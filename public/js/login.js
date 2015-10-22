/**
 * Created by leeshine on 15/10/22.
 */
var jwt = window.localStorage.getItem('readbox_jwt');
function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    );
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
function removeScriptCode(html) {
    html = html.replace(/<script.*<\/script>/ig, '');
    return html;
}
function removeHtmlTag(html) {
    html = html.replace(/<[^>]*>/ig, '');
    return html;
}
function loginSuccess(){
     $('.loginWrap').hide();
     $('#error').hide();
     $('.loginSuccess').show();
     var from  = getURLParameter('from');
     setTimeout(function(){
         if(from=='wechat'){
            window.close();
         }else{
            window.location.href ='/';
         }
     },1500);

}

if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
} else {
    onBridgeReady();
}
function onBridgeReady() {
    WeixinJSBridge.call('hideOptionMenu');
    WeixinJSBridge.call('hideToolbar');
}
$(document).ready(function(){
    $('#btnGotoRegister').click(function(){
        $('.loginWrap').animate({left:'-300px'});
        $('#error').html('').hide();
    });
    $('#btnLogin').click(function(){
        $('#error').html('').hide();
        var loginname = $.trim($('#loginname').val());
        var pwd = $('#pwd').val();
        pwd =  base64_encode(pwd);

        if(loginname==''){
            $('#error').html('need phone or email!').show();
            return;
        }
        if(pwd==''){
            $('#error').html('need password!').show();
            return;
        }
        $('#error').html('').hide();
        $.ajax({
            type: "POST",
            url: '/user/login',
            data: {loginName:loginname,pwd:pwd},
            dataType: 'json',
            success: function (res) {
                if(res.result=='TRUE'){
                    jwt = res.jwt;
                    window.localStorage.setItem('readbox_jwt',jwt);
                    loginSuccess();
                }else{
                    $('#error').html("(;´༎ຶД༎ຶ`) something wrong!").show();
                }
            },
            error:function(){
                $('#error').html("(;´༎ຶД༎ຶ`) something wrong!").show();
            }
        });
    });
    $('#btnRegister').click(function(){
        $('#error').html('').hide();
        var loginname = $.trim($('#regLoginname').val());
        var pwd = $('#regPwd').val();
        pwd =  base64_encode(pwd);
        var nickname = $.trim($('#nickname').val());
        nickname = removeScriptCode(nickname);
        nickname = removeHtmlTag(nickname);

        if(loginname==''){
            $('#error').html('need phone or email!').show();
            return;
        }
        if(pwd==''){
            $('#error').html('need password!').show();
            return;
        }
        if(nickname==''){
            $('#error').html('need nickname!').show();
            return;
        }

        $('#error').html('').hide();
        $.ajax({
            type: "POST",
            url:'/user/register',
            data: {loginName:loginname,pwd:pwd,nickname:nickname},
            dataType: 'json',
            success: function (res) {
                if(res.result=='TRUE'){
                    jwt = res.jwt;
                    window.localStorage.setItem('readbox_jwt',jwt);
                    loginSuccess();
                }else{
                    $('#error').html("(;´༎ຶД༎ຶ`) something wrong!").show();
                }
            },
            error:function(){
                $('#error').html("(;´༎ຶД༎ຶ`) something wrong!").show();
            }
        });
    });
});