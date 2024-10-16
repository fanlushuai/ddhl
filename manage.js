const { dd } = require("./dd");
const { hl } = require("./hl");
const { clickTextIfExists } = require("./x");

// hl.watchOrder(); //大厅订单

// hl.xc(); //行程界面

// dd.awaysWayList(); //常用路线

// dd.publicWayList(); //行程界面

const boot = {
  // 跳转到位置，然后开始执行。
  //包含hl，大厅，行程，
  //包含dd，常用路线，行程界面，

  boot2hl: function () {
    app.launchApp("哈啰");

    let disableStartTime;
    while (1) {
      if (
        includeSelector(
          id("tvCarLife")
            .text("车服务")
            .boundsInside(0, 0, W, H / 3),
          id("tvAcrossPax").text("城际路线")
        )
      ) {
        log("到达位置");
        break;
      }

      clickSelectIfExists(id("actionDialogClose"), "广告x");

      clickSelectIfExists(text("跳过"), "跳过") ||
        clickSelectIfExists(desc("跳过"), "跳过desc");

      if (
        !disableNotPassTimeSec(disableStartTime, 5) &&
        clickSelectIfExists(id("tv_tab_text"), "车主")
      ) {
        log("禁用 车主 5秒");
        disableStartTime = getCurrentTime();
      }
    }
  },
  initBack: function (func) {
    while (1) {
      back();
      if (func()) {
        break;
      }
      sleep(1000);
    }
  },
  initBackdd: function () {
    this.initBack(function () {
      return includePageSelector(id("tab_text").text("车主"));
    });
  },
  boot2dd: function () {
    app.launchApp("滴滴出行");
    let disableStartTime;
    while (1) {
      if (
        includeSelector(
          id("ch_tab_name")
            .text("顺风车")
            .boundsInside(0, 0, W, H / 3)
        )
      ) {
        log("到达 滴滴 位置");
        break;
      }

      clickSelectIfExists(id("close_dialog"), "关闭弹出窗");

      clickSelectIfExists(text("跳过"), "跳过") ||
        clickSelectIfExists(desc("跳过"), "跳过desc");

      if (
        !disableNotPassTimeSec(disableStartTime, 5) &&
        clickSelectIfExists(id("tab_text").text("车主"), "车主")
      ) {
        log("禁用 车主 5秒");
        disableStartTime = getCurrentTime();
      }
    }
  },
  intoDdOfferView: function () {
    dd.awaysWayTabs();
  },
  intoDdxcView: function () {
    sureTop();

    dd.publicWayList();

    function sureTop() {
      log("确保在顶部");
      while (1) {
        if (
          includePageSelector(id("sfc_title_profile_text").text("个人中心"))
        ) {
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
  },
};

module.exports = { boot };
