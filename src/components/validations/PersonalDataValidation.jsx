export const validateEmail = (value) => {
    const email = String(value ?? "").trim();

    if (!email) {
        return "El correo electrónico es obligatorio";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Ingresá un correo electrónico válido";
    }

    return "";
};

export const validateLoginPassword = (password) => {
    if (!password) {
        return "Ingresá tu contraseña";
    }

    return "";
};

export const ValidatePersonalData = (formData, confirmPassword) => {
    const errors = {};

    // Nombre
    if (!formData.nombre.trim()) {
        errors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 2) {
        errors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    // Apellido
    if (!formData.apellido.trim()) {
        errors.apellido = "El apellido es obligatorio";
    } else if (formData.apellido.trim().length < 2) {
        errors.apellido = "El apellido debe tener al menos 2 caracteres";
    }

    // Correo: misma función para registro, login y recuperación
    const emailError = validateEmail(formData.email);

    if (emailError) {
        errors.email = emailError;
    }

    // Teléfono
    if (!formData.telefono.trim()) {
        errors.telefono = "El teléfono es obligatorio";
    } else if (!/^\d{8,15}$/.test(formData.telefono)) {
        errors.telefono = "Ingresá un teléfono válido";
    }

    // DNI
    if (!formData.dni.trim()) {
        errors.dni = "El DNI es obligatorio";
    } else if (!/^\d{7,8}$/.test(formData.dni)) {
        errors.dni = "Ingresá un DNI válido de 7 u 8 dígitos";
    }

    // Contraseña de registro
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*!?]).{8,}$/;

    if (!formData.password) {
        errors.password = "required";
    } else if (!passwordRegex.test(formData.password)) {
        errors.password = "invalid";
    }

    // Confirmar contraseña
    if (!confirmPassword) {
        errors.confirmPassword = "Confirmá tu contraseña";
    } else if (formData.password !== confirmPassword) {
        errors.confirmPassword = "Las contraseñas no coinciden";
    }

    return errors;
};