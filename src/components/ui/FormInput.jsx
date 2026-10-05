import { CircleAlert } from "lucide-react";
import FormField, { getControlStyles } from "./FormField";

export function FormInput({
    id,
    name,
    label,
    type = "text",
    error,
    required = false,
    icon: Icon,
    className = "",
    "aria-describedby": describedBy,
    ...inputProps
}) {
    return (
        <FormField
            id={id}
            label={label}
            required={required}
            error={error}
            className={className}
            describedBy={describedBy}
        >
            {(accessibilityProps) => (
                <div className="relative">
                    {Icon && (
                        <Icon
                            size={18}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    )}

                    <input
                        {...inputProps}
                        {...accessibilityProps}
                        name={name}
                        type={type}
                        required={required}
                        className={`
                            ${getControlStyles(Boolean(error))}
                            ${Icon ? "pl-10" : ""}
                            ${error ? "pr-10" : ""}
                        `}
                    />

                    {error && (
                        <CircleAlert
                            size={18}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                        />
                    )}
                </div>
            )}
        </FormField>
    );
}

export default FormInput;