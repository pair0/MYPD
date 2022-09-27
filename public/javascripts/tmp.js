//const { assign } = require("nodemailer/lib/shared");

/* 변수 선언 */
var dataName = document.querySelector('#data_name');
var orgCode = document.querySelector('#org_code');
var assetId = document.querySelector('#assetId');
var error = document.querySelectorAll('.errorBox_myPage');

/* 이벤트 핸들러 연결 */
dataName.addEventListener("focusout", checkDataName);
orgCode.addEventListener("focusout", checkOrgCode);
assetId.addEventListener("focusout", checkAssetId);

/* 함수 선언 */
function checkDataName() {
    var dataPattern = /^[a-z0-9][a-z0-9_\-]{4,19}$/;
    if (dataName.value == "") {
        error[0].innerHTML = "필수 정보입니다.";
        error[0].style.color = "red";
        error[0].style.display = "flex";
        checkDataName = false;
    } else if (!dataPattern.test(dataName.value)) {
        error[0].innerHTML = "5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.";
        error[0].style.color = "red";
        error[0].style.display = "flex";
        checkDataName = false;
    } else {
        // 수정 자료형에 맞게 해야함
        $.ajax({
            url: "/user/check_overlap",
            type: "POST",
            async: false, 
            data: {
                // 마이데이터 테스트 데이터이름
                "ID": ID.value
            },
            success: function (data) {
                if (!data) {
                    error[0].innerHTML = "유효하지 않은 데이터 이름입니다.";
                    error[0].style.color = "red";
                    error[0].style.display = "flex";
                    checkDataName = false;
                } else {
                    checkDataName = true;
                }
            }
        })
    }
}

function checkOrgCode() {
    var codePattern = /[0-9]{10}$/;
    if (orgCode.value == "") {
        error[1].innerHTML = "필수 정보입니다.";
        error[1].style.color = "red";
        error[1].style.display = "flex";
        checkOrgCode = false;
    } else if (!codePattern.test(orgCode.value)) {
        error[1].innerHTML = "기관코드는 10자리 숫자만 사용 가능합니다.";
        error[1].style.color = "red";
        error[1].style.display = "flex";
        checkOrgCode = false;
    } else {
        // 수정 자료형에 맞게 해야함
        $.ajax({
            url: "/user/check_overlap",
            type: "POST",
            async: false, 
            data: {
                // 기관 코드
                "ID": ID.value
            },
            success: function (data) {
                if (!data) {
                    error[1].innerHTML = "유효하지 않은 기관코드 입니다.";
                    error[1].style.color = "red";
                    error[1].style.display = "flex";
                    checkOrgCode = false;
                } else {
                    checkOrgCode = true;
                }
            }
        })
    }
}

function checkAssetId() {
    var assetPattern = /[0-9]{10}$/;
    if (assetId.value == "") {
        error[2].innerHTML = "필수 정보입니다.";
        error[2].style.color = "red";
        error[2].style.display = "flex";
        checkAssetId = false;
    }
    // 자산 코드는 계좌, 카드등이어서 정규표현식 힘들듯
    /*
        else if (!ass[arguments].test(assetId.value)) {
        error[2].innerHTML = "기관코드는 10자리 숫자만 사용 가능합니다.";
        error[2].style.color = "red";
        error[2].style.display = "flex";
        checkOrgCode = false;
    }*/
    else {
        // 수정 자료형에 맞게 해야함
        $.ajax({
            url: "/user/check_overlap",
            type: "POST",
            async: false, 
            data: {
                // 자산유형 / 번호 (두개를 받아와야할듯)
                "assType": asset.type,
                "assNum": asset.num
            },
            success: function (data) {
                if (!data) {
                    error[2].innerHTML = "유효하지 않은 자산번호입니다.";
                    error[2].style.color = "red";
                    error[2].style.display = "flex";
                    checkAssetId = false;
                } else {
                    checkAssetId = true;
                }
            }
        })
    }
}