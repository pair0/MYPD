var test = true;

function sendMail() {
    console.log($("#find_femail").val() + "@" + $("#find_semail").val());
    if ($("#find_femail").val() == "" || $("#find_semail").val() == "") {
        alert('이메일을 입력하여 주세요!');
        return false;
    }
    $.ajax({
        url: "/user/mail_send",
        type: "POST",
        async: false,
        data: {
            "mail": $("#find_femail").val() + "@" + $("#find_semail").val()
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
    if ($("#find_femail").val() == "" || $("#find_semail").val() == "") {
        alert('이메일을 입력하여 주세요!');
        return false;
    } else if ($("#find_cmail").val() == "") {
        alert('인증번호를 입력하여 주세요!');
        return false;
    } else if (test) {
        alert('인증코드 발송을 진행하여 주세요!');
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
                if (data) {
                    result = true;
                    alert('인증이 완료되었습니다.');
                } else {
                    result = false;
                    alert('인증이 실패하였습니다. 메일을 다시 확인해주기 바랍니다! \n계속해서 진행이 되지 않는다면 메일 발송을 다시 한번 진행해주세요');
                }
            }
        })
    }
    return result;
}