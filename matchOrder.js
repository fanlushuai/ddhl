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
  okk: function (orders) {
    for (let o of orders) {
      if (this.ok(o)) {
        log("匹配成功" + o);
        return o;
      }
    }
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

// function parseDDOrder(ddOrder){
//   let order={

//     byWayLevel:,
//     time:,
//     price:,
//     disFrom:,
//     disTo:,
//     dis:,
//     fromAddr:,
//     toAddr:,
//     peopleCount:,
//     peopleMode:,
//     highwayFee:,
//   }
// }

function parseHLOrder_xc(hlOrder) {
  let o = hlOrder;

  let p = {
    byWayLevel: function (str) {
      if (str) {
        return str.replace("%顺路", "");
      }
    },

    time: function (str) {
      if (str) {
        // todo 解析时间
      }
    },
    price: function (str) {
      if (str) {
        return str.replace("元", "");
      }
    },
    disFrom: function (str) {
      if (str) {
        return str.replace("距你", "").replace("km", "");
      }
    },
    disTo: function (str) {
      if (str) {
        return str.replace("km", "");
      }
    },
    dis: function (str) {
      if (str) {
        return str;
      }
    },
    fromAddr: function (str) {
      if (str) {
        return str;
      }
    },
    toAddr: function (str) {
      if (str) {
        return str;
      }
    },
    peopleCount: function (str) {
      if (str) {
        return str.replace("人", "");
      }
    },
    peopleMode: function (str) {
      if (str) {
        if (str.indexOf("拼") != -1) {
          return "拼座";
        } else if (str.indexOf("独") != -1) {
          return "独享";
        }

        return "";
      }
    },
    highwayFee: function (str) {
      if (str) {
        if (str.indexOf("协商") != -1) {
          return "协商";
        } else if (str.indexOf("不承担") != -1) {
          return "不承担";
        } else {
          return "";
        }
      }
    },
  };

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
  // id("tvAmount")
  let order = {
    byWayLevel: p.byWayLevel(o.tvHitchPercent),
    time: p.time(o.tvDate),
    price: p.price(o.tvAmount),
    disFrom: p.disFrom(o.tvStartAddress),
    disTo: p.disTo(o.tvEndDistance),
    // dis:p.dis(o.),  //没有全程距离
    fromAddr: p.fromAddr(o.tvStartRegionDescribe),
    toAddr: p.toAddr(o.tvEndAddress + " " + o.tvEndRegionDescribe),
    peopleCount: p.peopleCount(o.tvDriverPeopleCount),
    peopleMode: p.peopleMode(o.tvDriverPooling),
    highwayFee: p.highwayFee(o.tvDriverHighwayFee),
  };

  return order;
}

// 标准order定义：
// byWayLevel
// time
// price
// disFrom
// disTo
// dis
// fromAddr
// toAddr
// peopleCount
// peopleMode
// highwayFee

module.exports = { matchOrder, parseHLOrder_xc };
