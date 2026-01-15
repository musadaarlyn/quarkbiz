import logo from "../../assets/img/quarkbiz-logo.png";
import "../../styles/projects/Home.css";

function Home() {
  return (
    <div className="home-page">
      {/* App Name */}
      <h1 className="home-title">Quarkbiz</h1>

      {/* Logo */}
      <img src={logo} alt="Quarkbiz Logo" className="home-logo" />
    </div>
  );
}

export default Home;
