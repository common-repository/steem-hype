<?php

class Shortcode
{

    function __construct()
    {
    }

    public function shortcode($params)
    {
        $feeds = new Feeds();
        $allFeeds = $feeds->getAllWebSharedFeeds($params);
        $pluginOptions = new pluginOptions();
        $options = $pluginOptions->getAllPluginOptions();
        $show_title = ($options['show_title'] == 0) ? 'hidden' : '';
        $show_description = ($options['show_description'] == 0) ? 'hidden' : '';
        $show_date_posted = ($options['date_posted'] == 0) ? 'hidden' : '';
        $show_category = ($options['show_category'] == 0) ? 'hidden' : '';
        $show_tags = ($options['show_tags'] == 0) ? 'hidden' : '';
        $show_author = ($options['show_author'] == 0) ? 'hidden' : '';
        $firstDiv = ($options['layout_type'] == 'list') ? 'col-xs-12 col-sm-5' : 'col-xs-12';
        $secondDiv = ($options['layout_type'] == 'list') ? 'col-xs-12 col-sm-7' : 'col-xs-12';
        $titleFontSize = $options['title_font_size'] . 'px';
        $authorFontSize = $options['author_font_size'] . 'px';
        $bodyFontSize = $options['body_font_size'] . 'px';
        $tagFontSize = $options['tag_font_size'] . 'px';
        $dateFontSize = $options['date_font_size'] . 'px';
        $categoryFontSize = $options['category_font_size'] . 'px';
        $showImage = ($options['show_image'] == 0) ? 'hidden' : '';
        $fullwidth = ($options['layout_type'] == 'list' && $showImage == 'hidden') ? 'full-width' : '';
        $imageSize = ($options['image_size'] == 'large') ? 'large-img' : 'small-img';
        $titleLimit = $options['title_limit'];
        $descriptionLimit = $options['description_limit'];

        $html = '
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <style>
        .hidden {
            display:none;
        }
        
        .feed-items{
            width:100%;
            max-width:700px;
            margin:0 auto;
            padding:20px;
            border-bottom: 1px solid #b6b6b6;
        }
        
        .large-img{
            width:100%;
            max-width:700px;
        }
        
        .col-xs-12 .small-img{
            width:100%;
            max-width:300px;
        }
        
        .col-sm-5 .small-img{
            width:100%;
            max-width:200px;
        }

        .col-xs-12 .img-container {
            margin-bottom:10px;
        }
    
        .title {
            font-size:' . $titleFontSize . ';
            margin-top:0px;
            color: inherit;
        }
        
        .author {
            font-size:' . $authorFontSize . ';
            margin-bottom:5px;
        }
        
        .category {
            font-size:' . $categoryFontSize . ';
            margin-bottom:5px;
        }
        
        .tags {
            font-size:' . $tagFontSize . ';
            margin-bottom:5px;
        }

        .date {
            font-size:' . $dateFontSize . ';
            margin-bottom:5px;
        }
        
        a, a:hover, a:visited, a:link, a:active {
            color: inherit;
            text-decoration: none !important;
            cursor: pointer;
            border:0!important;
            -webkit-box-shadow: none;
            box-shadow: none;
            -webkit-transition: none;
            transition: none;
            transition: none;
            transition: none;
        }
        
        .description{
            font-size:' . $bodyFontSize . ';
        }
        
        </style>
        ';

        foreach ($allFeeds as $key => $val) {
            $html .= '<div class="feed-items">';
            $html .= '<div class="row">';
            $html .= '<div class="' . $firstDiv . '">';
            $html .= '<div class="' . $showImage . '">';
            $html .= '<a class="count-click" target="_blank" href="' . $val->url . '" data-id="'.$val->id.'">';
            $html .= '<div class="img-container">';
            $html .= '<img style="margin:0 auto;" class="img-responsive ' . $imageSize . '" height="100%" src="' . $val->imagesrc . '" alt=""/>';
            $html .= '</div>';
            $html .= '</a>';
            $html .= '</div>';
            $html .= '</div>';
            $html .= '<div class="' . $secondDiv . ' ' . $fullwidth . '">';
            $html .= '<div class="' . $show_title . '">';
            $html .= '<h2 class="title"><a class="count-click" data-id="'.$val->id.'" target="_blank" href="' . $val->url . '">' . substr($val->title, 0, $titleLimit) . '</a>';
            if (strlen($val->title) > $titleLimit) {
                $html .= '<span>...</span>';
            }
            $html .= '</h2>';
            $html .= '</div>';
            $html .= '<div class="' . $show_author . '">';
            $html .= '<p class="author">Author: <a target="_blank" href="https://steemit.com/@' . $val->author . '"><i>@' . $val->author . '</i></a></p>';
            $html .= '</div>';
            $html .= '<div class="' . $show_date_posted . '">';
            $html .= '<p class="date">Date Posted: ' . $val->creation_date . ' </p>';
            $html .= '</div>';
            $html .= '<div class="' . $show_category . '">';
            $html .= '<p class="category">Category: ' . $val->category . '</p>';
            $html .= '</div>';
            $html .= '<div class="' . $show_tags . '">';
            $html .= '<p class="tags">Tags: ' . $val->tags . '</p>';
            $html .= '</div>';
            $html .= '<div class="description ' . $show_description . '">';
            $html .= '<p>' . substr($val->description, 0, $descriptionLimit) . '...</p>';
            $html .= '</div>';
            $html .= '</div>';
            $html .= '</div>';
            $html .= '</div>';
        }
        return $html;
    }

    public function subscribe()
    {
        $form = '';
        $form .= '<style>
        .subscribecontainer {
            padding:20px 0px;
            max-width:500px;
            width:100%;
            margin:0 auto;
        }
        .subscribecontainer #subscribe_email{
            height: 35px;
            padding: 6px 12px;
            font-size: 14px;
            line-height: 1.42857143;
            color: #555;
            background-color: #fff;
            background-image: none;
            border: 1px solid #292929;
            float:left;
            max-width:350px;
            border-radius:0;
        }
        .subscribecontainer #joinsteemhype{
            border-radius:0px;
            background-color:#292929;
            color:#fff;
            height: 35px;
        }
        .subscribecontainer .successmsg{
            text-align:center;
            padding: 10px 0px;
            display:none;
        }
        </style>';
        $form .= '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">';
        $form .= '<script type="text/javascript" src="https://code.jquery.com/jquery-2.2.4.min.js"></script>';

        $form .= '<div class="subscribecontainer">
                        <div class="successmsg">Thank you for subscribing!</div>
                         <input type="email" name="subscribe_email" id="subscribe_email" placeholder="Email Address"/>
                         <button class="btn" type="button" id="joinsteemhype">Subscribe</button>
                  </div>';
        return $form;
    }

    public function unsubscribe()
    {
        $id = ($_GET['id']) ? $_GET['id'] : '';
        $email = ($_GET['email']) ? $_GET['email'] : '';
        $html = '';
        $html .= '<style>
        .unsubscribecontainer #unsubscribe{
			border-radius: 0px;
			background-color: #292929;
			color: #fff;
			width:100%;
			font-size:16px;
		}
		.unsubscribecontainer{
			width: 100%;
			max-width:350px;
			margin: 0 auto;
			padding:20px;
        }
        .labelunsubscribe{
            font-size:12px;
            margin-bottom:10px;
            text-align:center;
        }
        </style>';
        $html .= '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">';
        $html .= '<script type="text/javascript" src="https://code.jquery.com/jquery-2.2.4.min.js"></script>';
        $html .= '<div class="unsubscribecontainer">
                    <div class="labelunsubscribe">Are you sure you want to unsubscribe?</div>
		            <button class="btn" type="button" id="unsubscribe" data-id="' . $id . '" data-email="' . $email . '">Unsubscribe</button>	
                </div>';
        return $html;
    }
}