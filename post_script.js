
var loadScript = function(filename) {
  var s = document.createElement('script');
  // 获取插件安装后，mock.js的file:///路径
  //! 需要在manifest.json中声明 web_accessible_resources
  s.src = chrome.extension.getURL(filename);
  // head还没准备好的话，取html
  var doc = document.head || document.documentElement;
  return doc.appendChild(s);
}
// test
loadScript('hook.js');