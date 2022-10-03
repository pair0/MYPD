function key_gen(){
    $.ajax({
        url: "/mypage/key_gen",
        type: "GET",
        async: true,
        data: {},
        dataType:"json",
        success: function (key) {
            console.log(key);
            $('input[name=c_id]').attr('value',key.id);
            $('input[name=c_secret]').attr('value',key.secret);
        }
    })
}
//키 미발급시 알림
function event_click(){
    if(document.getElementById("c_id").value==''){
        alert("key를 발급 받으세요.");
        return false;
    }
}

