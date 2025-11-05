import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dashboard-container">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(s => !s)} />

      <main className="main-content">
        <h1>Bienvenido al panel</h1>
        <p>Aquí puedes gestionar usuarios, cursos y roles.</p>
      </main>
    </div>
  );
};

export default Dashboard;