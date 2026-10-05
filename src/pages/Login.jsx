import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { FormInput } from "../components/ui/FormInput";
import { PasswordInput } from "../components/ui/PasswordInput";
import { Toast } from "../components/ui/Toast";
import { AuthWelcome } from "../components/auth/AuthWelcome";
import Navbar from "../components/layout/Navbar";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const closeError = () => {
        setError("");
    };

    const validateEmail = (value) => {
        if (!value.trim()) {
            return "El correo electrónico es obligatorio.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
            return "Ingresá un correo electrónico válido.";
        }

        return "";
    };

    const validateLoginPassword = (value) => {
        if (!value) {
            return "La contraseña es obligatoria.";
        }
        return "";
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailError("");
        setError("");
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordError("");
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        const cleanEmail = email.trim();
        const nextEmailError = validateEmail(cleanEmail);
        const nextPasswordError = validateLoginPassword(password);

        setEmailError(nextEmailError);
        setPasswordError(nextPasswordError);
        setError("");

        if (nextEmailError || nextPasswordError) {
            const firstInvalidField = nextEmailError
                ? "email"
                : "password";

            event.currentTarget.elements
                .namedItem(firstInvalidField)
                ?.focus();

            return;
        }

        setLoading(true);

        try {
            const data = await login({
                email: cleanEmail,
                password,
            });

            const role = String(
                data?.rol ||
                data?.role ||
                data?.user?.rol ||
                data?.user?.role ||
                ""
            ).toUpperCase();

            navigate(
                role.includes("ADMIN") ? "/admin" : "/dashboard",
                { replace: true }
            );
        } catch (err) {
            const status = err.response?.status;
            const serverMsg = err.response?.data?.message;

            if (!err.response) {
                setError(
                    "No pudimos conectarnos con el servidor. Revisá tu conexión e intentá nuevamente."
                );
            } else if (status === 401 || status === 400) {
                setError(
                    serverMsg || "Correo electrónico o contraseña incorrectos. Verificá tus credenciales."
                );
            } else if (status === 429) {
                setError(
                    "Realizaste demasiados intentos. Esperá un momento y volvé a intentar."
                );
            } else {
                setError(
                    serverMsg || "No pudimos iniciar sesión. Intentá nuevamente."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Navbar variant="login" />

            {error && (
                <Toast
                    variant="error"
                    title="No pudimos iniciar sesión"
                    message={error}
                    duration={5000}
                    onClose={closeError}
                />
            )}

            <main className="flex w-full flex-1">
                <AuthWelcome
                    variant="dark"
                    title={
                        <>
                            Cuidar
                            <br />
                            empieza por
                            <br />
                            <span className="text-teal-200">
                                conectar.
                            </span>
                        </>
                    }
                    description="Qué bueno tenerte de vuelta."
                />

                <section
                    className="
                        flex w-full min-w-0
                        items-center justify-center
                        px-6 py-12
                        sm:px-10
                        lg:w-1/2
                    "
                >
                    <div className="w-full max-w-md">
                        <h1
                            className="
                                text-3xl font-bold
                                tracking-tight text-gray-900
                                sm:text-4xl
                            "
                        >
                            Iniciá sesión
                        </h1>

                        <p className="mt-3 text-gray-500">
                            Ingresá a tu cuenta para continuar.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-9 space-y-6"
                            aria-busy={loading}
                            noValidate
                        >
                            <FormInput
                                id="email"
                                name="email"
                                label="Correo electrónico"
                                type="email"
                                icon={Mail}
                                placeholder="nombre@ejemplo.com"
                                autoComplete="username"
                                autoCapitalize="none"
                                spellCheck={false}
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={() => {
                                    setEmailError(validateEmail(email));
                                }}
                                error={emailError}
                                disabled={loading}
                                required
                            />

                            <PasswordInput
                                id="password"
                                name="password"
                                label="Contraseña"
                                placeholder="Ingresá tu contraseña"
                                autoComplete="current-password"
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={() => {
                                    setPasswordError(
                                        validateLoginPassword(password)
                                    );
                                }}
                                error={passwordError}
                                disabled={loading}
                                required
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    flex w-full items-center
                                    justify-center gap-2
                                    rounded-xl bg-teal-800
                                    px-4 py-3.5
                                    text-sm font-semibold text-white
                                    transition-colors hover:bg-teal-900
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {loading ? "Ingresando..." : "Ingresar"}

                                {!loading && (
                                    <ArrowRight
                                        size={18}
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        </form>

                        <p
                            className="
                                mt-8 border-t border-gray-100 pt-6
                                text-center text-sm text-gray-500
                            "
                        >
                            ¿Todavía no tenés una cuenta?{" "}
                            <Link
                                to="/register"
                                className="
                                    font-semibold text-teal-700
                                    hover:text-teal-900 hover:underline
                                "
                            >
                                Registrate
                            </Link>
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}