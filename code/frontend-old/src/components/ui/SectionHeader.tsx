import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  children?: ReactNode; // For buttons
}

export default function SectionHeader({ title, children }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
