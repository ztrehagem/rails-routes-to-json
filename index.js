const child_process = require('child_process');
const fs = require('fs');

module.exports = RailsRoutesToJson;

function RailsRoutesToJson(options, callback) {
  options = Object.assign({
    outputFilepath: 'routes.json'
  }, options || {});

  RailsRoutesToJson.getJsObject(options, (obj)=> {
    fs.writeFile(options.outputFilepath, JSON.stringify(obj), callback);
  });
}

RailsRoutesToJson.getJsObject = function(options, callback) {
  options = Object.assign({
    isIgnoreNonames: true,
  }, options || {});

  RailsRoutesToJson.execCommand(options.command || 'rails routes', (raw)=> {
    var items = raw.toString().split('\n').slice(1).filter((str)=> {
      return str && str.length;
    }).map((str)=> {
      var item = str.trim().split(/[ ]+/);
      if (item[0].match(/^[A-Z]+$/)) {
        item.unshift(null);
      }
      return new Item(item[0], item[1], item[2].match(/^(\/.*?)(?:\(.+\))?$/)[1]);
    });

    if (options.isIgnoreNonames) {
      items = items.filter((item)=> {
        return item.name && item.name.length;
      });
    }

    if (Array.isArray(options.ignoreUris)) {
      items = items.filter((item)=> {
        return !options.ignoreUris.some((uri)=> {
          return uri instanceof RegExp ? item.uri.match(uri) : item.uri == uri;
        });
      });
    }

    callback(items);
  });
};

RailsRoutesToJson.execCommand = function(command, callback) {
  child_process.exec(command, (error, raw)=> {
    if (error) {
      console.error('read error');
    } else {
      callback(raw.toString());
    }
  });
};

class Item {
  constructor(name, method, uri) {
    this.name = name;
    this.method = method;
    this.uri = uri;
  }
}
