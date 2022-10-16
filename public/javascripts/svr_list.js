
var myArray = [];

$.ajax({
    url: "/mypage/svr_list",
    type: "GET",
    async: true,
    data: {},
    dataType:"json",
    success: function (svc) {
        myArray=svc;
        buildtable(myArray);
    }
})


function buildtable(data){

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

