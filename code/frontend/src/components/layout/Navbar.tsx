const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          CodeQuark
        </h1>

        <ul className="flex items-center gap-6 text-gray-700 font-medium">
          <li>
            <a href="#categories" className="hover:text-blue-600 transition">
              Categories
            </a>
          </li>
          <li>
            <a href="#techstack" className="hover:text-blue-600 transition">
              Tech Stack
            </a>
          </li>
          <li>
            <a href="#projects" className="hover:text-blue-600 transition">
              Projects
            </a>
          </li>
          <li>
            <a href="#dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
