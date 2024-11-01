<?php
    $pluginOptions = new pluginOptions();
    $users = new SteemitUsers();
    $sharedswitch = new SharedSwitch();
    
    $options = $pluginOptions->getPluginOptions();
    $alloptions = $pluginOptions->getAllPluginOptions();
    $user = $users->getData();
    $sharedStatus = $sharedswitch->getAllValues();
    $page = $_GET['page'];

    $emailsubscribers = new Subscribers();
    $subscriber = $emailsubscribers->getAllActiveSubscribers();
  ?>
<script type="text/javascript" src="http://platform.linkedin.com/in.js?async=true"></script>
<script type="text/javascript">
  var options = {};
  
  <?php
    $pluginOptions = new pluginOptions();
    $users = new SteemitUsers();
    $sharedswitch = new SharedSwitch();
    
    $options = $pluginOptions->getPluginOptions();
    $alloptions = $pluginOptions->getAllPluginOptions();
    $user = $users->getData();
    $sharedStatus = $sharedswitch->getAllValues();
    $page = $_GET['page'];

    $emailsubscribers = new Subscribers();
    $subscriber = $emailsubscribers->getAllActiveSubscribers();
  ?>
  
  var optionData = '<?php echo json_encode($options); ?>';
  var allOptionData = '<?php echo json_encode($alloptions); ?>';
  var userData = '<?php echo json_encode($user); ?>';
  var sharedStatus = '<?php echo  $sharedStatus; ?>';
  var defaultImage = '<?php echo plugin_dir_url( dirname(__FILE__) ) . 'img/default.gif' ?>';
  var page = '<?php echo $page; ?>';

  //Universal Variable
  var subscribers = '<?php echo json_encode($subscriber); ?>';
  var unsubscribelinks = '<?php echo json_encode($unsubscribelink); ?>';
  
  optionData = JSON.parse(optionData);
  allOptionData = JSON.parse(allOptionData);
  userData = JSON.parse(userData);

  _.map(optionData, function(data) {
    options[data.options_name] = data.value;
  });
  
  if(userData != null){
    options['steem_user'] = userData.account_name;
  }

</script>
<div id="pendingFeeds">
  <div>
      <h3>Pending Steemit Feeds</h3>
  </div>
  <div id="feedsTab">
    <div class="warnings"></div>
    <table class="table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Feed Title</th>
          <th>Author</th>
          <th>
            Date Posted
          </th>
          <th>
            Share
            <p>Activate atleast one channel to share</p>
          </th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p class="text-center">
      <div class="load"></div>
    </p>
  </div>
</div>
