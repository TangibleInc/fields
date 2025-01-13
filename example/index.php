<?php

namespace Tangible\FieldsExample;

defined('ABSPATH') or die();

use tangible\framework;

$plugin = \tangible\create_object([
  'name'           => 'tangible-field-example',
  'title'          => 'Tangible Field Example',
  'setting_prefix' => 'tangible_field_example',

  'version'        => tangible_fields()->version,
  'file_path'      => __FILE__,
  'base_path'      => plugin_basename( __FILE__ ),
  'dir_path'       => plugin_dir_path( __FILE__ ),
  'url'            => plugins_url( '/', __FILE__ ),
  'assets_url'     => plugins_url( '/../assets', __FILE__ ),
]);

if (!function_exists('tangible_field_example')) {
  function tangible_field_example($instance = false) {
    static $plugin;
    return $plugin ? $plugin : ($plugin = $instance);
  }  
}

tangible_field_example($plugin);

require_once __DIR__ . '/ajax/index.php';
require_once __DIR__ . '/Documentation.php';
require_once __DIR__ . '/register/index.php';
require_once __DIR__ . '/enqueue.php';

framework\register_admin_menu([
  'name' => 'tangible-field-example',
  'title' => 'Fields Example',
  // 'css'  => $plugin->assets_url . '/build/settings.min.css',
  // 'js'   => $plugin->assets_url . '/build/settings.min.js',
  'callback' => function() use ($fields, $plugin) {
        $documentation = Documentation::$instance;
        $plugin->enqueue();

        $current_page = $_GET['type'] ?? 'introduction';
        $current_section = $_GET['section'] ?? 'introduction';

        if( $current_page && $current_section ) {
          $documentation->register_page_fields($current_section, $current_page);
        }

        $current_context = $_GET['context'] ?? 'default';
        $current_page_url = admin_url( sprintf('admin.php?%s', http_build_query($_GET)) ); 
        
        $fields->set_context($current_context); 
        
        ?>
        <form method="POST">
        <script>window.addEventListener('load', () => hljs.highlightAll())</script>
        <div class="tangible-field-example-settings">
        <div class="tf-example-container">
          
          <!-- Sidebar -->
          <div class="tf-example-list">
            
            <!-- Change context select -->
            <strong>Context</strong>
            <div class="tf-context-select-container">
              <select id="tf-context-select">
                <?php foreach( $fields->contexts as $context ): ?>
                  <option value="<?= $context ?>" <?= $context === $current_context ? 'selected' : '' ?>>
                    <?= ucfirst($context) ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </div>

            <!-- Links -->
            <?php foreach($documentation->sections as $section_slug => $section): ?>
              <strong><?= $section['title'] ?></strong>
              <ul>
                <?php foreach($section['pages'] as $slug => $page): ?>
                <li style="<?= $current_page === $slug ? 'font-weight: bold' : '' ?>">
                  <a href="<?= $current_page_url ?>&type=<?= $slug ?>&section=<?= $section_slug ?>">
                    <?= $page['title'] ?>
                  </a>
                </li>
                <?php endforeach; ?>
              </ul>
            <?php endforeach; ?>
          </div>

          <!-- Content -->
          <?php if( !empty($current_page) && !empty($current_section) ): ?>
            <div class="tf-example-field">
              <?php $documentation->require_template($current_section, $current_page)  ?>
            </div>
          <?php endif; ?>
        
        </div>
        </div>
        <form>
        <?php
  }
]);
