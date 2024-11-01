<?php

class SharedSwitch
{

    public function addSwitch($socialMedia, $steemitid, $creationdate)
    {
        global $wpdb;


        $fb = $socialMedia['facebook'];
        $twitter = $socialMedia['twitter'];
        $linkedin = $socialMedia['linkedin'];
        $web = $socialMedia['web'];
        $email = $socialMedia['email'];

        $fbPostId = $socialMedia['facebook_post_id'];
        $linkedinPostId = $socialMedia['linkedin_post_id'];
        $twitterPostId = $socialMedia['twitter_post_id'];

        $insertArr = array(
            'steemit_id' => $steemitid,
            'share_fb' => (!isset($fb) || is_null($fb)) ? 0 : $fb,
            'share_twitter' => (!isset($twitter) || is_null($twitter)) ? 0 : $twitter,
            'share_linkedin' => (!isset($linkedin) || is_null($linkedin)) ? 0 : $linkedin,
            'share_web' => (!isset($web) || is_null($web)) ? 0 : $web,
            'share_email' => (!isset($email) || is_null($email)) ? 0 : $email,
            'facebook_post_id' => (!isset($fbPostId) || is_null($fbPostId)) ? 0 : $fbPostId,
            'linkedin_post_id' => (!isset($linkedinPostId) || is_null($linkedinPostId)) ? 0 : $linkedinPostId,
            'twitter_post_id' => (!isset($twitterPostId) || is_null($twitterPostId)) ? 0 : $twitterPostId,
            'date_added' => $creationdate
        );

        $wpdb->insert(
            'wp_shared_steemit_feeds',
            $insertArr
        );
        return $wpdb->insert_id;

    }

    public function getAllValues()
    {
        global $wpdb;
        $query = 'SELECT id, steemit_id, share_fb, share_linkedin, share_twitter, share_web FROM wp_shared_steemit_feeds';
        $result = $wpdb->get_results($query);
        $jsonResults = json_encode($result);
        return $jsonResults;
    }
}