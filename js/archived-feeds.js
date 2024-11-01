var loading = true;
var offset = 0;
var limit = 20;
var steemitFeedStack = [];

(function ($) {
    $(document).ready(function () {
        getArchivedFeeds();
    });

    $(window).scroll(function () {
        var nearToBottom = 500;
        if (($(window).scrollTop() + $(window).height() > $(document).height() - nearToBottom) && loading == false) {
            loading = true;
            getArchivedFeeds();
        }
    });
    
    function getArchivedFeeds() {
        $('.load').html('<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i> <p>Loading Archived Steemit feeds</p>');

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

                    _.map(steemitFeedStack, function (o, index) {
                        generateContent(o, index);
                    });

                    if (steemitFeedStack.length < (limit)) {
                        loading = true;
                    } else {
                        offset = offset + limit;
                        loading = false;
                    }
                    $('.load').html('');
                }else{
                    loading = true;
                    $('.load').empty().html('<i class="fa fa-times fa-3x fa-fw"></i> <p>No Data</p>');
                }
            },
            error: function (err) {
                loading = true;
                toastr.error('Something went wrong. Please try again later', 'Error');
                $('.load').html('');
            }
        });
    }

    function generateContent(res, index) {
        var creationDate = moment(res.creation_date).format("YYYY-MM-DD");
        var webChecker = (_.maxBy(res.share, function (o) { return o.date_added; }).share_web == 1) ? "checked" : "";
        var filteredShare = _.filter(res.share, function (share) { return share.share_fb != 0 || share.share_linkedin != 0 || share.share_twitter != 0 || share.share_email != 0 });
        filteredShare = _.orderBy(filteredShare, ['date_added'], ['desc'])
        
        var content = '<tr class="trshare" id="trshare_' + res.steemit_id + '">';
        content += '<td>';
        content += '<div class="imgContainer">';
        content += '<img src="' + res.imgsrc + '">';
        content += '</div>';
        content += '</td>';
        content += '<td class="text-left"><a target="_blank" href="' + res.url + '" data-index="' + index + '">' + res.title + '</a></td>';
        content += '<td class="text-center"><a target="_blank" href="https://steemit.com/@' + res.author + '">' + res.author + '</a></td>';

        content += '<td class="text-center td-facebook-' + res.steemit_id + '" >' + _.map(filteredShare, function (share) {
            var icon = ((_.pick(share, 'share_fb')).share_fb == 1) ? ' glyphicon-ok green' : 'glyphicon-remove red';
            return '<span class="act-span glyphicon ' + icon + '"></span>';
        }).join('') + '</td>';
        content += '<td class="text-center td-twitter-' + res.steemit_id + '" >' + _.map(filteredShare, function (share) {
            var icon = ((_.pick(share, 'share_twitter')).share_twitter == 1) ? ' glyphicon-ok green' : 'glyphicon-remove red';
            return '<span class="act-span glyphicon ' + icon + '"></span>';
        }).join('') + '</td>';
        content += '<td class="text-center td-email-' + res.steemit_id + '" >' + _.map(filteredShare, function (share) {
            var icon = ((_.pick(share, 'share_email')).share_email == 1) ? ' glyphicon-ok green' : 'glyphicon-remove red';
            return '<span class="act-span glyphicon ' + icon + '"></span>';
        }).join('') + '</td>';
        content += '<td class="text-center td-date-' + res.steemit_id + '"> ' + _.map(filteredShare, function (share) {
            return '<p class="act-p">' + moment(share.date_added).format("YYYY-MM-DD") + '</p>';
        }).join('') + '</td>';


        content += '<td class="text-center"><label class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input hide archiveweb web-switch-' + res.steemit_id + '" data-steemitid="' + res.steemit_id + '" data-title="' + res.title + '" data-description="' + res.description + '" data-url="' + res.url + '" data-image="' + res.imgsrc + '" data-author="' + res.author + '" data-permlink="' + res.permlink + '" data-category="' + res.category + '" data-tags="' + res.tags + '" data-date="' + res.creation_date + '" ' + webChecker + '><span class="custom-control-indicator"></span></label></td>';
        content += '<td class="text-center"><span data-steemitid="' + res.steemit_id + '" class="shareFeed glyphicon glyphicon-send" data-title="' + res.title + '" data-description="' + res.description + '" data-url="' + res.url + '" data-image="' + res.imgsrc + '" data-author="' + res.author + '" data-permlink="' + res.permlink + '" data-category="' + res.category + '" data-tags="' + res.tags + '" data-date="' + res.creation_date + '"></span></td>';
        content += '</tr>';

        $('.table tbody').append(content);
    }

})(jQuery);