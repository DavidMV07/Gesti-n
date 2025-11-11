import UsersPage from "../Pages/Admin/UsersPage";
import "../styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <main className="main-content">
        <h1>Bienvenido al panel</h1>
        <p>Aquí puedes gestionar usuarios, cursos y roles.</p>
        <UsersPage />
      </main>
    </div>
  );
};

export default Dashboard;