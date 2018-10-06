module.exports = {
  plugins: [
    require('stylelint'),
    require('autoprefixer'),
    require('postcss-flexbugs-fixes'),
    require('cssnano')({
      preset: 'default',
    }),
    require('postcss-reporter')({ clearMessages: true }),
  ],
};
