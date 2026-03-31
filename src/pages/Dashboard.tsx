import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import FarmerDashboard from "./farmer/FarmerDashboard";
import WorkerDashboard from "./worker/WorkerDashboard";
import EquipmentOwnerDashboard from "./equipment/EquipmentOwnerDashboard";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/role-selection" replace />;

  switch (user?.role) {
    case "farmer": return <FarmerDashboard />;
    case "worker": return <WorkerDashboard />;
    case "equipment_owner": return <EquipmentOwnerDashboard />;
    default: return <Navigate to="/role-selection" replace />;
  }
};

export default Dashboard;
