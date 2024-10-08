const LocalStorage = {
  localStorage: function () {
    // 保证，一个手机上安装不同的autojs应用，相互之间的cachekey不受到影响
    let storage = storages.create("autojsAppCacheKey");
    let cacheKey = storage.get("cacheKey", "");
    if (cacheKey == "") {
      let arr = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
      ];

      let i = 10;
      while (i > 0) {
        cacheKey += arr[random(0, arr.length - 1)];
        i--;
      }
      log("生成cacheKey" + cacheKey);
      storage.put("cacheKey", cacheKey);
    }

    return storages.create(cacheKey);
  },
};

module.exports = { LocalStorage };
