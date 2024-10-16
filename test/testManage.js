const { AutojsUtil } = require("../autojsUtil");
const { boot } = require("../manage");
const {
  clickSelectIfExists,
  includeSelector,
  W,
  H,
  getCurrentTime,
  disableNotPassTimeSec,
  getSelectorBounds,
  findOnceInPage,
  includePageSelector,
} = require("../x");

function isInOffenWay() {
  let sb = getSelectorBounds(text("顺风车").id("ch_tab_name"));
  let eb = getSelectorBounds(text("常用路线订单").id("sfc_tab_item_text"));

  // log(eb.top - sb.top);
  // log(H / 6);
  if (eb.top - sb.top < H / 6) {
    log("常用路线已上移");
  } else {
    log("上移常用路线");
  }
}

function xc() {
  let sb = getSelectorBounds(text("顺风车").id("ch_tab_name"));
  let eb = getSelectorBounds(text("常用路线订单").id("sfc_tab_item_text"));

  // log(eb.top - sb.top);
  // log(H / 6);
  if (eb.top - sb.top < H / 6) {
    log("常用路线已上移");
    log("向下移动");
  }
}

function goTop() {
  while (1) {
    if (includePageSelector(id("sfc_title_profile_text").text("个人中心"))) {
      log("到达顶部");
      break;
    }

    if (!includeSelector(text("顺风车").id("ch_tab_name"))) {
      log("跳出界面");
      break;
    }

    log("向上滚动");
    AutojsUtil.pageUpBySwipe();
  }
}

// goTop();

boot.boot2dd();
sleep(1000);
// boot.intoDdxcView();
boot.intoDdOfferView();
// 08:30:08.076/D: cN:..TextView - id: sfc_tab_item_text - text: 常用路线订单Rect(720, 333 - 1080, 459)
