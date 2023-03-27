<?php
/**
 * Plugin Name: Tangible Module: Fields
 * Description: React-based custom fields library
 */

require_once __DIR__ . '/index.php';

add_action('admin_menu', function () {

    add_menu_page(
        'Page title in menu',
        'My test page for fields',
        'manage_options', // Only users with the capabilitites to manage_options can access the page
        'test-fields',
        function () {

            // Here will be the content of my page, I can render my fields here 

            $fields = tangible_fields();

?>
        <div>

            <?php echo $fields->render_field('my_field_name', [
                'type'  => 'alignment-matrix',
                'label' => 'Alignment Matrix'
            ]); ?>
        </div>

<?php

        }
    );
});






