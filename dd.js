const { Config } = require("./config");
const { matchOrder } = require("./matchOrder");
const {
  clickEleWithLog,
  clickPageSelectorIfExists,
  findInPage,
  clickSelectIfExists,
  clickParentClickableSelectorIfExists,
  includeSelector,
  W,
  includePageSelector,
  H,
  findOnceInPage,
} = require("./x");
function findIdInParent(ele, deep, idStr) {
  let e = ele.parent();
  let idE = e.findOne(id(idStr));
  if (idE) {
    return idE.text();
  } else {
    deep--;
    if (deep < 0) {
      log("找不到id：" + idStr);
      return null;
    }
    return findIdInParent(e, deep, idStr);
  }
}
const parseOrder = {
  price: function (priceStr) {
    if (priceStr) {
      // 220.53元
      // 已支付220.53元
      return priceStr.replace("已支付", "").replace("元", "");
    }
  },
  byWayLevel: function (byWayLevelStr) {
    if (byWayLevelStr) {
      return byWayLevelStr.replace("%顺路", "");
    }
  },
  time: function (timeStr) {
    if (timeStr) {
      // 今天21:30-21:45
      // text("10月20日04:00-04:15")
      // todo 解析时间
      return timeStr;
    }
  },
  disFrom: function (disFromStr) {
    if (disFromStr && /[0-9 \.]+km/.test(disFromStr)) {
      return disFromStr.replace("km", "");
    }
  },
  disTo: function (disEndStr) {
    if (disEndStr && /[0-9 \.]+km/.test(disEndStr)) {
      return disEndStr.replace("km", "");
    }
  },
  disTo: function (str) {
    // if (str) {
    //   return str.replace("km", "");
    // }
  },
  dis: function (str) {
    if (str) {
      //xxxx 订单里程115.7km xxx
      let startIndex = str.indexOf("订单里程");
      let endIndex = str.indexOf("km");
      if (startIndex > 0 && endIndex > 0) {
        return str.substring(startIndex + 4, endIndex);
      }
    }
  },

  highWayFee: function (str) {
    if (str) {
      // 可以协商高速费
      // text("1人愿拼 · 订单里程75.6km · 承担全部高速费")
      if (str.indexOf("可以协商高速费") > 0) {
        return "可以协商";
      } else if (str.indexOf("不出高速费") > 0) {
        return "不出高速费";
      } else if (str.indexOf("承担全部高速费") > 0) {
        return "承担全部高速费";
      }
    }
  },
  people: function (str) {
    if (str) {
      // text("1人独享 · 订单里程41.9km")
      let tA = str.split("·");
      for (let t of tA) {
        if (t.indexOf("人") > 0) {
          return {
            peopleCount: t.split("人")[0],
            peopleMode: str.indexOf("独享") > 0 ? "独享" : "拼单",
          };
        }
      }
    }
  },
};

const dd = {
  backFromPublicWayList: function () {
    clickSelectIfExists(id("common_title_bar_left_img"), "返回");
  },
  publicWayList: function () {
    if (
      clickPageSelectorIfExists(
        id("sfc_home_drv_suspense_title_alert"),
        "查看全部行程"
      )
    ) {
      // 列表里面一定有内容。不然进不来
      text("正在寻找顺路乘客").waitFor();
      log("进入行程列表");
      let es = text("进行中").find();
      log("进行中的行程 " + es.size());

      for (let e of es) {
        // todo 可能需要进行翻页.如果太多的话
        clickEleWithLog(e, "进行中");
        sleep(1000);
        this.publicWayOrderList();
        // todo 成功，或者失败，然后对应操作
        clickPageSelectorIfExists(id("back_icon"), "返回");
        sleep(1000);
      }
    } else {
      log("没有行程");
    }
  },
  publicWayOrderList: function () {
    log("行程列表");
    this.awaysWayList();
  },
  page: function () {
    let listBottomEle = findOnceInPage(textStartsWith("- 暂无更多去往"));

    let priceEles;
    if (listBottomEle) {
      let y = listBottomEle.bounds().bottom;
      priceEles = id("sfc_order_price_content").boundsInside(0, 0, W, y).find();
    } else {
      priceEles = findInPage(id("sfc_order_price_content"));
    }

    let orders = [];
    for (let pe of priceEles) {
      // 此处返回的，就是标准order对象
      let order = {};
      order.price = parseOrder.price(pe.text());

      order.byWayLevel = parseOrder.byWayLevel(
        findIdInParent(pe, 3, "sfc_new_order_card_degree_title")
      ); //顺路

      order.time = parseOrder.time(
        findIdInParent(pe, 3, "sfc_new_order_card_time_title") //时间
      );

      order.fromAddr = findIdInParent(pe, 3, "from_tv"); //起点地址
      order.toAddr = findIdInParent(pe, 3, "to_tv"); //终点地址

      order.disFrom = parseOrder.disFrom(findIdInParent(pe, 3, "from_tv_tag")); //距离，起点
      order.disTo = parseOrder.disFrom(findIdInParent(pe, 3, "to_tv_tag")); //距离，终点

      //各种：人数，独享，拼单，高速费，里程。
      let extraInfo = findIdInParent(pe, 3, "sfc_order_card_tips_content");
      order.dis = parseOrder.dis(extraInfo);
      let people = parseOrder.people(extraInfo);
      if (people) {
        order.peopleMode = people.peopleMode;
        order.peopleCount = people.peopleCount;
      }

      order.highWayFee = parseOrder.highWayFee(extraInfo);

      log(JSON.stringify(order));
      log("---------");
      order.ele = pe;
      orders.push(order);
    }

    return orders;
  },
  awaysWayList: function () {
    log("查看列表");

    function clickIfMatchOrder(orders) {
      let matchO = matchOrder.okk(orders);
      if (matchO) {
        log("进入订单详细");

        // 排除，在详情页，继续匹配详情。
        // 点击按钮
        if (includeSelector(id("sfc_invite_drv_button_layout"))) {
          log("在详情页，不点击");
          return;
        } else {
          clickEleWithLog(matchO.ele, "订单详情");
        }

        sleep(2000);
        if (Config.testMode == false) {
          log("正式抢单");
          clickPageSelectorIfExists(
            text("邀请同行").id("btn_main_title"),
            "邀请同行"
          ) ||
            clickPageSelectorIfExists(
              text("立即同行").id("btn_main_title"),
              "立即同行"
            );

          // todo 之后干嘛？？？
        } else {
          log("测试模式，不点击目标");
          clickPageSelectorIfExists(id("sfc_invite_drv_title_bar"), "back");
        }
      }
    }

    while (true) {
      if (includePageSelector(id("sfc_list_no_more_data_view"))) {
        log("出现底部");
        clickIfMatchOrder(this.page());
        break;
      }

      if (includePageSelector(textStartsWith("暂无顺路乘客，持续寻找中"))) {
        log("列表无内容");
        break;
      }

      // todo 匹配了就进行点击
      clickIfMatchOrder(this.page());

      swipe(0, H - 500, 0, H / 3, 500);
      sleep(1000);
    }
  },
  awaysWayTabs: function () {
    let eles = scrollable().find();
    log("将常用路线滚动到顶部");
    eles[1].scrollForward();

    if (
      clickParentClickableSelectorIfExists(
        id("sfc_tab_item_text").text("常用路线订单"),
        "常用路线订单",
        2
      )
    ) {
    } else {
      log("未找到常用路线订单");
      return;
    }

    let sfCount = 0;

    let hasClickList = [];
    while (1) {
      let eArr = findInPage(id("tv_go_time"));
      if (eArr == null) {
        log("未找到路线列表");
        break;
      }

      let end = false;

      for (let e of eArr) {
        log("列表检查到" + e.getText() + "");
        // 列表最多4个。小于4个的时候，有添加按钮。
        if (e.getText().includes("添加")) {
          end = true;
          break;
        }

        let wayEle = e.parent().findOne(id("tv_go_route_name"));

        if (hasClickList.indexOf(wayEle.text() + e.text()) > 0) {
          log("滚动结尾了");
          // 点击两次，说明，滚动没有效果。就认为，是到结尾了。
          end = true;
          break;
        }

        hasClickList.push(wayEle.text() + e.text());

        clickEleWithLog(e, "点击" + wayEle.getText());
        lastClick = wayEle.text();
        sleep(3000);
        //   todo
        this.awaysWayList();
      }

      if (end || includeSelector(id("tv_go_time").text("添加"))) {
        log("循环点击结束");
        break;
      }

      log("向右滚动");
      eles[3].scrollForward();
      sfCount++;
      sleep(500);
    }

    hasClickList = [];
    if (sfCount < 3) {
      // 确保滚动到头
      sfCount = 3;
    }
    if (sfCount > 0) {
      log("反向滚动");
      while (sfCount > -2) {
        sfCount--;
        eles[3].scrollBackward();
        sleep(500);
      }
    }
  },
};

module.exports = { dd };
