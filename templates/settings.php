<?php
$users = new SteemitUsers();
$user = $users->getData();
$pluginOptions = new pluginOptions();
$options = $pluginOptions->getAllPluginOptions();
?>
<script type="text/javascript">
  var defaultImage = '<?php echo plugin_dir_url( dirname(__FILE__) ) . 'img/default.gif' ?>';
</script>
  <div>
    <h3>Steem Hype Settings</h3>
  </div>
  <div id="settings_tabs">
    <ul id="settings_tabs_navigation">
      <li class="settings_tabs_li settings_tabs_selected"><a href="#steemit_account">Steemit Account</a></li>
      <li class="settings_tabs_li settings_tabs_selected"><a href="#content_settings">Content</a></li>
      <li class="settings_tabs_li"><a href="#shortcode">Shortcode</a></li>
      <li class="settings_tabs_li"><a href="#email">Email</a></li>
      <li class="settings_tabs_li"><a href="#license">Subscription</a></li>
    </ul>

    <div id="steemit_account">
      <div class="addUserContainer">
        <div>
          <h4>Steemit Account Settings</h4>
          <p>All with <span class="text-danger">*</span> are required.</p>
          <p>NOTE: This will be the Steemit author of the feeds that will be retrieving by the plugin. Please remove the @ sign, example "ned".</p>
        </div>
        <div>
          <p class="label">Steemit Account Name<span class="text-danger">*</span>
          <div>
              <input placeholder="Account Name" type="text" class="data_input" data-name="steem_user" value="<?php echo $user->account_name ?>" />
              <span data-name="steem_user" data-action="<?php echo ($user->id_steemit_user) != '' ? 'submit-edit' : 'add' ?>" id="submit_key_steem_user" class="submit_key glyphicon addData glyphicon-ok"></span>
          </div>
        </div>
      </div>
    </div>

    <div id="content_settings">
      <div class="layoutheader">
        <h4>Content Settings</h4>
        <p>All with <span class="text-danger">*</span> are required.</p>
        <p>NOTE: This is the content configuration for each Steemit Feeds in your Wordpress page / post.</p>
      </div>

      <!-- Show Image -->
      <div class="options_div">
        <p class="label option_label">Show Steemit Feed Image</p>
        <label class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input optionSwitch hide" data-name="show_image" <?php echo ($options['show_image']) == 1 ? 'checked' : ''; ?> />
          <span class="custom-control-indicator"></span>
        </label>
      </div>

      <div class="options_div">
        <div class="label option_label">Image Size</div>

        <div class="btn-group" data-toggle="buttons">
          <label class="btn btn-primary <?php echo ($options['image_size'] == 'small') ? 'active' : ''; ?>">
            <input type="radio" name="image_size" id="image_size" value="small"> Small
          </label>
          <label class="btn btn-primary <?php echo ($options['image_size'] == 'large') ? 'active' : ''; ?>">
            <input type="radio" name="image_size" id="image_size" value="large"> Large
          </label>
        </div>
      </div>

      <!-- Show Title-->
      <div class="options_div">
        <p class="label option_label">Show Steemit Feed Title</p>
        <label class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input hide optionSwitch" data-name="show_title" <?php echo ($options['show_title']) == 1 ? 'checked' : ''; ?> />
          <span class="custom-control-indicator"></span>
        </label>
      </div>

      <!-- Title Limit-->
      <div class="options_div">
        <p class="label option_label">Title Character Limit<span class="text-danger">*</span></p>
        <input type="text" maxlength="3" class="data_input layout_input numeric" data-name="title_limit" value="<?php echo $options['title_limit'] ?>" />
      </div>

      <!-- Show Description-->
      <div class="options_div">
        <p class="label option_label">Show Description</p>
        <label class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input optionSwitch hide" data-name="show_description" <?php echo ($options['show_description']) == 1 ? 'checked' : ''; ?> />
          <span class="custom-control-indicator"></span>
        </label>
      </div>

      <!-- Description Limit-->
      <div class="options_div">
        <p class="label option_label">Description Character Limit<span class="text-danger">*</span></p>
        <input type="text" maxlength="3" class="data_input layout_input numeric" data-name="description_limit" value="<?php echo $options['description_limit'] ?>" />
      </div>

      <!-- Show Author -->
      <div class="options_div">
        <p class="label option_label">Show Author</p>
        <label class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input optionSwitch hide" data-name="show_author" <?php echo ($options['show_author']) == 1 ? 'checked' : ''; ?> />
          <span class="custom-control-indicator"></span>
        </label>
      </div>

      <!-- Show Category -->
      <div class="options_div">
        <p class="label option_label">Show Category</p>
        <label class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input optionSwitch hide" data-name="show_category" <?php echo ($options['show_category']) == 1 ? 'checked' : ''; ?> />
          <span class="custom-control-indicator"></span>
        </label>
      </div>

      <!-- Show Tags -->
      <div class="options_div">
        <p class="label option_label">Show Tags</p>
        <label class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input optionSwitch hide" data-name="show_tags" <?php echo ($options['show_tags']) == 1 ? 'checked' : ''; ?> />
          <span class="custom-control-indicator"></span>
        </label>
      </div>

      <!-- Show Date Posted-->
      <div class="options_div">
        <p class="label option_label">Show Date Posted</p>
        <label class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input optionSwitch hide" data-name="date_posted" <?php echo ($options['date_posted']) == 1 ? 'checked' : ''; ?> />
          <span class="custom-control-indicator"></span>
        </label>
      </div>

       <!-- Font Size -->
       <div class="options_div">
        <p class="label option_label">Title Font Size<span class="text-danger">*</span></p>
        <input type="text" maxlength="3" class="data_input layout_input numeric" data-name="title_font_size" value="<?php echo $options['title_font_size'] ?>" />
      </div>

      <!-- Body Font Size -->
      <div class="options_div">
        <p class="label option_label">Body Font Size<span class="text-danger">*</span></p>
        <input type="text" maxlength="3" class="data_input layout_input numeric" data-name="body_font_size" value="<?php echo $options['body_font_size'] ?>" />
      </div>

      <!-- Author Font Size -->
      <div class="options_div">
        <p class="label option_label">Author Font Size<span class="text-danger">*</span></p>
        <input type="text" maxlength="3" class="data_input layout_input numeric" data-name="author_font_size" value="<?php echo $options['author_font_size'] ?>" />
      </div>

      <!-- Category Font Size -->
      <div class="options_div">
        <p class="label option_label">Category Font Size<span class="text-danger">*</span></p>
        <input type="text" maxlength="3" class="data_input layout_input numeric" data-name="category_font_size" value="<?php echo $options['category_font_size'] ?>" />
      </div>

      <!-- Tag Font Size -->
      <div class="options_div">
        <p class="label option_label">Tags Font Size<span class="text-danger">*</span></p>
        <input type="text" maxlength="3" class="data_input layout_input numeric" data-name="tag_font_size" value="<?php echo $options['tag_font_size'] ?>" />
      </div>

      <!-- Date Font Size -->
      <div class="options_div">
        <p class="label option_label">Date Posted Font Size<span class="text-danger">*</span></p>
        <input type="text" maxlength="3" class="data_input layout_input numeric" data-name="date_font_size" value="<?php echo $options['date_font_size'] ?>" />
      </div>

      <!-- Layout Type -->
      <div class="options_div">
        <p class="label option_label">Layout Type</p>
        <p class="margin-0">List Layout: Steemit feed image is located at the left part, and the body is located at the right part.</p>
        <p>Card Layout: Steemit feed image is located at the top, and the body is located at the bottom.</p>
        <div class="btn-group" data-toggle="buttons">
          <label class="btn btn-primary <?php echo ($options['layout_type'] == 'list') ? 'active' : ''; ?>">
            <input type="radio" name="layout_type" id="layout_type" value="list"> List
          </label>
          <label class="btn btn-primary <?php echo ($options['layout_type'] == 'card') ? 'active' : ''; ?>">
            <input type="radio" name="layout_type" id="layout_type" value="card"> Card
          </label>
        </div>
      </div>

      <!-- Save or Edit Button -->
      <div class="options_div">
        <span data-action="submit-edit" class="submit_key glyphicon addData glyphicon-ok"></span>
      </div>

    </div>

    <div id="shortcode">
      <div>
        <h4>Shortcode</h4>
        <p>NOTE: These are the following Steem Hype shortcodes that provides different features for your Wordpress website. Copy and paste these shortcodes to a Wordpress page.</p>
        <p class="label">Display list of Steemit feed shared via Web</p>
        <p>[steemhype]</p>
        <p class="label">Filter Steemit feed shared via Web by adding the following parameter to the shortcode.</p>
        <p>[steemhype author="author name (without @ sign)" category="category" tags="tag1 tag2 (space separated)"]</p>
        <p class="label">This shortcode will add a subscribe form to a Wordpress page. Subscribers will received Steemit feeds shared via email.</p>
        <p>[steemhypesubscribe]</p>
      </div>
    </div>

    <div id="email">
      <div class="emailheader">
        <h4>Email Template Settings</h4>
        <p>All with <span class="text-danger">*</span> are required.</p>
        <p>Arrange the layout by dragging each email panels.</p>
        <p>NOTE: This is the layout configuration for the email template of Steem Hype email sharing.</p>
      </div>
      
      <p class="label option_label">Email From Name<span class="text-danger">*</span></p>
      <input type="text" placeholder="To be displayed From Name" class="data_input email_input" data-name="email_from_name" value="<?php echo $options['email_from_name'] ?>" />

      <div style="background-color: #f6f6f6;min-height: 500px;padding: 5% 0;margin-top:10px">
      <div id="cont" style="max-width: 580px;margin: 0px auto;background-color:#fff;padding:15px;">
      <?php
      $layoutOptions = $options['email_layout'];

      foreach ($layoutOptions as $layoutOption) {
        switch ($layoutOption) {
          case 'logo':
            echo '<div class="layout_div logo" data-id="logo"><span><a class="remove-logo"><i class="fa fa-trash" aria-hidden="true"></i></a></span><div style="background:url(' . $options["email_logo"] . ')"><a class="email-logo" style="line-height: 100px;text-align: center;">Upload website logo here: 528x100</a><input type="file" id="target" class="hide" accept="image/*"  /></div></div>';
            break;
          case 'title':
            echo '<div class="layout_div" data-id="title"><p class="title">Steemit Feed Title</p></div>';
            break;
          case 'image':
            echo '<div class="layout_div" data-id="image"><div class="image"><p>Steemit Feed Image </p></div></div>';
            break;
          case 'description':
            echo '<div class="layout_div" data-id="description"><p class="description">Steemit Feed Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p></div>';
            break;
          case 'email_content':
            echo '<textarea placeholder="Type email content here" data-id="email_content"class="data_input layout_div email_text margin-bottom-0 margin-top-0" data-name="email_text">' . $options["email_text"] . '</textarea>';
            break;

        }
      }
      ?>
      </div>
      </div>
      <div class="options_div">
        <span data-action="submit-edit" class="submit_key glyphicon addData glyphicon-ok"></span>
      </div>
    </div>

    <div id="license">
      <div class="addLicense">
        <div>
          <h4>Subscription</h4>
          <p>NOTE: Subscription can be found at <a href="https://signalssoftware.com/steem-hype/">https://signalssoftware.com/steem-hype/</a>.</p>
        </div>
        <div class="license-form <?php echo ($options['license_activation_email'] != '') ? 'hide' : '' ?>">
          <div class="options_div">
            <p class="label option_label">Subscription Email Address<span class="text-danger">*</span></p>
            <input type="text" placeholder="Email address" class="data_input" data-name="license_activation_email" value="<?php echo $options['license_activation_email'] ?>" />
          </div>
          <!-- <div class="options_div">
            <p class="label option_label">License Key<span class="text-danger">*</span></p>
            <input type="text" placeholder="Valid license key" class="data_input" data-name="license_key" value="<?php echo $options['license_key'] ?>" />
          </div> -->
          <div class="options_div">
            <span class="submit_license glyphicon addData glyphicon-ok"></span>
          </div>
        </div>
        <div class="license-activation <?php echo ($options['license_activation_email'] == '') ? 'hide' : '' ?>">
          <p class="license-text"><?php echo ($options['license_activation_email'] != '') ? $options['license_activation_email'] : '' ?><span class="glyphicon glyphicon-remove red delete-license <?php echo ($options['license_activation_date'] != '') ? 'hide' : '' ?>"></span></p>
          <a class="activate-link" data-action="<?php echo ($options['license_activation_date'] != '') ? 'deactivate' : 'activate' ?>" data-activationEmail="<?php echo ($options['license_activation_email'] != '') ? $options['license_activation_email'] : '' ?>"><?php echo ($options['license_activation_date'] != '') ? 'Deactivate Subscription' : 'Activate Subscription' ?></a>
        </div>
      </div>     
    </div>
  </div>