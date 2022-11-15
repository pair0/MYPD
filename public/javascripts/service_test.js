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