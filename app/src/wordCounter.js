module.exports =  function (markdown) {
  var ignoreCount = false;
  var count = 0;
  if (!markdown) {
    return count;
  }
  markdown.split('\n').forEach(function (line) {
    //もし```か[jade]であれば、次の```か[/jade]まで無視
    if (/^(```|\[\/?jade\])/.test(line)) {
      ignoreCount = !ignoreCount ? true : false ;
    }
    if (ignoreCount) {
      return;
    }
    //不要な文字を消して数えたい文字列のみにする
    var filteredText = line
      // タグ
      .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
      // 引用
      .replace(/^>.+/g, '')
      // [note]などの独自記法
      .replace(/^\[.+\]$/g, '')
      // 画像
      .replace(/!\[.+\]\(.+\)/g, '')
      // リンクはタイトルを残す
      .replace(/\[(.+)\]\(.+\)/g, '$1')
      // 装飾記号
      .replace(/[#\-+*_`]/g, '')
      // 行頭の空白
      .replace(/^\s+/g, '')
      // 改行
      .replace(/\n+/g, '')
    if (filteredText.length) {
      count += filteredText.length;
    }
  });
  return count;
};
