(function ($) {
    $(document).on('change', '.archiveweb', function () {
        var steemitid = $(this).attr('data-steemitid');
        var image = $(this).attr("data-image");
        var title = $(this).attr("data-title");
        var description = $(this).attr("data-description");
        var url = $(this).attr("data-url");
        description = description.substring(0, 180) + " ...";
        var image = $(this).attr("data-image");
        var placeToShare = ['Facebook', 'LinkedIn', 'Twitter'];
        var loading = "";
        var author = $(this).attr('data-author');
        var permlink = $(this).attr('data-permlink');
        var creationDate = $(this).attr('data-date');
        var category = $(this).attr('data-category');
        var tags = $(this).attr('data-tags');
        var valcheck = (this.checked == true) ? 1 : 0;
        var webcheck = 1;
        var shareMedia = {
            "facebook": 0,
            "linkedin": 0,
            "twitter": 0,
            "web": valcheck
        }

        sharePost({
            action: 'insertFeed',
            id: steemitid,
            title: title,
            description: description,
            imgsrc: image,
            author: author,
            permlink: permlink,
            creation_date: moment(creationDate).format("YYYY-DD-MM"),
            url: url,
            category: category,
            tags: tags,
            sharemedia: shareMedia,
            webcheck: webcheck
        }, function () {
            if (valcheck == 1) {
                toastr.success('WEB: Successfully added to shortcode.', 'Success');
            } else {
                toastr.success('WEB: Successfully removed to shortcode.', 'Success');
            }
        });
    });

    function sharePost(params, cb) {
        let socialMediaShare = {
            facebook: (params.sharemedia).facebook || 0,
            twitter: (params.sharemedia).twitter || 0,
            linkedin: (params.sharemedia).linkedin || 0,
            web:(params.sharemedia).web || 0
        };
    
        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            cache: false,
            data: params,
            dataType: 'json'
        }).done(function () {
            if ($('#pendingFeeds').length > 0) {
                $('#trshare_' + params.id).fadeOut();
            } else {
                if (!params.webcheck) {
                    _.mapValues(socialMediaShare, function (value, key) {
                        var icon = (value == 1) ? ' glyphicon-ok green' : 'glyphicon-remove red';
                        $('.td-' + key + '-' + params.id).append('<span class="act-span glyphicon ' + icon + '"></span>');
                    });
                    $('.td-date-' + params.id).append('<p class="act-p">' + moment().format("MM-DD-YYYY") + '</p>');
                }
            }
            cb();
        });
    }
})(jQuery);