var converter = new showdown.Converter();
var loading = true;
var query = "";

(function ($) {
    $(document).ready(function () {
        if ($('#pendingFeeds').length > 0) {
            steem.api.setOptions({ url: 'https://api.steemit.com' });
            getSteemitFeeds();
        }
    });

    $(window).scroll(function () {
        var nearToBottom = 500;
        if (($(window).scrollTop() + $(window).height() > $(document).height() - nearToBottom) && loading == false) {
            loading = true;
            loadMoreFeed();
        }
    });

    function loadMoreFeed() {
        $('.load').html('<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i> <p>Loading Steemit feeds</p>');
        steem.api.getDiscussionsByBlog(query, function (err, result) {
            result.map(function (res, index) {
                if (index > 0) {
                    generateContent(res);
                }

                if (index == (result.length) - 1) {
                    query['limit'] = 21;
                    query['start_permlink'] = res.permlink;
                    query['start_author'] = res.author;
                }
            });

            if (result.length < (query.limit - 1)) {
                loading = true;
            } else {
                loading = false;
            }

            toastr.success('Steemit feeds successfully retrieved.', 'Success');
        });

        // $.ajax({
        //     type: 'GET',
        //     url: 'https://api.steemjs.com/getDiscussionsByBlog?query=' + JSON.stringify(query),
        //     success: function (result) {
        //         result.map(function (res, index) {
        //             if (index > 0) {
        //                 generateContent(res);
        //             }

        //             if (index == (result.length) - 1) {
        //                 query['limit'] = 21;
        //                 query['start_permlink'] = res.permlink;
        //                 query['start_author'] = res.author;
        //             }
        //         });

        //         if (result.length < (query.limit - 1)) {
        //             loading = true;
        //         } else {
        //             loading = false;
        //         }

        //         toastr.success('Steemit feeds successfully retrieved.', 'Success');
        //     },
        //     error: function (err) {
        //         loading = true;
        //         toastr.error('Something went wrong. Please refresh the page.', 'Error');
        //     }
        // }).done(function () {
        //     $('.load').html('');
        // });
    }

    function getSteemitFeeds() {
        var user = options.steem_user;
        query = {
            tag: user,
            limit: 20
        };

        if (typeof user != 'undefined' && user != '') {
            $('.load').html('<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i> <p>Loading Steemit feeds</p>');

            steem.api.getDiscussionsByBlog(query, function (err, result) {
                if (result.length > 0) {
                    result.map(function (res, index) {
                        generateContent(res);
                        if (index == (result.length) - 1) {
                            query['start_permlink'] = res.permlink;
                            query['start_author'] = res.author;
                        }
                    });

                    if (result.length < (query.limit - 1)) {
                        loading = true;
                    } else {
                        loading = false;
                    }

                    toastr.success('Steemit feeds successfully retrieved.', 'Success');
                    $('.load').html('');
                } else {
                    loading = true;
                    $('.load').empty().html('<i class="fa fa-times fa-3x fa-fw"></i> <p>No Data</p>');
                }
            });

            // $.ajax({
            //     type: 'GET',
            //     url: 'https://api.steemjs.com/getDiscussionsByBlog?query=' + JSON.stringify(query),
            //     success: function (result) {
            //         result.map(function (res, index) {
            //             generateContent(res);
            //             if (index == (result.length) - 1) {
            //                 query['start_permlink'] = res.permlink;
            //                 query['start_author'] = res.author;
            //             }
            //         });

            //         if (result.length < (query.limit - 1)) {
            //             loading = true;
            //         } else {
            //             loading = false;
            //         }
            //         toastr.success('Steemit feeds successfully retrieved.', 'Success');
            //     },
            //     error: function (err) {
            //         loading = true;
            //         toastr.error('Something went wrong. Please refresh the page.', 'Error');
            //     }
            // }).done(function () {
            // });

        } else {
            toastr.clear();
            $('.warnings').append('<div class="alert alert-danger" role="alert" id="alert"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>No valid Steemit author provided in the settings.</div>');
        }
    }

    function generateContent(res) {
        var feedSharedStatus = (typeof sharedStatus != 'undefined') ? JSON.parse(sharedStatus) : [];
        var meta = JSON.parse(res.json_metadata);
        var htmlString = converter.makeHtml(res.body);
        var holder = $('<div>');
        holder.html(htmlString);
        var textContent = holder[0].textContent;
        var title = (res.title).replace(/[\|&;\$%@"<>\(\)\+,\/\n|\r/']/g, " ");
        var author = res.author;
        var url = 'https://steemit.com' + res.url;
        var imageSrc = (typeof meta.image != 'undefined') ? meta.image[0] : '';
        var tags = (typeof meta.tags != 'undefined') ? (meta.tags).join(" ") : [];
        imageSrc = (imageSrc == '') ? holder.find('img').attr('src') : imageSrc
        imageSrc = (typeof imageSrc != 'undefined') ? imageSrc : defaultImage;
        var description = textContent.replace(/[\|&;\$%@"<>\(\)\+,\/\n|\r/']/g, " ");
        var creationDate = moment(res.created).format("YYYY-MM-DD");

        var content = '<tr class="trshare" id="trshare_' + res.id + '">';
        content += '<td>';
        content += '<div class="imgContainer">';
        content += '<img src="' + imageSrc + '">';
        content += '</div>';
        content += '</td>';
        content += '<td>';
        content += '<a target="_blank" href="' + url + '" data-toggle="tooltip" data-placement="top" title="' + title + '">' + title + '</a>';
        content += '</td>';
        content += '<td class="text-center"><a target="_blank" href="https://steemit.com/@' + author + '">' + author + '</a></td>';
        content += '<td class="text-center">' + creationDate + '</td>';
        content += '<td class="text-center"><span data-steemitid="' + res.id + '" class="shareFeed glyphicon glyphicon-send" data-title="' + title + '" data-description="' + description + '" data-url="' + url + '" data-image="' + imageSrc + '" data-author="' + author + '" data-permlink="' + res.permlink + '" data-category="' + res.category + '" data-tags="' + tags + '" data-date="' + res.created + '"></span></td>';
        content += '</tr>';

        if (typeof _.find(feedSharedStatus, function (feed) { return (feed.steemit_id == res.id) }) == "undefined") {
            $('.table tbody').append(content);
        }
    }
})(jQuery);