/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: {
      colorWhite: "var(--colorWhite)",
      colorDark: "var(--colorDark)",
      colorBlue: "var(--colorBlue)",
      colorOrange: "var(--colorOrange)",
    },
    fontSize: {
      fontS: "var(--fontS)",
      fontM: "var(--fontM)",
      fontL: "var(--fontL)",
      fontXL: "var(--fontXL)",
      fontXXL: "var(--fontXXL)",
      fontXXL2: "var(--fontXXL2)",
    },
    fontFamily: {
      poppinsReg: "var(--poppinsReg)",
      poppinsBold: "var(--poppinsBold)",
    },
    extend: {},
  },
  plugins: [],
};
