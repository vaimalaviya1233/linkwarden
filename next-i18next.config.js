/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "it", "fr", "zh", "uk"],
  },
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
