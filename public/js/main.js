/**
 * Created by leeshine on 15/3/24.
 */
function delArticle(page_id){
    $.ajax(
        {
            type: 'POST',
            url: '/handle/delPage',
            data: {page_id: page_id},
            dataType: 'JSON',
            cache: false,
            success: function (res) {
               if(res.result=='TRUE'){
                   showMsg('done');
                   closeWebPage();
               }else{
                   showMsg('oops! sth wrong！');
               }
            },
            error:function(){
                showMsg('oops! sth wrong！');
            }
        }

    );
}
function showMsg(content){
    $('#msgBox').html(content).show();
    setTimeout(function(){
        $('#msgBox').html('').fadeOut();
    },3000);
}
function closeWebPage(){
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null;
            window.close();
        } else {
            window.open('', '_top');
            window.top.close();
        }
    }
    else if (navigator.userAgent.indexOf("Firefox") > 0) {
        window.location.href = 'about:blank ';
    } else {
        window.opener = null;
        window.open('', '_self', '');
        window.close();
    }
}