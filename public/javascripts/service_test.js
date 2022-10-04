function making_select() {
    console.log("맞아 바로 여기야");
    var service_select=$("#biz_type").val();
    
    $.ajax({
        url: "/testbed/ServiceSelet",
        type: "POST",
        async: false, 
        data: {
            "data": service_select
        },
        success: function(data){
            if(data){
                $('input[name=C_ID]').attr('value',data.service_client_id);
                $('input[name=C_Se]').attr('value',data.service_client_secret);
            } else {
                $('input[name=C_ID]').removeAttr( 'value' );
                $('input[name=C_Se]').removeAttr( 'value' );
            }
        }
    });
}