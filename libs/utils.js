var http = require('http'),
    fs = require('fs'),
    moment = require('moment'),
    Promise = require('bluebird'),
    crypto = require('crypto');

var _ = require('underscore');
var _s = require('underscore.string');
var utils = {};

global.log = function (m) {
    console.log(m);
};
global.warn = function (m) {
    if (typeof m === 'string') {
        return console.warn(m);
    }
    console.warn(m);
};
global.error = function (m) {
    if (typeof m === 'string') {
        return console.error(m);
    }
    console.error(m);
};

utils.checkEmail = function (email) {
    return email.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)
};
utils.checkPhone = function (phone) {
    return phone.match(/^1[3|4|5|8|7][0-9]\d{4,8}$/);
};
utils.checkUrl = function (str) {
    //在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
    var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp = new RegExp(Expression);
    if (str.indexOf("localhost")) {
        str = str.replace("localhost", "127.0.0.1");
    }
    return objExp.test(str);

};

utils.subString=function(str, len, hasDot) {
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex, "**").length;
    for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
            newLength += 2;
        } else {
            newLength++;
        }
        if (newLength > len) {
            break;
        }
        newStr += singleChar;
    }

    if (hasDot && strLength > len) {
        newStr += "...";
    }
    return newStr;
};
utils.delHtmlTag=function(str) {
    return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
};
utils.delBlank=function(str) {
    var _tmp = str.replace(/\t/g, "");//把所有/t替换掉
    _tmp = _tmp.replace(/\r/g, "");//把所有/r替换掉
    _tmp = _s.trim(_tmp, ' \n');//把前后的换行替换掉
    _tmp = _s.trim(_tmp, '\n ');//把前后的换行替换掉
    _tmp = _s.trim(_tmp, '\n');//把前后的换行替换掉
    return _tmp;

};

utils.isArray = function (o) {
    return Object.prototype.toString.call(o) === '[object Array]';
};

/**
 * clone an object
 */
utils.clone = function (origin) {
    if (!origin) {
        return;
    }
    var obj = {};
    for (var f in origin) {
        if (origin.hasOwnProperty(f)) {
            obj[f] = origin[f];
        }
    }
    return obj;
};

//字符串的md5值
utils.md5 = md5;

//文件的md5值（同步方法获取文件，不适用大文件）
utils.getMD5 = function (path) {
    var str = fs.readFileSync(path, 'binary');
    return crypto.createHash('md5').update(str).digest('hex');
};

utils.Hmac = function (key, str) {
    // var Buffer = require('buffer').Buffer;
    // var buf = new Buffer(1024);
    // var len = buf.write(str, 0);
    // str = buf.toString('binary', 0, len);
    return crypto.createHmac('sha1', key).update(str).digest();
};

utils.sha1 = function (str) {
    return crypto.createHash('sha1').update(str).digest('hex');
};

utils.dateFormat = function (date) {
    var res = moment(date).format('YYYY-MM-DD');
    return res == 'Invalid date' ? '' : res;
};
utils.datetimeFormat = function (time) {
    var res = moment(time).format('YYYY-MM-DD HH:mm:ss');
    return res == 'Invalid date' ? '' : res;
};
utils.moment = moment;


utils.env = (function () {
    return !process.env.NODE_ENV ? 'dev' : process.env.NODE_ENV;
})();

utils.configDir = (function () {
    var path = process.cwd() + '/config.dev';
    if (utils.env == 'production') {
        path = process.cwd() + '/config.production';
    }
    return path;
})();

utils.generatePass = function (pass) {
    return md5(pass + 'readbox.in').substr(3, 15);
};

utils.base64_encode = function (str) {
    return base64_encode(str);
};
utils.base64_decode = function (str) {
    return base64_decode(str);
};
utils.getByteLen = function (val) {    //传入一个字符串
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
            len += 2; //如果是全角，占用两个字节
        else
            len += 1; //半角占用一个字节
    }
    return len;
};
//pads n with zeros on the left,
//digits is minimum length of output
//zeroPad(3, 5); returns "005"
//zeroPad(2, 500); returns "500"
utils.zeroPad = zeroPad;

var key = false;
var keya = false;
var keyb = false;
var cl = 4;
var EXPIRY = 300;
var salt = 'tWrmGHvRf4ikxEG2gdJNNz1xIP861mkjyXTVDXXAb1i';
utils.decodeResult = function (str) {
    var box = _createKeyBox('decode', str).box;
    var strbuf;
    str = str.substr(cl);
    strbuf = base64_decode(str);
    var result = _encryptHandler(strbuf, box);
    var vk = md5(result.substr(26) + keyb);
    if (result.substr(10, 16) == vk.substr(0, 16)) {
        return result.substr(26);
    } else {
        return '';
    }
};
utils.encodeResult = function (str) {
    var res = _createKeyBox('encode', str);
    var box = res.box;
    var keyc = res.keyc;
    keyc = 1234;
    var strbuf = zeroPad(10, EXPIRY + parseInt(moment().format('X'))) + md5(str + keyb).substr(0, 16) + str;
    var result = _encryptHandler(strbuf, box);
    result = keyc + base64_encode(result).replace(/=/g, '');
    return result;
};
function zeroPad(digits, n) {
    n = n.toString();
    while (n.length < digits)
        n = '0' + n;
    return n;
}
function md5(str) {
    var Buffer = require('buffer').Buffer;
    var buf = new Buffer(1024);
    var len = buf.write(str, 0);
    str = buf.toString('binary', 0, len);
    return crypto.createHash('md5').update(str).digest('hex');
}
function _createKeyBox(op, str) {
    var keyc = '';
    if (op == 'decode') {
        keyc = str.substr(0, cl);
    } else {
        keyc = md5(moment().format('X').toString()).substr(-cl);
    }
    if (!key) {
        key = md5(salt);
        keya = md5(key.substr(0, 16));
        keyb = md5(key.substr(16, 16));
    }
    var cryptkey = keya + md5(keya + keyc);
    var box = [];
    for (var l = 0; l < 256; l++) {
        box[l] = l;
    }
    var rndkey = [];
    var key_length = cryptkey.length;
    for (var i = 0; i < 256; i++) {
        rndkey[i] = cryptkey[i % key_length].charCodeAt();
    }
    var j = 0;
    for (var k = 0; k < 256; k++) {
        j = (j + box[k] + rndkey[k]) % 256;
        var tmp = box[k];
        box[k] = box[j];
        box[j] = tmp;
    }
    return {keyc: keyc, box: box};
}
function _encryptHandler(strbuf, box) {
    strbuf = strbuf.split('');
    var result = '';
    var a = m = 0;
    for (var n = 0; n < strbuf.length; n++) {
        a = (a + 1) % 256;
        m = (m + box[a]) % 256;
        var tmp2 = box[a];
        box[a] = box[m];
        box[m] = tmp2;
        result += chr(ord(strbuf[n]) ^ (box[(box[a] + box[m]) % 256]));
    }
    return result;
}

function ord(string) {
    var str = string + '',
        code = str.charCodeAt(0);
    if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
        var hi = code;
        if (str.length === 1) {
            return code; // This is just a high surrogate with no following low surrogate, so we return its value;
            // we could also throw an error as it is not a complete character, but someone may want to know
        }
        var low = str.charCodeAt(1);
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
    }
    if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
        return code; // This is just a low surrogate with no preceding high surrogate, so we return its value;
        // we could also throw an error as it is not a complete character, but someone may want to know
    }
    return code;
}
function chr(codePt) {
    if (codePt > 0xFFFF) { // Create a four-byte string (length 2) since this code point is high
        //   enough for the UTF-16 encoding (JavaScript internal use), to
        //   require representation with two surrogates (reserved non-characters
        //   used for building other characters; the first is "high" and the next "low")
        codePt -= 0x10000;
        return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
    }
    return String.fromCharCode(codePt);
}
function base64_encode(str) {
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}
function base64_decode(str) {
    var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1)
            break;
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}
function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}
function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                out += str.charAt(i - 1);
                break;
            case 12:
            case 13:
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}


module.exports = utils;