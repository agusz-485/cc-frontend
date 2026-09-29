import { FamiliarNotificationsTab } from "./FamiliarNotificationsTab";
import { CuidadorNotificationsTab } from "../cuidador/CuidadorNotificationsTab";
import { useAuth } from "../../context/AuthContext";

export function NotificationsTab({ role }) {
    const { user } = useAuth();
    const activeRole = (role || user?.rol || user?.role || "familiar").toLowerCase();
    const isProfessional = activeRole.includes("cuidador") || activeRole.includes("enfermero");

    if (isProfessional) {
        return <CuidadorNotificationsTab />;
    }

    return <FamiliarNotificationsTab />;
}

export default NotificationsTab;
