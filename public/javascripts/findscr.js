function sendMail() {
    if ($("#find_femail").val() == "" || $("#find_semail").val() == "") {
        alert('이메일을 입력하여 주세요!');
        return false;
    } else{
        alert('인증번호가 발송되었습니다!');
        $.ajax({
            url: "/user/mail_send",
            type: "POST",
            async: false,
            data: {
                "mail": $("#find_femail").val() + "@" + $("#find_semail").val()
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

function IDcheckMail() {
    var result;
    if ($("#find_femail").val() == "" || $("#find_semail").val() == "") {
        alert('이메일을 입력하여 주세요!');
        return false;
    } else if ($("#find_cmail").val() == "") {
        alert('인증번호를 입력하여 주세요!');
        return false;
    } else {
        $.ajax({
            url: "/user/mail_check",
            type: "POST",
            async: false,
            data: {
                "mail_check": $("#find_cmail").val()
            },
            success: function (data) {
                if (data == "true") {
                    result = true;
                    alert('인증이 완료되었습니다.');
                } else {
                    result = false;
                    alert(data);
                }
            }
        })
    }
    return result;
}

function PWcheckMail() {
    var result;
    if ($("#find_id").val() == "") {
        alert('아이디를 입력하여 주세요!');
        return false;
    } else if ($("#find_femail").val() == "" || $("#find_semail").val() == "") {
        alert('이메일을 입력하여 주세요!');
        return false;
    } else if ($("#find_cmail").val() == "") {
        alert('인증번호를 입력하여 주세요!');
        return false;
    } else {
        $.ajax({
            url: "/user/mail_check",
            type: "POST",
            async: false,
            data: {
                "mail_check": $("#find_cmail").val()
            },
            success: function (data) {
                if (data == "true") {
                    result = true;
                    alert('인증이 완료되었습니다.');
                } else {
                    result = false;
                    alert(data);
                }
            }
        })
    }
    return result;
}

$(document).ready(function checkPw() {
    $("input[name='init_pw']").focusout(function () {
        var pwPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,16}$/;
        if ($("#init_pw").val() == "") {
            $(".error_next_box")[0].innerHTML = "필수 정보입니다.";
            $(".error_next_box")[0].style.color = "red";
            $(".error_next_box")[0].style.display = "flex";
            return false;
        } else if (!pwPattern.test($("#init_pw").val())) {
            $(".error_next_box")[0].innerHTML = "8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.";
            $(".error_next_box")[0].style.color = "red";
            $(".error_next_box")[0].style.display = "flex";
            return false;
        } else {
            $(".error_next_box")[0].innerHTML = "사용 가능합니다!";
            $(".error_next_box")[0].style.color = "#08A600";
            $(".error_next_box")[0].style.display = "flex";
            return true;
        }
    });
});

$(document).ready(function comparePw() {
    $("input[name='init_pw_check']").focusout(function () {
        if($("#init_pw_check").val() == ""){
            $(".error_next_box")[1].innerHTML = "필수 정보입니다.";
            $(".error_next_box")[1].style.color = "red";
            $(".error_next_box")[1].style.display = "flex";
            return false;
        }
        else if($("#init_pw").val() != $("#init_pw_check").val()){
            $(".error_next_box")[1].innerHTML = "비밀번호가 일치하지 않습니다.";
            $(".error_next_box")[1].style.color = "red";
            $(".error_next_box")[1].style.display = "flex"
            return false;
        }
        else{
            $(".error_next_box")[1].innerHTML = "사용 가능합니다!";
            $(".error_next_box")[1].style.color = "#08A600";
            $(".error_next_box")[1].style.display = "flex";
            return true;
        }
    });
});


function PWcheckPasswd() {
    if (checkPw == true && comparePw() == true) return true;
    else false;
} 
