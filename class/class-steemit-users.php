<?php
/*
* Table : wp_steemit_users
*
*/
class SteemitUsers{

  function __construct() {

       if(isset($_POST['deleteUsers']) && ($_POST['user_id'] != '')){
             $this->deleteUsers($_POST['user_id']);
        }

       if(isset($_POST['submitUser']) && ($_POST['addSteemitUser'] != '')){
           $this->addUsers($_POST['addSteemitUser']);
       }

   }  

   public function getlastid(){
        global $wpdb;
        $query = "SELECT id_steemit_user FROM wp_steemit_users ORDER BY id_steemit_user DESC LIMIT 1";
        $result = $wpdb->get_row($sql);
        return $result;
   }

     //Get the data from wp_steemit_users table
    public function getData(){
		global $wpdb;
		$sql = 'Select id_steemit_user, account_name, DATE_FORMAT(date_added,"%M %d %Y") as date_added FROM wp_steemit_users';
		$result = $wpdb->get_row($sql);
		return $result;
	}

    //Add users
    public function addUsers($user){
        global $wpdb;
        $wpdb->insert(
            'wp_steemit_users',
            array(
                'account_name' => $user,
            )
        );
        $lastid = $wpdb->insert_id;
        return $lastid;
    }

    //Delete users
    public function deleteUsers($user_id){
        global $wpdb;
        $wpdb->delete( 
            'wp_steemit_users', 
            array( 
                'id_steemit_user' => $user_id, 
            ) 
        );
    }

    //Edit User
    public function editUser($data){
        global $wpdb;
        $lastid = $this->getlastid();
        $wpdb->update(
            'wp_steemit_users',
            array(
                'account_name' => $data
            ),
            array(
                'id_steemit_user' => 1
            )
        );
     }

}

?>