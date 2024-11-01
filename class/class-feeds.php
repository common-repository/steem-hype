<?php

class Feeds
{

    function __construct()
    {
    }

    public function insertFeed($postData)
    {
        global $wpdb;

        $feed_id = $postData['id'];
        $author = $postData['author'];
        $imgsrc = $postData['imgsrc'];
        $permlink = $postData['permlink'];
        $creationDate = $postData['creation_date'];
        $description = $postData['description'];
        $value = $postData['value'];
        $socialmedia = $postData['sharemedia'];
        $url = $postData['url'];
        $title = $postData['title'];
        $category = $postData['category'];
        $tags = $postData['tags'];
        $exist = $this->checkifexist($feed_id);
        $date_shared = date('Y-m-d H:i:s');

        if (isset($feed_id) && $feed_id != '' && $exist->count == 0) {
            $wpdb->insert(
                'wp_steemit_feeds',
                array(
                    'steemit_id' => $feed_id,
                    'title' => $title,
                    'author' => $author,
                    'imgsrc' => $imgsrc,
                    'permlink' => $permlink,
                    'url' => $url,
                    'creation_date' => $creationDate,
                    'description' => $description,
                    'category' => $category,
                    'tags' => $tags
                )
            );
        }

        $shareswitch = new SharedSwitch();
        $shareswitch->addSwitch($socialmedia, $feed_id, $date_shared);

    }

    public function getAllWebSharedFeeds($params)
    {

        global $wpdb;
        
        //Create where functions for parameters
        $where = '';
        $wcount = count($params);
        $counter = 1;
        $counter2 = 1;

        if (isset($params) && $params != '') {
            $where = 'AND ';
            foreach ($params as $k => $v) {
                $arrParams = explode(',', $v);
                $countParams = count($arrParams);
                if (isset($arrParams) && $arrParams != '' && $countParams > 1) {
                    $where .= '(';
                    foreach ($arrParams as $key => $item) {
                        $where .= $k . " LIKE '%" . $item . "%'";
                        if ($counter2 < $countParams) {
                            $where .= ' OR ';
                        }
                        $counter2++;
                    }
                    $where .= ')';
                } else {
                    $where .= $k . " LIKE '%" . $v . "%'";
                    if ($counter < $wcount) {
                        $where .= ' AND ';
                    }
                    $counter++;
                }
            }
        }

        $query = 'SELECT WF.steemit_id as id, title, author, imgsrc as imagesrc, permlink, url, description, creation_date, category, tags
        FROM wp_steemit_feeds WF
        LEFT JOIN wp_shared_steemit_feeds WS on (WF.steemit_id = WS.steemit_id)
        WHERE WS.share_web = 1 ' . $where . '
        GROUP BY WF.steemit_id';

        $result = $wpdb->get_results($query);
        $sharedweb = array();
        foreach ($result as $key => $val) {
            $web = $this->getLatestWebValue($val->id);
            if ($web == 1) {
                $sharedweb[] = $val;
            }
        }
        return $sharedweb;
    }

    public function checkifexist($feed_id)
    {
        global $wpdb;
        $query = 'SELECT COUNT(*) as count FROM wp_steemit_feeds WHERE steemit_id ="' . $feed_id . '"';
        $result = $wpdb->get_row($query);
        return $result;
    }

    public function deleteFeeds($feedId)
    {
        global $wpdb;
        $wpdb->delete(
            'wp_steemit_feeds',
            array('steemit_id' => $feedId)
        );
    }

    public function getAllSharedFeeds($postData)
    {
        global $wpdb;
        $query = 'SELECT *, MAX( wp_shared_steemit_feeds.date_added ) AS date_shared FROM `wp_steemit_feeds` LEFT JOIN wp_shared_steemit_feeds ON wp_steemit_feeds.steemit_id = wp_shared_steemit_feeds.steemit_id GROUP BY wp_steemit_feeds.steemit_id ORDER BY date_shared DESC LIMIT ' . $postData['limit'] . ' OFFSET ' . $postData['offset'] . '';
        $results = $wpdb->get_results($query);
        foreach ($results as $value) {
            $query = 'SELECT * FROM wp_shared_steemit_feeds WHERE steemit_id="' . $value->steemit_id . '"';
            $result = $wpdb->get_results($query);
            $value->share = $result;
            $queryCount = 'SELECT * FROM wp_steemit_feed_clicks WHERE steemit_id="' . $value->steemit_id . '"';
            $resultCount = $wpdb->get_results($queryCount);
            $value->count = $resultCount;
        }
        return $results;
    }

    public function getLatestWebValue($steemit_id)
    {
        global $wpdb;
        $query = 'SELECT `share_web` 
        FROM `wp_shared_steemit_feeds` 
        WHERE `steemit_id` = ' . (int)$steemit_id . ' 
        ORDER BY id DESC LIMIT 1';
        $result = $wpdb->get_var($query);

        return $result;
    }

    public function countSharedFeed()
    {
        global $wpdb;
        $query = 'SELECT Sum(CASE WHEN `share_fb` <> 0 THEN 1 ELSE 0 END) AS Facebook, Sum(CASE WHEN `share_twitter` <> 0 THEN 1 ELSE 0 END) AS Twitter, Sum(CASE WHEN `share_email` <> 0 THEN 1 ELSE 0 END) AS Email, (SELECT SUM(`share_web`) FROM ( SELECT * FROM wp_shared_steemit_feeds where id in (select max(id) from wp_shared_steemit_feeds group by steemit_id)) max_record) AS Web FROM wp_shared_steemit_feeds';
        $results = $wpdb->get_results($query);

        return $results;
    }

    public function countClickFeed($postData)
    {
        global $wpdb;
        date_default_timezone_set('Asia/Manila');

        $now = date('Y-m-d');
        $query = 'SELECT id, clicks AS clicks FROM wp_steemit_feed_clicks WHERE steemit_id = "' . $postData['steemit_id'] . '" AND date_added= "' . $now . '"';
        $results = $wpdb->get_results($query);
        $clickCount = $results[0]->clicks;
        
        if ($clickCount > 0) {
            $clickCount += 1;
            $wpdb->update(
                'wp_steemit_feed_clicks',
                array(
                    'clicks' => $clickCount,
                ),
                array(
                    'id' => $results[0]->id,
                )
            );
        } else {
            $clickCount = 1;
            $wpdb->insert(
                'wp_steemit_feed_clicks',
                array(
                    'steemit_id' => $postData['steemit_id'],
                    'clicks' => $clickCount,
                    'date_added' => $now
                )
            );
        }

        return true;
    }

    public function getClickedFeed($postData){
        global $wpdb;
        date_default_timezone_set('Asia/Manila');

        $query = 'SELECT * FROM `wp_steemit_feed_clicks` WHERE date_added >= "'.$postData['start_date'].'" AND date_added <= "'.$postData['end_date'].'"'; 
        $results = $wpdb->get_results($query);

        return $results;
    }

}