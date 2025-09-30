import localFont from "next/font/local";

export const lamoonMultiplier = 1.45;

export const lamoon = localFont({
  src: [
    {
      path: "./lamoon/light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./lamoon/light-italic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./lamoon/regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./lamoon/regular-italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./lamoon/bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./lamoon/bold-italic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
});

export default lamoon;
