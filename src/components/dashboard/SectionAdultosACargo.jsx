import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { P } from "../../shared";
import { createAdultoMayor } from "../../services/adultoMayorService";
import { AdultoMayorCard } from "../familiar/AdultoMayorCard";
import { AdultoMayorFormModal } from "../familiar/AdultoMayorFormModal";
import { ConditionPanel } from "../familiar/ConditionPanel";
import { MedicationPanel } from "../familiar/MedicationPanel";
import { NeedsPanel } from "../familiar/NeedsPanel";
import { SeniorDetailSidebar } from "../familiar/SeniorDetailSidebar";

export function SectionAdultosACargo({ seniors, setSeniors }) {
    const [selectedSenior, setSelectedSenior] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const estaVigente = (startDateStr, endDateStr) => {
        if (!startDateStr || !endDateStr) return false;
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        const today = new Date("2026-07-29");
        return today >= start && today <= end;
    };

    const handleRegisterSenior = async (newSeniorData) => {
        const familiarId = Number(localStorage.getItem("user_id")) || 11;
        const payload = {
            ...newSeniorData,
            familiarId
        };
        const saved = await createAdultoMayor(payload);
        setSeniors(prev => [...prev, saved]);
        setShowAddForm(false);
    };

    const handleAddCondition = (conditionData) => {
        const newCond = {
            idCondicion: Date.now(),
            condicion: conditionData.condicion,
            diagnosticoFecha: conditionData.diagnosticoFecha || new Date().toISOString().split('T')[0],
            notas: conditionData.notas,
            activo: true,
            createdAt: new Date().toISOString()
        };

        const updated = seniors.map(s => {
            if (s.idAdultoMayor === selectedSenior.idAdultoMayor) {
                return {
                    ...s,
                    condiciones: [...(s.condiciones || []), newCond],
                    fechaActualizacion: new Date().toISOString().split('T')[0]
                };
            }
            return s;
        });

        setSeniors(updated);
        setSelectedSenior(updated.find(s => s.idAdultoMayor === selectedSenior.idAdultoMayor));
    };

    const handleAddMedication = (medicationData) => {
        const newMed = {
            idMedicamento: Date.now(),
            nombreMedicamento: medicationData.nombreMedicamento,
            monodroga: medicationData.monodroga,
            dosis: medicationData.dosis,
            frecuencia: medicationData.frecuencia,
            horario: medicationData.horario,
            activo: true,
            inicio: medicationData.inicio,
            fin: medicationData.fin
        };

        const updated = seniors.map(s => {
            if (s.idAdultoMayor === selectedSenior.idAdultoMayor) {
                return {
                    ...s,
                    medicamentos: [...(s.medicamentos || []), newMed],
                    fechaActualizacion: new Date().toISOString().split('T')[0]
                };
            }
            return s;
        });

        setSeniors(updated);
        setSelectedSenior(updated.find(s => s.idAdultoMayor === selectedSenior.idAdultoMayor));
    };

    const handleAddNeed = (needData) => {
        const newNeed = {
            id: Date.now(),
            necesidad: needData.necesidad,
            createdAt: new Date().toISOString()
        };

        const updated = seniors.map(s => {
            if (s.idAdultoMayor === selectedSenior.idAdultoMayor) {
                return {
                    ...s,
                    necesidades: [...(s.necesidades || []), newNeed],
                    fechaActualizacion: new Date().toISOString().split('T')[0]
                };
            }
            return s;
        });

        setSeniors(updated);
        setSelectedSenior(updated.find(s => s.idAdultoMayor === selectedSenior.idAdultoMayor));
    };

    const deleteCondition = (id) => {
        const updated = seniors.map(s => {
            if (s.idAdultoMayor === selectedSenior.idAdultoMayor) {
                return {
                    ...s,
                    condiciones: (s.condiciones || []).filter(c => c.idCondicion !== id),
                    fechaActualizacion: new Date().toISOString().split('T')[0]
                };
            }
            return s;
        });
        setSeniors(updated);
        setSelectedSenior(updated.find(s => s.idAdultoMayor === selectedSenior.idAdultoMayor));
    };

    const deleteMedication = (id) => {
        const updated = seniors.map(s => {
            if (s.idAdultoMayor === selectedSenior.idAdultoMayor) {
                return {
                    ...s,
                    medicamentos: (s.medicamentos || []).filter(m => m.idMedicamento !== id),
                    fechaActualizacion: new Date().toISOString().split('T')[0]
                };
            }
            return s;
        });
        setSeniors(updated);
        setSelectedSenior(updated.find(s => s.idAdultoMayor === selectedSenior.idAdultoMayor));
    };

    const deleteNeed = (id) => {
        const updated = seniors.map(s => {
            if (s.idAdultoMayor === selectedSenior.idAdultoMayor) {
                return {
                    ...s,
                    necesidades: (s.necesidades || []).filter(n => n.id !== id),
                    fechaActualizacion: new Date().toISOString().split('T')[0]
                };
            }
            return s;
        });
        setSeniors(updated);
        setSelectedSenior(updated.find(s => s.idAdultoMayor === selectedSenior.idAdultoMayor));
    };

    return (
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#f8fbfd" }}>
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center flex-wrap gap-4 text-left">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: P.dark, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Adultos Mayores a Cargo
                        </h1>
                        <p className="text-sm mt-0.5" style={{ color: P.neutralDark }}>Gestión de historial clínico, medicamentos y necesidades diarias.</p>
                    </div>

                    {!selectedSenior && !showAddForm && (
                        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-95 pointer-events-auto cursor-pointer" style={{ backgroundColor: P.primary }}>
                            <Plus className="w-4 h-4" /> Agregar Adulto Mayor
                        </button>
                    )}

                    {(selectedSenior || showAddForm) && (
                        <button onClick={() => { setSelectedSenior(null); setShowAddForm(false); }} className="px-4 py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-neutral-50 cursor-pointer" style={{ borderColor: P.baseNeutral, color: P.dark }}>
                            Volver al Listado
                        </button>
                    )}
                </div>

                {/* VIEW: MAIN LIST OF SENIORS */}
                {!selectedSenior && !showAddForm && (
                    seniors.length === 0 ? (
                        <div className="bg-white rounded-3xl p-8 border text-center border-dashed" style={{ borderColor: P.baseNeutral }}>
                            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="font-bold text-slate-700">No hay adultos mayores a cargo registrados</p>
                            <p className="text-xs text-slate-500 mt-1 mb-4">Registra a las personas bajo tu cuidado para gestionar su historial médico.</p>
                            <button onClick={() => setShowAddForm(true)} className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md cursor-pointer" style={{ backgroundColor: P.primary }}>
                                Agregar Adulto Mayor
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {seniors.map(s => (
                                <AdultoMayorCard 
                                    key={s.idAdultoMayor || s.id} 
                                    senior={s} 
                                    onViewClinicalHistory={setSelectedSenior} 
                                />
                            ))}
                        </div>
                    )
                )}

                <AdultoMayorFormModal 
                    isOpen={showAddForm} 
                    onClose={() => setShowAddForm(false)} 
                    onSubmit={handleRegisterSenior} 
                />

                {/* VIEW: CLINICAL HISTORIAL (DETAIL) */}
                {selectedSenior && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: General Card & Conditions & Needs */}
                        <div className="lg:col-span-2 space-y-6">
                            <ConditionPanel 
                                selectedSenior={selectedSenior}
                                onAddCondition={handleAddCondition}
                                onDeleteCondition={deleteCondition}
                            />

                            <MedicationPanel 
                                selectedSenior={selectedSenior}
                                onAddMedication={handleAddMedication}
                                onDeleteMedication={deleteMedication}
                                estaVigente={estaVigente}
                            />
                        </div>

                        {/* Right: Senior Profile Sidebar & Needs */}
                        <div className="space-y-6">
                            <SeniorDetailSidebar selectedSenior={selectedSenior} />

                            <NeedsPanel 
                                selectedSenior={selectedSenior}
                                onAddNeed={handleAddNeed}
                                onDeleteNeed={deleteNeed}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SectionAdultosACargo;
