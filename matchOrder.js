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
    // todo
    return time >= Config.goTimeBegin && time <= Config.goTimeEnd;
  },
  peopleCountOk: function (count) {
    // todo Config.cbOnePeopleNotLimit
    return count >= Config.peopleCountMin && count <= Config.peopleCountMax;
  },

  priceOk: function (price) {
    return price >= Config.orderPriceMin && price <= Config.orderPriceMax;
  },
  disFromOK: function (disFrom) {
    return disFrom <= Config.orderDisFromMax;
  },
  disToOK: function (disTo) {
    return disTo <= Config.orderDisToMax;
  },
  okk: function (orders) {
    for (let o of orders) {
      if (this.ok(o)) {
        log("匹配成功" + o);
        return o;
      }
    }
  },
  ok_with_hl_Orders: function (hlOrders) {
    // { tvDate: 10月21日 06:50~07:00,
    //   tvStartAddressCross: '北板桥站',
    //   tvStartDistanceCross: '31.3',
    //   tvEndAddress: '高平市高平东站',
    //   tvDriverPeopleCount: '1人',
    //   tvDriverPooling: 独享   拼座,
    //   tvTabPay: '已预付',
    //   tvDriverHighwayFee: undefined,
    //   amountEle: {} }

    // 标准order定义：
    for (let o of hlOrders) {
      let order = {};
      // order.byWayLevel=o.
      order.time = o.tvDate; //todo
      order.price = o.tvAmount.replace("元", "");
      order.disFrom = o.tvStartDistanceCross;
      // order.disTo=o.
      // order.dis=o.
      order.fromAddr = o.tvStartAddressCross;
      order.toAddr = o.tvEndAddress;
      order.peopleCount = o.tvDriverPeopleCount.replace("人", "");
      order.peopleMode = o.tvDriverPooling;
      order.highwayFee = o.tvDriverHighwayFee;

      if (this.ok(order)) {
        log("匹配成功" + order);
        return o;
      }
    }
  },
  ok: function (order) {
    if (Config.cbByWayLevel) {
      // 顺路存在的情况下，才生效
      if (order.byWayLevel && order.byWayLevel < Config.byWayLevel) {
        return false;
      }
    }

    if (Config.cbGoTime) {
      if (!this.timeOk(order.time)) {
        return false;
      }
    }

    if (Config.cbOrderDisFrom) {
      if (!this.disFromOK(order.disFrom)) {
        return false;
      }
    }

    if (Config.cbOrderDisTo) {
      // 终点距离存在的情况下，再生效
      if (order.disTo && !this.disToOK(order.disTo)) {
        return false;
      }
    }

    // todo 特惠和舒适没见过
    let peopleModeOk =
      (Config.cbOrderModeOnePeople && order.peopleMode.indexOf("独") > 0) ||
      (Config.cbOrderModeMultiPeople && order.peopleMode.indexOf("拼") > 0) ||
      (Config.cbOrderModeComfort && order.peopleMode.indexOf("舒") > 0) ||
      (Config.cbOrderModeChip && order.peopleMode.indexOf("惠") > 0);

    if (!peopleModeOk) {
      return false;
    }

    if (Config.cbPeopleCount) {
      if (!this.peopleCountOk(order.peopleCount)) {
        if (order.peopleMode.indexOf("独") > -1) {
          // 独享模式，人数不限
          if (Config.cbOnePeopleModeCountFree) {
          } else {
            return false;
          }
        }
        return false;
      }
    }

    if (Config.cbOrderPrice) {
      if (!this.priceOk(order.price)) {
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
