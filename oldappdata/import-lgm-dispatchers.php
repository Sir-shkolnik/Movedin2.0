<?php
// import-lgm-dispatchers.php
// Usage: php import-lgm-dispatchers.php [json_path]
// Updates the LGM vendor's 'dispatchers' post meta with the full dispatcher array from JSON

require_once('/mnt/data/home/1460372.cloudwaysapps.com/tckyfefgub/public_html/wp-load.php');

$json_file = $argv[1] ?? __DIR__ . '/lgm_dispatchers_full.json';
if (!file_exists($json_file)) die('JSON not found: ' . $json_file . "\n");
$dispatchers = json_decode(file_get_contents($json_file), true);
if (!$dispatchers || !is_array($dispatchers)) die("Invalid or empty JSON\n");

// Find LGM vendor by name
$lgm = get_posts([
    'post_type' => 'moving_vendor',
    'meta_key' => 'name',
    'meta_value' => "Let's Get Moving",
    'numberposts' => 1
]);
if (!$lgm) die("LGM vendor not found\n");
$vendor_id = $lgm[0]->ID;

// Update the 'dispatchers' post meta
update_post_meta($vendor_id, 'dispatchers', json_encode($dispatchers));
echo "Updated LGM vendor ID $vendor_id with " . count($dispatchers) . " dispatchers.\n"; 