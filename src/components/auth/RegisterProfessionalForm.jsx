import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";

const enfermeroFields = [
    {
        name: "matriculaProfesional",
        label: "Matrícula profesional",
        type: "text",
        placeholder: "Ingresá tu matrícula",
        required: true,
    },
    {
        name: "tipoMatricula",
        label: "Tipo de matrícula",
        control: "select",
        required: true,
        options: [
            { value: "NACIONAL", label: "Nacional" },
            { value: "PROVINCIAL", label: "Provincial" },
        ],
    },
    {
        name: "nivelProfesional",
        label: "Especialidad / Nivel",
        type: "text",
        placeholder: "Ej. Licenciado, Técnico, Auxiliar",
        required: true,
    },
    {
        name: "institucionEgreso",
        label: "Institución de egreso",
        type: "text",
        placeholder: "Ingresá la institución",
        required: true,
    },
    {
        name: "seguroMalaPraxis",
        label: "Seguro de mala praxis",
        type: "text",
        placeholder: "Ingresá tu seguro",
        required: true,
        fullWidth: true,
    },
];

const cuidadorFields = [
    {
        name: "zonaPrincipal",
        label: "Zona donde trabajás",
        type: "text",
        placeholder: "Ej. CABA, Zona Norte, etc.",
        required: true,
    },
    {
        name: "precioHora",
        label: "Tarifa por hora (ARS)",
        type: "number",
        placeholder: "Ej. 2500",
        min: "0",
        step: "0.01",
        required: true,
    },
];

export default function RegisterProfessionalForm({
    formData,
    handleChange,
    errors = {},
}) {
    const isNurse = formData.rol === "ENFERMERO";
    const isCaregiver = formData.rol === "CUIDADOR";

    if (!isNurse && !isCaregiver) return null;

    const fields = isNurse ? enfermeroFields : cuidadorFields;

    return (
        <section className="rounded-xl bg-teal-50 p-5">
            <h2 className="text-lg font-semibold text-gray-900">
                {isNurse
                    ? "Información profesional"
                    : "Información como cuidador"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                {isNurse
                    ? "Contanos un poco más sobre tu perfil profesional."
                    : "Contanos un poco más sobre tu servicio."}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {fields.map(({ fullWidth, control, ...field }) => {
                    const Component =
                        control === "select" ? FormSelect : FormInput;

                    return (
                        <Component
                            key={field.name}
                            {...field}
                            value={formData[field.name] ?? ""}
                            onChange={handleChange}
                            error={errors[field.name]}
                            className={
                                fullWidth ? "lg:col-span-2" : ""
                            }
                        />
                    );
                })}
            </div>
        </section>
    );
}