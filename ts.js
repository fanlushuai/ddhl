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

  log(postionArr);

  for (let i = 0; i < postionArr.length; i++) {
    let keywords = keys.substring(postionArr[i], postionArr[i + 1]).trim();
    log("关键字:" + keywords);
    if (keywords.startsWith("+")) {
      keywords = keywords.substring(1);
      log("包含 关键字:" + keywords);
      if (testStr.indexOf(keywords) == -1) {
        return false;
      }
    } else if (keywords.startsWith("-")) {
      keywords = keywords.substring(1);
      log("排除 关键字:" + keywords);
      if (testStr.indexOf(keywords) != -1) {
        return false;
      }
    }
  }

  return true;
}

keyewords = "-aaa-bbb+ccc";

str = "aaccc";

log(keysWordsOk(keyewords, str));
