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
        }
    })
}

// ????????? ?????? swagger ??????
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

// ?????? ??????????????? ?????? 
$("#biz_type").on("change", function() {
    if(window.location.href == "https://mypd.kr/testbed/unit_svc")
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
                    $('#api_swagger').append('<iframe id="swagger-iframe" src="https://mypd.kr/api_test" style="border: 0px; background-color: #ffffff;"  width="840px" height="1000px">?????? ??????</iframe>')
                    swaggerlog("?????? <br> ???????????????")
                }
            })
        }
    })
});
// ????????? ??????????????? ?????? 
$(document).ready(function(){
    swaggerlog("????????? <br> ???????????????")
})
// ???????????? ????????? ??? ???????????????
$(window).on("scroll", function() {
    var position = $(window).scrollTop() + 20; // ?????? ??????????????? ???????????? ???????????????.
    $(".side_bar2").stop().animate({top:position+"px"}, 1); //?????? ???????????? ????????? ?????????
});


document.getElementById("clickresult").onclick = function() {
    window.open("/testbed/popup_api_select?id="+$('#b_right').val(), "?????? ??????", "width = 460, height = 650, top = 100, left = 200, location = no");
}

function setJSON(row) {
    var jsonObj = {};
    // textarea value to JSON object
    try {
        jsonObj = JSON.parse(row);
        
        if(!row.includes("{") || !row.includes("}"))
        {
            throw Error("not json");
        }
        return jsonObj
    }catch (err) {
        alert("???????????? json????????? ?????? ????????????.");
        return false;
    }
};

function check1(arg0){
    fetch('inte_api_final_request').then(function(response){
        response.text().then(function(text){
            opener.document.getElementById('request').innerHTML=text;
            opener.document.getElementById("clickresult").style.display = 'none';
            opener.document.getElementById("result").style.display = 'block';
            $.ajax({
                url: "/testbed/inte_api_final_request",
                type: "POST",
                async: false,
                data: {
                    "select" : $(arg0).val(),
                    "orgcode": opener.$('#orgcode').val(),
                    "Access_token": opener.$('#Access_token').val()
                },
                dataType:"json",
                success: function (svc) {
                    opener.$("#header_api").text(svc["api"]);
                    var jsonViewer = new JSONViewer();
                    opener.$("#code123").html(svc["row"]);
                    var res = setJSON(svc["row"]);
                    if (res===false)
                    {
                        return false;
                    }
                    jsonViewer.showJSON(res);
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
            api_req = JSON.parse($("#code123").val())
            $.ajax({
                url: "/testbed/api_response", //"/v1/diagnosis/lists",
                type: "GET",
                async: false,
                headers: {
                    "authorization" : api_req.access_token
                },
                data: {
                    "org_code" : api_req.org_code,
                    "spec_id" : api_req.spec_id,
                    "line_no" : api_req.line_no,
                    "pres_certify_no" : api_req.pres_certify_no
                },
                dataType:"json",
                success: function (svc) {
                    $("#header_api_res").text($("#header_api").text())
                    row = JSON.stringify(svc)
                    var jsonViewer = new JSONViewer();
                    $("#coderesponse").html(jsonViewer.getContainer());
                    var res = setJSON(row);
                    if (res===false)
                    {
                        return false;
                    }
                    jsonViewer.showJSON(res);
                }
            })
        })   
    })
}


function clickresult2() {
    document.getElementById("result").style.display = 'none';
    document.getElementById("response").style.display = 'none';
    window.open("/testbed/popup_api_select?id="+$('#b_right').val(), "?????? ??????", "width = 460, height = 650, top = 100, left = 200, location = no");
}