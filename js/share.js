(function ($) {
    $(document).on('click', '.shareFeed', function () {
        var steemitid = $(this).attr('data-steemitid');
        var image = $(this).attr("data-image");
        var title = $(this).attr("data-title");
        var description = $(this).attr("data-description");
        var url = $(this).attr("data-url");
        description = description.substring(0, 180) + " ...";
        var placeToShare = ['Facebook', 'Twitter', 'Email'];
        var loading = "";
        var author = $(this).attr('data-author');
        var permlink = $(this).attr('data-permlink');
        var creationDate = $(this).attr('data-date');
        var category = $(this).attr('data-category');
        var tags = $(this).attr('data-tags');
        var shareMedia = {};
        var email_layout = allOptionData.email_layout;
        var email_logo = allOptionData.email_logo;
        var email_text = allOptionData.email_text;
        var fromName = allOptionData.email_from_name;
        var licenseActivationEmail = allOptionData.license_activation_email;

        if (page == 'steempendingfeeds') { placeToShare.push('Web'); }

        var content = '<div class="crop"><img style="margin-bottom:10px" src="' + image + '"></div>';
        content += '<p class="margin-top-5 margin-bottom-5">' + description + '</p>';
        content += '<p class="margin-top-5 margin-bottom-5">Author: <a target="_blank" href="https://steemit.com/@' + author + '">' + author + '</a></p>';
        content += '<p class="margin-top-5 margin-bottom-5">Date Posted: ' + moment(creationDate).format("YYYY-MM-DD") + '</p>';
        content += '<p class="margin-top-5 margin-bottom-5">Category: ' + category + '</p>';
        content += '<p class="margin-top-5 margin-bottom-5">Tags: ' + tags + '</p>';
        content += '<p>Share Steemit Feed</p>';
        content += '<input placeholder="Status" maxlength="120" type="text" class="status" style="width: 100%;"/><span class="characterCount">120</span>';
        _.map(placeToShare, function (o) {
            content += '<div class="options_div">';
            content += '<p class="label option_label">' + o;
            if (typeof $.cookie(o.toLowerCase()) != 'undefined' && $.cookie(o.toLowerCase()) !== null) {
                content += '<span class="glyphicon glyphicon-ok green ' + o + '-check"></span> ';
            }
            if (o == 'Web') {
                content += '<span style="font-size:8px"> Add to Steem Hype shortcode</span>';
            }
            if (o == 'Email') {
                content += '<span style="font-size:8px"> Premium</span>';
            }
            content += '</p>';
            content += '<label class="custom-control custom-checkbox">';
            content += '<input type="checkbox" class="custom-control-input hide shareSwitch share' + o.toLowerCase() + '" data-name="show_title" data-type="' + o + '">';
            content += '<span class="custom-control-indicator"></span>';
            content += '</label>';
            content += '</div>';
        });

        $.confirm({
            columnClass: 'medium',
            title: title,
            content: content,
            scrollToPreviousElement: false,
            onContentReady: function () {
                $('.shareSwitch').change(function () {
                    var type = ($(this).attr("data-type")).toLowerCase();
                    var shareUrl = '';

                    switch (type) {
                        case 'facebook':
                            shareUrl = 'authenticate-facebook.php';
                            break;

                        case 'linkedin':
                            shareUrl = 'authenticate-linkedin.php';
                            break;

                        case 'twitter':
                            shareUrl = 'authenticate-twitter.php';
                            break;
                    }

                    if (type != 'web' && type != 'email') {
                        if (this.checked && ($.cookie(type) === null || typeof $.cookie(type) == 'undefined') && type != 'web') {
                            authenticate(type, 'http://steemhypeshare.signalssoftware.com/' + shareUrl);
                        }
                    }
                });

                $('.status').keyup(updateCount);
                $('.status').keydown(updateCount);

                function updateCount() {
                    var cs = [120 - $(this).val().length];
                    $('.characterCount').text(cs);
                }
            },
            buttons: {
                Share: function () {
                    var status = $('.status').val();
                    var channels = [];
                    var _this = this;
                    var date = new Date();

                    $('.shareSwitch').each(function () {
                        var type = ($(this).attr("data-type")).toLowerCase();
                        var valcheck = (this.checked == true) ? 1 : 0;

                        if (this.checked) {
                            if (type != 'web' && type != 'email') {
                                var userState = $.cookie(type);
                                if (userState !== null && typeof userState != 'undefined') {
                                    channels.push({ type: type, user_state: userState });
                                } else {
                                    $('.share' + type).attr('checked', false);
                                }
                            } else {
                                channels.push({ type: type, user_state: userState });
                            }
                        }
                    });

                    loading = $.confirm({
                        title: '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Loading',
                        content: 'Sharing Steemit feed. Please wait.',
                        buttons: {
                            Cancel: { btnClass: 'hide' }
                        }
                    });

                    if (channels.length > 0) {
                        if (page != 'steempendingfeeds') {
                            var webCheckValue = ($('.web-switch-' + steemitid).is(':checked')) ? 1 : 0;
                            shareMedia['web'] = webCheckValue;
                        }
                        async.each(channels, function (channel, callback) {
                            if (channel.type != 'web' && channel.type != 'email') {
                                $.ajax({
                                    type: 'POST',
                                    url: 'http://steemhypeshare.signalssoftware.com/share-' + channel.type + '.php',
                                    data: JSON.stringify({
                                        user_state: channel.user_state,
                                        title: title,
                                        description: description,
                                        url: url,
                                        image_url: image,
                                        message: status
                                    }),
                                    success: function (success) {
                                        if (success.status) {
                                            toastr.success(success.message, 'Success');
                                            shareMedia[channel.type] = 1;
                                            shareMedia[channel.type + '_post_id'] = success.result;
                                        } else {
                                            date.setTime(date.getTime() + (1 * 1000));
                                            $.cookie(channel.type, null, { expires: date });
                                            shareMedia[channel.type] = 0;
                                            toastr.error(success.message, 'Error');
                                        }
                                        callback(null, false);
                                    },
                                    error: function (err) {
                                        toastr.error(channel.toUpperCase() + ': Unexpected error. Please try again later.', 'Error');
                                        callback(null, false);
                                    }
                                });
                            } else if (channel.type == 'email') {
                                var emaildata = {
                                    "subscribers": JSON.parse(subscribers),
                                    "html_order": email_layout,
                                    "email_logo": email_logo,
                                    "email_content": email_text,
                                    "steemit_title": title,
                                    "steemit_author": author,
                                    "steemit_image": image,
                                    "steemit_description": description,
                                    "steemit_link": url,
                                    "from_name": fromName,
                                    "activation_email": licenseActivationEmail
                                };

                                if (JSON.parse(subscribers).length > 0) {
                                    $.ajax({
                                        type: 'POST',
                                        url: 'http://steemhypeshare.signalssoftware.com/share-email.php',
                                        data: JSON.stringify(emaildata),
                                        dataType: 'json',
                                        success: function (success) {
                                            if (success.status) {
                                                shareMedia[channel.type] = 1;
                                                toastr.success(success.message, 'Success');
                                            } else {
                                                shareMedia[channel.type] = 0;
                                                toastr.error(success.message, 'Error');
                                            }
                                            callback(null, false);
                                        },
                                        error: function (err) {
                                            toastr.error('Email: Unexpected error. Please try again later.', 'Error');
                                            callback(null, false);
                                        }
                                    });
                                } else {
                                    toastr.error('Email: No active subscribers detected.', 'Error');
                                    shareMedia[channel.type] = 0;
                                }
                            } else {
                                toastr.success('WEB: Successfully added to shortcode.', 'Success');
                                shareMedia[channel.type] = 1;
                                callback(null, false);
                            }
                        }, function (err, result) {
                            var zeroCounter = 0;
                            _.mapValues(shareMedia, function (value, key) { if (value != 0) { zeroCounter++; } });

                            if (zeroCounter > 0) {
                                sharePost({
                                    action: 'insertFeed',
                                    id: steemitid,
                                    title: title,
                                    description: description,
                                    imgsrc: image,
                                    author: author,
                                    permlink: permlink,
                                    creation_date: moment(creationDate).format("YYYY-MM-DD"),
                                    url: url,
                                    category: category,
                                    tags: tags,
                                    sharemedia: shareMedia
                                }, function () {
                                    setTimeout(function () {
                                        toastr.success('Steemit Feed successfully shared.', 'Success');
                                        _this.close();
                                        loading.close()
                                    }, 500);
                                });
                            } else {
                                $('.shareSwitch').attr('checked', false);
                                setTimeout(function () {
                                    _this.close();
                                    loading.close();
                                }, 500);
                            }
                        });
                    } else {
                        setTimeout(function () {
                            toastr.error('Select atleast one channel to share.', 'Error');
                            loading.close();
                        }, 500);
                    }
                    return false;
                },
                cancel: function () {

                }
            }
        });
    });

    $(document).on('click', '.shareemail', function () {
        var licenseActivationEmail = allOptionData.license_activation_email;
        var licenseActivationDate = allOptionData.license_activation_date;

        if (this.checked == true) {
            var loading = $.confirm({
                title: '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Loading',
                content: 'Checking subscription. Please wait.',
                buttons: {
                    Cancel: { btnClass: 'hide' }
                }
            });
            if (licenseActivationDate != '') {
                // var requestParams = ['email=' + licenseActivationEmail + '', 'license_key=' + licenseKey + '', 'product_id=shprolicense'];
                // var requestUrl = 'http://signalssoftware.com/woocommerce/?wc-api=software-api&request=check&' + requestParams.join('&');
                $.ajax({
                    type: 'POST',
                    url: 'http://steemhypeshare.signalssoftware.com/check-subscriptions.php',
                    cache: false,
                    data: JSON.stringify({
                        email_address: licenseActivationEmail
                    }),
                    dataType: 'json',
                    success: function (success) {
                        if (success.status) {
                            toastr.success('Valid subscription detected.', 'Success');
                        } else {
                            $('.shareemail').attr('checked', false);
                            toastr.error('Invalid subscription detected.', 'Error');
                        }
                        setTimeout(function () { loading.close() }, 500);
                    },
                    error: function (err) {
                        $('.shareemail').attr('checked', false);
                        toastr.error('Something went wrong. Please try again.', 'Error');
                        setTimeout(function () { loading.close() }, 500);
                    }
                });
            } else {
                $('.shareemail').attr('checked', false);
                toastr.error('Invalid subscription detected.', 'Error');
                setTimeout(function () { loading.close() }, 500);
            }
        }
    });

    function authenticate(type, url) {
        var date = new Date();
        var minutes = 1;
        var loading = $.confirm({
            title: '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Loading',
            content: 'Authenticating user. Please wait.',
            buttons: {
                Cancel: { btnClass: 'hide' }
            }
        });

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            success: function (success) {
                var popUp = window.open(success.url, '_blank');
                var userState = "";

                if (type == 'facebook' || type == 'linkedin') {
                    minutes = 43200;
                    userState = getUrlParameter('state', success.url);
                } else {
                    minutes = 5256000;
                    userState = getUrlParameter('oauth_token', success.url);
                }

                if (_hasPopupBlocker(popUp) == true) {
                    date.setTime(date.getTime() + (minutes * 60 * 1000));
                    $.cookie(type, userState, { expires: date });
                } else {
                    date.setTime(date.getTime() + (1 * 1000));
                    $.cookie(type, null, { expires: date });
                    $('.share' + type).attr('checked', false);
                }

                setTimeout(function () { loading.close() }, 500);
            },
            error: function (err) {
                setTimeout(function () {
                    $('.share' + type).attr('checked', false);
                    toastr.error('Something went wrong. Please try again later.', 'Error');
                    loading.close()
                }, 500);
            }
        });
    }

    function _hasPopupBlocker(poppedWindow) {
        if (poppedWindow == null || typeof (poppedWindow) == 'undefined') {
            $.alert({
                title: 'Steem Hype Error:',
                content: "Please allow pop-ups in your browser to share Steemit Feeds and click on the SHARE button again.",
            });
            return false;
        } else {
            poppedWindow.focus();
            return true;
        }
    }

    function sharePost(params, cb) {
        let socialMediaShare = {
            facebook: (params.sharemedia).facebook || 0,
            twitter: (params.sharemedia).twitter || 0,
            linkedin: (params.sharemedia).linkedin || 0,
            web: (params.sharemedia).web || 0,
            email: (params.sharemedia).email || 0
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
                $('.table tbody').prepend($('#trshare_' + params.id))
                if (!params.webcheck) {
                    _.mapValues(socialMediaShare, function (value, key) {
                        var icon = (value == 1) ? ' glyphicon-ok green' : 'glyphicon-remove red';
                        $('.td-' + key + '-' + params.id).prepend('<span class="act-span glyphicon ' + icon + '"></span>');
                    });
                    $('.td-date-' + params.id).prepend('<p class="act-p">' + moment().format("YYYY-MM-DD") + '</p>');
                }
            }
            cb();
        });
    }

    function getUrlParameter(name, url) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
})(jQuery);