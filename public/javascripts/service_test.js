function making_select() {
    var service_select=$("#biz_type").val();

    $.ajax({
        url: "/testbed/ServiceSelect",
        type: "POST",
        async: false, 
        data: {
            "data": service_select
        },
        success: function(data){
            if(data){
                $('input[name=C_ID]').attr('value',data['clientid']);
                $('input[name=C_Se]').attr('value',data['clientsecret']);
            } else {
                $('input[name=C_ID]').removeAttr('value');
                $('input[name=C_Se]').removeAttr('value');
            }
        }
    });
}

function making_select_server() {
    var server_select=$("#biz_type").val();

    $.ajax({
        url: "/testbed/ServerSelect",
        type: "POST",
        async: false, 
        data: {
            "data": server_select
        },
        success: function(data){
            if(data){
                $('input[name=C_ip]').attr('value',data['clientip']);
            } else {
                $('input[name=C_ip]').removeAttr('value');
            }
        }
    });
}

function making_select_server_final() {
    var server_select=$("#biz_type").val();

    $.ajax({
        url: "/testbed/ServerSelect",
        type: "POST",
        async: false, 
        data: {
            "data": server_select
        },
        success: function(data){
            if(data){
                $('input[name=b_right]').attr('value',data['business_right']);
            } else {
                $('input[name=b_right]').removeAttr('value');
            }
        }
    });
}


function making_select_data() {
    var data_select=$("#data_select").val();

    $.ajax({
        url: "/testbed/DataSelect",
        type: "POST",
        async: false, 
        data: {
            "data": data_select
        },
        success: function(data){
            if(data){
                $('input[name=tmp_data]').attr('value',data['data_json']);
            } else {
                $('input[name=tmp_data]').removeAttr('value');
            }
        }
    });
}

function log(origin, type) {
    $.ajax({
        url: "/testbed/unitLogging",
        type: "POST",
        async: false,
        data: {
            "type" : type,
            "curl" : origin.find('.language-bash').text(),
            "resCode" : origin.find('.response > .response-col_status').eq(0).text(),
            "resBody" : origin.find('.language-json').eq(0).text(),
            "resHeaders" : origin.find('.headerline').text()
        },
        success : function(data){
            console.log(data);
        }
    })
}

// 로깅을 위한 swagger 접근
function swaggerlog(type) {
    $('#swagger-iframe').off('on').on('load',function(){
        let origin = $(this)
        $(this).contents().find('.opblock-summary-control').off('click').on('click',function(){
            origin.contents().find('body').find('.operation-tag-content').off('DOMNodeInserted').on('DOMNodeInserted','.no-margin',function(){
                origin = $(this)
                $(this).find('.try-out').off('click').on('click',function(){
                    setTimeout(function(){
                        origin.find('.execute-wrapper').off('click').on('click',function(){
                            if(origin.find('div').hasClass('curl-command') == true){
                                origin = origin.find('.responses-inner')
                                log(origin,type)
                            }
                            else{
                                origin.find('.responses-inner').off('DOMNodeInserted').on('DOMNodeInserted','div',
                                function(){
                                    log($(this),type)
                                });
                            }
                        });
                    },1)
                })
            })
        })
    })
}

// 서버 단위테스트 로깅 
$("#biz_type").on("change", function() {
    if(window.location.href == "http://localhost:3000/testbed/unit_svc")
        return
    $.ajax({
        url: "/testbed/selectServer",
        type: "POST",
        async: true, 
        data: {
            "data": $('#callback_url').val()
        },
        success: function(data){
            server = data;
            $(document).ready(function(){
                $('#swagger-iframe').remove();
                if(data['url'] != ''){
                    $('#api_swagger').append('<iframe id="swagger-iframe" src="http://localhost:3000/api_test" style="border: 0px; background-color: #ffffff;"  width="840px" height="1000px">로드 중…</iframe>')
                    swaggerlog("서버 <br> 단위테스트")
                }
            })
        }
    })
});
// 서비스 단위테스트 로깅 
$(document).ready(function(){
    swaggerlog("서비스 <br> 단위테스트")
})
// 사이드바 스크롤 시 내려오도록
$(window).on("scroll", function() {
    var position = $(window).scrollTop() + 20; // 현재 스크롤바의 위치값을 반환합니다.
    $(".side_bar2").stop().animate({top:position+"px"}, 1); //해당 오브젝트 위치값 재설정
});


document.getElementById("clickresult").onclick = function() {
    window.open("/testbed/popup_api_select", "인증 팝업", "width = 460, height = 650, top = 100, left = 200, location = no");
}

function check1(){
    fetch('inte_api_final_request').then(function(response){
        response.text().then(function(text){
            opener.document.getElementById('request').innerHTML=text;
            opener.document.getElementById("clickresult").style.display = 'none';
            opener.document.getElementById("result").style.display = 'block';
            $.ajax({
                url: "/testbed/inte_api_final_request",
                type: "POST",
                async: false,
                data: {},
                dataType:"json",
                success: function (svc) {
                    //var table = opener.document.getElementById('code123')
                    //for(var i=0; i< rowjosn.length; i++){
//                     var row = `{
//         <span style="color: rgb(32, 187, 230);">"x-api-tran-id"</span><span style="color: rgb(32, 187, 230);"> : </span><span style="color: rgb(162, 252, 162);">"<span><input value="입력해주세요." style="background-color: rgb(51, 51, 51); color: rgb(162, 252, 162); outline: none; border: none;"><span style="color: rgb(162, 252, 162);">",<span>
//         <span style="color: rgb(32, 187, 230);">"x-api-type"</span><span style="color: rgb(32, 187, 230);"> : </span><input style="background-color: black; color: rgb(162, 252, 162);" value='"false"'>
//         <span style="color: rgb(32, 187, 230);">"org_code"</span><span style="color: rgb(32, 187, 230);"> : </span><input style="background-color: black; color: rgb(162, 252, 162);" value='"${opener.$('#orgcode').val()}"'>
//         <span style="color: rgb(32, 187, 230);">"search_timestamp"</span><span style="color: rgb(32, 187, 230);"> : </span><input style="background-color: black; color: rgb(162, 252, 162);" value='"0"'>
//         <span style="color: rgb(32, 187, 230);">"access_token"</span><span style="color: rgb(32, 187, 230);"> : </span><input style="background-color: black; color: rgb(162, 252, 162);" value='"${opener.$('#Access_token').val()}"'>
// }`
                    var row = `{\n    "x-api-tran-id": "입력해주세요.",\n    "x-api-type": "false",\n    "org_code": "${opener.$('#orgcode').val()}",\n    "search_timestamp": "0",\n    "access_token": "입력해주세요"\n}` //${opener.$('#Access_token').val()}
                    //}
                    var jsonViewer = new JSONViewer();
                    var jsonObj = {};
                    opener.document.querySelector("#code123").appendChild(jsonViewer.getContainer());
                    alert(row);
                    //table.innerHTML +=row
                    try {
                        jsonObj = JSON.parse(row);
                        
                        console.log(jsonObj);
                        if(!row.includes("{") || !row.includes("}"))
                        {
                            throw Error("not json");
                        }
                    }
                    catch (err) {
                        alert("데이터가 json문법에 맞지 않습니다.");
                        return false;
                    }
                    jsonViewer.showJSON(jsonObj);
                }
            })
            window.close();
        })
    })
}

function clickresponse() {
    fetch('inte_api_final_response').then(function(response){
        response.text().then(function(text){
            document.getElementById('response').innerHTML=text;
            document.getElementById("response").style.display = 'block';
        })
    }).then(res => {
        // $.ajax({
        //     url: "/testbed/inte_api_final_request",
        //     type: "GET",
        //     async: true,
        //     data: {},
        //     dataType:"json",
        //     success: function (svc) {
        //         // data=svc;
        //         // for(var i=0; i< data.length;i++)
        //         // {
        //         //     var table = opener.document.getElementById('mytable')
        //         //     var row =  `<tr>
        //         //     <td id="list_name">${data[i].service_name}</td>
        //         //     <td>${data[i].service_callback_url}</td>
        //         //     <td>${data[i].service_client_id}</td>
        //         //     <td>${data[i].service_text}</td>
        //         //     <td class="svc_dlt_box"><a class="svc_dlt" onclick="del(1, ${data[i].service_id})">삭제</a></td>
        //         // </tr>
        //         // `
        //         //     table.innerHTML +=row
        //         // }
        //     }
        // })
        //opener.document.getElementById("result").style.display = 'block';
        //opener.document.getElementById("clickresult").style.display = 'none';
    }).catch((err) => {
        alert(err);
    });
}

function clickresult2() {
    document.getElementById("result").style.display = 'none';
    document.getElementById("response").style.display = 'none';
    window.open("/testbed/popup_api_select", "인증 팝업", "width = 460, height = 650, top = 100, left = 200, location = no");
}