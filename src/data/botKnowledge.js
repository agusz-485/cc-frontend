// Base de conocimiento interactiva para CareBot (Asistente de Ayuda y Soporte)

export const BOT_CATEGORIES = [
    {
        id: "contratacion",
        title: "Contratación y Turnos",
        icon: "Calendar",
        description: "Cómo buscar cuidadores, solicitar turnos y gestionar reservas."
    },
    {
        id: "resenas",
        title: "Reseñas y Calificaciones",
        icon: "Star",
        description: "Sistema de estrellas, comentarios y reputación."
    },
    {
        id: "pagos",
        title: "Tarifas y Pagos",
        icon: "CreditCard",
        description: "Costos por hora, formas de cobro y facturación."
    },
    {
        id: "seguridad",
        title: "Verificación y Seguridad",
        icon: "ShieldCheck",
        description: "Matrículas profesionales, validación y perfiles seguros."
    },
    {
        id: "reportes",
        title: "Reportar un Incidente",
        icon: "AlertTriangle",
        description: "Crear un ticket de reporte sobre un usuario, turno o falla técnica."
    },
    {
        id: "cuenta",
        title: "Mi Cuenta y Perfil",
        icon: "User",
        description: "Modificar datos personales, foto, contraseña y preferencias."
    }
];

export const BOT_FAQS = [
    {
        id: "faq_contratar",
        categoryId: "contratacion",
        question: "¿Cómo contratar a un cuidador o enfermero?",
        summary: "Paso a paso para buscar y enviar una solicitud de servicio.",
        answer: `Para contratar a un profesional en CareConnect:
1. **Explora el Directorio:** Ve a la pestaña **Marketplace / Profesionales** y usa los filtros por rol (Cuidador/Enfermero), especialidad, tarifa o ubicación.
2. **Revisa el Perfil:** Haz clic en **"Ver Perfil"** para consultar su biografía, matrícula verificada, experiencia y reseñas reales.
3. **Solicita el Turno:** Haz clic en **"Contratar Servicio"** o **"Solicitar Turno"**, selecciona la fecha, horario y detalles del paciente.
4. **Coordinación:** El profesional recibirá tu solicitud en su panel y podrá aceptarla. Podrán comunicarse mediante el chat interno seguro.`,
        suggestedActions: [
            { label: "Ir al Marketplace", route: "/directory" },
            { label: "Ver mis reservas", route: "/dashboard" }
        ]
    },
    {
        id: "faq_cancelar_turno",
        categoryId: "contratacion",
        question: "¿Cómo cancelar o modificar una reserva?",
        summary: "Políticas de cancelación y pasos en el panel de reservas.",
        answer: `Puedes gestionar tus reservas desde tu panel:
* Ve a **Mi Panel > Mis Reservas / Turnos**.
* Selecciona la solicitud correspondiente.
* Si el turno aún está **Pendiente**, puedes cancelarlo sin penalización.
* Si ya fue **Aceptado**, te recomendamos avisar al profesional mediante el **Chat** antes de cancelarlo para coordinar adecuadamente.`,
        suggestedActions: [
            { label: "Ir a Mis Turnos", route: "/dashboard" }
        ]
    },
    {
        id: "faq_resenas",
        categoryId: "resenas",
        question: "¿Cómo calificar y dejar una reseña a un profesional?",
        summary: "Calificación con estrellas y comentarios una vez finalizado el servicio.",
        answer: `El sistema de reseñas asegura la confianza en la comunidad:
1. Una vez que el turno figure como **COMPLETADO / FINALIZADO**, aparecerá automáticamente la opción de **"Dejar Reseña"** en tu lista de turnos.
2. Las **estrellas (de 1 a 5) son obligatorias** para registrar tu nivel de satisfacción.
3. El **comentario de texto es opcional**.
4. Cada usuario puede emitir **una reseña por servicio prestado**, la cual se refleja de inmediato en el perfil público del profesional y en el Marketplace.`,
        suggestedActions: [
            { label: "Ver Profesionales con Reseñas", route: "/directory" }
        ]
    },
    {
        id: "faq_tarifas",
        categoryId: "pagos",
        question: "¿Cómo se calculan las tarifas y cómo se abona?",
        summary: "Información sobre tarifas por hora, turnos prolongados y medios de pago.",
        answer: `* **Tarifa por hora:** Cada cuidador o enfermero establece su valor por hora en su perfil público.
* **Cálculo total:** Al seleccionar los horarios de inicio y fin, la plataforma calcula automáticamente el monto estimado según las horas del turno.
* **Guardias y Servicios Especiales:** Pueden aplicar tarifas diferenciales acordadas para guardias nocturnas o feriados.`,
        suggestedActions: [
            { label: "Consultar Tarifas en el Directorio", route: "/directory" }
        ]
    },
    {
        id: "faq_verificacion",
        categoryId: "seguridad",
        question: "¿Cómo se valida la matrícula de los enfermeros?",
        summary: "Proceso de auditoría y sello de verificación oficial.",
        answer: `En CareConnect la seguridad es prioritaria:
* Los enfermeros matriculados deben subir su número de matrícula nacional/provincial y la documentación respaldatoria.
* El equipo administrativo audita los antecedentes y valida la autenticidad con los registros de salud oficiales.
* Los perfiles verificados cuentan con la insignia azul **"Matrícula Verificada"** en el Marketplace.`,
        suggestedActions: [
            { label: "Ver perfiles verificados", route: "/directory" }
        ]
    },
    {
        id: "faq_reportar_usuario",
        categoryId: "reportes",
        question: "¿Qué hago si tuve un problema con un usuario o turno?",
        summary: "Pasos para abrir un reporte oficial con el equipo de soporte y moderación.",
        answer: `Si experimentaste una conducta inapropiada, inasistencia sin aviso, o un problema con el servicio:
1. Puedes abrir un **Reporte de Incidente** directamente desde este asistente seleccionando la opción **"🚨 Reportar Incidente"**.
2. Nuestro equipo administrativo revisará el caso con prioridad y aplicará las medidas disciplinarias o suspensiones correspondientes.
3. Se te asignará un código de seguimiento (**#REP-XXXX**) para consultar la resolución.`,
        suggestedActions: [
            { label: "🚨 Iniciar Reporte Ahora", action: "START_REPORT_WIZARD" }
        ]
    },
    {
        id: "faq_modificar_perfil",
        categoryId: "cuenta",
        question: "¿Cómo edito mi información personal, foto o tarifa?",
        summary: "Acceso a la configuración de cuenta y perfil profesional.",
        answer: `Para actualizar tus datos:
1. Ingresa a **Mi Panel**.
2. Dirígete a la sección **Configuración** (o **Mi Perfil**).
3. Podrás cambiar tu biografía, especialidades, teléfono, foto de perfil y tarifa por hora. Guarda los cambios para que se reflejen al instante.`,
        suggestedActions: [
            { label: "Ir a Configuración", route: "/dashboard" }
        ]
    },
    {
        id: "faq_soporte_humano",
        categoryId: "reportes",
        question: "¿Cómo contacto directamente a soporte humano?",
        summary: "Canales de contacto y atención telefónica de emergencia.",
        answer: `Si requieres asistencia directa de un agente de soporte:
* ✉️ **Correo electrónico:** soporte@careconnect.com
* ⏱️ **Horario de atención:** Lunes a Sábados de 08:00 a 20:00 hs.
* 🚨 **Emergencias médicas:** Por favor comunicate de inmediato con el servicio de emergencias médicas local (ej. 107 / 911).`,
        suggestedActions: [
            { label: "🚨 Iniciar Reporte en Plataforma", action: "START_REPORT_WIZARD" }
        ]
    }
];

export const INITIAL_QUICK_PROMPTS = [
    { label: "🔍 ¿Cómo contratar?", faqId: "faq_contratar" },
    { label: "⭐ Reseñas y Estrellas", faqId: "faq_resenas" },
    { label: "💰 Tarifas y Pagos", faqId: "faq_tarifas" },
    { label: "🛡️ Verificación Médica", faqId: "faq_verificacion" },
    { label: "🚨 Reportar un Problema", action: "START_REPORT_WIZARD" },
    { label: "📋 Mis Tickets de Reporte", action: "VIEW_MY_REPORTS" }
];
