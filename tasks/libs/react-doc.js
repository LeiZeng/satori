import gutil from 'gulp-util'
import R from 'ramda'
import fs from 'fs'
import doctrine from 'doctrine'
import path from 'path'
import through from 'through2'
import stringify from 'json-stringify-safe'

var PLUGIN_NAME = 'react-dox';

module.exports = function (fileName) {

  if (!fileName) {
    throw new gutil.PluginError(PLUGIN_NAME, 'Missing file option for react-dox');
  }

  var result = {};

  return through.obj(docJson, endStream);

  function endStream(cb) {

    var file = new gutil.File({
      path: fileName,
      contents: new Buffer(stringify(result, null, 2))
    });

    this.push(file);

    cb();

  }

  function docJson(file, enc, cb) {

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    try {

      var doctrineTags = R.pipe(
        R.curry(takeComments),
        R.map(function (comment) {
          return doctrine.parse(comment, {
            unwrap: true,
            sloppy: true
          })
        }),
        R.reduce(function (tags, item) {
          return R.concat(tags, item.tags)
        }, [])
      )(file.contents.toString());

      if (!isReactDoc(doctrineTags)) {
        return cb();
      }

      result[file.path] = moduleNameFix(getInfoByDoctrineTags(doctrineTags), file.path);

    } catch (err) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
    }

    return cb();

  }

};

function isReactDoc(doctrineTags) {
  return R.pipe(
    R.filter(function (tag) {
      return R.propEq('title', 'reactType', tag) && R.strIndexOf('React', R.prop('description', tag)) === 0
    }),
    R.length
  )(doctrineTags);
}

function getInfoByDoctrineTags(doctrineTags) {

  return R.pipe(
    R.reduceIndexed(function (info, tagItem, idx, tags) {

      var type = R.prop('title', tagItem);

      switch (type) {
        case 'exampleRequire':

          info[type + 's'] = R.concat(info[type + 's'] || [], [
            exampleRequireParse(R.prop('description', tagItem))
          ]);

          break;
        case 'example':
        case 'exampleFile':

          var contents;
          if (R.eq(type, 'exampleFile')) {
            contents = String(fs.readFileSync(path.join(process.cwd(), R.trim(R.prop('description', tagItem))), 'utf-8'));
          } else {
            contents = R.prop('description', tagItem)
          }
          info['examples'] = R.concat(info['examples'] || [], [contents]);

          break;
        case 'prop':
        case 'property':
        case 'param':

          if (R.eq(type, 'prop')) {
            type = 'property'
          }

          if (R.has('$of', info)) {
            info = info['$of'];
          }

          if (!info[type]) {
            info[type] = {};
          }

          info[type][tagItem.name] = R.pick(['name', 'description', 'type'])(tagItem);

          info[type][tagItem.name]['$of'] = info;

          return info[type][tagItem.name];

          break;

        case 'description':
        case 'reactType':
        case 'name':
        case 'module':
        default:
          info[type] = R.prop('description', tagItem);
          break;
      }

      if (R.eq(idx, R.length(tags) - 1) && R.has('$of', info)) {
        return info['$of'];
      }

      return info

    }, {})
  )(doctrineTags)

}

function exampleRequireParse(string) {
  var result = R.match(/(\{([^\s]+)\})?\s?([^\s]+)/, string);

  if (!result) {
    return null;
  }

  var obj = {};

  obj.reactType = result[2] || 'ReactComponent';

  if (R.eq(obj.reactType, 'ReactComponent')) {
    obj = R.merge(obj, R.zipObj(['module', 'name'], R.split('.')(result[3])));
    obj.filePath = path.join(process.cwd(), String(obj.module), String(obj.name) + '.jsx')
  }

  return obj
}

function moduleNameFix(info, filePath) {
  if (!info.name || !info.module) {
    var pathArr = R.split(path.sep)(path.relative(process.cwd(), filePath));
    var fileName = R.last(pathArr);
    info.name = R.substringTo(R.strIndexOf('.js', fileName), fileName);
    info.module = R.join('/')(R.take(R.length(pathArr) - 1, pathArr));
  }

  info.filePath = filePath;

  return info;
}

function takeComments(str) {
  return R.match(/\/\*([\S\s]*?)\*\//gm, str) || [];
}
