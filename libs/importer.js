//动态加载器
var fs = require('fs');
var path = require('path');
var debug = require('debug')('importer');

function dispatchImporter(rel__dirname) {
    function importer(from) {
        var imported = {};
        var joinPath = function() {
            return '.' + path.sep + path.join.apply(path, arguments);
        };
        var fsPath = joinPath(path.relative(process.cwd(), rel__dirname), from);
        fs.readdirSync(fsPath).forEach(function(name) {
            var info = fs.statSync(path.join(fsPath, name));
            if (info.isDirectory()) {
                imported[name] = importer(joinPath(from, name));
            } else {
                var ext = path.extname(name);
                var base = path.basename(name, ext);
                if (require.extensions[ext]) {
                    imported[base] = require(path.join(rel__dirname, from, name));
                } else {
                    debug('cannot require ', name);
                }
            }
        });
        return imported;
    }
    return importer;

}

module.exports = dispatchImporter;