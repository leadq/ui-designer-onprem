// The SDK supplies the parser, plugins and baseline rules during dev/build.
module.exports = {
  root: true,
  ignorePatterns: ['src/adapters/**', 'archive/**', 'build/**', 'node_modules/**'],
  overrides: [{
    files: ['src/**/*.{ts,tsx}'],
    rules: { 'no-console': 'off' },
  }, {
    files: ['src/components/**/*.{ts,tsx}', 'src/pages/**/*.{ts,tsx}', 'src/App.tsx'],
    excludedFiles: ['src/components/common/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@mantine/core', '@mui/material', '@mui/material/*', 'antd', 'antd/*'],
          message: 'Editor UI must use components/common; authored libraries belong in adapters.',
        }],
      }],
      'no-restricted-syntax': ['error', {
        selector: 'JSXOpeningElement[name.name=/^(button|input|select|textarea)$/]',
        message: 'Use the shared control from components/common.',
      }],
    },
  }],
};
