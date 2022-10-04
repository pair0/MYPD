function making_select() {
    console.log("맞아 바로 여기야");
    var service_select=$("#biz_type").val();
    
    $.ajax({
        url: "/user/number_check",
        type: "POST",
        async: false, 
        data: {
            "data": service_select
        },
        success: function(result3){
            if(result3 == "true"){
                alert("사용 가능한 사업자번호입니다.");
                number_check = true;
            } else {
                alert(result3);
                number_check = false;
            }
        }
    });
}