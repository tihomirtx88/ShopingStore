
import React from "react";
import Sidebar from "./Sidebar";
import SeparatorWrapper from "@/components/reviews/SeparatorWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <h2 className="text-2xl pl-4">Dashboard</h2>
      <SeparatorWrapper />
      <section className="grid lg:grid-cols-12 gap-12 mt-12">
        <div className="lg:col-span-2">
          <Sidebar />
        </div>
        <div className="lg:col-span-10 px-4">{children}</div>
      </section>
    </>
  );
}
