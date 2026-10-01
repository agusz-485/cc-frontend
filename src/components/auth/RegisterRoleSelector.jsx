import {
    Heart,
    Stethoscope,
    Users,
} from "lucide-react";

import RoleCard from "../ui/RoleCard";

const roles = [
    {
        value: "FAMILIAR",
        title: "Familiar",
        description: "Busco cuidado para un familiar",
        icon: Users,
    },
    {
        value: "CUIDADOR",
        title: "Cuidador",
        description: "Quiero brindar servicios de cuidado",
        icon: Heart,
    },
    {
        value: "ENFERMERO",
        title: "Enfermero/a",
        description: "Quiero ofrecer atención profesional",
        icon: Stethoscope,
    },
];

export default function RegisterRoleSelector({
    selectedRole,
    onRoleChange,
}) {
    return (
        <section>
            <h2 className="text-xl font-bold text-gray-900">
                ¿Cómo querés usar CareConnect?
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                Seleccioná el perfil que mejor te describe. Podrás completar
                más información según tu rol.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
                {roles.map((role) => (
                    <RoleCard
                        key={role.value}
                        title={role.title}
                        description={role.description}
                        icon={role.icon}
                        selected={selectedRole === role.value}
                        onClick={() => onRoleChange(role.value)}
                    />
                ))}
            </div>
        </section>
    );
}