(function ($) {
    $(document).on('click', '.count-click', function () {
        var steemitId = $(this).attr('data-id');
        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            cache: false,
            data: {
                action: 'clickCount',
                steemit_id: steemitId
            },
            dataType: 'json'
        })
    });
})(jQuery);