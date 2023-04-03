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
                // 'type'       => 'repeater',
                // 'name'  => 'my_field', 
                // // 'layout'     => 'block',
                // 'wrapper' => [
                //     'class'       => 'abc',
                //     'data-attr1'  => 'test1',
                //     'data-attr2'  => 'test2',
                // ],
                // 'sub_fields' => [
                //     [
                //         'type'  => 'text',
                //         'label' => 'Description of the last field abc',
                //         'name'  => 'field-descrption',
                //         'wrapper' => [
                //             'class'       => 'def',
                //             'data-attr1'  => 'test1',
                //             'data-attr2'  => 'test2',
                //         ],
                //     ],
                //     [
                //         'type'    => 'select',
                //         'label'   => 'Post type of the ajax result of the last field',
                //         'name'    => 'field-post-type',
                //         'choices' => [
                //             'post' => 'Post',
                //             'page' => 'Page',
                //         ],
                //     ]
                // ]


                // 'type' => 'text',
                // 'label' => 'my text',
                // 'wrapper' => [
                //     'class'       => 'custom-class-name',
                //     'data-attr1'  => 'test1',
                //     'data-attr2'  => 'test2',
                // ],

                'label'   => 'Text field',
                'type'    => 'field_group',
                'wrapper' => [
                    'class'       => 'custom-class-name',
                    'data-attr1'  => 'test1',
                    'data-attr2'  => 'test2',
                ],
                'fields'  => [

                    // Can be any type of field, just make sure to add a name

                    [
                        'label'   => 'Text',
                        'type'    => 'text',
                        'name'    => 'text_name',
                        'wrapper' => [
                            'class'       => 'custom-class-name',
                            'data-attr1'  => 'test1',
                            'data-attr2'  => 'test2',
                        ],
                    ], [
                        'label'   => 'Text',
                        'type'    => 'dimensions',
                        'name'    => 'dimension_name',
                    ]
                ]
            ]); ?>
        </div>

<?php

        }
    );
});
