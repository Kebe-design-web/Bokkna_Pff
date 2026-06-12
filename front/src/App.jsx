import { useState } from "react";
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [page, setPage] = useState("auth");

  if (page === "auth") return (
    <AuthPage
      onSuccess={() => setPage("dashboard")}
      onRegister={() => setPage("register")}
    />
  );
  if (page === "dashboard") return <Dashboard onLogout={() => setPage("auth")} onAdmin={() => setPage("admin")} />;
  if (page === "admin") return <AdminDashboard onLogout={() => setPage("auth")} />;
  if (page === "register") return <RegisterPage onBack={() => setPage("auth")} />;
}

export default App;