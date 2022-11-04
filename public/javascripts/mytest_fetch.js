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
    for(var i=data.length-1; i >= 0;i--)
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
                                        var myCircle = echarts.init(document.getElementById('circle')); // echarts init 메소드로 id=chart인 DIV에 차트 초기화
                                        option = {
                                            tooltip: {
                                                trigger: 'item'
                                            },
                                            legend : {
                                                top : 5,
                                                type : 'scroll'
                                            },
                                            series: [
                                                {
                                                    name: 'Test 유형',
                                                    type: 'pie',
                                                    radius: ['40%', '70%'],
                                                    avoidLabelOverlap: true,
                                                    itemStyle: {
                                                        borderRadius: 10,
                                                        borderColor: '#fff',
                                                        borderWidth: 0
                                                    },
                                                    label: {
                                                        show: false,
                                                        position: 'center'
                                                    },
                                                    emphasis: {
                                                        label: {
                                                            show: true,
                                                            fontSize: '15',
                                                            fontWeight: 'bold'
                                                        }
                                                    },
                                                    labelLine: {
                                                        show: false
                                                    },
                                                    data: [
                                                        { value: svc['service_unit'], name: '서비스 단위테스트' },
                                                        { value: svc['service_inte'], name: '서비스 통합테스트' },
                                                        { value: svc['server_unit'], name: '서버 단위테스트' },
                                                        { value: svc['server_inte'], name: '서버 통합테스트' },
                                                    ]
                                                }
                                            ]
                                        };
                                        myCircle.setOption(option); // 차트 디스플레이
                                        $(function(){
                                            $(window).on('resize',function(){
                                                myCircle.resize();

                                            })
                                        })
                                    }
                                })
                                $.ajax({
                                    url: "/mypage/countDatePerTry",
                                    type: "get",
                                    async: true,
                                    data: {
                                    },
                                    dataType:"json",
                                    success: function (svc) {
                                        var date = {};
                                        for(var i = 0; i < svc.length; i++){
                                            if(!(svc[i].timestamp.substr(5,5) in date))
                                                date[svc[i].timestamp.substr(5,5)] = 1;
                                            else
                                                date[svc[i].timestamp.substr(5,5)]++;
                                        }
                                        var myChart = echarts.init(document.getElementById('canvas'),null,{
                                            height : "205px",
                                        }); // echarts init 메소드로 id=chart인 DIV에 차트 초기화
                                        option = {
                                            xAxis: {
                                                type: 'category',
                                                boundaryGap: false,
                                                data: Object.keys(date)
                                            },
                                            yAxis: {
                                                type: 'value'
                                            },
                                            emphasis: {
                                                label: {
                                                    show: true,
                                                    fontSize: '30',
                                                    fontWeight: 'bold'
                                                }
                                            },
                                            series: [
                                                {
                                                    data: Object.values(date),
                                                    type: 'line',
                                                    areaStyle: {
                                                        color : '#0770FF',
                                                        fontWeight : 1000,
                                                        fontsize : 1000,
                                                    },
                                                    // lineStyle: {
                                                    //     width : 10
                                                    // }
                                                }
                                            ]
                                        };
                                        myChart.setOption(option); // 차트 디스플레이
                                        $(function(){
                                            $(window).on('resize',function(){
                                                myChart.resize();
                                            })
                                        })
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
