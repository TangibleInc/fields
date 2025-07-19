

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": [
    "../assets/src/components/**/*.mdx",
    "../assets/src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-onboarding",
    "@storybook/addon-docs"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  core: {
    builder: '@storybook/builder-vite', // Replace Webpack with Vite
    disableTelemetry: true,
  }
};
export default config;
