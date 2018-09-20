const fs = require('fs');
/* 删除注释 */
function deleteNote(code) {
    var reg = /([^http:]\/\/.*)|(\/\*[\s\S]*?\*\/)/g;
    var result = code.replace(reg, '');
    return result;
}

module.exports = function getLessVariables(file) {
    var themeContent = fs.readFileSync(file, 'utf-8')
    var variables = {}
    themeContent = deleteNote(themeContent).split('\n');
    themeContent.forEach(function(item) {
        var _pair = item.split(':')
        if (_pair.length < 2) return;
        var key = _pair[0].replace('\r', '').replace('@', '')
        if (!key) return;
        _pair.splice(0,1)
        _pair = _pair.join(':')
        var value = _pair.replace(';', '').replace('\r', '').replace(/^\s+|\s+$/g, '')
        variables[key] = value
    })
    return variables
}
