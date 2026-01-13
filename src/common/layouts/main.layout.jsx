"use client";

import Footer from "@/components/footer/footer.component";
import Header from "@/components/header/header.component";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="pt-52 lg:pt-40">{children}</main>
      <Footer />
    </div>
  );
}
