import { ChevronDown, CircleAlert } from "lucide-react";
import FormField, { getControlStyles } from "./FormField";

export default function FormSelect({
    id,
    name,
    label,
    options = [],
    placeholder = "Seleccioná una opción",
    error,
    required = false,
    className = "",
    "aria-describedby": describedBy,
    ...selectProps
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
                    <select
                        {...selectProps}
                        {...accessibilityProps}
                        name={name}
                        required={required}
                        className={`
                            ${getControlStyles(Boolean(error))}
                            appearance-none
                            ${error ? "pr-16" : "pr-10"}
                        `}
                    >
                        <option value="">{placeholder}</option>

                        {options.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>

                    {error && (
                        <CircleAlert
                            size={18}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-9 top-1/2 -translate-y-1/2 text-red-500"
                        />
                    )}

                    <ChevronDown
                        size={18}
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                </div>
            )}
        </FormField>
    );
}