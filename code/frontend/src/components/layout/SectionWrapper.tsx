import React from "react";

interface SectionWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;   // ← ADD THIS
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, title, children, className }) => {
  return (
    <section id={id} className={`scroll-mt-24 py-10 ${className ?? ""}`}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl mb-8 font-semibold">{title}</h2>
        {children}
      </div>
    </section>
  );
};

