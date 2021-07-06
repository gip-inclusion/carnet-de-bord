const colors = require("tailwindcss/colors");

const config = {
  mode: "jit",
  purge: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Marianne"],
    },
    colors: {
      white: colors.white,
      orange: colors.orange,
      "blue-dora": "#2B5787",
      gray: colors.gray,
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

module.exports = config;
