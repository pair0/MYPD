
    var myArray = [];

    $.ajax({
        url: "/mypage/svc_list",
        type: "GET",
        async: true,
        data: {},
        dataType:"json",
        success: function (svc) {
            myArray=svc;
            console.log(myArray);
            buildtable(myArray);
        }
    })


    function buildtable(data){

        for(var i=0; i< data.length;i++)
        {
            var table = document.getElementById('mytable')
            var row = `<tr>
                            <td>${data[i].service_name}</td>
                            <td>${data[i].service_callback_url}</td>
                            <td>${data[i].service_client_id}</td>
                            <td>${data[i].service_text}</td>
                        </tr>
                        `
            table.innerHTML +=row
        }
        }


