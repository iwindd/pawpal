export const postcssConfig = {
  plugins: {
    "postcss-preset-mantine": {},
    "postcss-simple-vars": {
      variables: {
        "mantine-breakpoint-xs": "36em", // ~576px: โทรศัพท์มือถือแนวนอน (Landscape Mobile) หรือแท็บเล็ตขนาดเล็กมาก
        "mantine-breakpoint-sm": "48em", // ~768px: แท็บเล็ตแนวตั้ง (iPad Portrait)
        "mantine-breakpoint-md": "62em", // ~992px: แท็บเล็ตแนวนอน (iPad Landscape) หรือ แล็ปท็อปขนาดเล็ก
        "mantine-breakpoint-lg": "75em", // ~1200px: แล็ปท็อปขนาดมาตรฐาน (Laptop) หรือ หน้าจอคอมพิวเตอร์ทั่วไป (Desktop)
        "mantine-breakpoint-xl": "88em", // ~1408px: หน้าจอเดสก์ท็อปขนาดใหญ่ (Large Monitor / iMac)
        "mantine-breakpoint-2xl": "88em", // ~1408px: หน้าจอขนาดใหญ่พิเศษ (ในโค้ดนี้ตั้งค่าไว้เท่ากับ xl ปกติมักจะใช้เผื่อหน้าจอ Ultrawide หรือทีวี)
      },
    },
  },
};

export default postcssConfig;
