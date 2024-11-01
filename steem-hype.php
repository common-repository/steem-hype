<?php

/**
 * Plugin Name: Steem Hype
 * Description: Share Steemit posts to different Social Media.
 * Version: 1.4.1
 * Author: Signals Software
 * Author URI: http://signalssoftware.com/
 **/


define('STEEMHYPE__DIR__', dirname(__FILE__));

//Include classes
require_once(STEEMHYPE__DIR__ . '/class/class-steemit-users.php');
require_once(STEEMHYPE__DIR__ . '/class/class-feeds.php');
require_once(STEEMHYPE__DIR__ . '/class/class-shared-switch.php');
require_once(STEEMHYPE__DIR__ . '/class/class-options.php');
require_once(STEEMHYPE__DIR__ . '/class/class-shortcode.php');
require_once(STEEMHYPE__DIR__ . '/class/class-subscribers.php');


//WP_List_Table
if (!class_exists('WP_List_Table')) {
    require_once(ABSPATH . 'wp-admin/includes/class-wp-list-table.php');
}

//Activate Plugin
function activateSteemHype()
{

    global $wpdb;

    $sql = "CREATE TABLE `wp_steemit_users` (
    `id_steemit_user` int(11) NOT NULL AUTO_INCREMENT,
    `account_name` varchar(255) NOT NULL,
    `date_added` datetime NOT NULL,
    PRIMARY KEY (`id_steemit_user`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1
    ";

    $sql2 = "CREATE TABLE `wp_steemhype_options` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `option_name` varchar(255) NOT NULL,
    `value` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1
    ";

    $sql3 = "CREATE TABLE `wp_steemit_feeds` (
    `id` bigint(100) NOT NULL AUTO_INCREMENT,
    `steemit_id` bigint(100) NOT NULL,
    `title` varchar(255) NOT NULL,
    `author` varchar(255) NOT NULL,
    `imgsrc` text NOT NULL,
    `permlink` varchar(255) NOT NULL,
    `url` varchar(255) NOT NULL,
    `description` text NOT NULL,
    `creation_date` DATE DEFAULT NULL,
    `category` varchar(255) NOT NULL,
    `tags` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARACTER SET = utf8; 
    ";

    $sql4 = "CREATE TABLE `wp_shared_steemit_feeds` (
    `id` bigint(100) NOT NULL AUTO_INCREMENT,
    `steemit_id` bigint(100) NOT NULL,
    `share_fb` tinyint(4) NOT NULL DEFAULT '0',
    `share_linkedin` tinyint(4) NOT NULL DEFAULT '0',
    `share_twitter` tinyint(4) NOT NULL DEFAULT '0',
    `share_email` tinyint(4) NOT NULL DEFAULT '0',
    `share_web` tinyint(4) NOT NULL DEFAULT '0',
    `facebook_post_id` VARCHAR(100) NOT NULL,
    `linkedin_post_id` VARCHAR(100) NOT NULL,
    `twitter_post_id` VARCHAR(100) NOT NULL,
    `date_added` datetime NOT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1
    ";

    $sql5 = "INSERT INTO `wp_steemhype_options` (`id`, `option_name`, `value`) VALUES
    (1, 'show_title', '1'),
    (2, 'title_limit', '100'),
    (3, 'show_description', '1'),
    (4, 'description_limit', '100'),
    (5, 'date_posted', '1'),
    (6, 'show_category', '1'),
    (7, 'show_tags', '1'),
    (8, 'show_author', '1'),
    (9, 'show_creation_date', '1'),
    (10, 'title_font_size', '15'),
    (11, 'author_font_size', '13'),
    (12, 'body_font_size', '14'),
    (13, 'tag_font_size', '13'),
    (14, 'category_font_size', '13'),
    (15, 'layout_type', 'list'),
    (16, 'image_size', 'small'),
    (17, 'show_image', '1'),
    (18, 'date_font_size', '13'),
    (19, 'email_logo', ''),
    (20, 'email_layout', 'logo,email_content,title,image,description'),
    (21, 'email_text', ''),
    (22, 'email_from_name', 'Steem Hype'),
    (23, 'license_activation_email', ''),
    (24, 'license_activation_date', '');";

    $sql6 = "CREATE TABLE `wp_steemhype_subscribers` (
    `id` bigint(100) NOT NULL AUTO_INCREMENT,
    `email` varchar(255) NOT NULL,
    `status` tinyint(1) NOT NULL,
    `date_added` datetime NOT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1
    ";

    $sql7 = "CREATE TABLE IF NOT EXISTS `wp_steemit_feed_clicks` (
    `id` bigint(100) NOT NULL AUTO_INCREMENT,
    `clicks` bigint(100) NOT NULL,
    `steemit_id` bigint(100) NOT NULL,
    `date_added` date NOT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
    dbDelta($sql2);
    dbDelta($sql3);
    dbDelta($sql4);
    dbDelta($sql5);
    dbDelta($sql6);
    dbDelta($sql7);
}
register_activation_hook(__FILE__, 'activateSteemHype');

function initializedScript()
{
    wp_localize_script('ajaxHandle', 'ajax_object', array('ajaxurl' => admin_url('admin-ajax.php')));
    wp_enqueue_script('steem_hype_script');
    wp_enqueue_style('steem_hype_style', plugins_url() . '/steem-hype-wordpress-plugin/css/style.css', array('jquery-ui-css', 'bootstrap', 'bootstrap-table', 'font-awesome', 'jquery-confirm', 'toaster', 'dragula', 'morris', 'date-range-picker'));
}

function wp_loadSteemHypeDependencies()
{
    $page = $_GET['page'];
    $dependencyStack = array('jquery', 'jquery-ui', 'bootstrap-js', 'lodash', 'jquery-confirm', 'showdown', 'moment', 'bootstrap-table-js', 'toaster', 'async', 'cookie', 'dragula', 'rafael', 'morris', 'steemit', 'date-range-picker');

    wp_register_script('jquery-ui', 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js', false, null);
    wp_register_script('bootstrap-js', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js', false, null);
    wp_register_script('lodash', 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js', false, null);
    wp_register_script('jquery-confirm', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js', false, null);
    wp_register_script('showdown', 'https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.3/showdown.min.js', false, null);
    wp_register_script('moment', 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.3/moment.min.js', false, null);
    wp_register_script('bootstrap-table-js', 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.1/bootstrap-table.min.js', false, null);
    wp_register_script('toaster', 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js', false, null);
    wp_register_script('async', 'https://cdnjs.cloudflare.com/ajax/libs/async/2.6.0/async.js', false, null);
    wp_register_script('cookie', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js', false, null);
    wp_register_script('dragula', 'https://cdnjs.cloudflare.com/ajax/libs/dragula/3.6.3/dragula.min.js', false, null);
    wp_register_script('rafael', 'https://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js', false, null);
    wp_register_script('morris', 'https://cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js', false, null);
    wp_register_script('steemit', 'https://cdn.steemjs.com/lib/latest/steem.min.js', false, null);
    wp_register_script('date-range-picker', 'http://cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.js', false, null);

    wp_register_style('jquery-ui-css', 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css', false, null);
    wp_register_style('bootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css', false, null);
    wp_register_style('font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', false, null);
    wp_register_style('bootstrap-table', 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.1/bootstrap-table.css', false, null);
    wp_register_style('toaster', 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.css', false, null);
    wp_register_style('jquery-confirm', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css', false, null);
    wp_register_style('dragula', 'https://cdnjs.cloudflare.com/ajax/libs/dragula/3.6.3/dragula.min.css', false, null);
    wp_register_style('morris', 'https://cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css', false, null);
    wp_register_style('date-range-picker', 'http://cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.css', false, null);

    switch ($page) {
        case 'steempendingfeeds':
            wp_register_script('share', plugins_url() . '/steem-hype-wordpress-plugin/js/share.js');
            array_push($dependencyStack, 'share');
            wp_register_script('steem_hype_script', plugins_url() . '/steem-hype-wordpress-plugin/js/pending-feeds.js', $dependencyStack);
            break;
        case 'steemarchivefeeds':
            wp_register_script('share', plugins_url() . '/steem-hype-wordpress-plugin/js/share.js');
            wp_register_script('web', plugins_url() . '/steem-hype-wordpress-plugin/js/web.js');
            array_push($dependencyStack, 'share', 'web');
            wp_register_script('steem_hype_script', plugins_url() . '/steem-hype-wordpress-plugin/js/archived-feeds.js', $dependencyStack);
            break;
        case 'subscribers':
            wp_register_script('steem_hype_script', plugins_url() . '/steem-hype-wordpress-plugin/js/subscribers.js', $dependencyStack);
            break;
        case 'steemhypesettings':
            wp_register_script('steem_hype_script', plugins_url() . '/steem-hype-wordpress-plugin/js/settings.js', $dependencyStack);
            break;
        case 'analytics':
            wp_register_script('steem_hype_script', plugins_url() . '/steem-hype-wordpress-plugin/js/analytics.js', $dependencyStack);
            break;
    }

    initializedScript();

}
add_action('admin_enqueue_scripts', 'wp_loadSteemHypeDependencies');

function initializedFrontEndScript()
{
    wp_register_script('clickCount', plugins_url() . '/steem-hype-wordpress-plugin/js/click-count.js', false, null);
    wp_register_script('steemhype-frontend-js', plugins_url() . '/steem-hype-wordpress-plugin/js/subscribe.js', array('clickCount'));
    wp_enqueue_script('steemhype-frontend-js');
    wp_localize_script('steemhype-frontend-js', 'ajax_object', array('ajaxurl' => admin_url('admin-ajax.php')));
}
add_action('wp_print_scripts', 'initializedFrontEndScript');


//Add menus to the dashboard
add_action('admin_menu', 'steemHypeMenu');
function steemHypeMenu()
{
    add_menu_page('Steem Hype Page', 'Steem Hype', 'manage_options', 'steemhypefeeds', 'steemhypefeeds', 'dashicons-admin-plugins', 100);
    add_submenu_page('steemhypefeeds', 'Pending Feeds', 'Pending Feeds', 'manage_options', 'steempendingfeeds', 'steempendingfeeds');
    add_submenu_page('steemhypefeeds', 'Archived Feeds', 'Archived Feeds', 'manage_options', 'steemarchivefeeds', 'steemarchivefeeds');
    add_submenu_page('steemhypefeeds', 'Subscribers', 'Subscribers', 'manage_options', 'subscribers', 'steemhypesubscribers');
    add_submenu_page('steemhypefeeds', 'Analytics', 'Analytics', 'manage_options', 'analytics', 'analytics');
    add_submenu_page('steemhypefeeds', 'Settings', 'Settings', 'manage_options', 'steemhypesettings', 'steemhypesettings');
    remove_submenu_page('steemhypefeeds', 'steemhypefeeds');
}

//Template for feeds
function steempendingfeeds()
{
    include(STEEMHYPE__DIR__ . '/templates/feeds.php');
}

//Template for feeds
function steemarchivefeeds()
{
    include(STEEMHYPE__DIR__ . '/templates/archive-feeds.php');
}

//Template for settings
function steemhypesettings()
{
    include(STEEMHYPE__DIR__ . '/templates/settings.php');
}

//Template for subscribers
function steemhypesubscribers()
{
    include(STEEMHYPE__DIR__ . '/templates/subscribers.php');
}

function analytics()
{
    include(STEEMHYPE__DIR__ . '/templates/analytics.php');
}


function accessWooCommerceLicenseAjax()
{
    $postData = $_POST;
    $wooData = wp_remote_get($postData[url]);
    wp_send_json_success($wooData);
}
add_action('wp_ajax_accessWooCommerceLicense', 'accessWooCommerceLicenseAjax');

//Feed Ajax
function getArchivedFeedAjax()
{
    $postData = $_POST;
    $feeds = new Feeds();
    $archiveFeeds = $feeds->getAllSharedFeeds($postData);
    wp_send_json_success($archiveFeeds);
}

add_action('wp_ajax_getArchivedFeed', 'getArchivedFeedAjax');

function insertFeedAjax()
{
    $postData = $_POST;
    $insertFeed = new Feeds();
    $results = $insertFeed->insertFeed($postData);
}
add_action('wp_ajax_insertFeed', 'insertFeedAjax');

function deleteFeedAjax()
{
    $id_feed = $_POST['id'];
    $feed = new Feeds();
    $feed->deleteFeeds($id_feed);
}
add_action('wp_ajax_deleteFeed', 'deleteFeedAjax');

function steemhype($atts)
{
    $shortcode = new Shortcode();
    return $shortcode->shortcode($atts);
}
add_shortcode('steemhype', 'steemhype');

function getSubscribersAjax()
{
    $postData = $_POST;
    $subscribers = new Subscribers();
    $subscriberList = $subscribers->getAllSubscribers($postData);
    wp_send_json_success($subscriberList);
}

add_action('wp_ajax_getSubscribers', 'getSubscribersAjax');

function addSettingsAjax()
{
    $postData = $_POST;

    if ($postData != '') {
        if (isset($postData['steem_user']) && $postData['steem_user'] != '') {
            $user = $postData['steem_user'];
            $users = new SteemitUsers();
            $users->addUsers($user);
        } else {
            $pluginOptions = new pluginOptions();
            $pluginOptions->addPluginOption($postData);
        }
    }
}
add_action('wp_ajax_addSettings', 'addSettingsAjax');

function editSettingsAjax()
{
    $postData = $_POST;

    if ($postData != '') {
        if (isset($postData['steem_user']) && $postData['steem_user'] != '') {
            $user = $postData['steem_user'];
            $users = new SteemitUsers();
            $users->editUser($user);
        } else {
            $pluginOptions = new pluginOptions();
            $pluginOptions->editPluginOption($postData);
        }
    }
}
add_action('wp_ajax_editSettings', 'editSettingsAjax');


function addSubscriber()
{
    $postData = $_POST;
    $subscribers = new Subscribers();
    $val = $subscribers->insertSubscriber($postData);
    echo json_encode($val);
    exit;
}
add_action('wp_ajax_addSubscriber', 'addSubscriber');
add_action('wp_ajax_nopriv_addSubscriber', 'addSubscriber');

function emailsubscribe()
{
    $shortcode = new Shortcode();
    return $shortcode->subscribe();
}
add_shortcode('steemhypesubscribe', 'emailsubscribe');

function updateSubscribe()
{
    $postData = $_POST;
    $subscribers = new Subscribers();
    $value = $subscribers->updateSubscribe($postData);
    wp_send_json_success($value);
}

add_action('wp_ajax_updateSubscribe', 'updateSubscribe');
add_action('wp_ajax_nopriv_updateSubscribe', 'updateSubscribe');

function emailunsubscribe()
{
    $shortcode = new Shortcode();
    return $shortcode->unsubscribe();
}
add_shortcode('unsubscribe', 'emailunsubscribe');

function add_query_vars($query_vars)
{
    $query_vars[] = 'unsubscribe';
    return $query_vars;
}
add_filter('query_vars', 'add_query_vars');

function redirectTemplate($wp)
{
    if (array_key_exists('unsubscribe', $wp->query_vars)) {
        $id = $_GET['id'];
        $email = $_GET['email'];
        if ($id != '' && $email != '') {
            include(STEEMHYPE__DIR__ . '/templates/unsubscribe.php');
            exit();
        }
    }
    return;
}
add_action('parse_request', 'redirectTemplate');

//analytics functions
function getShareCount()
{
    $feeds = new Feeds();
    $value = $feeds->countSharedFeed();
    wp_send_json_success($value[0]);
}

add_action('wp_ajax_getShareCount', 'getShareCount');

function getSubscriberCount()
{
    $subscribers = new Subscribers();
    $value = $subscribers->subscriberCount();
    wp_send_json_success($value[0]);
}

add_action('wp_ajax_getSubscriberCount', 'getSubscriberCount');

function getClickedCount()
{
    $postData = $_POST;
    $feeds = new Feeds();
    $value = $feeds->getClickedFeed($postData);
    wp_send_json_success($value);
}

add_action('wp_ajax_getClickedCount', 'getClickedCount');

function clickCount()
{
    $postData = $_POST;
    $feeds = new Feeds();
    $value = $feeds->countClickFeed($_POST);
    wp_send_json_success($value);
}

add_action('wp_ajax_clickCount', 'clickCount');
add_action('wp_ajax_nopriv_clickCount', 'clickCount');
?>