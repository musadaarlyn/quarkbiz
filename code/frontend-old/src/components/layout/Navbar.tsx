import { useEffect, useState } from "react";
import logo from "../../assets/img/quarkbiz-logo.png";
import SearchBar from "./SearchBar";

const NAV_ITEMS = [
  { label: "Categories", id: "categories" },
  { label: "Tech Stack", id: "techstack" },
  { label: "Projects", id: "projects" },
  { label: "Insights", id: "dashboard" },
];

export default function Navbar() {
  const [active, setActive] = useState<string>("categories");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

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
    <nav className="fixed top-0 left-0 w-full z-50 h-20 flex items-center backdrop-blur">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,150,190,0.35),_rgba(7,18,33,0.95))]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071221] via-[#0d1f33] to-[#0b1a29]/90 border-b border-white/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="QuarkBiz Logo"
            className="w-11 h-11 rounded-xl object-contain"
          />
          <div>
            <h1 className="text-xl font-semibold text-white tracking-wide">QuarkBiz</h1>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Engineered Workflows</p>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

      {/* for desktop */}
        <ul className="hidden md:flex gap-x-8 text-sm font-medium text-white/60">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`relative px-2 py-1 transition-colors duration-200 ${
                  active === item.id ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 right-0 -bottom-2 h-0.5 rounded-full transition-all duration-300 ${
                    active === item.id ? "bg-[#2596be]" : "bg-transparent"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

      {/* for mobile */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#071221]/95 backdrop-blur border-t border-white/10">
          <div className="px-6 pt-4 pb-2">
            <SearchBar />
          </div>
          <ul className="flex flex-col px-6 py-4 space-y-3 text-white/80">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-2 ${
                    active === item.id ? "text-white font-semibold" : "hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

    </nav>

    
  );
}
