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