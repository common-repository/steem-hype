<script type="text/javascript">
   <?php
      $pluginOptions = new pluginOptions();
      $alloptions = $pluginOptions->getAllPluginOptions();
      ?>
   
   var allOptionData = '<?php echo json_encode($alloptions); ?>';
   allOptionData = JSON.parse(allOptionData);
   
</script>
<div>
   <h3>Analytics</h3>
</div>
<div class="container-fluid" style="padding-left:0px;">
   <div class="warnings"></div>
   <div id="analytics" class="row charts hide">
      <div class="col-md-6 col-sm-12 col-xs-12 margin-bottom-5" style="padding-right:7px">
         <div class="col">
            <h4 class="text-center">Shared Steemit Feed Count</h4>
            <p class="label text-center">Number of Steemit Feeds Shared using the plugin</p>
            <div id="shared-count"></div>
         </div>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12 margin-bottom-5" style="padding-left:7px">
         <div class="col">
            <h4 class="text-center">Subscribers Count</h4>
            <p class="label text-center">Number of Subscribers using the plugin</p>
            <p class="number-icon"><i class="fa fa-users fa-4" aria-hidden="true"></i></p>
            <div class="row">
               <div class="col-md-6 col-sm-12 col-xs-12">
                  <h5 class="text-center detail-label">Active</h5>
                  <p class="text-center details-text" id="active-count"></p>
               </div>
               <div class="col-md-6 col-sm-12 col-xs-12">
                  <h5 class="text-center detail-label">In-Active</h5>
                  <p class="text-center details-text" id="inactive-count"></p>
               </div>
            </div>
         </div>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12 margin-bottom-5">
         <div class="col">
            <h4 class="text-center">Click Counts</h4>
            <p class="label text-center">Number of Steemit Feeds clicked in the plugin shortcode</p>
            <div class="col-md-6 col-sm-12 col-xs-12">
               <input type="text" name="daterange" id="date-range" value="" placeholder="Date" />
            </div>
            <div class="row">
               <div class="col-md-12 col-sm-12 col-xs-12">
                  <div id="count-line" style="height: 310px;"></div>
               </div>
            </div>
         </div>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12">
         <div class="col analytics-table">
            <table class="table margin-0">
               <thead>
                  <tr>
                     <th style="width:240px;">Feed Title</th>
                     <th style="width:105px;">Author</th>
                     <th style="width:105px;">Clicks</th>
                     <th style="width:105px;">Steemit Comments</th>
                     <th style="width:105px;">Steemit Up-Votes</th>
                     <th style="width:105px;">Social Media</th>
                     <th style="width:110px;">
                        <i class="fa fa-thumbs-up count-type"></i>
                        <p>Like</p>
                     </th>
                     <th style="width:110px;">
                        <i class="fa fa-share-square count-type"></i>
                        <p>Share</p>
                     </th>
                     <th style="width:110px;">
                        <i class="fa fa-comment count-type"></i>
                        <p>Comments</p>
                     </th>
                     <th style="width:170px;">
                        Date Shared
                     </th>
                  </tr>
               </thead>
               <tbody>
               </tbody>
            </table>
            <div class="load"></div>
         </div>
      </div>
   </div>
</div>