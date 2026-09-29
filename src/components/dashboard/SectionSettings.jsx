import { SectionSettingsCuidador } from "./SectionSettingsCuidador";
import { SectionSettingsFamiliar } from "./SectionSettingsFamiliar";
import { useAuth } from "../../context/AuthContext";

export function SectionSettings({ onProfileUpdate, role }) {
    const { user } = useAuth();
    const activeRole = (role || user?.rol || user?.role || "familiar").toLowerCase();
    const isProfessional = activeRole.includes("cuidador") || activeRole.includes("enfermero");

    if (isProfessional) {
        return <SectionSettingsCuidador onProfileUpdate={onProfileUpdate} role={activeRole} />;
    }

    return <SectionSettingsFamiliar onProfileUpdate={onProfileUpdate} />;
}

export default SectionSettings;
