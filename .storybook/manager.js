import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';
import tangibleTheme from './tangibleTheme';
 
addons.setConfig({
  theme: tangibleTheme,
});