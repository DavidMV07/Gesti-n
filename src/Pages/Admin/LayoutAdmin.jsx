import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
