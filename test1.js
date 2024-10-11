const autojsUtil = {
  pageUpBySwipe: function () {
    var h = device.height; //屏幕高
    var w = device.width; //屏幕宽
    var x = random((w * 1) / 3, (w * 2) / 3); //横坐标随机。防止检测。
    var h1 = (h / 6) * 5; //纵坐标6分之5处
    var h2 = h / 6; //纵坐标6分之1处
    swipe(x, h2, x, h1, 500); //向上翻页(从纵坐标6分之1处拖到纵坐标6分之5处)
    // this.sml_move(x, h2, x, h1, 500); //向上翻页(从纵坐标6分之1处拖到纵坐标6分之5处)
  },
  pageDownBySwipe: function () {
    var h = device.height; //屏幕高
    var w = device.width; //屏幕宽
    // var x = (w / 3) * 2; //横坐标2/3处。
    var x = random((w * 2) / 5, (w * 3) / 5); //横坐标随机。防止检测。
    var h1 = (h / 6) * 5; //纵坐标6分之5处
    var h2 = h / 6; //纵坐标6分之1处
    swipe(x, h1, x, h2, 500); //向下翻页(从纵坐标6分之5处拖到纵坐标6分之1处)
    // this.sml_move(x, h1, x, h2, 500); //向下翻页(从纵坐标6分之5处拖到纵坐标6分之1处)
  },
  //qx, qy, zx, zy, time 代表起点x,起点y,终点x,终点y,过程耗时单位毫秒
  // 参考：https://blog.98lm.com/archives/1868.html
  sml_move: function (qx, qy, zx, zy, time) {
    var xxy = [time];
    var point = [];
    var dx0 = {
      x: qx,
      y: qy,
    };

    var dx1 = {
      x: random(qx - 100, qx + 100),
      y: random(qy, qy + 50),
    };
    var dx2 = {
      x: random(zx - 100, zx + 100),
      y: random(zy, zy + 50),
    };
    var dx3 = {
      x: zx,
      y: zy,
    };
    for (var i = 0; i < 4; i++) {
      eval("point.push(dx" + i + ")");
    }
    // log(point[3].x);

    for (let i = 0; i < 1; i += 0.08) {
      xxyy = [
        parseInt(bezier_curves(point, i).x),
        parseInt(bezier_curves(point, i).y),
      ];

      xxy.push(xxyy);
    }

    // log(xxy);
    gesture.apply(null, xxy);

    function bezier_curves(cp, t) {
      cx = 3.0 * (cp[1].x - cp[0].x);
      bx = 3.0 * (cp[2].x - cp[1].x) - cx;
      ax = cp[3].x - cp[0].x - cx - bx;
      cy = 3.0 * (cp[1].y - cp[0].y);
      by = 3.0 * (cp[2].y - cp[1].y) - cy;
      ay = cp[3].y - cp[0].y - cy - by;

      tSquared = t * t;
      tCubed = tSquared * t;
      result = {
        x: 0,
        y: 0,
      };
      result.x = ax * tCubed + bx * tSquared + cx * t + cp[0].x;
      result.y = ay * tCubed + by * tSquared + cy * t + cp[0].y;
      return result;
    }
  },
};

// autojsUtil.pageUpBySwipe();
// autojsUtil.pageDownBySwipe();

// swipe(0, device.height / 2, 0, device.height / 3, 500);

let D = device.width;
let H = device.height;

// gesture(2200, [0, 1500], [0, 200]);
gesture(1000, [0, 300], [0, 1500]);

let eles = scrollable().find();
for (let e of eles) {
  log(e.className());
  //   sleep(3000);
  //   log(e.className());
  log(e.bounds());
  //   e.scrollForward();
  // 经过测试，第三个滚动有效。
}
log(D);
log(H);
// className("RecyclerView").findOne().scrollForward();

function handlerAllData() {
  while (1) {
    if (include("没有更多数据")) {
      log("到了底部");
      break;
    }
    id("rvMatchOrders").findOne().scrollForward();
    sleep(200);
  }
}

function backTop() {
  id("btnRefresh").findOne().click();
}

// let e = className("ScrollView").findOne();
// e.scrollForward();
// e.scrollBackward();
// e.scrollDown();
