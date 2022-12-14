/*변수 선언*/
var NUMBER = document.querySelector('#number_check');
/*이벤트 핸들러 연결*/
NUMBER.addEventListener("click", number_check);

function number_check() {
    var numberPattern =/^[0-9]{10}$/; 
    if($("#number").val()==""){
        alert("사업자번호를 넣어주세요");
        number_check = false;
    } else if(!numberPattern.test($("#number").val())){
        alert("-를 제외한 숫자 10자리를 입력해주세요.")
        number_check = false;
    } else {
        var data_number = {
            "b_no": [$("#number").val()] // 사업자번호 "xxxxxxx" 로 조회 시,
        }; 
        $.ajax({
            url: "/user/check_overlap",
            type: "POST",
            async: false, 
            data: {
                "NUMBER": $("#number").val()
            },
            success: function (result1) {
                if (!result1) {
                    $.ajax({
                        url: "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=FBONefeh0BNms/zROn6qTrT7HiD8OIXfye0Du4rE97od/UHXKHdz6KCdy5PexGfKzuPxyALWTqOUlSwwFucbNg==",  // serviceKey 값을 xxxxxx에 입력
                        type: "POST",
                        data: JSON.stringify(data_number), // json 을 string으로 변환하여 전송
                        dataType: "JSON",
                        contentType: "application/json",
                        accept: "application/json",
                        success: function(result2) {
                            $.ajax({
                                url: "/user/number_check",
                                type: "POST",
                                async: false, 
                                data: {
                                    "use": result2.data[0]['b_stt']
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
                        },
                        error: function(result2) {
                            console.log(result.responseText); //responseText의 에러메세지 확인
                            number_check = false;
                        }
                    });
                } else {
                    alert("회원님께서는 이미 MYPD에 가입하셨습니다.");
                    number_check = false;
                }
            }
        })
    };
}
function checkAll() {
    var result;
    $.ajax({
        url: "/user/check_num",
        type: "POST",
        async: false,
        data: {
            "Number_check" : number_check,
        },
        success: function (data) {
            if (data==true) {
                result = true;
            } else {
                result = false;
                alert(data)
            }
        }
    })
    return result;
}