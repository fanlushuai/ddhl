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

function disableNotPassTimeSec(startTime, timeSec) {
  if (startTime != null && startTime != 0) {
    if (getCurrentTime() - (startTime + timeSec * 1000) > 0) {
      return false; // 已过期
    } else {
      return true; // 正在禁用
    }
  }

  // 未生效。未已过期
  return false;
}

function clickSelectIfExists(selector, text) {
  let ele = selector.findOnce();
  if (ele == null) {
    return;
  }

  log("找到->" + text + "");
  clickEleWithLog(ele, text);
  sleep(200, 500);
  return true;
}

function clickParentClickableSelectorIfExists(selector, text, deep) {
  let ele = selector.findOnce();
  if (ele) {
    let clickableEle = findClickableParent(ele, deep);
    if (clickableEle) {
      log("点击 可点击元素 ->" + text);
      clickableEle.click();
      return true;
    }
  }
}

function findClickableParent(ele, deep) {
  if (ele.clickable()) {
    return ele;
  } else {
    deep--;
    if (deep < 0) {
      return null;
    } else {
      return findClickableParent(ele.parent(), deep);
    }
  }
}

function clickEleWithLog(ele, text) {
  if (ele.clickable() == true) {
    log("点击->" + text);
    ele.click();
  } else {
    log(
      "点击坐标-> " +
        ele.bounds().centerX() +
        "," +
        ele.bounds().centerY() +
        " " +
        text
    );
    // press(
    //   ele.bounds().centerX() + random(0, 6) - 3,
    //   ele.bounds().centerY() + random(0, 6) - 3,
    //   1
    // );
    press(ele.bounds().centerX(), ele.bounds().centerY(), 100);
    // click(ele.bounds().centerX(), ele.bounds().centerY());

    // click()
  }
  return true;
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

function includeSelector() {
  // arguments 对象。是一个类数组对象。包含了函数调用时，传入的所有实参
  for (let i = 0; i < arguments.length; i++) {
    if (arguments[i].findOnce() == null) {
      return false;
    }
  }

  return true;
}

function includePageSelector() {
  // arguments 对象。是一个类数组对象。包含了函数调用时，传入的所有实参
  for (let i = 0; i < arguments.length; i++) {
    if (findOnceInPage(arguments[i]) == null) {
      return false;
    }
  }

  return true;
}

function findOnceInPage(selector) {
  return selector
    .boundsInside(0, 0, device.width, device.height)
    .visibleToUser()
    .findOnce();
}
function findInPage(selector) {
  return selector
    .boundsInside(0, 0, device.width, device.height)
    .visibleToUser()
    .find();
}

function getOnceTextById(idStr) {
  let e = id(idStr).findOnce();
  if (e) {
    return e.text();
  }
}

function getSelectorBounds(s) {
  let e = s.findOnce();
  if (e) {
    return e.bounds();
  }
}

module.exports = {
  H,
  W,
  getCurrentTime,
  clickTextIfExists,
  clickPageSelectorIfExists,
  include,
  includeSelector,
  findOnceInPage,
  clickParent,
  clickEleWithLog,
  clickSelectIfExists,
  findInPage,
  findOnceInPage,
  getOnceTextById,
  disableNotPassTimeSec,
  getSelectorBounds,
  includePageSelector,
  clickParentClickableSelectorIfExists,
  findClickableParent,
};
