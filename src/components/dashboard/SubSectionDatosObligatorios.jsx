import { P } from "../../shared";

export function SubSectionDatosObligatorios({
    professionalType,
    setProfessionalType,
    matricula,
    setMatricula,
    isMatriculaValid,
    experience,
    setExperience,
    isExperienceValid,
    price,
    setPrice,
    isPriceValid,
    mainZone,
    setMainZone,
    isMainZoneValid,
    bio,
    setBio,
    isBioValid,
    selectedSpecs,
    toggleSpec,
    hasSpecialty,
    specialtiesOptions
}) {
    return (
        <div className="bg-white rounded-3xl p-6 border space-y-4 shadow-sm" style={{ borderColor: P.baseNeutral }}>
            <h3 className="font-bold text-base border-b pb-2.5" style={{ color: P.dark }}>Datos Obligatorios</h3>

            <div className="mb-4 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: P.dark }}>
                    Tipo de Profesional <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    {["cuidador", "enfermero"].map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setProfessionalType(t)}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border"
                            style={{
                                backgroundColor: professionalType === t ? P.primary : "transparent",
                                color: professionalType === t ? "white" : P.dark,
                                borderColor: professionalType === t ? P.primary : P.baseNeutral
                            }}
                        >
                            {t === "cuidador" ? "🩺 Cuidador" : "🏥 Enfermero"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {professionalType === "enfermero" && (
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: P.dark }}>
                            Matrícula Profesional <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={matricula}
                            onChange={e => setMatricula(e.target.value)}
                            placeholder="Ej. MN-49281-ENF"
                            className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all"
                            style={{ borderColor: isMatriculaValid ? P.baseNeutral : "#f87171" }}
                        />
                        {!isMatriculaValid && <p className="text-[10px] text-red-500 mt-1">Este campo es requerido para Enfermeros.</p>}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: P.dark }}>
                        Años de Experiencia <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={experience}
                        onChange={e => setExperience(e.target.value)}
                        placeholder="Ej. 5"
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all"
                        style={{ borderColor: isExperienceValid ? P.baseNeutral : "#f87171" }}
                    />
                    {!isExperienceValid && <p className="text-[10px] text-red-500 mt-1">Debe ingresar años válidos.</p>}
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: P.dark }}>
                        Precio por Hora ($ ARS) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder="Ej. 4500"
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all"
                        style={{ borderColor: isPriceValid ? P.baseNeutral : "#f87171" }}
                    />
                    {!isPriceValid && <p className="text-[10px] text-red-500 mt-1">Debe ingresar una tarifa válida.</p>}
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: P.dark }}>
                        Zona Principal de Trabajo <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={mainZone}
                        onChange={e => setMainZone(e.target.value)}
                        placeholder="Ej. Palermo, CABA"
                        className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-all"
                        style={{ borderColor: isMainZoneValid ? P.baseNeutral : "#f87171" }}
                    />
                    {!isMainZoneValid && <p className="text-[10px] text-red-500 mt-1">Este campo es requerido.</p>}
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: P.dark }}>
                    Descripción / Biografía <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Describe tu metodología de trabajo, experiencia geriátrica y por qué las familias deberían elegirte..."
                    rows={4}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none resize-none transition-all"
                    style={{ borderColor: isBioValid ? P.baseNeutral : "#f87171" }}
                />
                <div className="flex justify-between mt-1">
                    <span className="text-[10px]" style={{ color: P.neutralDark }}>Mínimo 20 caracteres requeridos.</span>
                    <span className="text-[10px]" style={{ color: bio.length >= 20 ? "green" : "red" }}>{bio.length} caracteres</span>
                </div>
            </div>

            {professionalType === "cuidador" && (
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: P.dark }}>
                        Especialidades Médicas <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {specialtiesOptions.map(spec => {
                            const active = selectedSpecs.includes(spec);
                            return (
                                <button
                                    key={spec}
                                    type="button"
                                    onClick={() => toggleSpec(spec)}
                                    className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                                    style={{
                                        borderColor: active ? P.primary : P.baseNeutral,
                                        backgroundColor: active ? `${P.primary}12` : "transparent",
                                        color: active ? P.primary : P.neutralDark,
                                    }}
                                >
                                    {spec}
                                </button>
                            );
                        })}
                    </div>
                    {!hasSpecialty && <p className="text-[10px] text-red-500 mt-2">Selecciona al menos una especialidad médica.</p>}
                </div>
            )}
        </div>
    );
}
