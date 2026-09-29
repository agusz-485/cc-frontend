import { P } from "../../shared";

export function SeniorDetailSidebar({ selectedSenior }) {
    if (!selectedSenior) return null;

    const calcularEdad = (dobString) => {
        if (!dobString) return 0;
        const birthDate = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const initialLetter1 = selectedSenior.nombre?.[0] || "A";
    const initialLetter2 = selectedSenior.apellido?.[0] || "";

    return (
        <div className="bg-white rounded-3xl p-6 border shadow-sm space-y-4 text-left" style={{ borderColor: P.baseNeutral }}>
            <div className="text-center pb-4 border-b" style={{ borderColor: P.baseNeutral }}>
                <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-700 font-extrabold text-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                    {initialLetter1}{initialLetter2}
                </div>
                <h4 className="font-extrabold text-base" style={{ color: P.dark }}>
                    {selectedSenior.nombre} {selectedSenior.apellido || ""}
                </h4>
                <p className="text-xs" style={{ color: P.neutralDark }}>
                    DNI: {selectedSenior.dni || "Sin especificar"}
                </p>
            </div>

            <div className="space-y-2.5 text-xs font-semibold" style={{ color: P.dark }}>
                <div className="flex justify-between">
                    <span style={{ color: P.neutralDark }}>Edad:</span>
                    <span>{calcularEdad(selectedSenior.fechaNacimiento)} años</span>
                </div>
                <div className="flex justify-between">
                    <span style={{ color: P.neutralDark }}>Nacimiento:</span>
                    <span>{selectedSenior.fechaNacimiento || "No especificado"}</span>
                </div>
                <div className="flex justify-between">
                    <span style={{ color: P.neutralDark }}>Movilidad:</span>
                    <span className="font-bold text-slate-700">{selectedSenior.movilidad || "Autónomo"}</span>
                </div>
                {selectedSenior.parentesco && (
                    <div className="flex justify-between">
                        <span style={{ color: P.neutralDark }}>Parentesco:</span>
                        <span>{selectedSenior.parentesco}</span>
                    </div>
                )}
                {selectedSenior.fechaCreacion && (
                    <div className="flex justify-between">
                        <span style={{ color: P.neutralDark }}>Creado el:</span>
                        <span>{selectedSenior.fechaCreacion}</span>
                    </div>
                )}
                {selectedSenior.fechaActualizacion && (
                    <div className="flex justify-between">
                        <span style={{ color: P.neutralDark }}>Actualizado el:</span>
                        <span>{selectedSenior.fechaActualizacion}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SeniorDetailSidebar;
