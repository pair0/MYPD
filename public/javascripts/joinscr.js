var ID = document.querySelector('#id');
var PW = document.querySelector('#pw');
var PWCheck = document.querySelector('#pw_check');
var emailF = document.querySelector('#femail');
var emailS = document.querySelector('#semail');
var emailCheck = document.querySelector('#cmail');
var input = document.querySelector('.huji .input');
var error = document.querySelectorAll('.error_next_box');
var test = true;

/*이벤트 핸들러 연결*/

ID.addEventListener("focusout", checkId);
PW.addEventListener("focusout", checkPw);
PWCheck.addEventListener("focusout", comparePw);

/*콜백 함수*/

function checkId() {
    var idPattern = /^[a-z0-9][a-z0-9_\-].{4,19}$/;
    var result;
    if (ID.value == "") {
        error[0].innerHTML = "필수 정보입니다.";
        error[0].style.color = "red";
        error[0].style.display = "flex";
        return false;
    } else if (!idPattern.test(ID.value)) {
        error[0].innerHTML = "5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.";
        error[0].style.color = "red";
        error[0].style.display = "flex";
        return false;
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
                    result = true;
                } else {
                    error[0].innerHTML = "이미 존재하는 ID입니다.";
                    error[0].style.color = "red";
                    error[0].style.display = "flex";
                    result = false;
                }
            }
        })
        return result;
    }
}

function checkPw() {
    var pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,16}$/;
    if (PW.value == "") {
        error[1].innerHTML = "필수 정보입니다.";
        error[1].style.color = "red";
        error[1].style.display = "flex";
        return false;
    } else if (!pwPattern.test(PW.value)) {
        error[1].innerHTML = "8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.";
        error[1].style.color = "red";
        error[1].style.display = "flex";
        return false;
    } else {
        error[1].innerHTML = "사용 가능합니다!";
        error[1].style.color = "#08A600";
        error[1].style.display = "flex";
        return true;
    }
}

function comparePw() {
    if (PWCheck.value == "") {
        error[2].innerHTML = "필수 정보입니다.";
        error[2].style.color = "red";
        error[2].style.display = "flex";
        return false;
    } else if (PW.value != PWCheck.value) {
        error[2].innerHTML = "비밀번호가 일치하지 않습니다.";
        error[2].style.color = "red";
        error[2].style.display = "flex"
        return false;
    } else {
        error[2].innerHTML = "비밀번호가 일치합니다!";
        error[2].style.color = "#08A600";
        error[2].style.display = "flex";
        return true;
    }
}

function checkAll() {
    var result;
    $.ajax({
        url: "/user/check_all",
        type: "POST",
        async: false,
        data: {
            "checkID": checkId(),
            "checkPW": checkPw(),
            "comparePW": comparePw(),
            "checkMAIL": checkMail()
        },

        success: function (data) {
            if (data == "true") {
                console.log("성공" + data);
                result = true;
            } else {
                alert(data);
                result = false;
            }
        }
    })
    console.log("adsfasdfawefㅁㄴㅇㄹ"+$("#check1").is(":checked")==true);
    if($("#check1").is(":checked")==true && $("#check2").is(":checked")==true){
        result = true;
    }else if($("#check1").is(":checked")==false && $("#check2").is(":checked")==true){
        alert("기업 회원 약관에 동의란을 확인해주세요!");
        result = false;
    } else if($("#check1").is(":checked")==true && $("#check2").is(":checked")==false){
        alert("개인정보 수집 및 이용에 동의란을 확인해주세요!");
        result = false;
    } else{
        alert("기업 회원 약관 및 개인정보 수집 및 이용에 동의를 해주세요!");
        result = false;
    } 

    return result;
}

function sendMail() {
    if (emailF.value == "" || emailS.value == "") {
        alert('이메일을 입력하여 주세요!');
        return false;
    }
    $.ajax({
        url: "/user/mail_send",
        type: "POST",
        async: false,
        data: {
            "mail": emailF.value + "@" + emailS.value
        },
        success: function (data) {
            if (data) {
                alert('인증번호가 발송되었습니다!');
                auth = data;
                test = false;
            } else {
                auth = false;
            }
        }
    })
    return auth;
}

function checkMail() {
    var result;
    if (emailF.value == "" || emailS.value == "") {
        alert('이메일을 입력하여 주세요!');
        return false;
    } else if (emailCheck.value == "") {
        alert('인증번호를 입력하여 주세요!');
        return false;
    } else if(test) {
        alert('인증코드 발송을 진행하여 주세요!');
        return false;
    } else {
        $.ajax({
            url: "/user/mail_check",
            type: "POST",
            async: false,
            data: {
                "mail_check": emailCheck.value
            },
            success: function (data) {
                if (data) {
                    result = true;
                    alert('인증이 완료되었습니다.');
                    emailCheck.style.background = "#c7c7c7";
                    emailCheck.readOnly = true;
                } else {
                    result = false;
                    alert('인증이 실패하였습니다. 메일을 다시 확인해주기 바랍니다!');
                }
            }
        })
    }
    return result;
}

$(document).ready(function() {
    $("#checkAll").click(function() {
        if($("#checkAll").is(":checked")) $("input[name=chk]").prop("checked", true);
        else $("input[name=chk]").prop("checked", false);
    });
    
    $("input[name=chk]").click(function() {
        var total = $("input[name=chk]").length;
        var checked = $("input[name=chk]:checked").length;
        
        if(total != checked) $("#checkAll").prop("checked", false);
        else $("#checkAll").prop("checked", true); 
    });
});