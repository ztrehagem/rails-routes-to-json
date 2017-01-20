const RailsRoutesToJson = require('./index');
const fs = require('fs');

// TODO 公開しても大丈夫なテスト用ファイルを用意する
const ignoreUris = require('./ignore-uris');

RailsRoutesToJson.execCommand = function(command, callback) {
  fs.readFile('routes.txt', (error, raw)=> {
    callback(raw.toString());
  });
};

RailsRoutesToJson({
  ignoreUris: ignoreUris
}, (obj)=> {
  // obj.forEach((item)=> {
  //   console.log(item.name);
  //   console.log('  ', item.uri);
  // });
  console.log('done');
});
