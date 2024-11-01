var loading = true;
var offset = 0;
var limit = 20;

(function ($) {
    $(document).ready(function () {
        getSubscribers();
    });

    $(window).scroll(function () {
        var nearToBottom = 500;
        if (($(window).scrollTop() + $(window).height() > $(document).height() - nearToBottom) && loading == false) {
            loading = true;
            getSubscribers();
        }
    });

    $(document).on('click', '.subscribeswitch', function () {
        var email = $(this).attr('data-email');
        var id = $(this).attr('data-id');
        var valcheck = (this.checked == true) ? 1 : 0;
        var status = (this.checked == true) ? 'subscribed' : 'unsubscribed';
        var params = {
            action: 'updateSubscribe',
            id: id,
            email: email,
            value: valcheck
        };

        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            cache: false,
            data: params,
            dataType: 'json',
            success: function (success) {
                if (success == 1) {
                    toastr.success(email + ' was successfully ' + status, 'Success');
                } else {
                    toastr.error('Something went wrong. Please refresh the page.', 'Error');
                }
            },
        });
    });

    function getSubscribers() {
        $('.load').html('<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i> <p>Loading Subscribers</p>');

        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            cache: false,
            data: {
                action: 'getSubscribers',
                limit: limit,
                offset: offset
            },
            dataType: 'json',
            success: function (success) {
                if ((success.data).length != 0) {
                    var results = success.data;

                    results.map(function (array) {
                        generateContent(array);
                    });

                    if (results.length < (limit)) {
                        loading = true;
                    } else {
                        offset = offset + limit;
                        loading = false;
                    }

                    $('.load').html('');
                } else {
                    loading = true;
                    $('.load').empty().html('<i class="fa fa-times fa-3x fa-fw"></i> <p>No Data</p>');
                }
            },
            error: function (err) {
                loading = true;
                toastr.error('Something went wrong. Please try again later', 'Error');
            }
        });
    }

    function generateContent(res) {
        var statusChecker = (res.status == 1) ? "checked" : "";
        var content = '<tr id="trsubscribe_' + res.id + '"> ';
        content += '<td class="text-center">' + res.email + '</td>';
        content += '<td class="text-center"> <label class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input hide subscribeswitch" data-id="' + res.id + '" data-email="' + res.email + '" ' + statusChecker + '> <span class="custom-control-indicator"></span> </label > </td>';
        content += '<td class="text-center">' + moment(res.date_added).format("YYYY-MM-DD") + '</td>';
        content += '</tr>';
        $('.table tbody').append(content);
    }
})(jQuery);