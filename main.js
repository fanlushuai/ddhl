"ui";

const { AutojsUtil } = require("./autojsUtil");
const { Config } = require("./config");

auto.waitFor();
AutojsUtil.loadUI("./project.json", "./ui.xml");

Config.setLSConfig2UI();

AutojsUtil.autoServiceCheck();

ui.save.click(function () {
  log("保存配置");
  Config.setUI2LSConfig();
  ui.run(function () {
    AutojsUtil.buttonFlashing(ui.save, "已 保 存");
  });
});

ui.boot.click(function () {
  if (auto.service == null) {
    toastLog("请先开启无障碍服务！");
    return;
  }

  log("保存配置");
  Config.setUI2LSConfig();

  log("启动脚本");

  threads.start(function () {
    home();
    sleep(1000);
    engines.execScriptFile("./qq.js");
    threads.shutDownAll();
  });
});
