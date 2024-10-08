const { Config } = require("./config");
const { slog, setBootFunc } = require("./script");

// 初始化配置到内存里面
Config.loadConfig();
let W = device.width;
let H = device.height;
function getCurrentTime() {
  return new Date().getTime();
}
function clickTextIfExists(textString) {
  return clickPageSelectorIfExists(text(textString), textString);
}

function clickPageSelectorIfExists(selector, text) {
  let pageShowSelector = selector
    .boundsInside(0, 0, device.width, device.height)
    .visibleToUser();
  return clickSelectIfExists(pageShowSelector, text);
}

function clickSelectIfExists(selector, text) {
  let ele = selector.findOnce();
  if (ele == null) {
    return;
  }

  slog("找到->" + text + "");
  clickEleWithLog(ele, text);
  sleep(200, 500);
  return true;
}

function clickEleWithLog(ele, text) {
  if (ele.clickable() == true) {
    slog("点击->" + text);
    ele.click();
  } else {
    slog(
      "点击坐标-> " +
        ele.bounds().centerX() +
        "," +
        ele.bounds().centerY() +
        " " +
        text
    );
    press(
      ele.bounds().centerX() + random(0, 6) - 3,
      ele.bounds().centerY() + random(0, 6) - 3,
      1
    );
  }
}

function clickParent(ele, deep) {
  if (ele == null || deep == 0) {
    return false;
  }

  if (ele.parent() == null) {
    return false;
  }

  if (ele.parent().clickable() == true) {
    ele.parent().click();
    return true;
  } else {
    return clickParent(ele.parent(), deep - 1);
  }
}

function include() {
  // arguments 对象。是一个类数组对象。包含了函数调用时，传入的所有实参
  for (let i = 0; i < arguments.length; i++) {
    if (text(String(arguments[i])).findOnce() == null) {
      return false;
    }
  }

  return true;
}

function findOneInPage(selector) {
  return selector
    .boundsInside(0, 0, device.width, device.height)
    .visibleToUser()
    .findOnce();
}

function addOnePeople() {
  slog("添加一个好友");
  let nickNameEle = findOneInPage(id("nickname"));
  if (nickNameEle == null) {
    return;
  }

  let nickName = nickNameEle.text();

  if (inJumpList(nickName)) {
    slog("已经在跳过列表中，跳过" + nickName);
    jumpNickName(nickName);
    return;
  }

  slog("即将处理：" + nickName);

  let e = nickNameEle.parent().parent().findOne(text("添加"));
  if (e == null) {
    slog("没有添加按钮，跳过");
    jumpNickName(nickName);

    return;
  }

  e.click();

  sleep(4000);

  if (include(nickName, "添加好友")) {
    slog("位于添加好友页面");

    let verifyInfoEle = text("填写验证信息").className("TextView").findOnce();
    if (verifyInfoEle) {
      slog("需要填写验证信息");
      let bottom = verifyInfoEle.bounds().bottom;
      slog("bottom:" + bottom);

      let editTextArr = className("EditText").find();
      for (let e of editTextArr) {
        slog(e.bounds().top);
        if (e.bounds().top > bottom) {
          slog("选择下面最近的输入框");
          e.setText(Config.validInfo || "你好");
          break;
        }
      }
    }

    if (className("EditText").text("输入答案").exists()) {
      slog("需要输入答案，跳过");
      back();
      sleep(1500);
      jumpNickName(nickName);
      return;
    }

    if (
      clickPageSelectorIfExists(
        className("Button").text("发送").clickable(true),
        "发送"
      )
    ) {
      sleep(1500);
      if (clickTextIfExists("我知道了")) {
        sleep(500);
        back();
      }
      return true;
    }
  }

  function jumpNickName(jumpNickName) {
    slog("跳过用户：" + jumpNickName + "");
    addJumpList(jumpNickName);

    let nicknameEles = id("nickname")
      .boundsInside(0, 0, device.width, device.height)
      .visibleToUser()
      .find();

    // slog(nicknameEles.length);

    if (nicknameEles && nicknameEles.length >= 2) {
      //   slog("第一个昵称：" + nicknameEles[0].text());
      if (nicknameEles[0].text() == jumpNickName) {
        slog("跳过用户：" + jumpNickName + "");
        let scrollUpLength =
          nicknameEles[1].bounds().bottom - nicknameEles[0].bounds().bottom;

        slog("上滑距离:" + scrollUpLength);

        swipe(W / 2, H / 2, W / 2, H / 2 - scrollUpLength, 500);
        sleep(1500);
      }
    }
  }
}

let sleepTime = 6000;

let storage = storages.create("fjdsjfdskj");

let jumpList = [];

function loadJumpList() {
  return storage.get("jumpList", []);
}

jumpList = loadJumpList();

function addJumpList(nickName) {
  slog("加入跳过列表：" + nickName + "");
  jumpList.push(nickName);
  storage.put("jumpList", jumpList);
}

function inJumpList(nickName) {
  return jumpList.indexOf(nickName) > -1;
}

function fastIntoLoation() {
  slog("开始快速找到第一个可添加的");

  let nicknameEles = id("nickname")
    .boundsInside(0, 0, device.width, device.height)
    .visibleToUser()
    .find();

  let e;
  for (let ne of nicknameEles) {
    if (!inJumpList(ne.getText())) {
      e = ne;
      break;
    }
  }

  if (e) {
    slog("移动到：" + e.text());
    let dis = e.bounds().bottom - nicknameEles[0].bounds().bottom;
    slog("上滑距离:" + dis);
    swipe(W / 2, e.bounds().bottom, W / 2, dis, 500);
    slog("快速寻找完毕");
    sleep(1500);
    return;
  } else {
    // 可能死循环
    slog("翻页");

    if (text("没有更多了").findOnce() != null) {
      slog("最后一页");
      return;
    }

    swipe(W / 2, H - 500, W / 2, 500, 500);

    fastIntoLoation();
  }
}

function inInitPage() {
  let hasLog = false;
  while (1) {
    let e = text("可能想认识的人").findOnce();
    // 只有，处于中间位置的，可能想认识的人，才能标题，为可能想认识的人的页面

    if (
      e &&
      e.bounds().right > W / 2 &&
      !include("找人", "找群") &&
      !include("群聊")
    ) {
      if (hasLog) {
        slog("已经入页面");
      }
      return true;
      // log(e.bounds());
    } else {
      if (!hasLog) {
        hasLog = true;
        slog("等待手动切换到初始QQ界面");
      }
    }

    sleep(500);
  }
}

function work() {
  inInitPage();
  sleep(1500);

  fastIntoLoation();
  slog(Config);

  let i = 0;
  while (1) {
    inInitPage();
    if (addOnePeople()) {
      slog("休息" + (Config.stepSec || 1) + "秒");
      sleep((Config.stepSec || 1) * 1000);
      i++;
      if (i >= Config.maxAddCount) {
        slog("达到添加上限");
        break;
      }
      if (text("没有更多了").findOnce() != null) {
        slog("进入最后一页逻辑");
        addLastPage();
        break;
      }
    }
    sleep(500);
  }
  slog("任务完成！");
}

function addLastPage() {
  let nicknameEles = id("nickname")
    .boundsInside(0, 0, device.width, device.height)
    .visibleToUser()
    .find();

  for (let nickNameEle of nicknameEles) {
    let e = nickNameEle.parent().parent().findOne(text("添加"));
    if (e == null) {
      slog("没有添加按钮，跳过");
      continue;
    }

    let nickName = nickNameEle.text();

    e.click();

    sleep(4000);

    if (include(nickName, "添加好友")) {
      slog("位于添加好友页面");

      let verifyInfoEle = text("填写验证信息").className("TextView").findOnce();
      if (verifyInfoEle) {
        slog("需要填写验证信息");
        let bottom = verifyInfoEle.bounds().bottom;
        slog("bottom:" + bottom);

        let editTextArr = className("EditText").find();
        for (let e of editTextArr) {
          slog(e.bounds().top);
          if (e.bounds().top > bottom) {
            slog("选择下面最近的输入框");
            e.setText(Config.validInfo || "你好");
            break;
          }
        }
      }

      if (className("EditText").text("输入答案").exists()) {
        slog("需要输入答案，跳过");
        back();
        sleep(1500);
        jumpNickName(nickName);
        continue;
      }

      if (
        clickPageSelectorIfExists(
          className("Button").text("发送").clickable(true),
          "发送"
        )
      ) {
        sleep(1500);
        if (clickTextIfExists("我知道了")) {
          sleep(500);
          back();
        }
        continue;
      }
    }
  }
}

setBootFunc(work);
work();
