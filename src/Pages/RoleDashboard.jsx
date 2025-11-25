import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from './Admin/AdminDashboard';
import StudentDashboard from './Student/StudentDashboard';
import ProfessorDashboard from './Professor/ProfessorDashboard';

export default function RoleDashboard(){
  const { user } = useContext(AuthContext);

  if(!user) return <div>No autenticado</div>;

  if(user.role === 'admin') return <AdminDashboard />;
  if(user.role === 'profesor') return <ProfessorDashboard />;
  return <StudentDashboard />;
}
