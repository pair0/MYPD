// 메뉴 바 
const list = document.querySelectorAll('.list');



function activeLink()
{
        list.forEach((item) =>
        item.classList.remove('active'));
        this.classList.add('active');
}
list.forEach((item) =>
item.addEventListener('click', activeLink));
var data = [];

//페이지 이동
function fetchPagesvr(name){
    fetch(name).then(function(response){
        response.text().then(function(text){
            document.querySelector('content').innerHTML=text;
        })
    }).then(res => {
        $.ajax({
        url: "/mypage/svr_list",
        type: "GET",
        async: true,
        data: {},
        dataType:"json",
        success: function (svc) {
            data=svc;
            for(var i=0; i< data.length;i++)
            {
                var table = document.getElementById('mytable')
                var row = `<tr>
                                <td id="list_name">${data[i].server_name}</td>
                                <td>${data[i].server_ip}</td>
                                <td>${data[i].business_right}</td>
                                <td>${data[i].server_explain}</td>
                                <td class="svc_dlt_box"><a class="svc_dlt" onclick="del_svc(${data[i].server_manage_id})">삭제</a></td>
                            </tr>
                            `
                table.innerHTML +=row
            }
        }
    })
    }).catch(()=>{
        console.log("error");
    });

}

function fetchPagedata(name){
    fetch(name).then(function(response){
        response.text().then(function(text){
            document.querySelector('content').innerHTML=text;
        })
    }).then(res => {
        $.ajax({
        url: "/mypage/data_list",
        type: "GET",
        async: true,
        data: {},
        dataType:"json",
        success: function (svc) {
            data=svc;
            for(var i=0; i< data.length;i++)
            {
                var table = document.getElementById('mytable')
                var row =  `<tr>
                <td id="list_name">${data[i].data_name}</td>
                <td>${data[i].enterprise_code}</td>
                <td>${data[i].business_right}</td>
                <td>${data[i].data_api}</td>
                <td>${data[i].asset_id}</td>
                <td class="svc_dlt_box"><a class="svc_dlt" onclick="">편집</a></td>
                <td class="svc_dlt_box"><a class="svc_dlt" onclick="del_svc(${data[i].data_id})">삭제</a></td>
            </tr>
            `
                table.innerHTML +=row
            }
        }
    })
    })
    .catch(()=>{
        console.log("error");
    })
}

function fetchPagesvc(name){
    fetch(name).then(function(response){
        response.text().then(function(text){
            document.querySelector('content').innerHTML=text;
        })
    }).then(res => {
        $.ajax({
        url: "/mypage/svc_list",
        type: "GET",
        async: true,
        data: {},
        dataType:"json",
        success: function (svc) {
            data=svc;
            for(var i=0; i< data.length;i++)
            {
                var table = document.getElementById('mytable')
                var row =  `<tr>
                <td id="list_name">${data[i].service_name}</td>
                <td>${data[i].service_callback_url}</td>
                <td>${data[i].service_client_id}</td>
                <td>${data[i].service_text}</td>
                <td class="svc_dlt_box"><a class="svc_dlt" onclick="del_svc(${data[i].service_id})">삭제</a></td>
            </tr>
            `
                table.innerHTML +=row
            }
        }
    })
    }) .catch(()=>{
        console.log("error");
    });
}

        //연동서버 관리
function fetchPageisv(name){
    fetch(name).then(function(response){
        response.text().then(function(text){
            document.querySelector('content').innerHTML=text;
        })
    }).then(res => {
        $.ajax({
        url: "/mypage/isv_list",
        type: "GET",
        async: true,
        data: {},
        dataType:"json",
        success: function (svc) {
            data=svc;
            for(var i=0; i< data.length;i++)
            {
                var table = document.getElementById('mytable')
                var row =  `<tr>
                <td id="list_name" onclick="click()">${data[i].server_name}</td>
                <td>${data[i].server_ip}</td>
                <td>${data[i].business_right}</td>
                <td>${data[i].request_count}</td>
                <td class="svc_dlt_box"><a class="svc_dlt" onclick="del_svc(${data[i].interserver_id})">취소</a></td>
            </tr>
            `
                table.innerHTML +=row
            }
        }
    })
    }).catch(()=>{
        console.log("table insert error");
    });
}
async function buillogdtable(data, id){
    $('td').remove('.dataTables-empty')
    var id_name = id + '_name'
    for(var i=0; i< data.length;i++)
    {
        var table = document.getElementById(id)
        if((data[i].reqBody == null || data[i].reqBody == "{}") && (data[i].reqHeaders == null || data[i].reqHeaders == "{}")){
            var row = `<tr id="log_tr">
                            <td id=${id_name}>${data[i].type}</td>
                            <td id=${id_name}>${data[i].timestamp.substr(0,10)}<br>${data[i].timestamp.substr(11)}</td>
                            <td id=${id_name}>${data[i].httpMethod +'/'+ data[i].resCode}</td>
                            <td id=${id_name}>${data[i].reqUrl}</td>
                            <td id=${id_name}>${""}</td>
                            <td id=${id_name}>${""}</td>
                            <td id=${id_name+'_res'}>${data[i].resBody}</td>
                        </tr>
                        `
        }
        else if(data[i].reqHeaders == null || data[i].reqHeaders == "{}"){
            var row = `<tr id="log_tr">
                            <td id=${id_name}>${data[i].type}</td>
                            <td id=${id_name}>${data[i].timestamp.substr(0,10)}<br>${data[i].timestamp.substr(11)}</td>
                            <td id=${id_name}>${data[i].httpMethod +'/'+ data[i].resCode}</td>
                            <td id=${id_name}>${data[i].reqUrl}</td>
                            <td id=${id_name}>${""}</td>
                            <td id=${id_name}>${data[i].reqBody}</td>
                            <td id=${id_name+'_res'}>${data[i].resBody}</td>
                        </tr>
                        `
        }
        else if (data[i].reqBody == null || data[i].reqBody == "{}"){
            var row = `<tr id="log_tr">
                            <td id=${id_name}>${data[i].type}</td>
                            <td id=${id_name}>${data[i].timestamp.substr(0,10)}<br>${data[i].timestamp.substr(11)}</td>
                            <td id=${id_name}>${data[i].httpMethod +'/'+ data[i].resCode}</td>
                            <td id=${id_name}>${data[i].reqUrl}</td>
                            <td id=${id_name}>${data[i].reqHeaders}</td>
                            <td id=${id_name}>${""}</td>
                            <td id=${id_name+'_res'}>${data[i].resBody}</td>
                        </tr>
                        `
        }

        table.innerHTML +=row
    }
}
async function buildList(data, id){
    var id_name = id + '_name'
    for(var i=0; i< data.length;i++)
    {
        if(id == 'server')
            info =  data[i].server_name
        else if(id == 'service')
            info =  data[i].service_name
        else if(id == 'data')
            info = data[i].data_name
        var table = document.getElementById(id)
        var row = `<tr>
                        <td id=${id_name}>${info}</td>
                    </tr>
                    `
        table.innerHTML +=row
    }
}
function color1(i, data){
    $(".pie-chart1").css({
        "background":"conic-gradient(#8b22ff 0% "+i+"%, #ffffff "+i+"% 100%)"
        });
}
function color2(i, data){
    $(".pie-chart1").css({
        "background":"conic-gradient(#8b22ff 0% "+data[0]+"%, #0000FF "+data[0]+"% "+i+"%, #ffffff "+i+"% 100%)"
        });
}
function color3(i, data){
    $(".pie-chart1").css({
        "background":"conic-gradient(#8b22ff 0% "+data[0]+"%, #0000FF "+data[0]+"% "+(data[0]+data[1])+"%, #ffd400 "+(data[0]+data[1])+"% "+i+"%, #ffffff "+i+"% 100%)"
        });
}
function color4(i, data){
    $(".pie-chart1").css({
        "background":"conic-gradient(#8b22ff 0% "+data[0]+"%, #0000FF "+data[0]+"% "+(data[0]+data[1])+"%, #ffd400 "+(data[0]+data[1])+"% "+(data[0]+data[1]+data[2])+"%, #008000 "+(data[0]+data[1]+data[2])+"% "+i+"%, #ffffff "+i+"% 100%)"
        });
}
function fetchPageDashBoard(name){
    fetch(name).then(function(response){
        response.text().then(function(text){
            document.querySelector('content').innerHTML=text;
        })
    }).then(res => {
        $.ajax({
        url: "/mypage/dashboradServerList",
        type: "GET",
        async: true,
        data: {},
        dataType:"json",
        success: function (svc) {
            buildList(svc,'server')
        }
    })
    }).then(() => {
        $.ajax({
            url: "/mypage/dashboradServiceList",
            type: "GET",
            async: true,
            data: {},
            dataType:"json",
            success: function (svc) {
                buildList(svc,'service')
            }
        })
    }).then(() => {
        $.ajax({
            url: "/mypage/dashboraddataList",
            type: "GET",
            async: true,
            data: {},
            dataType:"json",
            success: function (svc) {
                buildList(svc,'data')
            }
        })
    }).then(() => {
        $.ajax({
            url: "/mypage/dashboardlog",
            type: "GET",
            async: true,
            data: {},
            dataType:"json",
            success: function (svc) {
                buillogdtable(svc, 'mytable')
            }
        })
    }).then(() => {
        $.ajax({
            url: "/mypage/countServiceUnitLog",
            type: "GET",
            async: true,
            data: {},
            dataType:"json",
            success: function (svc) {
                $.ajax({
                    url: "/mypage/countServiceInteLog",
                    type: "post",
                    async: true,
                    data: {"service_unit" : svc['service_unit']},
                    dataType:"json",
                    success: function (svc) {
                        $.ajax({
                            url: "/mypage/countserverUnitLog",
                            type: "post",
                            async: true,
                            data: {
                                "service_unit" : svc['service_unit'],
                                "service_inte" : svc['service_inte']
                            },
                            dataType:"json",
                            success: function (svc) {
                                $.ajax({
                                    url: "/mypage/countserverInteLog",
                                    type: "post",
                                    async: true,
                                    data: {
                                        "service_unit" : svc['service_unit'],
                                        "service_inte" : svc['service_inte'],
                                        "server_unit" : svc['server_unit'],
                                    },
                                    dataType:"json",
                                    success: function (svc) {
                                        var total = Number(svc['service_unit']) + Number(svc['service_inte']) + Number(svc['server_unit']) + Number(svc['server_inte'])
                                        var data = [
                                            Number(svc['service_unit'])/total * 100, //보리
                                            Number(svc['service_inte'])/total * 100 , // 파랑
                                            Number(svc['server_unit'])/total * 100, // 노랑
                                            Number(svc['server_inte'])/total * 100 // 노랑
                                        ]
                                        $(window).ready(function(svc){
                                            var i=1;
                                            var func1 = setInterval(function(){
                                                if(i<data[0]){
                                                    color1(i,data);
                                                    i++
                                                } else if(i < data[0] + data[1]){
                                                    color2(i,data);
                                                    i++;
                                                } else if(i <  data[0] + data[1] + data[2] ){
                                                    color3(i,data);
                                                    i++;
                                                } else if (i < data[0] + data[1] + data[2] + data[3] +1){
                                                    color4(i,data);
                                                    i++;
                                                } else {
                                                    clearInterval(func1);
                                                }
                                            },10);
                                        });
                                        var table = document.getElementById('col')
                                        var row = `<div style = "display : flex">
                                                        <div>
                                                            <ul>
                                                                <li id="colex1">서비스단위테스트 : ${svc['service_unit']}</li>
                                                                <li id="colex2">서비스통합테스트 : ${svc['service_inte']}</li>
                                                            </ul>
                                                        </div>
                                                        <div>
                                                            <ul>
                                                                <li id="colex3">서버단위테스트 : ${svc['server_unit']}</li>
                                                                <li id="colex4">서버통합테스트 : ${svc['server_inte']}</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    `
                                        table.innerHTML +=row
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })
    .catch(()=>{
        console.log("error");
    });

}
function del_svc(id){
    if(!confirm('삭제하시겠습니까?')){
        return false;
    }
    $.ajax({
        url: "/mypage/svr_list_del",
        type: "POST",
        async: false,
        data: {
            "server_manage_id" : id
        },
        success: function(result){
                alert("삭제되었습니다.");
                location.reload();
        }
    });

}
//서비스 추가하기
function fetchPage(name){
    fetch(name).then(function(response){
        response.text().then(function(text){
            document.querySelector('content').innerHTML=text;
        })
    }).catch(()=>{
        console.log("error");
    });

}
//서버 추가 취소하기
function fetchPage_addsvr_cancel(name){
    fetch(name).then(function(response){
        response.text().then(function(text){
            document.querySelector('content').innerHTML=text;
        })
    }).catch(()=>{
        console.log("error");
    });

}

//서버 추가하기
//서비스 추가하기
