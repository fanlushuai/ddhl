const { dd } = require("./dd");
const {
  clickSelectIfExists,
  clickPageSelectorIfExists,
  findInPage,
  clickEleWithLog,
  includeSelector,
  H,
  W,
} = require("./x");

// let eles = scrollable().find();
// eles[1].scrollForward();

function xx() {
  let eles = scrollable().find();
  eles[1].scrollForward();

  clickSelectIfExists(
    id("sfc_tab_item_text").text("常用路线订单"),
    "常用路线订单"
  );

  let sfCount = 0;
  while (1) {
    let eArr = findInPage(id("tv_go_time"));
    for (let e of eArr) {
      log("列表检查到" + e.getText() + "");
      if (e.getText().includes("添加")) {
        break;
      }
      clickEleWithLog(e, "点击" + e.getText());
      sleep(3000);
      //   todo
    }

    if (includeSelector(id("tv_go_time").text("添加"))) {
      log("循环点击结束");
      break;
    }

    log("滚动列表");
    eles[3].scrollForward();
    sfCount++;
    sleep(800);
  }

  while (sfCount > -2) {
    sfCount--;
    eles[3].scrollBackward();
    sleep(800);
  }
}

// xx();
// sleep(8000);

//  sfc_new_order_card_time_title - text: 今天21:30-21:45Rect(96, 1157 - 894, 1232)
// .TextView - id: from_tv - text: 晋城市·秀水苑-北门Rect(137, 1262 - 508, 1319)
// 02:41:03.846/D: cN:..TextView - id: from_tv_tag - text: 2.9kmRect(517, 1262 - 629, 1319)
// 02:41:03.847/D: cN:..TextView - id: to_tv - text: 濮阳市·上亿广场-1号门Rect(137, 1343 - 567, 1400)

// 02:41:03.852/D: cN:..TextView - id: sfc_order_price_content - text: 163.46元Rect(746, 1314 - 972, 1400)
// 02:41:03.869/D: cN:..TextView - id: sfc_order_price_content - text: 已支付220.53元Rect(609, 1987 - 972, 2073)

// 02:41:03.855/D: cN:..TextView - id: sfc_order_card_tips_content - text: 1人愿拼 · 订单里程260.3kmRect(96, 1430 - 559, 1492)
// 、..TextView - id: sfc_order_card_tips_content - text: 1人愿拼 · 订单里程115.7km · 可以协商高速费Rect(96, 894 - 834, 819)
// .TextView - id: sfc_order_card_tips_content - text: 1人愿拼 · 订单里程643.0km · 不出高速费 · 有行李Rect(96, 1267 - 921, 1329)
// 02:58:23.970/D: cN:..TextView - id: sfc_order_card_tips_content - text: 2人独享 · 订单里程12.5km · 可以协商高速费Rect(96, 1143 - 826, 1205)

// 02:41:03.859/D: cN:..TextView - id: btn_main_title - text: 邀请同行Rect(717, 1593 - 969, 1648)
// 02:41:03.875/D: cN:..TextView - id: btn_main_title - text: 立即同行Rect(717, 2266 - 969, 2217)

// id("sfc_new_order_card_state_img")  查看过，图标

// --------行程列表

// .TextView - id: sfc_new_order_card_degree_title - text: 90%顺路Rect(96, 784 - 284, 859)
// TextView - id: sfc_new_order_card_time_title - text: 今天07:35-07:50Rect(314, 784 - 894, 859)

// ------ 进入页面
// // 03:03:37.616/D: cN:..TextView - id: btn_main_title - text: 邀请同行Rect(378, 2164 - 702, 2243)

// function findIdInParent(ele, deep, idStr) {
//   let e = ele.parent();
//   let idE = e.findOne(id(idStr));
//   if (idE) {
//     return idE.text();
//   } else {
//     deep--;
//     if (deep < 0) {
//       log("找不到id：" + idStr);
//       return null;
//     }
//     return findIdInParent(e, deep, idStr);
//   }
// }

// const parseOrder = {
//   price: function (priceStr) {
//     if (priceStr) {
//       // 220.53元
//       // 已支付220.53元
//       return priceStr.replace("已支付", "").replace("元", "");
//     }
//   },
//   byWayLevel: function (byWayLevelStr) {
//     if (byWayLevelStr) {
//       return byWayLevelStr.replace("%顺路", "");
//     }
//   },
//   time: function (timeStr) {
//     if (timeStr) {
//       // 今天21:30-21:45
//     }
//   },
//   disFrom: function (disFromStr) {
//     if (disFromStr && /[0-9 \.]+km/.test(disFromStr)) {
//       return disFromStr.replace("km", "");
//     }
//   },
//   disTo: function (disEndStr) {
//     if (disEndStr && /[0-9 \.]+km/.test(disEndStr)) {
//       return disEndStr.replace("km", "");
//     }
//   },
//   disTo: function (str) {
//     // if (str) {
//     //   return str.replace("km", "");
//     // }
//   },
//   dis: function (str) {
//     if (str) {
//       //xxxx 订单里程115.7km xxx
//       let startIndex = str.indexOf("订单里程");
//       let endIndex = str.indexOf("km");
//       if (startIndex > 0 && endIndex > 0) {
//         return str.substring(startIndex, endIndex);
//       }
//     }
//   },

//   highWayFee: function (str) {
//     if (str) {
//       // 可以协商高速费
//       if (str.indexOf("可以协商高速费") > 0) {
//         return "可以协商";
//       } else if (str.indexOf("不出高速费") > 0) {
//         return "不出高速费";
//       } else {
//         return "";
//       }
//     }
//   },
//   people: function (str) {
//     if (str) {
//       let tA = str.split(".");
//       for (let t of tA) {
//         if (t.indexOf("人") > 0) {
//           return {
//             peopleCount: t.split("人")[0],
//             peopleMode: t.split("人")[1] == "独享" ? "独享" : "拼单",
//           };
//         }
//       }
//     }
//   },
// };

// let listBottomEle = textStartsWith("- 暂无更多去往").findOnce();

// let priceEles;
// if (listBottomEle) {
//   let y = listBottomEle.bounds().bottom;

//   priceEles = id("sfc_order_price_content").boundsInside(0, 0, W, y).find();
// } else {
//   priceEles = id("sfc_order_price_content").find();
// }

// let orders = [];
// for (let pe of priceEles) {
//   let order = {};
//   order.price = parseOrder.price(pe.text());

//   order.byWayLevel = parseOrder.byWayLevel(
//     findIdInParent(pe, 3, "sfc_new_order_card_degree_title")
//   ); //顺路

//   order.time = parseOrder.time(
//     findIdInParent(pe, 3, "sfc_new_order_card_time_title") //时间
//   );

//   order.fromAddr = findIdInParent(pe, 3, "from_tv"); //起点地址
//   order.toAddr = findIdInParent(pe, 3, "to_tv"); //终点地址

//   order.disFrom = parseOrder.disFrom(findIdInParent(pe, 3, "from_tv_tag")); //距离，起点
//   order.disTo = parseOrder.disFrom(findIdInParent(pe, 3, "to_tv_tag")); //距离，终点

//   //各种：人数，独享，拼单，高速费，里程。
//   let extraInfo = findIdInParent(pe, 3, "sfc_order_card_tips_content");
//   order.dis = parseOrder.dis(extraInfo);
//   let people = parseOrder.people(extraInfo);
//   if (people) {
//     order.peopleMode = people.peopleMode;
//     order.peopleCount = people.peopleCount;
//   }

//   order.highWayFee = parseOrder.highWayFee(extraInfo);

//   log(JSON.stringify(order));
//   orders.push(order);
// }
// // log(JSON.stringify(orders));

// while (true) {
//   let notMoreEle = id("sfc_list_no_more_data_view").findOnce();
//   if (notMoreEle) {
//     log("最后一页");
//     break;
//   }
//   swipe(0, H - 500, 0, H / 3, 500);
//   sleep(1000);
// }

// dd.awaysWayTabs();

// dd.awaysWayList();

let es = text("进行中").find();
log("进行中的行程 " + es.size());

// if (textStartswith("点击查看20").findOnce() != null) {
//   log("end");
// }

// for (let e of es) {
//   clickEleWithLog(e, "进行中");
//   sleep(1000);
//   clickPageSelectorIfExists(id("back_icon"), "返回");
//   sleep(1000);
// }

// dd.publicWayList();

// while (1) {
//   find();
//   // sleep(1000);
//   log("xxx");
// }

// for (let i = 0; i < 1000000000; i++) {
//   find();
//   // sleep(1000);
//   log("xxx");
//   ("进行中");
// }

// while (1) {
//   // sleep(1000);
//   log("xxx");
// }
