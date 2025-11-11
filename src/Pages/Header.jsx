import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import "../styles/Header.css";

function Header(){
  const [collapsed, setCollapsed] = useState(false);
  return (
    <header className="header">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(s => !s)} />
    </header>
  );
}

export default Header;