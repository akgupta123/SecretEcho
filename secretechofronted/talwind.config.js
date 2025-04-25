/** @type {import('tailwindcss').Config} */
const config = {
    content: [
      "./app/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        backdropBlur: {
          d: 'blur(5px)',
        },
        colors: {
          primary: "#FFAF00",
          secondary: "#242424",
          bgcolor: "#FFFCFF",
          formlabel: "#242424",
          placeholder: "#D2D6DA",
          bgshipmenttotal: "rgba(241, 216, 161, 0.47)",
          graytext: "#979797",
          bgbox: "#FFAF0014",
          headerbg: "rgba(255, 175, 0, 0.47)",
          containerload: "#C5C9CD",
          bgradiogroup: "#FFAF0078",
          creditcard: "#FFE09D",
          lightBlue: "#F2F7FA",
          lightGrey: "#B5B5C3",
          darkGrey: "#C5C9CD",
        },
        boxShadow: {
          loginbutton: "0px 4px 6px -1px rgba(0, 0, 0, 0.12), 0px 2px 4px -1px rgba(0, 0, 0, 0.12)",
          newuser: "0px 4px 27px 3px rgba(0, 0, 0, 0.05)",
          sidebarbox: "0px 10px 27px 4px rgba(0, 0, 0, 0.05)",
          avtivemenu: "0px 4px 27px 3px rgba(255, 175, 0, 0.08)",
          cardsection: "0px 20px 27px rgba(0, 0, 0, 0.05)",
          searchbox: "0px 4px 6px -1px rgba(0, 0, 0, 0.12), 0px 2px 4px -1px rgba(0, 0, 0, 0.12)",
          editbtn: "0px 4px 6px -1px rgba(0, 0, 0, 0.12), 0px 2px 4px -1px rgba(0, 0, 0, 0.12)",
          creditcard: "0px 0px 20px rgba(94, 98, 120, 0.04)",
          dashboardmaincard: "-3px 3px 50px 5px rgba(0, 0, 0, 0.12)",
          dashboardselect: "0px 0px 40px 0px rgba(0, 0, 0, 0.10)",
        },
        backgroundImage: {
          dashed: "linear-gradient(to right, #333 80%, rgba(255, 255, 255, 0) 20%)",
          formbg: "linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.39) 100%, rgba(255, 255, 255, 0.52) 100%)"
        },
      },
    },
    plugins: [],
  };
  
  module.exports = config;
  