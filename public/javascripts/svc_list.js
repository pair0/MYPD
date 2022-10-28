
var myArray = [];


$(document).ready(function(){
    $.ajax({
    url: "/mypage/svc_list",
    type: "GET",
    async: true,
    data: {},
    dataType:"json",
    success: function (svc) {
        myArray=svc;
        buildtable(myArray);
    }
    });
});



function buildtable(data){

    for(var i=0; i< data.length;i++)
    {
        var callback_arr = JSON.parse(data[i].service_callback_url)
        var callbackurl_set = ""
        for ( var j = 0; j < callback_arr.length; j++){
            callbackurl_set += " | " + callback_arr[j]
        }
        callbackurl_set += " |"
        var table = document.getElementById('mytable')
        var row = `<tr>
                        <td id="list_name">${data[i].service_name}</td>
                        <td>${callbackurl_set}</td>
                        <td>${data[i].service_client_id}</td>
                        <td>${data[i].service_text}</td>
                        <td class="svc_dlt_box"><a class="svc_dlt" onclick="del_svc(${data[i].service_id})">삭제</a></td>
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
        url: "/mypage/svc_list_del",
        type: "POST",
        async: false,
        data: {
            "service_id": id
        },
        success: function(result){
                alert("삭제되었습니다.");
                location.reload();
        }
    });

}

