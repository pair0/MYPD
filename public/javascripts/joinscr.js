/*변수 선언*/
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

$(document).ready(function number_check() {
    $("input[name='number']").click(function () {
        var result = false;
        var data = {
            "b_no": [$("#number").val()] // 사업자번호 "xxxxxxx" 로 조회 시,
        }; 
        
        $.ajax({
            url: "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=FBONefeh0BNms/zROn6qTrT7HiD8OIXfye0Du4rE97od/UHXKHdz6KCdy5PexGfKzuPxyALWTqOUlSwwFucbNg==",  // serviceKey 값을 xxxxxx에 입력
            type: "POST",
            data: JSON.stringify(data), // json 을 string으로 변환하여 전송
            dataType: "JSON",
            contentType: "application/json",
            accept: "application/json",
            success: function(result) {
                console.log(result);
                result = false;
            },
            error: function(result) {
                console.log(result.responseText); //responseText의 에러메세지 확인
                result = false;
            }
        });
    });
});

/*콜백 함수*/
function checkId() {
    var idPattern = /^[a-z0-9][a-z0-9_\-].{4,19}$/;
    var result;
    if (ID.value == "") {
        error[0].innerHTML = "필수 정보입니다.";
        error[0].style.color = "red";
        error[0].style.display = "flex";
        checkId = false;
    } else if (!idPattern.test(ID.value)) {
        error[0].innerHTML = "5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.";
        error[0].style.color = "red";
        error[0].style.display = "flex";
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
                    error[0].innerHTML = "사용 가능합니다!";
                    error[0].style.color = "#08A600";
                    error[0].style.display = "flex";
                    checkId = true;
                } else {
                    error[0].innerHTML = "이미 존재하는 ID입니다.";
                    error[0].style.color = "red";
                    error[0].style.display = "flex";
                    checkId = false;
                }
            }
        })
    }
}
function checkPw() {
    var pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,16}$/;
    if (PW.value == "") {
        error[1].innerHTML = "필수 정보입니다.";
        error[1].style.color = "red";
        error[1].style.display = "flex";
        checkPw = false;
    } else if (!pwPattern.test(PW.value)) {
        error[1].innerHTML = "8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.";
        error[1].style.color = "red";
        error[1].style.display = "flex";
        checkPw = false;
    } else {
        error[1].innerHTML = "사용 가능합니다!";
        error[1].style.color = "#08A600";
        error[1].style.display = "flex";
        checkPw = true;
    }
}
function comparePw() {
    if(PWCheck.value == ""){
        error[2].innerHTML = "필수 정보입니다.";
        error[2].style.color = "red";
        error[2].style.display = "flex";
        comparePw = false;
    }
    else if(PW.value != PWCheck.value){
        error[2].innerHTML = "비밀번호가 일치하지 않습니다.";
        error[2].style.color = "red";
        error[2].style.display = "flex"
        comparePw = false;
    }
    else{
        error[2].innerHTML = "사용 가능합니다!";
        error[2].style.color = "#08A600";
        error[2].style.display = "flex";
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
                    emailCheck.style.background = "#c7c7c7";
                    emailCheck.readOnly = true;
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