<script type="text/javascript">
  <?php
    $page = $_GET['page'];
    $emailsubscribers = new Subscribers();
    $subscriber = $emailsubscribers->getAllActiveSubscribers();
    $pluginOptions = new pluginOptions();
    $alloptions = $pluginOptions->getAllPluginOptions();
  ?>

  var page = '<?php echo  $page; ?>';
  var subscribers = '<?php echo json_encode($subscriber); ?>';
  var allOptionData = '<?php echo json_encode($alloptions); ?>';
  allOptionData = JSON.parse(allOptionData);
  
</script>
<div id="archiveFeeds">
  <div>
    <h3>Archived Steemit Feeds</h3>
  </div>
  <div id="feedsTab">
    <table class="table">
      <thead>
        <tr>
          <th style="width:80px;">Image</th>
          <th style="width:240px;">Feed Title</th>
          <th style="width:105px;">Author</th>
          <th style="width:110px;">
            Facebook
            <p>Share on Facebook</p>
          </th>
          <th style="width:110px;">
            Twitter
            <p>Share on Twitter</p>
          </th>
          <th style="width:110px;">
            Email
            <p>Share on Email</p>
          </th>
          <th style="width:110px;">
            Date Shared
          </th>
          <th style="width:150px;">
            Web
            <p>Add to Steem Hype shortcode</p>
          </th>
          <th style="width:150px;">
            Share
            <p>Activate atleast one channel to share</p>
          </th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
    <p class="text-center">
      <div class="load"></div>
    </p>
  </div>
</div>