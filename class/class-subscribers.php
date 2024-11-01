<?php

class Subscribers{
    
    function __construct() {
    }

    public function insertSubscriber($postdata){
        global $wpdb;
        $email = $postdata['email'];
        $status = 1;
        $exist = $this->checkifexist($email);
        $date = date('Y-m-d H:i:s');
        if(isset($email) && $email != '' && $exist->count == 0){
            $wpdb->insert(
                    'wp_steemhype_subscribers',
                array(
                    'email' => $email,
                    'date_added' => $date,
                    'status' => $status,
                )
            );
            $inserted = $wpdb->insert_id;
            return $inserted;
        }
    }

    public function checkifexist($email){
        global $wpdb;
        $query = 'SELECT COUNT(*) as count FROM wp_steemhype_subscribers WHERE email ="'.$email.'" AND status = 1';
        $result = $wpdb->get_row($query);
        return $result;
    }

    public function getAllSubscribers($postData){
        global $wpdb;
        $query = 'SELECT id, email, status,DATE_FORMAT(date_added,"%m-%d-%Y") as date_added 
                  FROM wp_steemhype_subscribers 
                  ORDER BY date_added DESC LIMIT '.$postData['limit'].' OFFSET '.$postData['offset'].'';
        $result = $wpdb->get_results($query);
        return $result;
    }

    public function updateSubscribe($params){
        global $wpdb;
        $id = $params['id'];
        $value = $params['value'];
        $email = $params['email'];
        $validate = $this->validateunsubscribe($id,$email);
        $succ = 0;
        if($validate->count > 0){
            $wpdb->update( 
                'wp_steemhype_subscribers', 
                array( 
                    'status' => $value 
                ), 
                array( 
                    'id' => $id,
                    'email' => $email 
                ) 
            );
            echo json_encode(1);
            exit; 
        }else{
            echo json_encode(0);
            exit; 
        }
    }

    public function validateunsubscribe($id,$email){
        global $wpdb;
        $query = 'SELECT COUNT(*) as count FROM wp_steemhype_subscribers WHERE id = '.$id.' AND email ="'.trim($email).'"';
        $result = $wpdb->get_row($query);
        return $result;
    }

    public function getAllActiveSubscribers(){
        global $wpdb;
        $siteurl = get_site_url();
        $query = 'SELECT id,email
                  FROM wp_steemhype_subscribers WHERE status = 1
                  ORDER BY date_added DESC';
        $result = $wpdb->get_results($query);
        $subscriber = array();
        foreach($result as $key => $val){
            $subscriber[$key]['email_address'] = $val->email;
            $subscriber[$key]['unsubscribe_link'] = $siteurl.'/action?unsubscribe=true&id='.$val->id.'&email='.$val->email;
        }
        return $subscriber;
    }

    public function subscriberCount(){
        global $wpdb;
        $query = 'SELECT SUM(CASE WHEN `status` = 1 THEN 1 ELSE 0 END) AS active, SUM(CASE WHEN `status` = 0 THEN 1 ELSE 0 END) AS inactive FROM wp_steemhype_subscribers';
        $results = $wpdb->get_results($query); 
        return $results; 
    }
}