export const ValidateProfessionalData = (formData) => {
    const errors = {};

    // Cuidador
    if (formData.rol === "CUIDADOR") {
        if (!formData.zonaPrincipal.trim()) {
            errors.zonaPrincipal =
                "La zona donde trabajás es obligatoria";
        }

        if (!formData.precioHora) {
            errors.precioHora =
                "La tarifa por hora es obligatoria";
        } else if (Number(formData.precioHora) <= 0) {
            errors.precioHora =
                "La tarifa debe ser mayor a $0";
        }
    }

    // Enfermero
    if (formData.rol === "ENFERMERO") {
        if (!formData.matriculaProfesional.trim()) {
            errors.matriculaProfesional =
                "La matrícula profesional es obligatoria";
        }

        if (!formData.tipoMatricula) {
            errors.tipoMatricula =
                "Seleccioná el tipo de matrícula";
        }

        if (!formData.nivelProfesional.trim()) {
            errors.nivelProfesional =
                "La especialidad o nivel es obligatorio";
        }

        if (!formData.institucionEgreso.trim()) {
            errors.institucionEgreso =
                "La institución de egreso es obligatoria";
        }

        if (!formData.seguroMalaPraxis.trim()) {
            errors.seguroMalaPraxis =
                "El seguro de mala praxis es obligatorio";
        }
    }

    return errors;
};