// const { Result } = require("express-validator");

var jsonObj = {};
// var firstval = "예시 데이터 입니다";
var jsonViewer = new JSONViewer();
document.querySelector("#json").appendChild(jsonViewer.getContainer());

var textarea = document.querySelector("textarea");
textarea.value = "";
// textarea value to JSON object
var setJSON = function() {
    try {
        var value = textarea.value;
        jsonObj = JSON.parse(value);
        if(!textarea.value.includes("{") || !textarea.value.includes("}"))
        {
            throw Error("not json");
        }
    }
    catch (err) {
        alert("데이터가 json문법에 맞지 않습니다.");
        return false;
    }
};


// load default value
// setJSON();

var loadJsonBtn = document.querySelector("button.load-json");
var collapseBtn = document.querySelector("button.collapse");
var maxlvlBtn = document.querySelector("button.maxlvl");

loadJsonBtn.addEventListener("click", function() {
    var res = setJSON();
    if (res===false)
    {
        return false;
    }
    jsonViewer.showJSON(jsonObj);
});


function checkdata(){

	if(document.getElementById("testdata").value.length == 0)
    {
        alert("데이터를 등록하세요.")
        return false;
    }
    if(setJSON()===false)
    {
        return false;
    }
	return true;
    
}

async function changeAPI(val){
    var target = document.getElementById("api");
    var medical = [
        "[의료명세서 API] 명세서 목록 조회 API",
        "[의료명세서 API] 명세서 내역 조회 API",
        "[의료명세서 API] API 목록 조회",
        "[의료명세서 API] 전송요구내역 조회 API",
        "[의료명세서 API] 명세서 일반내역 조회 API(가안)",
        "[진료정보제공 API] 진료내역 목록 조회 API",
        "[진료정보제공 API] 진료내역 조회 API",
        "[진료정보제공 API] API 목록 조회",
        "[진료정보제공 API] 처방전교부목록 조회 API",
        "[진료정보제공 API] 처방전교부내역 조회 API",
        "[진료정보제공 API] 수진자상병내역 조회 API",
        "[진료정보제공 API] 전송요구내역 조회 API",
        "[의약품정보제공 API] 의료기관약제내역목록 조회 API",
        "[의약품정보제공 API] 의료기관약제내역 조회 API"
        ]
    
    var ecommerce=[
        "도입예정1 API",
        "도입예정2 API"
    ]

    var finance=[
        "도입예정1 API"
    ]
    
    var res = [];

    if(val.value ==="의료"){
        res = medical;
    }
    else if(val.value==="전자상거래")
    {
        res=ecommerce;
    }
    else if(val.value==="금융"){
        res=finance;
    }
    
    target.options.length=0;
    for(x in res)
    {
        var opt = document.createElement("option");
        opt.value=res[x];
        opt.innerHTML =res[x];
        target.appendChild(opt);
    }

}