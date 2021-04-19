<?php
// https://codex.wordpress.org/AJAX_in_Plugins

add_action('admin_enqueue_scripts', function () {
  wp_enqueue_script('ajax', plugin_dir_url(__FILE__) . "ajax.js");
}, 100);


add_action('wp_ajax_address', function () {
  check_ajax_referer('nonce_action', 'security');

  $user_id = get_current_user_id();
  update_user_meta($user_id, 'ADDR', $_POST['address']);

  echo $_POST['address'];
  echo ' => ' . get_user_meta($user_id, 'ADDR')[0];
  wp_die();
});