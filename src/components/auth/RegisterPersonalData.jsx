import FormInput from "../ui/FormInput";
import PasswordInput from "../ui/PasswordInput";

const fields = [
    {
        name: "nombre",
        label: "Nombre",
        type: "text",
        placeholder: "Ingresá tu nombre",
        autoComplete: "given-name",
        required: true,
    },
    {
        name: "apellido",
        label: "Apellido",
        type: "text",
        placeholder: "Ingresá tu apellido",
        autoComplete: "family-name",
        required: true,
    },
    {
        name: "email",
        label: "Correo electrónico",
        type: "email",
        placeholder: "nombre@ejemplo.com",
        autoComplete: "email",
        autoCapitalize: "none",
        spellCheck: false,
        required: true,
        fullWidth: true,
    },
    {
        name: "telefono",
        label: "Teléfono",
        type: "tel",
        placeholder: "Ej. 1112345678",
        autoComplete: "tel",
        required: true,
    },
    {
        name: "dni",
        label: "DNI",
        type: "text",
        placeholder: "Ingresá tu DNI",
        inputMode: "numeric",
        required: true,
    },
];

export default function RegisterPersonalData({
    formData,
    handleChange,
    confirmPassword,
    handleConfirmPasswordChange,
    errors = {},
}) {
    return (
        <section>
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {fields.map(({ fullWidth, ...field }) => (
                    <FormInput
                        key={field.name}
                        {...field}
                        value={formData[field.name] ?? ""}
                        onChange={handleChange}
                        error={errors[field.name]}
                        className={fullWidth ? "lg:col-span-2" : ""}
                    />
                ))}

                <PasswordInput
                    id="password"
                    name="password"
                    label="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresá tu contraseña"
                    error={errors.password}
                    showRequirements={true}
                    autoComplete="new-password"
                    required
                />

                <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Repetí tu contraseña"
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                    required
                />
            </div>
        </section>
    );
}