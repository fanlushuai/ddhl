//
// 00:19:20.820/D: cN:..TextView - id: tvDriverPeopleCount - text: 1人
// 00:19:20.821/D: cN:..TextView - id: tvDriverPooling - text: 拼座     text("舒适拼")
// 00:19:20.821/D: cN:..TextView - id: tvTabPay - text: 已预付
// 00:19:20.822/D: cN:..TextView - id: tvDriverHighwayFee - text: 不承担高速费

// 00:19:20.780/D: cN:..TextView - id: tvDate - text: 今天 02:00~02:20
// 00:19:20.787/D: cN:..TextView - id: tvStartAddressCross - text: 晋城市·郭素波诊所
// 00:19:20.788/D: cN:..TextView - id: tvStartDistanceCross - text: 9.5km
// 00:19:20.791/D: cN:..TextView - id: tvEndAddress - text: 平顶山市·万基·九尊府
// 00:19:20.791/D: cN:..TextView - id: tvEndAddress - text: 平顶山市·万基·九尊府

// 市内路线。tvStartAddress  距你12.1km
// 市内路线。tvStartDistance  晋城市宏顺钢结构工程有限公司-东南侧
// tvEndAddress  阳城县
// tvRegionDescribe 山西亚美大宁能源有限公司
// tvAmount

// 00:19:20.798/D: cN:..TextView - id: tvDriverPeopleCount - text: 1人
// 00:19:20.799/D: cN:..TextView - id: tvDriverPooling - text: 拼座

// id("tvNearPax")text("市内路线")
// id("tvAcrossPax")text("城际路线")

// text("没有更多数据")

amountEles = id("tvAmount").find();
for (let ae of amountEles) {
  log(ae.getText());
  getEle(ae);
  log("---------");
}

// clickEleWithLog(findClickableParent(amountEles[3], 5), "第一个");

// dis =
//   amountEles[amountEles.length - 2].bounds().top - amountEles[0].bounds().top;

// log(amountEles[amountEles.length - 2].bounds().top);
// log(amountEles[0].bounds().top);
// swipe(
//   W / 6,
//   amountEles[amountEles.length - 2].bounds().top - 500,
//   W / 6,
//   amountEles[0].bounds().top,
//   1000
// );

// swipe(W / 2, H / 2, W / 2, H / 2 - 600, 1500);
// swipe(W / 2, H / 2, W / 3, H / 2 - 600, 100);
// swipe(W / 2, H / 2, W / 2, H / 2 - 600, 1500);

function getEle(amountEle) {
  let cardEle = amountEle.parent().parent().parent();

  let tvDateEle = cardEle.findOne(id("tvDate"));
  if (tvDateEle != null) {
    let tvDateText = tvDateEle.getText();
    log(tvDateText);
  }
  let tvStartAddressCrossEle = cardEle.findOne(id("tvStartAddressCross"));
  if (tvStartAddressCrossEle != null) {
    let tvStartAddressCrossText = tvStartAddressCrossEle.getText();
    log(tvStartAddressCrossText);
  }
  let tvStartDistanceCrossEle = cardEle.findOne(id("tvStartDistanceCross"));
  if (tvStartDistanceCrossEle != null) {
    let tvStartDistanceCrossText = tvStartDistanceCrossEle.getText();
    log(tvStartDistanceCrossText);
  }
  let tvEndAddressEle = cardEle.findOne(id("tvEndAddress"));
  if (tvEndAddressEle != null) {
    let tvEndAddressText = tvEndAddressEle.getText();
    log(tvEndAddressText);
  }

  let tvDriverPeopleCountEle = cardEle.findOne(id("tvDriverPeopleCount"));
  if (tvDriverPeopleCountEle != null) {
    let tvDriverPeopleCountText = tvDriverPeopleCountEle.getText();
    log(tvDriverPeopleCountText);
  }
  let tvDriverPoolingEle = cardEle.findOne(id("tvDriverPooling"));
  if (tvDriverPoolingEle != null) {
    let tvDriverPoolingText = tvDriverPoolingEle.getText();
    log(tvDriverPoolingText);
  }
  let tvTabPayEle = cardEle.findOne(id("tvTabPay"));
  if (tvTabPayEle != null) {
    let tvTabPayText = tvTabPayEle.getText();
    log(tvTabPayText);
  }
  let tvDriverHighwayFeeEle = cardEle.findOne(id("tvDriverHighwayFee"));
  if (tvDriverHighwayFeeEle != null) {
    let tvDriverHighwayFeeText = tvDriverHighwayFeeEle.getText();
    log(tvDriverHighwayFeeText);
  }
}

// back();

function findClickableParent(ele, deep) {
  if (deep == 0) return null;
  return ele.parent().clickable() == true
    ? ele.parent()
    : findClickableParent(ele.parent(), deep - 1);
}
