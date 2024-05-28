<?php

namespace Tangible\Fields\Tests;

trait Render {

  /**
   * Needs to define those attribute to be used:
   * string $dynamic_value_slug
   * string $dynamic_value_default_args
   */
  function _render_value($args) {

    $args = array_merge(
      $this->dynamic_value_default_args, 
      $args
    );

    $args_string = array_map(function($key) use($args) {
      return $key . '=' . $args[ $key ];
    }, array_keys($args));

    return tangible_fields()->render_value('[[' . $this->dynamic_value_slug . '::' . implode('::', $args_string) . ']]');
  }

}
