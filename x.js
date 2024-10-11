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

  log("找到->" + text + "");
  clickEleWithLog(ele, text);
  sleep(200, 500);
  return true;
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
};
