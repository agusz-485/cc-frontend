import { Check } from "lucide-react";

export default function RoleCard({
    title,
    description,
    icon: Icon,
    selected,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                relative
                w-full
                rounded-xl
                border
                px-4 py-5
                text-center
                transition-all
                duration-200
                ${
                    selected
                        ? "border-teal-600 bg-teal-50 ring-1 ring-teal-600"
                        : "border-gray-200 bg-white hover:border-teal-300"
                }
            `}
        >
            {/* Check del rol seleccionado */}
            {selected && (
                <span
                    className="
                        absolute right-3 top-3
                        flex h-6 w-6
                        items-center justify-center
                        rounded-full
                        bg-teal-600
                        text-white
                    "
                >
                    <Check size={15} strokeWidth={3} />
                </span>
            )}

            {/* Ícono */}
            <Icon
                size={36}
                strokeWidth={2}
                className="mx-auto text-teal-700"
            />

            <h3 className="mt-3 text-base font-semibold text-gray-900">
                {title}
            </h3>

            <p className="mt-1 text-sm leading-5 text-gray-500">
                {description}
            </p>
        </button>
    );
}