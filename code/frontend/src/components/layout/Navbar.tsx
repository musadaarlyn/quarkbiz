import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "Categories", id: "categories" },
  { label: "Tech Stack", id: "techstack" },
  { label: "Projects", id: "projects" },
  { label: "Dashboard", id: "dashboard" },
];

export default function Navbar() {
  const [active, setActive] = useState<string>("categories");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 90;

      let current = active;

      for (const item of NAV_ITEMS) {
        const section = document.getElementById(item.id);
        if (section && section.offsetTop <= scrollPosition) {
          current = item.id;
        }
      }

      if (current !== active) {
        setActive(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [active]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50 h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between w-full">
        {/* Brand */}
        <h1 className="text-xl font-bold">QuarkBiz</h1>

        {/* Navigation */}
        <ul className="flex gap-x-12">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`text-sm font-medium transition-colors ${
                  active === item.id
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
