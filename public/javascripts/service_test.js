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
            "resCode" : origin.find('.response > .response-col_status').text(),
            "resBody" : origin.find('.language-json').text(),
            "resHeaders" : origin.find('.headerline').text()
        },
        success : function(data){
            console.log(data);
        }
    })
}

$("#biz_type").on("change", function() {
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
                    $('#swagger-iframe').off('on').on('load',function(){
                        let origin = $(this)
                        $(this).contents().find('.opblock-summary-control').off('click').on('click',function(){
                            origin.contents().find('body').find('.operation-tag-content').on('DOMNodeInserted','.no-margin',function(){
                                origin = $(this)
                                $(this).find('.try-out').off('click').on('click',function(){
                                    setTimeout(function(){
                                        origin.find('.execute-wrapper').off('click').on('click',function(){
                                            if(origin.find('div').hasClass('curl-command') == true){
                                                origin = origin.find('.responses-inner')
                                                log(origin,"server")
                                            }
                                            else{
                                                origin.find('.responses-inner').on('DOMNodeInserted','div',
                                                function(){
                                                    log($(this),"server")
                                                });
                                            }
                                        });
                                    },1)
                                })
                            })
                        })
                    })
                }
            })
        }
    })
});

$(document).ready(function(){
        $('#swagger-iframe').off('on').on('load',function(){
            let origin = $(this)
            $(this).contents().find('.opblock-summary-control').off('click').on('click',function(){
                origin.contents().find('body').find('.operation-tag-content').on('DOMNodeInserted','.no-margin',function(){
                    origin = $(this)
                    $(this).find('.try-out').off('click').on('click',function(){
                        setTimeout(function(){
                            origin.find('.execute-wrapper').off('click').on('click',function(){
                                if(origin.find('div').hasClass('curl-command') == true){
                                    origin = origin.find('.responses-inner')
                                    log(origin,"service")
                                }
                                else{
                                    origin.find('.responses-inner').on('DOMNodeInserted','div',
                                    function(){
                                        log($(this),"service")
                                    });
                                }
                            });
                        },1)
                    })
                })
            })
        })
})