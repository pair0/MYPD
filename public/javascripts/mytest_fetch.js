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
