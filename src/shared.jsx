// Shared palette, types, data, and UI primitives
export const P = {
    primary: "#0B4B59",        // Teal corporativo principal
    secondary: "#4EA6AA",      // Teal claro secundario / hover
    accent: "#FF8A3D",         // Naranja de acción / resalte
    neutralDark: "#75898E",    // Gris-teal de textos secundarios
    neutralLight: "#F2FBFA",   // Fondo verde menta súper suave
    baseNeutral: "#D7E0E2",    // Bordes y separadores sutiles
    dark: "#103E4C",           // Fondo oscuro de barras y contenedores
};
export function formatARS(n) {
    return `$${n.toLocaleString("es-AR")}`;
}
export const CAREGIVERS = [
    {
        id: 1,
        name: "María González",
        location: "Recoleta, Buenos Aires",
        specialties: ["Alzheimer", "Acompañamiento", "Rehabilitación"],
        hourlyRate: 4500, dailyRate: 32000, rating: 4.9, reviews: 47,
        verified: false, available: true,
        tipo: "enfermero",
        image: null,
        bio: "Enfermera titulada con 12 años de experiencia en cuidado de adultos mayores y enfermedades neurodegenerativas. Especializada en pacientes con Alzheimer y movilidad reducida, con un enfoque cálido, profesional y humanista que pone al paciente y a la familia siempre en el centro.",
        experience: 12,
        certifications: ["Enfermería Geriátrica", "RCP Avanzado", "Cuidados Paliativos"],
    },
];
export const REVIEWS = [
    { author: "Familia Martín", rating: 5, date: "15 Jun 2026", text: "María es extraordinaria. Cuida a mi madre con una dedicación y cariño increíbles. Siempre puntual y muy profesional. 100% recomendable a cualquier familia." },
    { author: "Pedro Alonso", rating: 5, date: "2 Jun 2026", text: "Llevamos 6 meses con María y no podríamos estar más satisfechos. Mi padre ha mejorado notablemente gracias a su ayuda y metodología de trabajo." },
    { author: "Isabel Vargas", rating: 4, date: "18 May 2026", text: "Muy buena profesional. Organizada y empática. Algunos ajustes pequeños al inicio pero después todo perfecto y muy fluido." },
];
export const INITIAL_MESSAGES = [
    { id: 1, sender: "caregiver", text: "Buenos días! Le confirmo que estaré disponible los días 7, 8 y 9 de julio tal como acordamos. ¿Tiene alguna indicación especial para los medicamentos de su padre?", time: "09:14" },
    { id: 2, sender: "user", text: "Buenos días María. Sí, el Dr. Ramírez indicó que la metformina debe tomarse con el desayuno y el ramipril por las noches. Le enviaré la receta escaneada.", time: "09:22" },
    { id: 3, sender: "caregiver", text: "Perfecto, anotado. También quisiera saber si el Sr. García prefiere salir a pasear por las mañanas o por las tardes.", time: "09:25" },
    { id: 4, sender: "user", text: "Por las mañanas es mejor, después de desayunar. Le encanta el parque del barrio, a unos 5 minutos caminando.", time: "09:31" },
    { id: 5, sender: "caregiver", text: "Excelente! Prepararé una rutina personalizada para él. Estaré allí el lunes a las 8:30. Cuídense mucho 😊", time: "09:33" },
];
// --- Shared UI components ---
import { Star, CheckCircle } from "lucide-react";
export function StarRating({ rating, size = "sm" }) {
    const sizes = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };
    return (<div className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className={`${sizes[size]} ${s <= Math.round(rating) ? "fill-current" : "opacity-20 fill-current"}`} style={{ color: s <= Math.round(rating) ? P.accent : P.neutralDark }}/>))}
    </div>);
}
export function SpecialtyBadge({ label }) {
    return (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "#e8f4f8", color: P.primary }}>
      {label}
    </span>);
}
export function VerifiedBadge() {
    return (<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "#e8f6ee", color: "#16a34a" }}>
      <CheckCircle className="w-3 h-3"/>
      Verificada
    </span>);
}
