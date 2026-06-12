import { useState } from "react";
import "../styles/Dashboard.css";
import "../styles/Screens.css";
import HomeScreen from "../components/screens/HomeScreen";
import VoteScreen from "../components/screens/VoteScreen";
import ResultsScreen from "../components/screens/ResultsScreen";
import ParamsScreen from "../components/screens/ParamsScreen";

const SCREENS = {
  home: "Tableau de bord",
  vote: "Voter",
  results: "Résultats",
  params: "Paramètres",
};

export default function Dashboard({ onLogout, onAdmin }) {
  const [active, setActive] = useState("home");

  const handleNavigate = (screen) => {
    if (screen === "admin") {
      onAdmin();
      return;
    }
    setActive(screen);
  };

  const renderScreen = () => {
    switch (active) {
      case "home": return <HomeScreen onNavigate={handleNavigate} />;
      case "vote": return <VoteScreen onNavigate={handleNavigate} />;
      case "results": return <ResultsScreen />;
      case "params": return <ParamsScreen />;
      default: return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sb-logo">
          <div className="logo-circle">
            <div className="logo-inner"><div className="logo-dot" /></div>
          </div>
          <div className="brand-name">BOKKNA</div>
        </div>

        <nav className="sb-nav">
          {[
            { id: "home", icon: "ti-home", label: "Accueil" },
            { id: "vote", icon: "ti-checkbox", label: "Voter" },
            { id: "results", icon: "ti-chart-bar", label: "Résultats" },
            { id: "params", icon: "ti-settings", label: "Paramètres" },
          ].map((item) => (
            <div
              key={item.id}
              className={`nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => handleNavigate(item.id)}
            >
              <i className={`ti ${item.icon}`} />
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sb-footer">
          <div className="nav-item logout" onClick={onLogout}>
            <i className="ti ti-logout" />
            Déconnexion
          </div>
        </div>
      </div>

      <div className="main">
        <div className="topbar">
          <div className="tb-title">{SCREENS[active] || "Tableau de bord"}</div>
          <div className="tb-user">
            <div className="avatar">AM</div>
            <div>
              <div className="user-name">Amadou M.</div>
              <div className="user-sub">Citoyen vérifié</div>
            </div>
          </div>
        </div>
        <div className="content">{renderScreen()}</div>
      </div>
    </div>
  );
}