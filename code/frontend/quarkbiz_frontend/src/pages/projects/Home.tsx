import logo from "../../assets/img/quarkbiz-logo.png";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[95vh] bg-gray-50 p-4 font-sans">
      {/* App Name */}
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#05b7f5]">
        Quarkbiz
      </h1>

      {/* Logo */}
      <img
        src={logo}
        alt="Quarkbiz Logo"
        className="w-full max-w-lg object-contain"
      />
    </div>
  );
}

export default Home;
