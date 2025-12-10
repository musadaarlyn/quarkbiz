import type { ReactNode } from "react";

interface TableProps {
  headers: string[];
  children: ReactNode;
}

const Table = ({ headers, children }: TableProps) => {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b bg-gray-100">
          {headers.map((h) => (
            <th key={h} className="py-2 px-3 font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>{children}</tbody>
    </table>
  );
};

export default Table;
