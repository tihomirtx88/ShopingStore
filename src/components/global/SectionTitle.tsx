import React from "react";
import SeparatorWrapper from "../reviews/SeparatorWrapper";
export default function SectionTitle({ text }: { text: string }) {
  return (
    <div>
      <h1 className="text-3xl font-medium tracking-wider capitalize mb-8">
        {text}
      </h1>
      <SeparatorWrapper/>
    </div>
  );
}
