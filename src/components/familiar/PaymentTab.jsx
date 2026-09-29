import { FamiliarPaymentTab } from "./FamiliarPaymentTab";
import { CuidadorPayoutTab } from "../cuidador/CuidadorPayoutTab";
import { useAuth } from "../../context/AuthContext";

export function PaymentTab({ role }) {
    const { user } = useAuth();
    const activeRole = (role || user?.rol || user?.role || "familiar").toLowerCase();
    const isProfessional = activeRole.includes("cuidador") || activeRole.includes("enfermero");

    if (isProfessional) {
        return <CuidadorPayoutTab />;
    }

    return <FamiliarPaymentTab />;
}

export default PaymentTab;
