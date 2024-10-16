const { Config } = require("./config");
const { bootV } = require("./manage");
const { slog, setBootFunc } = require("./script");

// 初始化配置到内存里面
Config.loadConfig();
setBootFunc(boot);

function boot() {
  log(Config);
  slog("脚本启动");
  if (ddxc) {
    log("开启滴滴行程");
    bootV.boot2dd();
    bootV.intoDdxcView();
  }

  if (ddOffenWay) {
    log("开启滴滴 常用路线");
    bootV.boot2dd();
    bootV.intoDdxcView();
  }

  if (hlxc || hldt) {
    bootV.boot2hl();

    if (hlxc) {
      log("开启哈啰 行程");
    }

    if (hldt) {
      log("开启哈啰 大厅");
      bootV.intoHldtView();
    }
  }
}

// cbByWayLevel: false,
// cbOrderDisFrom: false,
// cbOrderDisTo: false,
// cbOrderModeOnePeople: true,
// cbOrderModeMultiPeople: true,
// cbOrderModeComfort: true,
// cbOrderModeChip: true,
// cbMultiPeople: false,
// cbOnePeopleModeCountFree: false,
// cbGoTime: false,
// cbOrderPrice: false,
// cbFromKeyWords: false,
// cbEndKeyWords: false,
// alertMusic: false,
// testMode: false,

// ddxc: true,
// ddOffenWay: false,
// hlxc: true,
// hldt: false,

// goTimeBegin: '',
// goTimeEnd: '',
// fromKeyWords: '',
// endKeyWords: '',
// byWayLevel: 90,
// orderDisFromMax: 10,
// orderDisToMax: 10,
// multiPeolpeMinCount: 1,
// multiPeolpeMaxCount: 4,
// orderPriceMin: 0,
// orderPriceMax: 1000,

// refreshIntervalSec: 15 }
