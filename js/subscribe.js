(function ($) {
    var baseUri = window.location.hostname;
$(document).ready(function(){
    $(document).on('click','#joinsteemhype',function(e){
        $('#joinsteemhype').text('Loading ...');
        var emailaddress = $('#subscribe_email').val().trim();
        var error = '';
        if(emailaddress == ''){
            error = 1;
        }else{
            if(!validateEmail(emailaddress)){
                error = 1;
            }
        }

        if(error == 1){
            $('#subscribe_email').val('');
            $('#subscribe_email').attr('placeholder','Please provide a valid email address...');
            $('#joinsteemhype').text('Subscribe');
            return false;
        }else{
            var params = {
                action : 'addSubscriber',
                email : emailaddress
            };
           
            $.ajax({
                type: 'POST',
                url: '/wp-admin/admin-ajax.php',
                cache: false,
                data: params,
                dataType: 'json',
                success: function (success) {
                    if(success){
                       $('.successmsg').show();
                       $('#subscribe_email').val('');
                       $('#subscribe_email').attr('placeholder','Email Address');
                       $('#joinsteemhype').text('Subscribe');
                       return false;
                    }else{
                        $('#subscribe_email').val('');
                        $('#subscribe_email').attr('placeholder','You\'re Already Subscribed!');
                        $('#joinsteemhype').text('Subscribe');
                        return false;
                    }
                },
            });
        }
    });

    $(document).on('click','#unsubscribe',function(e){
        var id = $(this).attr('data-id');
        var email = $(this).attr('data-email');
        
        if(id == '' && email == ''){
            return false;
        }

        var params = {
            action : 'updateSubscribe',
            id : id,
            email : email,
            value : 0
        };

        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            cache: false,
            data: params,
            dataType: 'json',
            success: function (success) {
                if(success == 1){
                    $('#unsubscribe').text('Success!');
                    $('#unsubscribe').prop('disabled','true');
                }else{
                    $('#unsubscribe').text('Error Encountered!');
                }
              
            },
        });

    });

});

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

})(jQuery);