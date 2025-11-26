import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";

export default function StudentLayout() {
  return (
    <div className="student-layout">
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
