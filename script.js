// 加载控制台

function getCurrentTime() {
  return new Date().getTime();
}

// 加载浮动按钮
importClass(android.graphics.Color);
importClass(android.view.View);

let floatyPositon = { x: device.width * 0.3, y: device.height * 0.4 };

function logWin() {
  floatyLogInit(5, floatyPositon.x, floatyPositon.y, true); //主显示
}

function slog(nr) {
  floatyLog(nr);
}

function floatyLogInit(linesCount, x, y, islog) {
  linesCount = linesCount || 6;
  if (typeof linesCount != "number") linesCount = 6;
  if (typeof x != "number") x = 0;
  if (typeof y != "number") y = 10;
  if (typeof islog != "boolean") islog = true;

  ww = floaty.rawWindow(
    <horizontal
      id="move"
      background="#000000"
      paddingLeft="10"
      paddingRight="10"
      w="*"
    >
      <button
        id="log"
        textSize="13dp"
        textColor="#0bf613"
        style="Widget/AppCompat.Button.Borderless"
        text="[运行日志2.3.1]"
        textStyle="bold"
        layout_gravity="right"
        layout_weight="5"
        layout_width="wrap_content"
        layout_height="wrap_content"
      />
    </horizontal>
  );
  ww.setTouchable(false);
  ui.run(() => {
    ww.setPosition(x, y);
  });

  let nowlogArr = [];

  let lastLog = "";

  clsLog = function () {
    nowlogArr = [];
    log("清空控制台");
    ui.run(() => {
      ww.log.text("[运行日志2.3.1]");
    });
  };

  floatyLog = function () {
    let s = "[" + dateFormat(new Date(), "hh:mm:ss") + "] ";
    for (let param of arguments) s += param + " ";

    if (lastLog.indexOf("⌛") > -1 && s.indexOf("⌛") > -1) {
      // 上一行和这一行都包含，倒计时，那么，直接覆盖。
      nowlogArr.pop();
    } else {
      if (nowlogArr.length > linesCount) nowlogArr.shift();
    }

    nowlogArr.push(s);
    lastLog = s;

    let printContent = nowlogArr.join("\n");
    ui.run(() => {
      ww.log.text(printContent);
    });
    if (islog) log(s);
  };

  floatyShow = function (x, y) {
    let _x = x || 0;
    let _y = y || 10;
    ui.run(() => {
      ww.setPosition(_x, _y);
    });
  };

  floatyHide = function () {
    ui.run(() => {
      ww.setPosition(3000, 3000);
    });
  };
  function dateFormat(date, fmt) {
    let o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      S: date.getMilliseconds(),
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }

    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
    return fmt;
  }
}

function floatyWin() {
  let 绿 = Color.parseColor("#00FF00");
  let 红 = Color.parseColor("#ed30ae");
  let 蓝 = Color.parseColor("#1E90FF");
  let 天蓝 = Color.parseColor("#00BFFF");

  let a_红 = Color.parseColor("#FF6666");
  let a_灰 = Color.parseColor("#CCCCCC");
  let a_蓝 = Color.parseColor("#0099CC");
  let a_绿 = Color.parseColor("#99CC00");

  绿 = a_绿; //
  红 = a_红; //
  天蓝 = a_灰; //隐藏
  绿 = a_绿;

  //   <linear id="h" gravity="center">
  //         <button
  //           margin="1dp"
  //           padding="1dp"
  //           w="30dp"
  //           id="action"
  //           text="停"
  //           minHeight="1dp"
  //           minWidth="1dp"
  //           textSize="15sp"
  //           background="#FF6666"
  //         />
  //       </linear>
  // let window = floaty.window(
  let window = floaty.rawWindow(
    <vertical w="*">
      <linear id="h" gravity="center">
        <button
          margin="0"
          padding="0"
          w="30dp"
          id="floatyShow"
          text="隐"
          minHeight="0dp"
          minWidth="0dp"
          textSize="15sp"
          textColor="#00BFFF"
          background="#CCCCCC"
        />
      </linear>
      <linear id="h" gravity="center">
        <button
          margin="0"
          padding="0"
          w="30dp"
          id="exitScriptButton"
          text="退"
          minHeight="0dp"
          minWidth="0dp"
          textSize="15sp"
          background="#0099CC"
        />
      </linear>
    </vertical>
  );
  window.setPosition(0, floatyPositon.y);
  setInterval(() => {}, 1000);
  let execution = null;
  //记录按键被按下时的触摸坐标
  let x = 0,
    y = 0;
  //记录按键被按下时的悬浮窗位置
  let windowX, windowY;
  //记录按键被按下的时间以便判断长按等动作
  let downTime;
  window.floatyShow.setOnTouchListener(function (view, event) {
    switch (event.getAction()) {
      case event.ACTION_DOWN:
        x = event.getRawX();
        y = event.getRawY();
        windowX = window.getX();
        windowY = window.getY();
        downTime = new Date().getTime();
        return true;
      case event.ACTION_MOVE:
        //移动手指时调整悬浮窗位置
        window.setPosition(
          windowX + (event.getRawX() - x),
          windowY + (event.getRawY() - y)
        );
        //如果按下的时间超过1.5秒判断为长按，退出脚本
        if (new Date().getTime() - downTime > 30000) {
          // exit();
        }
        return true;
      case event.ACTION_UP:
        //手指弹起时如果偏移很小则判断为点击
        if (
          Math.abs(event.getRawY() - y) < 5 &&
          Math.abs(event.getRawX() - x) < 5
        ) {
          onClick();
        }
        return true;
    }
    return true;
  });

  function onClick() {
    floatyShowHidden();
  }

  window.exitScriptButton.click(function () {
    slog("退出脚本");
    engines.stopAll();
  });

  function floatyShowHidden() {
    if (window.floatyShow.getText() == "隐") {
      slog("隐藏 日志 悬浮窗");
      window.floatyShow.setText("显");
      window.floatyShow.setTextColor(绿);
      floatyHide();

      slog("隐藏按钮，停和退");
      //   window.action.setVisibility(View.INVISIBLE);
      window.exitScriptButton.setVisibility(View.INVISIBLE);
    } else {
      window.floatyShow.setText("隐");
      // window.floatyShow.setTextColor(天蓝);
      slog("显示 日志 悬浮窗");
      floatyShow(floatyPositon.x, floatyPositon.y);
      //   window.action.setVisibility(View.VISIBLE);
      window.exitScriptButton.setVisibility(View.VISIBLE);
    }
  }

  function changeAction() {
    if (window.action.getText() == "停") {
      window.action.setText("启");
      window.action.setBackgroundColor(绿);
      stopScript();
      slog("ok");
    } else if (window.action.getText() == "启") {
      toastLog("启动脚本");
      resetGLobalVariable();
      slog("启动脚本");
      boot();
      window.action.setText("停");
      window.action.setBackgroundColor(红);
    }
  }

  //   window.action.click(changeAction);
}

function resetGLobalVariable() {
  slog("重置相关全局变量");
}
function stopScript() {
  slog("正常退出脚本");
  toastLog("正常退出脚本");
  // 这个退出很搞笑。没有 console.hide(); 这一行。就不管用了。
  console.hide();
  threads.shutDownAll();
}

floatyWin();
logWin();

let boot = function () {
  log("请重写此方法");
};
function setBootFunc(bootFunc) {
  boot = bootFunc;
}

module.exports = {
  slog,
  setBootFunc,
};
