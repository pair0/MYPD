$.ajax({
        url: "/user/checkInfo",
        type: "POST",
        async: false, 
        data: {
        },
        success: function(data){
            console.log(data);
            if(!data){
                var options = 'top=10, left=10, width=500, height=700, status=no, menubar=no, toolbar=no, resizable=no';
                    window.open("https://localhost:3000/user/addinfo","EditInfo",options);
            }
        }
    });