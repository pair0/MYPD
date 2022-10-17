
var myArray = [];

$.ajax({
    url: "/mypage/data_list",
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


function del_svc(id){
    $.ajax({
        url: "/mypage/data_list_del",
        type: "POST",
        async: false,
        data: {
            "data_id": id
        },
        success: function(result){
                alert("삭제되었습니다.");
                location.reload();
        }
    });

}

