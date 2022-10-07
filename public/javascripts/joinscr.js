/*변수 선언*/
var NUMBER = document.querySelector('#number_check');
var NICKNAME = document.querySelector('#nickname');
var ID = document.querySelector('#id');
var PW = document.querySelector('#pw');
var PWCheck = document.querySelector('#pw_check');
var emailF = document.querySelector('#femail');
var emailS = document.querySelector('#semail');
var emailCheck = document.querySelector('#cmail');
var input = document.querySelector('.huji .input');
var error = document.querySelectorAll('.error_next_box');

/*이벤트 핸들러 연결*/
ID.addEventListener("focusout", checkId);
PW.addEventListener("focusout", checkPw);
PWCheck.addEventListener("focusout", comparePw);
NUMBER.addEventListener("click", number_check);
NICKNAME.addEventListener("focusout", checkNickname);

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
                            console.log(result2.data[0]['b_stt']);
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

//================================================================

function check_bizNum() {
    var numberPattern =/^[0-9]{10}$/; 
    if($("#biz_num").val()==""){
        alert("사업자번호를 넣어주세요");
        number_check = false;
    } else if(!numberPattern.test($("#biz_num").val())){
        alert("-를 제외한 숫자 10자리를 입력해주세요.")
        number_check = false;
    } else {
        $.ajax({
            url: "/user/biz_num",
            type: "POST",
            async: false,
            data: {
                "NUMBER": $("#biz_num").val()
            },
            success: function (data) {
                if (data == true) {
                    result = true;
                    alert('인증이 완료되었습니다.');
                } else {
                    result = false;
                }
            }
        })
    };
}

//================================================================

function checkNickname() {
    var nickPattern = /^[a-z0-9][a-z0-9_\-]{4,19}$/;
    if (NICKNAME.value == "") {
        error[0].innerHTML = "필수 정보입니다.";
        error[0].style.color = "red";
        error[0].style.display = "flex";
        checkNickname = false;
    } else if (!nickPattern.test(NICKNAME.value)) {
        error[0].innerHTML = "5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.";
        error[0].style.color = "red";
        error[0].style.display = "flex";
        checkNickname = false;
    } else {
        $.ajax({
            url: "/user/check_overlap",
            type: "POST",
            async: false, 
            data: {
                "NICKNAME": NICKNAME.value
            },
            success: function (data) {
                if (!data) {
                    error[0].innerHTML = "사용 가능합니다!";
                    error[0].style.color = "#08A600";
                    error[0].style.display = "flex";
                    checkNickname = true;
                } else {
                    error[0].innerHTML = "이미 존재하는 닉네임입니다.";
                    error[0].style.color = "red";
                    error[0].style.display = "flex";
                    checkNickname = false;
                }
            }
        })
    }
}

/*콜백 함수*/
function checkId() {
    var idPattern = /^[a-z0-9][a-z0-9_\-]{4,19}$/;
    if (ID.value == "") {
        error[1].innerHTML = "필수 정보입니다.";
        error[1].style.color = "red";
        error[1].style.display = "flex";
        checkId = false;
    } else if (!idPattern.test(ID.value)) {
        error[1].innerHTML = "5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.";
        error[1].style.color = "red";
        error[1].style.display = "flex";
        checkId = false;
    } else {
        $.ajax({
            url: "/user/check_overlap",
            type: "POST",
            async: false, 
            data: {
                "ID": ID.value
            },
            success: function (data) {
                if (!data) {
                    error[1].innerHTML = "사용 가능합니다!";
                    error[1].style.color = "#08A600";
                    error[1].style.display = "flex";
                    checkId = true;
                } else {
                    error[1].innerHTML = "이미 존재하는 ID입니다.";
                    error[1].style.color = "red";
                    error[1].style.display = "flex";
                    checkId = false;
                }
            }
        })
    }
}

function checkPw() {
    var pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,16}$/;
    if (PW.value == "") {
        error[2].innerHTML = "필수 정보입니다.";
        error[2].style.color = "red";
        error[2].style.display = "flex";
        checkPw = false;
    } else if (!pwPattern.test(PW.value)) {
        error[2].innerHTML = "8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.";
        error[2].style.color = "red";
        error[2].style.display = "flex";
        checkPw = false;
    } else {
        error[2].innerHTML = "사용 가능합니다!";
        error[2].style.color = "#08A600";
        error[2].style.display = "flex";
        checkPw = true;
    }
}
function comparePw() {
    if(PWCheck.value == ""){
        error[3].innerHTML = "필수 정보입니다.";
        error[3].style.color = "red";
        error[3].style.display = "flex";
        comparePw = false;
    }
    else if(PW.value != PWCheck.value){
        error[3].innerHTML = "비밀번호가 일치하지 않습니다.";
        error[3].style.color = "red";
        error[3].style.display = "flex"
        comparePw = false;
    }
    else{
        error[3].innerHTML = "사용 가능합니다!";
        error[3].style.color = "#08A600";
        error[3].style.display = "flex";
        comparePw = true;
    }
} 

function sendMail() {
    if (emailF.value == "" || emailS.value == "") {
        alert('이메일을 입력하여 주세요!');
        return false;
    } else{
        alert('인증번호가 발송되었습니다!');
        $.ajax({
            url: "/user/mail_send",
            type: "POST",
            async: false,
            data: {
                "mail": emailF.value + "@" + emailS.value
            },
            success: function (data) {
                if (data) {
                    auth = data;
                } else {
                    auth = false;
                }
            }
        })
        return auth;
    }
}

function checkMail() {
    if (emailF.value == "" || emailS.value == "") {
        alert('이메일을 입력하여 주세요!');
        checkMail = false;
    } else if (emailCheck.value == "") {
        alert('인증번호를 입력하여 주세요!');
        checkMail =  false;
    }  else {
        $.ajax({
            url: "/user/mail_check",
            type: "POST",
            async: false,
            data: {
                "mail_check": emailCheck.value
            },
            success: function (data) {
                if (data == "true") {
                    checkMail = true;
                    alert('인증이 완료되었습니다.');
                } else {
                    checkMail = false;
                    alert(data);
                }
            }
        })
    }
}

function checkBox(){
    if ($("#check1").is(":checked") == true && $("#check2").is(":checked") == true) {
        return true;
    } else {
        return false;
    }
}

function checkAll() {
    var result;
    $.ajax({
        url: "/user/check_all",
        type: "POST",
        async: false,
        data: {
            "Number_check" : number_check,
            "checkID": checkId,
            "checkPW": checkPw,
            "comparePW": comparePw,
            "checkMAIL" : checkMail,
            "checkBOX" : checkBox
        },
        success: function (data) {
            if (data==true) {
                result = true;
            } else {
                alert(data);
                result = false;
            }
        }
    })
    return result;
}

$(document).ready(function () {
        $("#checkboxAll").click(function () {
            if ($("#checkboxAll").is(":checked")) 
                $("input[name=chk]").prop("checked", true);
            else 
                $("input[name=chk]").prop("checked", false);
            }
        );
        $("input[name=chk]").click(function () {
            var total = $("input[name=chk]").length;
            var checked = $("input[name=chk]:checked").length;

            if (total != checked) 
                $("#checkboxAll").prop("checked", false);
            else 
                $("#checkboxAll").prop("checked", true);
            }
        );
    });