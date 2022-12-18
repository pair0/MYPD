$.ajax({
        url: "/user/checkInfo",
        type: "POST",
        async: false, 
        data: {
        },
        success: function(data){
            if(!data){
                var popupX = (window.screen.width / 2) - (500 / 2);
                var popupY= (window.screen.height /2) - (700 / 2);
                var options = 'top='+ popupY +', left='+ popupX +',screenX='+ popupX + ', screenY= '+ popupY+', width=500, height=700, status=no, menubar=no, toolbar=no, resizable=no';
                window.open("https://mypd.kr/user/addinfo","EditInfo",options);
            }
        }
    });