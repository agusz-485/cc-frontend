import { FamiliarSecurityTab } from "./FamiliarSecurityTab";
import { CuidadorSecurityTab } from "../cuidador/CuidadorSecurityTab";
import { useAuth } from "../../context/AuthContext";

export function SecurityTab({ role }) {
    const { user } = useAuth();
    const activeRole = (role || user?.rol || user?.role || "familiar").toLowerCase();
    const isProfessional = activeRole.includes("cuidador") || activeRole.includes("enfermero");

    if (isProfessional) {
        return <CuidadorSecurityTab />;
    }

    return <FamiliarSecurityTab />;
}

export default SecurityTab;
