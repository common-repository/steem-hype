(function ($) {
    var layoutStack = '';
    var _URL = window.URL || window.webkitURL;
    var emailLogo = '';
    var converter = new showdown.Converter();

    $(document).ready(function () {
        $('#settings_tabs').tabs();
        initEmailBuilder();
    });

    //Email Builder
    $(document).on('click', '.email-logo', function (e) {
        $('#target').trigger('click');
        e.preventDefault();
    });

    $(document).on('click', '.remove-logo', function (e) {
        $('.logo div').css('background', 'none');
        var fileInput = $('#target');

        fileInput.replaceWith(fileInput = fileInput.clone(true));
        emailLogo = null;

        e.preventDefault();
    });

    $(document).on('change', '#target', function () {
        var _this = $(this);
        var file = _this[0].files[0];
        var img = new Image();
        var imgwidth = 0;
        var imgheight = 0;
        var maxwidth = 640;
        var maxheight = 640;

        img.src = _URL.createObjectURL(file);
        img.onload = function () {
            imgwidth = this.width;
            imgheight = this.height;

            if (imgwidth != 528 && imgheight != 100) {
                toastr.error('Website logo must be 528 x 100', 'Error');
            } else {
                var reader = new FileReader();
                reader.readAsBinaryString(file);
                reader.onload = function () {
                    $('.email-logo').text('Uploading image please wait ...');

                    $.ajax({
                        url: 'http://steemhypeshare.signalssoftware.com/upload-logo.php',
                        type: 'POST',
                        data: JSON.stringify({
                            logo: btoa(reader.result),
                            name: Number(new Date()) + '-' + file.name
                        }),
                        success: function (success) {
                            $('.logo div').css('background', 'url(' + _URL.createObjectURL(file) + ')');
                            emailLogo = success.result;
                            $('.email-logo').text('Upload website logo here: 528x100');
                            toastr.success(success.message, 'Success');
                        },
                        error: function (err) {
                            toastr.error('Something went wrong. Please try again later.', 'Error');
                        }
                    });

                };
                reader.onerror = function () {
                    toastr.error('Something went wrong. Please try again.', 'Error');
                };
            }
        };

    });

    //License
    $(document).on('click', '.submit_license', function () {
        var licenseData = {
            action: 'editSettings'
        };

        $('.data_input:visible').each(function () {
            var name = $(this).attr('data-name');
            var value = $(this).val();
            licenseData[name] = value;
        });


        if (_.some(licenseData, function (o, key) { return o === "" })) {
            $.alert({ title: 'Error', content: 'Please fill all of the required fields.' });
        } else if (emailChecker(licenseData.license_activation_email) == false) {
            $.alert({ title: 'Error', content: 'Invalid Activation Email Address.' });
        } else {
            var loading = $.confirm({
                title: 'Loading',
                content: 'Activating Subscription, Please wait...',
                buttons: { Cancel: { btnClass: 'hide' } }
            });
            // var requestParams = ['email=' + licenseData['license_activation_email'] + '', 'license_key=' + licenseData['license_key'] + '', 'product_id=shprolicense'];
            // var requestUrl = 'http://signalssoftware.com/woocommerce/?wc-api=software-api&request=check&' + requestParams.join('&');

            // $.ajax({
            //     type: 'POST',
            //     url: '/wp-admin/admin-ajax.php',
            //     cache: false,
            //     data: {
            //         url: requestUrl,
            //         action: 'accessWooCommerceLicense'
            //     },
            //     dataType: 'json',
            //     success: function (success) {
            //         var successBody = JSON.parse(success.data.body);

            //         if (successBody.success) {
            //             if (successBody.remaining > 0) {
            $.ajax({
                type: 'POST',
                url: 'http://steemhypeshare.signalssoftware.com/check-subscriptions.php',
                cache: false,
                data: JSON.stringify({
                    email_address: licenseData['license_activation_email']
                }),
                dataType: 'json',
                success: function (success) {
                    if ((success.result).length > 0) {
                        $.ajax({
                            type: 'POST',
                            url: '/wp-admin/admin-ajax.php',
                            cache: false,
                            data: licenseData,
                            dataType: 'json',
                            success: function (success) {
                                $('.license-form').fadeOut("slow");
                                $('.license-activation').removeClass('hide').removeAttr('style');
                                $('.license-text').text(licenseData['license_activation_email']).append('<span class="glyphicon glyphicon-remove red delete-license"></span>');
                                $('.activate-link').attr('data-activationEmail', licenseData['license_activation_email']);
                                $('.activate-link').attr('data-license', licenseData['license_key']);
                                loading.close();
                                toastr.success('Subscription email address successfully saved.', 'Success');
                            },
                            error: function (err) {
                                loading.close();
                                toastr.error('Something went wrong. Please try again later.', 'Error');
                            }
                        });
                    } else {
                        loading.close();
                        toastr.error('No up to date subscription found.', 'Error');
                    }
                    // $('.activate-link').attr('data-activationEmail', licenseData['license_activation_email']);
                    // $('.activate-link').attr('data-license', licenseData['license_key']);
                    // loading.close();
                    // toastr.success('License Key successfully saved.', 'Success');
                },
                error: function (err) {
                    loading.close();
                    toastr.error('Something went wrong. Please try again later.', 'Error');
                }
            });
            //             } else {
            //                 loading.close();
            //                 toastr.error('License key already been activated.', 'Error');
            //             }
            //         } else {
            //             loading.close();
            //             toastr.error('Something went wrong. Please try again later.', 'Error');
            //         }
            //     },
            //     error: function (err) {
            //         loading.close();
            //         toastr.error('Something went wrong. Please try again later.', 'Error');
            //     }
            // });
        }
    });

    $(document).on('click', '.activate-link', function () {
        var action = $(this).attr('data-action');
        var activationEmailAddress = $(this).attr('data-activationemail');
        var activationLabel = '';
        var licenseData = {
            action: 'editSettings',
        };
        var _this = $(this);
        var loading = $.confirm({
            title: 'Loading',
            content: 'License Action Request. Please wait...',
            buttons: { Cancel: { btnClass: 'hide' } }
        });
        var activate = 0;
        switch (action) {
            case 'activate':
                licenseData['license_activation_date'] = moment().format('YYYYMMDD');
                activationLabel = 'Deactivate License Key';
                break;
            case 'deactivate':
                licenseData['license_activation_date'] = '';
                activationLabel = 'Activate License Key';
                activate = 1;
                break;
        }

        $.ajax({
            type: 'POST',
            url: 'http://steemhypeshare.signalssoftware.com/activate-subscriptions.php',
            data: JSON.stringify({
                "email_address": activationEmailAddress,
                "activate": activate
            }),
            dataType: 'json',
            success: function (success) {
                if (success.status) {
                    $.ajax({
                        type: 'POST',
                        url: '/wp-admin/admin-ajax.php',
                        data: licenseData,
                        dataType: 'json',
                        success: function (sucres) {
                            _this.text(activationLabel);
                            _this.attr('data-action', (action != 'activate') ? 'activate' : 'deactivate');
                            if (action == 'activate') {
                                $('.delete-license').remove();
                            } else {
                                $('.license-text').append('<span class="glyphicon glyphicon-remove red delete-license"></span>');
                            }
                            loading.close();
                            toastr.success(success.message, 'Success');
                        },
                        error: function (sucerr) {
                            loading.close();
                            toastr.error('Something went wrong. Please try again later.', 'Error');
                        }
                    });
                } else {
                    loading.close();
                    toastr.error(success.message, 'Error');
                }
            },
            error: function (err) {
                loading.close();
                toastr.error('Something went wrong. Please try again later.', 'Error');
            }
        });

        // $.ajax({
        //     type: 'POST',
        //     url: '/wp-admin/admin-ajax.php',
        //     cache: false,
        //     data: {
        //         url: requestUrl,
        //         action: 'accessWooCommerceLicense'
        //     },
        //     dataType: 'json',
        //     success: function (success) {
        //         var successBody = JSON.parse(success.data.body);

        // $.ajax({
        //     type: 'POST',
        //     url: '/wp-admin/admin-ajax.php',
        //     data: licenseData,
        //     dataType: 'json',
        //     success: function (success) {

        //     },
        //     error: function (err) {
        //         loading.close();
        //         toastr.error('Something went wrong. Please try again later.', 'Error');
        //     }
        // });
        //     },
        //     error: function (err) {
        //         loading.close();
        //         toastr.error('Something went wrong. Please try again later.', 'Error');
        //     }
        // });
    });

    $(document).on('click', '.delete-license', function () {
        $.confirm({
            title: 'Delete',
            content: 'Are you sure you want to delete your subscription email address?',
            buttons: {
                ok: function () {
                    var licenseData = {
                        license_activation_email: '',
                        license_key: '',
                        action: 'editSettings'
                    };

                    $.ajax({
                        type: 'POST',
                        url: '/wp-admin/admin-ajax.php',
                        cache: false,
                        data: licenseData,
                        dataType: 'json',
                        success: function (success) {
                            $('.license-activation ').fadeOut("slow");
                            $('.license-form').removeClass('hide').removeAttr('style');
                            toastr.success('License Key successfully deleted', 'Success');
                        },
                        error: function (err) {
                            toastr.error('Something went wrong. Please try again later.', 'Error');
                        }
                    });
                },
                cancel: function () { }
            }
        });
    });

    //Settings
    $(document).on('click', '.submit_key', function () {
        var action = $(this).attr('data-action');
        var dataArr = {};
        var id = $(this).attr('id');

        $('.data_input:visible').each(function () {
            var name = $(this).attr('data-name');
            var value = $(this).val();

            dataArr[name] = value;
        });

        if ($('.optionSwitch').length > 0) {
            var optionSwitch = $(this).parent().siblings().children().find('.optionSwitch');

            optionSwitch.each(function () {
                var name = $(this).attr('data-name');
                var check = this.checked;
                var value = (check) ? 1 : 0;
                dataArr[name] = value;
            });
        }

        if ($('#content_settings:visible').length > 0) {
            var layoutTypeValue = $("input[type=radio][name='layout_type']:checked").val();
            var imageSizeValue = $("input[type=radio][name='image_size']:checked").val();

            dataArr['layout_type'] = layoutTypeValue;
            dataArr['image_size'] = imageSizeValue;
        }

        if (layoutStack.length > 0) {
            var name = 'email_layout';
            var value = layoutStack.join(',');
            dataArr[name] = value;
        }

        if ($('#email:visible').length > 0) {
            var name = 'email_logo';
            dataArr[name] = emailLogo;
        }

        if (_.has(dataArr, 'steem_user')) {
            $.confirm({
                title: false,
                content: 'Import last 10 post of this user?<br> Note: Pressing No will still save the Steemit author.',
                buttons: {
                    YES: {
                        action: function () {
                            var query = {
                                tag: dataArr['steem_user'],
                                limit: 10
                            }
                            var loading = $.confirm({
                                title: 'Loading',
                                content: 'Importing Steemit Feeds, Please wait...',
                                buttons: { Cancel: { btnClass: 'hide' } }
                            });

                            steem.api.getDiscussionsByBlog(query, function (err, result) {
                                async.each(result, function (res, callback) {
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

                                    var insertParams = {
                                        action: 'insertFeed',
                                        id: res.id,
                                        title: res.title,
                                        description: description,
                                        imgsrc: imageSrc,
                                        author: author,
                                        permlink: res.permlink,
                                        creation_date: moment(creationDate).format("YYYY-MM-DD"),
                                        url: url,
                                        category: res.category,
                                        tags: tags,
                                        sharemedia: {
                                            web: 1
                                        }
                                    };

                                    sharePost(insertParams, function () {
                                        callback();
                                    });
                                }, function () {
                                    setTimeout(function () {
                                        loading.close();
                                        saveData(dataArr, action);
                                    }, 500)
                                });
                            });
                        }
                    },
                    NO: {
                        action: function () {
                            saveData(dataArr, action);
                        }
                    },
                }
            });
        } else {
            saveData(dataArr, action);
        }
    });

    function saveData(params, action) {
        var dataArr = params;

        switch (action) {
            case 'add':
                dataArr['action'] = 'addSettings';
                var submitData = dataArr;

                if (_.some(submitData, function (o, key) { return o === "" && key != 'email_text' && key != 'email_logo' })) {
                    $.alert({ title: 'Error', content: 'Please fill all of the required fields.' });
                } else {
                    var loading = $.confirm({
                        title: 'Loading',
                        content: 'Saving settings, Please wait...',
                        buttons: { Cancel: { btnClass: 'hide' } }
                    });

                    $.ajax({
                        type: 'POST',
                        url: '/wp-admin/admin-ajax.php',
                        cache: false,
                        data: submitData,
                        dataType: 'json',
                        success: function (success) {
                            loading.close();
                            toastr.success('Settings successfully saved.', 'Success');
                        },
                        error: function (err) {
                            loading.close();
                            toastr.error('Something went wrong. Please try again later', 'Error');
                        }
                    });
                }

                break;

            case 'submit-edit':
                dataArr['action'] = 'editSettings';
                var submitData = dataArr;

                if (_.some(submitData, function (o, key) { return o === "" && key != 'email_text' && key != 'email_logo' })) {
                    $.alert({ title: 'Error', content: 'Please fill all of the required fields.' });
                } else {
                    var loading = $.confirm({
                        title: 'Loading',
                        content: 'Saving settings, Please wait...',
                        buttons: { Cancel: { btnClass: 'hide' } }
                    });

                    $.ajax({
                        type: 'POST',
                        url: '/wp-admin/admin-ajax.php',
                        cache: false,
                        data: submitData,
                        dataType: 'json',
                        success: function (success) {
                            loading.close();
                            toastr.success('Settings successfully saved.', 'Success');
                        },
                        error: function (err) {
                            loading.close();
                            toastr.error('Something went wrong. Please try again later', 'Error');
                        }
                    });
                }
                break
        }
    }

    $(document).on('keydown', '.numeric', function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode == 110 || e.keyCode == 190)) {
            e.preventDefault();
        }
    });

    //Functions
    function initEmailBuilder() {
        dragula([document.getElementById('cont')]).on('drop', function (el) {
            layoutStack = [];

            $(".layout_div").each(function () {
                var id = $(this).attr('data-id');

                if (_.indexOf(layoutStack, id) == -1) {
                    layoutStack.push(id);
                }
            });
        });
    }

    function emailChecker(email) {
        var regChecker = /\S+@\S+\.\S+/;
        return regChecker.test(email);
    }

    function sharePost(params, cb) {
        let socialMediaShare = {
            web: 1
        };

        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            cache: false,
            data: params,
            dataType: 'json'
        }).done(function () {

            cb();
        });
    }

})(jQuery);