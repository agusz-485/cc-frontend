import { useEffect, useRef } from "react";
import { CircleCheck, AlertCircle, X } from "lucide-react";

const variants = {
    success: {
        icon: CircleCheck,
        border: "border-teal-200",
        iconBackground: "bg-teal-50",
        iconColor: "text-teal-600",
        progressBackground: "bg-teal-100",
        progressColor: "bg-teal-600",
    },
    error: {
        icon: AlertCircle,
        border: "border-red-200",
        iconBackground: "bg-red-50",
        iconColor: "text-red-600",
        progressBackground: "bg-red-100",
        progressColor: "bg-red-600",
    },
};

export default function Toast({
    title,
    message,
    onClose,
    variant = "success",
    duration = 5000,
}) {
    const styles = variants[variant] || variants.success;
    const Icon = styles.icon;

    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onCloseRef.current?.();
        }, duration);

        return () => clearTimeout(timeout);
    }, [duration, title, message, variant]);

    return (
        <>
            <style>
                {`
                    @keyframes careConnectToastEnter {
                        0% {
                            opacity: 0;
                            transform: translateX(40px) scale(0.96);
                        }

                        70% {
                            transform: translateX(-4px) scale(1.01);
                        }

                        100% {
                            opacity: 1;
                            transform: translateX(0) scale(1);
                        }
                    }

                    @keyframes careConnectToastProgress {
                        from {
                            transform: scaleX(1);
                        }

                        to {
                            transform: scaleX(0);
                        }
                    }

                    .careconnect-toast {
                        animation: careConnectToastEnter 0.4s ease-out;
                    }

                    .careconnect-toast-progress {
                        transform-origin: left;
                        animation:
                            careConnectToastProgress
                            var(--toast-duration)
                            linear
                            forwards;
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .careconnect-toast,
                        .careconnect-toast-progress {
                            animation: none;
                        }
                    }
                `}
            </style>

            <div
                key={`${variant}-${title}-${message}-${duration}`}
                role={variant === "error" ? "alert" : "status"}
                aria-atomic="true"
                style={{ "--toast-duration": `${duration}ms` }}
                className={`
                    careconnect-toast
                    fixed right-5 top-20 z-[100]
                    w-[calc(100%_-_2.5rem)] max-w-sm
                    rounded-xl border bg-white p-4 shadow-lg
                    ${styles.border}
                `}
            >
                <div className="flex items-start gap-3">
                    <div
                        className={`
                            flex h-10 w-10 shrink-0
                            items-center justify-center rounded-full
                            ${styles.iconBackground}
                        `}
                    >
                        <Icon
                            size={23}
                            className={styles.iconColor}
                            aria-hidden="true"
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                            {title}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            {message}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded p-1 text-gray-400 transition hover:text-gray-600"
                        aria-label="Cerrar notificación"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <div
                    aria-hidden="true"
                    className={`
                        mt-3 h-1 overflow-hidden rounded-full
                        ${styles.progressBackground}
                    `}
                >
                    <div
                        className={`
                            careconnect-toast-progress
                            h-full rounded-full
                            ${styles.progressColor}
                        `}
                    />
                </div>
            </div>
        </>
    );
}