// Config.goTimeBegin: 25,
// Config.goTimeEnd: 60,
// Config.onePeolpeMinCount: 25,
// Config.onePeolpeMaxCount: 60,
// Config.multiPeolpeMinCount: 25,
// Config.multiPeolpeMaxCount: 60,
// Config.comfortPeopleMinCount: 25,
// Config.comfortPeopleMaxCount: 60,
// Config.orderPriceMin: 25,
// Config.orderPriceMax: 60,
// Config.orderDisMin: 25,
// Config.orderDisMax: 60,
// Config.byWayLevel: 80,
// Config.peopleCountMin: 25,
// Config.peopleCountMax: 60,
// Config.orderPriceMin1: 25,
// Config.orderPriceMax1: 60,
// Config.orderDisMin1: 25,
// Config.orderDisMax1: 60,
// Config.refreshIntervalSec: 15,
// Config.fromKeyWords: '',
// Config.cbfromKeyWords: '',
// Config.endKeyWords: '10',
// Config.cbGoTime: false,
// Config.cbOnePeople: false,
// Config.cbMultiPeople: false,
// Config.cbComfortPeople: false,
// Config.cbOrderPrice: false,
// Config.cbOrderDis: false,
// Config.cbOnePeopleNotLimit: false,
// Config.alertMusic: false,

const { Config } = require("./config");
function keysWordsOk(keys, testStr) {
  let postionArr = [];

  for (let i = 0; i < keys.length; i++) {
    console.log(keys[i]); // 输出每个字符
    let char = keys[i];
    if (char == "+") {
      postionArr.push(i);
    } else if (char == "-") {
      postionArr.push(i);
    }
  }

  //   log(postionArr);

  for (let i = 0; i < postionArr.length; i++) {
    let keywords = keys.substring(postionArr[i], postionArr[i + 1]).trim();
    // log("关键字:" + keywords);
    if (keywords.startsWith("+")) {
      keywords = keywords.substring(1);
      //   log("包含 关键字:" + keywords);
      if (testStr.indexOf(keywords) == -1) {
        log("关键字不匹配，未找到需要包含的关键字:" + keywords + "");
        return false;
      }
    } else if (keywords.startsWith("-")) {
      keywords = keywords.substring(1);
      //   log("排除 关键字:" + keywords);
      if (testStr.indexOf(keywords) != -1) {
        log("关键字不匹配 ，包含了不需要的关键字:" + keywords + "");
        return false;
      }
    }
  }

  return true;
}

// testMode: false
const matchOrder = {
  fromKeysOk: function (fromAddr) {
    return keysWordsOk(Config.fromKeyWords, fromAddr);
  },
  endKeysOk: function (endAddr) {
    return keysWordsOk(Config.endKeyWords, endAddr);
  },
  timeOk: function (time) {
    goTimeBegin;
    goTimeEnd;
    return time >= Config.goTimeBegin && time <= Config.goTimeEnd;
  },
  peopleOk: function (count) {
    // todo Config.cbOnePeopleNotLimit
    return count >= Config.peopleCountMin && count <= Config.peopleCountMax;
  },
  multiPeolpeOk: function (count) {
    return (
      count >= Config.multiPeolpeMinCount && count <= Config.multiPeolpeMaxCount
    );
  },
  comfortPeopleOk: function (count) {
    return (
      count >= Config.comfortPeopleMinCount &&
      count <= Config.comfortPeopleMaxCount
    );
  },
  priceOk: function (price) {
    return price >= Config.orderPriceMin && price <= Config.orderPriceMax;
  },
  fromDisOK: function (fromDis) {
    return fromDis >= Config.orderDisMin && fromDis <= Config.orderDisMax;
  },
  ok: function (order) {
    if (Config.cbGoTime) {
      if (!this.timeOk(order.goTime)) {
        return false;
      }
    }

    if (Config.cbOnePeople) {
      if (!this.peopleOk(order.peopleCount)) {
        return false;
      }
    }

    if (Config.cbMultiPeople) {
      if (!this.multiPeolpeOk(order.peopleCount)) {
        return false;
      }
    }

    if (Config.cbComfortPeople) {
      if (!this.comfortPeopleOk(order.peopleCount)) {
        return false;
      }
    }

    if (Config.cbOrderPrice) {
      if (!this.priceOk(order.price)) {
        return false;
      }
    }

    if (Config.cbOrderDis) {
      if (!this.fromDisOK(order.fromDis)) {
        return false;
      }
    }

    if (Config.cbfromKeyWords) {
      if (!this.fromKeysOk(order.fromAddr)) {
        return false;
      }
    }

    if (Config.endKeyWords) {
      if (!this.endKeysOk(order.toAddr)) {
        return false;
      }
    }

    return true;
  },
};

module.exports = { matchOrder };
