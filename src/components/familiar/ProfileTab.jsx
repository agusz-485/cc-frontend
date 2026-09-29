import { FamiliarProfileTab } from "./FamiliarProfileTab";
import { CuidadorProfileTab } from "../cuidador/CuidadorProfileTab";
import { useAuth } from "../../context/AuthContext";

export function ProfileTab({ onProfileUpdate, role }) {
    const { user } = useAuth();
    const activeRole = (role || user?.rol || user?.role || "familiar").toLowerCase();
    const isProfessional = activeRole.includes("cuidador") || activeRole.includes("enfermero");

    if (isProfessional) {
        return <CuidadorProfileTab onProfileUpdate={onProfileUpdate} role={activeRole} />;
    }

    return <FamiliarProfileTab onProfileUpdate={onProfileUpdate} />;
}

export default ProfileTab;
