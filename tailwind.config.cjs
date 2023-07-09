/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: {
      colorWhite: "var(--colorWhite)",
      colorDark: "var(--colorDark)",
      colorBlue: "var(--colorBlue)",
      colorOrange: "var(--colorOrange)",
      colorGray: "var(--colorGray)",
    },
    fontSize: {
      fontXS: "var(--fontXS)",
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
    extend: {
      animation: {
        fade: "fade-in 2s both",
        slideDown1: "slide-down 0.5s ease-in-out .2s both",
        slideDown2: "slide-down 0.5s ease-in-out .4s both",
        slideDown3: "slide-down 0.5s ease-in-out .6s both",
        slideDown4: "slide-down 0.5s ease-in-out .8s both",
        slideUp1: "slide-up 0.5s ease-in-out 1s both",
        slideUp2: "slide-up 0.5s ease-in-out 1.2s both",
        slideUp3: "slide-up 0.5s ease-in-out 1.4s both",
        slideUp4: "slide-up 0.5s ease-in-out 1.6s both",
        slideRight: "slide-right 0.5s ease-in-out 1.8s both",
      },
    },
  },
  plugins: [],
};
