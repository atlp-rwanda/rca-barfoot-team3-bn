const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  directory: `${__dirname}/./locales/`,
  queryParameter: 'lang'
});

module.exports = i18n;
