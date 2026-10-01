import { useId } from "react";

export function getControlStyles(hasError) {
    return `
        w-full rounded-lg border bg-white
        px-3 py-2.5 text-sm text-gray-900
        placeholder:text-gray-400
        transition focus:outline-none focus:ring-2
        disabled:cursor-not-allowed disabled:opacity-60
        ${
            hasError
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-gray-300 focus:border-teal-600 focus:ring-teal-100"
        }
    `;
}

export default function FormField({
    id,
    label,
    required = false,
    error,
    className = "",
    describedBy,
    children,
}) {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    const descriptionIds = [
        describedBy,
        error ? errorId : undefined,
    ]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
        <div className={className}>
            <label
                htmlFor={inputId}
                className="mb-1.5 block text-sm font-medium text-gray-700"
            >
                {label}

                {required && (
                    <span
                        aria-hidden="true"
                        className="ml-1 text-red-500"
                    >
                        *
                    </span>
                )}
            </label>

            {children({
                id: inputId,
                "aria-invalid": Boolean(error),
                "aria-describedby": descriptionIds,
            })}

            {error && (
                <p
                    id={errorId}
                    className="mt-1.5 text-xs text-red-600"
                    aria-live="polite"
                >
                    {error}
                </p>
            )}
        </div>
    );
}