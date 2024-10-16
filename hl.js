const { AutojsUtil } = require("./autojsUtil");
const { matchOrder } = require("./matchOrder");
const {
  clickTextIfExists,
  clickSelectIfExists,
  include,
  clickEleParentClickableIfExists,
} = require("./x");

function findIdText(baseEle, idStr) {
  let e = baseEle.findOne(id(idStr));
  if (e != null) {
    let text = e.getText();
    log(text);
    return text;
  }
}

const hl = {
  xc: function () {
    //todo
    return;
  },
  xc_scroll: function () {},
  xc_page: function () {
    let amountEles = id("tvAmount").find();
    let orders = [];
    for (let amountEle of amountEles) {
      let cardEle = amountEle.parent().parent().parent();
      //   { tvHitchPercent: 55%顺路,
      //     tvDate: '今天 07:00~07:10',
      //     tvStartAddress: '距你111.4km',
      //     tvStartRegionDescribe: '乐天宠物诊疗',
      //     tvEndAddress: '管城回族区 · 经济开发区明湖街道',
      //     tvEndRegionDescribe: '盛华里购物中心',
      //     tvEndDistance: '11km',
      //     tvDriverPeopleCount: '1人',
      //     tvDriverPooling: 独享   拼座,
      //     tvTabPay: '已预付',
      //     tvDriverHighwayFee: '不承担高速费' }
      let order = {
        ele: cardEle,
        tvAmount: amountEle.getText(), //金额
        tvHitchPercent: findIdText(cardEle, "tvHitchPercent"), //顺路度
        tvDate: findIdText(cardEle, "tvDate"), //出发时间
        tvStartAddress: findIdText(cardEle, "tvStartAddress"), //距离,出发
        tvStartRegionDescribe: findIdText(cardEle, "tvStartRegionDescribe"), //出发地址
        tvEndAddress: findIdText(cardEle, "tvEndAddress"), //到达地址,大
        tvEndRegionDescribe: findIdText(cardEle, "tvEndRegionDescribe"), //到达地址,小
        tvEndDistance: findIdText(cardEle, "tvEndDistance"), //距离,到达
        tvDriverPeopleCount: findIdText(cardEle, "tvDriverPeopleCount"), //人数
        tvDriverPooling: findIdText(cardEle, "tvDriverPooling"), //拼车,独享
        tvTabPay: findIdText(cardEle, "tvTabPay"), //已预付
        tvDriverHighwayFee: findIdText(cardEle, "tvDriverHighwayFee"), //高速
      };
      log(order);
      order = parseHLOrder_xc(order);
      log(order);
      order.ele == cardEle;
      orders.push(order);
    }

    function findIdText(baseEle, idStr) {
      let e = baseEle.findOne(id(idStr));
      if (e != null) {
        let text = e.text();
        log(text);
        return text;
      }
    }
  },

  tabWayInCity: function () {
    return clickTextIfExists("市内路线");
  },
  tabWayBetweenCity: function () {
    return clickTextIfExists("城际路线");
  },
  getOrderInfoWayInCity: function () {
    amountEles = id("tvAmount").find();
    let orders = [];
    for (let ae of amountEles) {
      log(ae.getText());
      let order = getEle(ae);
      order.amountEle = ae;
      orders.push(order);
      log("---------");
    }
    return orders;

    function getEle(amountEle) {
      let cardEle = amountEle.parent().parent().parent();
      // 市内路线。tvStartAddress  距你12.1km
      // 市内路线。tvStartDistance  晋城市宏顺钢结构工程有限公司-东南侧
      // tvEndAddress  阳城县
      // tvRegionDescribe 山西亚美大宁能源有限公司
      // tvAmount

      function parseKM(text) {
        if (text) {
          return text.replace("km", "").replace("距你", "").trim();
        }
      }

      return {
        tvAmount: amountEle.getText(),
        tvDate: findIdText(cardEle, "tvDate"),
        // tvStartAddressCross: findIdText(cardEle, "tvStartAddressCross"),
        // tvStartDistanceCross: findIdText(cardEle, "tvStartDistanceCross"),
        // tvEndAddress: findIdText(cardEle, "tvEndAddress"),
        tvStartAddressCross: findIdText(cardEle, "tvStartDistance"),
        tvStartDistanceCross: parseKM(findIdText(cardEle, "tvStartAddress")),
        tvEndAddress:
          findIdText(cardEle, "tvEndAddress") +
          findIdText(cardEle, "tvRegionDescribe"),

        tvDriverPeopleCount: findIdText(cardEle, "tvDriverPeopleCount"),
        tvDriverPooling: findIdText(cardEle, "tvDriverPooling"),
        tvTabPay: findIdText(cardEle, "tvTabPay"),
        tvDriverHighwayFee: findIdText(cardEle, "tvDriverHighwayFee"),
      };
    }
  },
  getOrderInfoWayBetweenCity: function () {
    amountEles = id("tvAmount").find();
    let orders = [];
    for (let ae of amountEles) {
      log(ae.getText());
      let order = getEle(ae);
      orders.push(order);
      log("---------");
    }
    return orders;

    function getEle(amountEle) {
      let cardEle = amountEle.parent().parent().parent();
      return {
        tvDate: findIdText(cardEle, "tvDate"),
        tvStartAddressCross: findIdText(cardEle, "tvStartAddressCross"),
        tvStartDistanceCross: findIdText(cardEle, "tvStartDistanceCross"),
        tvEndAddress: findIdText(cardEle, "tvEndAddress"),
        tvDriverPeopleCount: findIdText(cardEle, "tvDriverPeopleCount"),
        tvDriverPooling: findIdText(cardEle, "tvDriverPooling"),
        tvTabPay: findIdText(cardEle, "tvTabPay"),
        tvDriverHighwayFee: findIdText(cardEle, "tvDriverHighwayFee"),
      };
    }
  },
  refresh: function () {
    return clickSelectIfExists(id("btnRefresh"), "刷新按钮");
  },
  showAllList: function () {
    log("上滑出完整列表");
    let sE = className("ScrollView").id("driver_new_scroll").findOnce();
    if (sE) {
      sE.scrollForward();
    }
  },
  scrollDownPage: function (func) {
    while (1) {
      if (func() || include("没有更多数据")) {
        log("到了底部");
        break;
      }
      log("滑动页面");
      id("rvMatchOrders").findOne().scrollForward();
      sleep(200);
    }
  },

  sheet: function () {
    // todo 测试模式
    log("测试模式");
    if (Config.testMode) {
    } else {
      textMatches(/(立即抢单)|(确认同行)/).waitFor();
      log("进入抢单页面");
      //   clickSelectIfExists(id("tvButton").text("确认同行"), "确认同行") ||
      //     clickSelectIfExists(id("tvButton").text("立即抢单"), "立即抢单");
    }
  },
  watchOrder: function () {
    this.tabWayInCity();

    this.scrollDownPage(() => {
      let orders = this.getOrderInfoWayInCity();
      for (let order of orders) {
        log(order);
        log("判断是否匹配");
        if (matchOrder.ok_with_hl_Orders(order)) {
          log("匹配成功");

          clickEleParentClickableIfExists(order.amountEle, "进入订单详情", 4);

          //todo  等待进入页面
          log("进入");
          // todo 进去抢单。确认订单。
          AutojsUtil.playMp3(Config.mp3Path);
        }
      }
    });

    this.tabWayBetweenCity();
    this.scrollDownPage(() => {
      let orders = this.getOrderInfoWayBetweenCity();
      for (let order of orders) {
        log(order);
        log("判断是否匹配");
      }
    });

    // this.refresh();
  },
};

module.exports = { hl };
