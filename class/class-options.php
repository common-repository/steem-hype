<?php
/*
* Table : wp_steemhype_options
*
*/
class pluginOptions{
    function __construct() {}
    
    public function getPluginOptions(){
        global $wpdb;
        $sql = 'SELECT option_name, value FROM wp_steemhype_options';
        $result = $wpdb->get_results($sql);
        return $result;
    }

    public function addPluginOption($data){ 
        global $wpdb; 
         foreach($data as $key => $value){ 
            if($key != 'action'){ 
                 $wpdb->insert( 
                    'wp_steemhype_options', 
                    array( 
                        'option_name' => $key, 
                        'value' => $value 
                    ) 
                ); 
            } 
         } 
     } 
 
     public function editPluginOption($data){ 
        global $wpdb; 
        foreach($data as $key => $value){ 
            if($key != 'action'){ 
                $wpdb->update( 
                    'wp_steemhype_options', 
                    array( 
                        'value' => $value 
                    ), 
                    array( 
                        'option_name' => $key 
                    ) 
                );         
            } 
        } 
     } 

    public function getAllPluginOptions(){
        global $wpdb;
        $sql = 'SELECT option_name, value FROM wp_steemhype_options';
        $result = $wpdb->get_results($sql);
        $arrOptions = array();
        foreach($result as $key => $item){
            $arrOptions[$item->option_name] = $item->value;
            if($item->option_name == 'email_layout'){
                $explodeVal = explode(',',$item->value);
                $arrOptions[$item->option_name] = $explodeVal;
            }
        }
        return $arrOptions;
    }
}

?>