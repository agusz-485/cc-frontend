export function AuthWelcome({
    title,
    description,
    image,
    imageAlt = "",
    eyebrow,
    benefits = [],
    variant = "light",
}) {
    const isDark = variant === "dark";

    return (
        <aside
            className={`
                relative hidden overflow-hidden
                lg:flex lg:w-1/2 lg:shrink-0 lg:flex-col
                ${
                    isDark
                        ? "justify-center bg-teal-800 px-10 py-32 xl:px-14"
                        : "bg-teal-50 lg:px-16 lg:py-8 xl:px-20 2xl:px-24"
                }
            `}
        >
            <div className="relative z-10">
                {eyebrow && (
                    <>
                        <p
                            className={`text-sm font-semibold ${
                                isDark ? "text-teal-100" : "text-teal-700"
                            }`}
                        >
                            {eyebrow}
                        </p>

                        <div
                            className={`mt-5 h-0.5 w-7 ${
                                isDark ? "bg-teal-200" : "bg-teal-600"
                            }`}
                        />
                    </>
                )}

                <h2
                    className={
                        isDark
                            ? "text-5xl font-bold leading-[1.08] tracking-tight text-white xl:text-6xl 2xl:text-7xl"
                            : "mt-5 max-w-md text-4xl font-bold leading-tight text-gray-900"
                    }
                >
                    {title}
                </h2>

                {description && (
                    <p
                        className={
                            isDark
                                ? "mt-7 text-xl leading-relaxed text-teal-100 xl:text-2xl"
                                : "mt-4 max-w-md text-base leading-7 text-gray-600"
                        }
                    >
                        {description}
                    </p>
                )}

                {benefits.length > 0 && (
                    <div className="mt-7 flex flex-col gap-5">
                        {benefits.map(({ title, description, icon: Icon }) => (
                            <div
                                key={title}
                                className="flex items-center gap-4"
                            >
                                {Icon && (
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                                            isDark
                                                ? "bg-teal-700 text-teal-100"
                                                : "bg-teal-100 text-teal-700"
                                        }`}
                                    >
                                        <Icon
                                            size={24}
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />
                                    </div>
                                )}

                                <div>
                                    <h3
                                        className={`text-sm font-semibold ${
                                            isDark
                                                ? "text-white"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        {title}
                                    </h3>

                                    <p
                                        className={`mt-0.5 text-sm ${
                                            isDark
                                                ? "text-teal-100"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {image && (
                <div
                    className={
                        benefits.length > 0
                            ? "relative z-10 mt-5 flex justify-center"
                            : "relative z-10 flex flex-1 items-center justify-center py-10"
                    }
                >
                    <img
                        src={image}
                        alt={imageAlt}
                        className="w-full max-w-[340px] object-contain xl:max-w-[380px]"
                    />
                </div>
            )}

            {/* Detalle decorativo de conexión */}
            {isDark && (
                <svg
                    viewBox="0 0 600 180"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-5 left-0 h-28 w-full"
                    fill="none"
                >
                    <path
                        d="M-20 15 C100 35 190 130 300 130"
                        stroke="#99F6E4"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                    />

                    <path
                        d="M300 130 C410 130 500 35 620 15"
                        stroke="#67E8F9"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                    />

                    <circle
                        cx="300"
                        cy="130"
                        r="15"
                        fill="#99F6E4"
                        opacity="0.12"
                    />

                    <circle
                        cx="300"
                        cy="130"
                        r="6"
                        fill="#99F6E4"
                    />
                </svg>
            )}
        </aside>
    );
}

export default AuthWelcome;