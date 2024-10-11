const {
  clickSelectIfExists,
  clickPageSelectorIfExists,
  findInPage,
  clickEleWithLog,
  includeSelector,
  H,
} = require("./x");

// clickSelectIfExists(
//   id("sfc_tab_item_text").text("常用路线订单"),
//   "常用路线订单"
// );

// id("rv_route_list").className("RecyclerView").findOne().scrollForward();

// for (let e of eles) {
//   log(e.className());
//   //   sleep(3000);
//   //   log(e.className());
//   log(e.bounds());
//   //   e.scrollForward();
//   // 经过测试，第三个滚动有效。
// }

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
// 03:03:37.616/D: cN:..TextView - id: btn_main_title - text: 邀请同行Rect(378, 2164 - 702, 2243)

let prices = id("sfc_order_price_content").find();
for (let p of prices) {
  log(p.getText());
}

swipe(0, H - 500, 0, H / 3, 500);
