# SEO Rules — `apps/web`

ทุกหน้าใน `apps/web` ที่ public (ไม่ต้อง login) ต้องให้ความสำคัญกับ SEO

## Metadata

### Static Pages

ใช้ `export const metadata: Metadata` ใน `page.tsx` หรือ `layout.tsx`

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ชื่อหน้า | Pawpal",
  description: "คำอธิบายหน้า สั้น กระชับ ไม่เกิน 160 ตัวอักษร",
  openGraph: {
    title: "ชื่อหน้า | Pawpal",
    description: "คำอธิบายหน้า",
    type: "website",
  },
};
```

### Dynamic Pages (e.g. `products/[slug]`)

ใช้ `generateMetadata` เพื่อดึงข้อมูลจาก server มาสร้าง metadata แบบ dynamic

```typescript
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await ServerAPI.product.findOneBySlug(slug);

  if (!product.success || !product.data) return {};

  return {
    title: `${product.data.name} | Pawpal`,
    description: product.data.description?.slice(0, 160),
    openGraph: {
      title: product.data.name,
      description: product.data.description?.slice(0, 160),
      images: product.data.image ? [product.data.image] : [],
      type: "website",
    },
  };
}
```

## Rules

- **Title format**: `{ชื่อหน้า} | Pawpal` — ทุกหน้าต้องมี title ที่สื่อความหมาย
- **Description**: ต้องไม่เกิน 160 ตัวอักษร สรุปเนื้อหาของหน้า
- **OpenGraph**: ทุกหน้า public ต้องมี `openGraph` properties อย่างน้อย `title`, `description`
- **Heading hierarchy**: ใช้ `<h1>` เพียง 1 ตัวต่อหน้า เรียงลำดับ `h1 > h2 > h3` ไม่ข้ามลำดับ
- **Semantic HTML**: ใช้ `<main>`, `<article>`, `<section>`, `<nav>`, `<footer>` ตามความเหมาะสม
- **Image alt**: ทุก `<Image>` ต้องมี `alt` ที่สื่อความหมาย ห้ามปล่อยว่าง
- **Link descriptive text**: ห้ามใช้ "คลิกที่นี่" — ใช้ข้อความที่อธิบายปลายทาง
- **Server Components preferred**: ใช้ Server Components เป็นหลักเพื่อให้ content ถูก render ฝั่ง server (ดีต่อ SEO)
- **`lang` attribute**: Root layout ต้องมี `<html lang={currentLocale}>` (ทำอยู่แล้ว)

## ไม่ต้องทำ SEO

- หน้าที่ต้อง login (`/user/*`, `/topup/*`)
- `apps/admin` — เป็น internal dashboard
