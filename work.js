const { Config } = require("./config");
const { bootV } = require("./manage");
const { slog, setBootFunc } = require("./script");

// 初始化配置到内存里面
Config.loadConfig();
setBootFunc(boot);
boot();

function boot() {
  log(Config);
  slog("脚本启动");

  if (Config.ddOffenWay || Config.ddxc) {
    slog("切换到滴滴");
    bootV.boot2dd();

    // todo 判断，当前位于哪个界面
    if (Config.ddxc) {
      slog("开启滴滴行程");
      bootV.intoDdxcView();
    }

    if (Config.ddOffenWay) {
      slog("开启滴滴 常用路线");
      bootV.intoDdOfferView();
    }
  }

  if (Config.hlxc || Config.hldt) {
    slog("切换到哈啰");
    bootV.boot2hl();
    // todo 判断，当前位于哪个界面,先开始哪个活动。
    // 如果，几个目标界面，都没在。直接向后返回，然后重新进入

    if (Config.hlxc) {
      slog("开启哈啰 行程");
    }

    if (Config.hldt) {
      slog("开启哈啰 大厅");
      bootV.intoHldtView();
    }
  }
}
