import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import FormField, { getControlStyles } from "./FormField";

function getPasswordError(error, showRequirements) {
    if (!error) return "";

    if (error === "required") {
        return "La contraseña es obligatoria";
    }

    if (error === "invalid") {
        return showRequirements
            ? "La contraseña no cumple los requisitos indicados."
            : "Ingresá una contraseña válida";
    }

    return error;
}

export default function PasswordInput({
    id,
    name,
    label,
    value,
    onChange,
    placeholder,
    error,
    showRequirements = false,
    required = false,
    disabled = false,
    autoComplete = "new-password",
    className = "",
    "aria-describedby": describedBy,
    ...inputProps
}) {
    const [showPassword, setShowPassword] = useState(false);

    const errorMessage = getPasswordError(error, showRequirements);
    const displayRequirements = showRequirements && error === "invalid";

    return (
        <FormField
            id={id}
            label={label}
            required={required}
            error={errorMessage}
            className={className}
            describedBy={describedBy}
        >
            {(accessibilityProps) => {
                const requirementsId =
                    `${accessibilityProps.id}-requirements`;

                const descriptionIds = [
                    accessibilityProps["aria-describedby"],
                    displayRequirements ? requirementsId : undefined,
                ]
                    .filter(Boolean)
                    .join(" ") || undefined;

                return (
                    <>
                        <div className="relative">
                            <input
                                {...inputProps}
                                {...accessibilityProps}
                                aria-describedby={descriptionIds}
                                name={name}
                                type={showPassword ? "text" : "password"}
                                value={value}
                                onChange={onChange}
                                placeholder={placeholder}
                                autoComplete={autoComplete}
                                required={required}
                                disabled={disabled}
                                className={`
                                    ${getControlStyles(Boolean(error))}
                                    pr-12
                                `}
                            />

                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() =>
                                    setShowPassword((previous) => !previous)
                                }
                                aria-label={
                                    showPassword
                                        ? "Ocultar contraseña"
                                        : "Mostrar contraseña"
                                }
                                aria-controls={accessibilityProps.id}
                                className="
                                    absolute inset-y-0 right-0
                                    flex w-11 items-center justify-center
                                    rounded-r-lg text-gray-400
                                    transition-colors hover:text-teal-600
                                    focus-visible:outline
                                    focus-visible:outline-2
                                    focus-visible:outline-teal-600
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {showPassword ? (
                                    <EyeOff size={20} aria-hidden="true" />
                                ) : (
                                    <Eye size={20} aria-hidden="true" />
                                )}
                            </button>
                        </div>

                        {displayRequirements && (
                            <div
                                id={requirementsId}
                                className="mt-2 text-sm text-gray-600"
                            >
                                <p className="font-medium">
                                    La contraseña debe contener:
                                </p>

                                <ul className="mt-1 list-disc space-y-1 pl-5">
                                    <li>Al menos 8 caracteres</li>
                                    <li>Una letra mayúscula</li>
                                    <li>Una letra minúscula</li>
                                    <li>Un número</li>
                                    <li>
                                        Un carácter especial:{" "}
                                        <span className="font-medium">
                                            @ # $ % & * ! ?
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </>
                );
            }}
        </FormField>
    );
}