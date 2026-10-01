import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShieldCheck, Users } from "lucide-react";

import { authService } from "../services/authService";

import { ValidatePersonalData } from "../components/validations/PersonalDataValidation";
import { ValidateProfessionalData } from "../components/validations/ProfessionalDataValidation";

import Navbar from "../components/layout/Navbar";
import AuthWelcome from "../components/auth/AuthWelcome";
import RegisterPersonalData from "../components/auth/RegisterPersonalData";
import RegisterProfessionalForm from "../components/auth/RegisterProfessionalForm";
import RegisterRoleSelector from "../components/auth/RegisterRoleSelector";
import Toast from "../components/ui/Toast";

import registerCareImage from "../assets/registro.png";

const registerBenefits = [
    {
        title: "Confianza",
        description: "Perfiles verificados y seguros.",
        icon: ShieldCheck,
    },
    {
        title: "Cuidado real",
        description: "Personas que hacen la diferencia.",
        icon: Heart,
    },
    {
        title: "Comunidad",
        description: "Juntos por una mejor calidad de vida.",
        icon: Users,
    },
];

const professionalFieldNames = [
    "zonaPrincipal",
    "precioHora",
    "matriculaProfesional",
    "tipoMatricula",
    "nivelProfesional",
    "institucionEgreso",
    "seguroMalaPraxis",
];

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        telefono: "",
        dni: "",

        rol: "FAMILIAR",

        zonaPrincipal: "",
        precioHora: "",

        matriculaProfesional: "",
        tipoMatricula: "",
        nivelProfesional: "",
        institucionEgreso: "",
        seguroMalaPraxis: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [registerError, setRegisterError] = useState("");
    const [loading, setLoading] = useState(false);

    const professionalSectionRef = useRef(null);
    const redirectTimeoutRef = useRef(null);
    const scrollTimeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            clearTimeout(redirectTimeoutRef.current);
            clearTimeout(scrollTimeoutRef.current);
        };
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
            ...(name === "password" ? { confirmPassword: "" } : {}),
        }));

        setRegisterError("");
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);

        setErrors((previous) => ({
            ...previous,
            confirmPassword: "",
        }));
    };

    const handleRoleChange = (rol) => {
        setFormData((previous) => ({
            ...previous,
            rol,
        }));

        setErrors((previous) => {
            const nextErrors = { ...previous };

            professionalFieldNames.forEach((name) => {
                delete nextErrors[name];
            });

            return nextErrors;
        });

        clearTimeout(scrollTimeoutRef.current);

        if (rol === "CUIDADOR" || rol === "ENFERMERO") {
            scrollTimeoutRef.current = setTimeout(() => {
                professionalSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 100);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        setRegisterError("");

        const personalErrors = ValidatePersonalData(
            formData,
            confirmPassword
        );

        const professionalErrors = ValidateProfessionalData(formData);

        const validationErrors = {
            ...personalErrors,
            ...professionalErrors,
        };

        setErrors(validationErrors);

        const invalidFields = Object.keys(validationErrors);

        if (invalidFields.length > 0) {
            event.currentTarget.elements
                .namedItem(invalidFields[0])
                ?.focus();

            return;
        }

        setLoading(true);

        try {
            await authService.register({
                ...formData,
                email: formData.email.trim(),
            });

            setShowSuccess(true);

            redirectTimeoutRef.current = setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2000);
        } catch {
            setRegisterError(
                "No pudimos crear tu cuenta. Intentá nuevamente."
            );

            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar variant="register" />

            {showSuccess && (
                <Toast
                    variant="success"
                    title="¡Cuenta creada con éxito!"
                    message="Tu registro se completó correctamente."
                    duration={2000}
                    onClose={() => setShowSuccess(false)}
                />
            )}

            {registerError && (
                <Toast
                    variant="error"
                    title="No pudimos crear tu cuenta"
                    message={registerError}
                    duration={5000}
                    onClose={() => setRegisterError("")}
                />
            )}

            <main
                className="
                    min-h-[calc(100vh-73px)]
                    bg-teal-50/30
                    lg:flex
                "
            >
                <AuthWelcome
                    variant="light"
                    eyebrow="Personas que cuidan, vidas que se conectan"
                    title={
                        <>
                            Bienvenido a
                            <br />
                            CareConnect
                        </>
                    }
                    description="
                        Sumate a una comunidad que conecta familias
                        con personas dedicadas al cuidado.
                    "
                    benefits={registerBenefits}
                    image={registerCareImage}
                    imageAlt="Cuidadora acompañando a una persona mayor"
                />

                <section
                    className="
                        w-full min-w-0
                        px-6 py-8
                        sm:px-8
                        lg:w-1/2 lg:px-12 lg:py-6
                        xl:px-16
                        2xl:px-20
                    "
                >
                    <div
                        className="
                            mx-auto w-full max-w-md
                            rounded-2xl bg-white
                            sm:max-w-xl
                            lg:max-w-3xl lg:p-8 lg:shadow-sm
                        "
                    >
                        <div className="mb-6">
                            <p
                                className="
                                    mb-3 flex items-center gap-3
                                    text-sm font-medium text-gray-500
                                "
                            >
                                <span
                                    aria-hidden="true"
                                    className="
                                        h-1 w-10 rounded-full bg-teal-600
                                    "
                                />
                                Creá tu cuenta
                            </p>

                            <h1
                                className="
                                    text-2xl font-bold text-gray-900
                                    lg:text-3xl
                                "
                            >
                                Tus datos personales
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Completá tus datos para empezar.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            aria-busy={loading}
                            noValidate
                        >
                            <fieldset
                                disabled={loading}
                                className="
                                    m-0 flex min-w-0 w-full
                                    flex-col gap-6 border-0 p-0
                                "
                            >
                                <RegisterPersonalData
                                    formData={formData}
                                    handleChange={handleChange}
                                    confirmPassword={confirmPassword}
                                    handleConfirmPasswordChange={
                                        handleConfirmPasswordChange
                                    }
                                    errors={errors}
                                />

                                <RegisterRoleSelector
                                    selectedRole={formData.rol}
                                    onRoleChange={handleRoleChange}
                                />

                                {(formData.rol === "CUIDADOR" ||
                                    formData.rol === "ENFERMERO") && (
                                    <div ref={professionalSectionRef}>
                                        <RegisterProfessionalForm
                                            formData={formData}
                                            handleChange={handleChange}
                                            errors={errors}
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        w-full rounded-lg
                                        bg-gradient-to-r
                                        from-teal-600 to-teal-500
                                        px-4 py-3
                                        text-sm font-semibold text-white
                                        shadow-sm transition
                                        hover:from-teal-700 hover:to-teal-600
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >
                                    {loading
                                        ? "Creando cuenta..."
                                        : "Crear cuenta"}
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}