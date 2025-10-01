// frontend/pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fa" dir="rtl">
      <Head>
        {/* --- START: FIX --- */}
        {/* لینک مستقیم به فایل CSS کپی شده */}
        <link rel="stylesheet" href="/styles/quill.snow.css" />
        {/* --- END: FIX --- */}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}