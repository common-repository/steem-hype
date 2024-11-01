(function ($) {
    var loading = true;
    var offset = 0;
    var limit = 5;
    var steemitFeedStack = [];

    $(document).ready(function () {
        var licenseActivationDate = allOptionData.license_activation_date;
        var licenseActivationEmail = allOptionData.license_activation_email;

        if (licenseActivationDate != '' && typeof licenseActivationDate != 'undefined') {
            //var licenseActivationDate = allOptionData.license_activation_date;
            // var requestParams = ['email=' + licenseActivationEmail + '', 'license_key=' + licenseKey + '', 'product_id=shprolicense'];
            // var requestUrl = 'http://signalssoftware.com/woocommerce/?wc-api=software-api&request=check&' + requestParams.join('&');

            $('.warnings').append('<div class="load"><i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i> <p>Loading Data</p></div>');

            $.ajax({
                type: 'POST',
                url: 'http://steemhypeshare.signalssoftware.com/check-subscriptions.php',
                cache: false,
                data: JSON.stringify({
                    email_address: licenseActivationEmail
                }),
                dataType: 'json',
                success: function (success) {
                    if (success.status == false) {
                        $('.warnings').html('<div class="alert alert-danger" role="alert" id="alert">This page is for Premium users. Please provide a valid subscription email on the settings -> subscription.</div>');
                    } else {
                        checkCookie();
                        getSharedCount();
                        getSubscriberCount();
                        getArchivedFeeds();
                        generateCountChart({
                            start_date: (moment().subtract(4, "days")).format('YYYY-MM-DD'),
                            end_date: moment().format('YYYY-MM-DD')
                        });

                        $('input[name="daterange"]').daterangepicker({
                            autoUpdateInput: false,
                            locale: {
                                cancelLabel: 'Clear'
                            }
                        });

                        $('input[name="daterange"]').on('apply.daterangepicker', function (ev, picker) {
                            $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
                            generateCountChart({
                                start_date: picker.startDate.format('YYYY-MM-DD'),
                                end_date: picker.endDate.format('YYYY-MM-DD')
                            })
                        });
                        $('.warnings').empty();
                        $('#analytics').removeClass('hide');
                    }
                },
                error: function (err) {
                    toastr.error('Something went wrong. Please try again later', 'Error');
                }
            });
        } else {
            $('.warnings').append('<div class="alert alert-danger" role="alert" id="alert">This page is for Premium users. Please provide a valid License Key.</div>');
        }
    });

    $(window).scroll(function () {
        var nearToBottom = 500;
        if (($(window).scrollTop() + $(window).height() > $(document).height() - nearToBottom) && loading == false) {
            loading = true;
            getArchivedFeeds();
        }
    });

    $(document).on('click', '.authenticate', function (e) {
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
        authenticate(type, 'http://steemhypeshare.signalssoftware.com/' + shareUrl);
        e.preventDefault();
    });

    function checkCookie() {
        (['facebook', 'twitter']).map(function (type) {
            if ($.cookie(type) === null || typeof $.cookie(type) == 'undefined') {
                $('.warnings').append('<div class="alert alert-danger" role="alert" id="alert"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><p>' + type.toUpperCase() + ': Authenticate by clicking this <a href="#" class="authenticate" data-type="' + type + '">link</a> to retrieved analytics data</p></div>');
            }
        });
    }

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

                setTimeout(function () {
                    location.reload();
                    loading.close();
                }, 500);
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

    function generateCountChart(params) {
        $("#count-line").empty();

        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            cache: false,
            data: {
                action: 'getClickedCount',
                start_date: params.start_date,
                end_date: params.end_date,
            },
            dataType: 'json',
            success: function (success) {
                var output = _(success.data)
                    .groupBy('date_added')
                    .map(function (o, key) {
                        return {
                            'x-key': key,
                            'value': _.sumBy(o, function (o) { return _.toNumber(o.clicks) })
                        }
                    })
                    .value();
                var chartData = _.map(output, function (o, key) {
                    return {
                        'x-key': o['x-key'],
                        value: o['value']
                    }
                });
                var chartObject = {
                    element: 'count-line',
                    data: chartData
                };

                if (chartData.length > 0) {
                    generateLineChart(chartObject);
                } else {
                    $('#count-line').empty().html('<div class="load"><i class="fa fa-times fa-3x fa-fw"></i> <p>No Data</p></div>');
                }
            },
            error: function (err) {

            }
        });
    }

    function getSharedCount() {
        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            cache: false,
            data: {
                action: 'getShareCount'
            },
            dataType: 'json',
            success: function (success) {
                var successData = _.map(success.data, function (o, key) {
                    return { label: key, value: o }
                });
                if ((_.filter(successData, function (o) { return o.value != null })).length > 0) {
                    generateDonutChart({
                        element: 'shared-count',
                        data: successData,
                        colors: [
                            '#3b5998',
                            '#00aced',
                            '#27ae60',
                            '#f1c40f'
                        ]
                    });
                } else {
                    $('#shared-count').empty().html('<div class="load"><i class="fa fa-times fa-3x fa-fw"></i> <p>No Data</p></div>');
                }
            },
            error: function (err) {
                toastr.error('Something went wrong. Please try again later.', 'Error');
            }
        });
    }

    function getSubscriberCount() {
        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            cache: false,
            data: {
                action: 'getSubscriberCount'
            },
            dataType: 'json',
            success: function (success) {
                var data = success.data;
                var active = (data.active != null) ? data.active : 0;
                var inActive = (data.inactive != null) ? data.inactive : 0;

                $('#active-count').html(active);
                $('#inactive-count').html(inActive);
            },
            error: function (err) {
                toastr.error('Something went wrong. Please try again later.', 'Error');
            }
        });
    }

    function getArchivedFeeds() {
        $('.analytics-table .load').html('<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i> <p>Loading Data</p>');

        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            cache: false,
            data: {
                action: 'getArchivedFeed',
                limit: limit,
                offset: offset
            },
            dataType: 'json',
            success: function (success) {
                if ((success.data).length != 0) {
                    steemitFeedStack = success.data;

                    var filteredFeedStack = _.filter(steemitFeedStack, function (res) {
                        var sharedChecker = _.filter(res.share, function (o) { return o.share_fb != 0 || o.share_linkedin != 0 || o.share_twitter != 0 });
                        return sharedChecker.length > 0
                    });

                    if (offset == 0 && filteredFeedStack.length == 0) {
                        $('.analytics-table .load').empty().html('<i class="fa fa-times fa-3x fa-fw"></i> <p>No Data</p>');
                    } else {
                        _.map(filteredFeedStack, function (o, index) {
                            generateContent(o, index);
                            getSteemiPostDetails(o);
                        });

                        if (filteredFeedStack.length < limit) {
                            loading = true;
                        } else {
                            offset = offset + limit;
                            loading = false;
                        }
                        $('.analytics-table .load').html('');
                    }
                } else {
                    $('.analytics-table .load').empty().html('<i class="fa fa-times fa-3x fa-fw"></i> <p>No Data</p>');
                }
            },
            error: function (err) {
                loading = true;
                toastr.error('Something went wrong. Please try again later', 'Error');
                $('.analytics-table .load').html('');
            }
        });
    }

    function generateContent(res, index) {
        var content = '';
        var detailStacks = [];
        var filteredShare = _.filter(res.share, function (o) { return o.share_fb != 0 || o.share_linkedin != 0 || o.share_twitter != 0 });
        var clickedCount = _.sumBy(res.count, function (o) { return _.toNumber(o.clicks) });
        var className = (index % 2 == 0) ? 'bg-white' : 'bg-blue';

        _.map(filteredShare, function (o, index) {
            content += '<tr class="trshare">';
            if (index == 0) {
                content += '<td class="text-left ' + className + '" rowspan="' + (filteredShare).length * 2 + '"><a target="_blank" href="' + res.url + '" data-index="' + index + '">' + res.title + '</a></td>';
                content += '<td class="text-center ' + className + '" rowspan="' + (filteredShare).length * 2 + '"><a target="_blank" href="https://steemit.com/@' + res.author + '">' + res.author + '</a></td>';
                content += '<td class="text-center ' + className + '" rowspan="' + (filteredShare).length * 2 + '">' + clickedCount + '</td>';
                content += '<td class="text-center ' + className + ' comment-' + res.steemit_id + '" rowspan="' + (filteredShare).length * 2 + '"></td>';
                content += '<td class="text-center ' + className + ' vote-' + res.steemit_id + '" rowspan="' + (filteredShare).length * 2 + '"></td>';
            }
            _.map(['Facebook', 'Twitter'], function (channel, callback) {
                var lowerCaseChannel = channel.toLowerCase();
                content += '<td class="text-center ' + className + '">' + channel + '</td>';
                content += '<td class="' + lowerCaseChannel + '-like-' + o.id + ' text-center ' + className + '"></td>';
                content += '<td class="' + lowerCaseChannel + '-share-' + o.id + ' text-center ' + className + '"></td>';
                content += '<td class="' + lowerCaseChannel + '-comments-' + o.id + ' text-center ' + className + '"></td>';
                content += '<td class="text-center ' + className + '" style="width: 160px;">';
                content += '<p class="margin-0">' + moment.parseZone(o.date_added).format('YYYY-MM-DD HH:MM:SS') + '</p>';
                content += '</td>';
                content += '</tr>';

                detailStacks.push({
                    id: o.id,
                    type: lowerCaseChannel,
                    user_state: $.cookie(lowerCaseChannel),
                    post_id: o[lowerCaseChannel + '_post_id'],
                })
            });
        });

        $('.table tbody').append(content);
        _.map(detailStacks, function (o) {
            analyticsCall(o, function (res) {
                $('.' + o.type + '-like-' + o.id).append(res.like);
                $('.' + o.type + '-share-' + o.id).append(res.share);
                $('.' + o.type + '-comments-' + o.id).append(res.comments);
            });
        });
    }

    function getSteemiPostDetails(o) {
        var permlink = o.permlink;
        var author = o.author;
        var query = {
            tag: author,
            limit: 1,
            start_permlink: permlink,
            start_author: author
        }

        steem.api.getDiscussionsByBlog(query, function (err, result) {
            var response = result[0];

            $('.comment-' + o.steemit_id).append(response.children);
            $('.vote-' + o.steemit_id).append((response.active_votes).length);
        });
    }

    function analyticsCall(params, cb) {
        var licenseActivationEmail = allOptionData.license_activation_email

        if (params.post_id == 0) {
            cb({
                like: 0,
                share: 0,
                comments: 0
            });
        } else {
            $.ajax({
                type: 'POST',
                url: 'http://steemhypeshare.signalssoftware.com/analytics-' + params.type + '.php',
                data: JSON.stringify({
                    user_state: params.user_state,
                    post_id: params.post_id,
                    activation_email: licenseActivationEmail
                }),
                success: function (success) {
                    var responseObject = {};

                    if (success.status) {
                        switch (params.type) {
                            case 'facebook':
                                if (success.status == false) {
                                    responseObject = {
                                        like: 0,
                                        share: 0,
                                        comments: 0
                                    };
                                } else {
                                    responseObject = {
                                        like: (success.result.likes.data).length,
                                        share: (typeof success.result.shares != 'undefined') ? success.result.shares.count : 0,
                                        comments: (success.result.comments.data).length
                                    };
                                }
                                break;

                            case 'linkedin':
                                responseObject = {
                                    like: 0,
                                    share: 0,
                                    comments: 0
                                };
                                break;

                            case 'twitter':
                                if (success.status == false) {
                                    responseObject = {
                                        like: 0,
                                        share: 0,
                                        comments: 0
                                    };
                                } else {
                                    responseObject = {
                                        like: success.result.favorite_count,
                                        share: success.result.retweet_count,
                                        comments: (success.result.replies).length
                                    };
                                }
                                break;
                        }
                    } else {
                        toastr.error(success.message, 'Error');
                    }
                    cb(responseObject);
                },
                error: function (err) {
                    cb({
                        like: 0,
                        share: 0,
                        comments: 0
                    });
                }
            });
        }
    }

    //Chart Functions
    function generateDonutChart(params) {
        Morris.Donut({
            element: params.element,
            data: params.data,
            colors: params.colors
        });
    }

    function generateLineChart(params) {
        Morris.Line({
            element: params.element,
            data: params.data,
            xkey: 'x-key',
            ykeys: ['value'],
            labels: ['Value']
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
})(jQuery);