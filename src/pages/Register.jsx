import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import RegisterProfessionalForm from "../components/auth/RegisterProfessionalForm";

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

        // Cuidador
        zonaPrincipal: "",
        precioHora: "",

        // Enfermero
        matriculaProfesional: "",
        tipoMatricula: "",
        nivelProfesional: "",
        institucionEgreso: "",
        seguroMalaPraxis: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await authService.register(formData);

            alert("Usuario registrado correctamente");

            navigate("/login");

        } catch (error) {
            console.error("Error al registrar:", error);
            alert("Error al registrar usuario");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3"
            >
                <h1 className="text-2xl font-bold mb-4">
                    Registro de usuario
                </h1>

                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="dni"
                    placeholder="DNI"
                    value={formData.dni}
                    onChange={handleChange}
                />

                <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                >
                    <option value="FAMILIAR">Familiar</option>
                    <option value="CUIDADOR">Cuidador</option>
                    <option value="ENFERMERO">Enfermero</option>
                </select>

                {(formData.rol === "CUIDADOR" ||
                    formData.rol === "ENFERMERO") && (
                        <RegisterProfessionalForm
                            formData={formData}
                            handleChange={handleChange}
                        />
                    )}

                <button type="submit">
                    Registrar
                </button>
            </form>

        </div>
    );
}