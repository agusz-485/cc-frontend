import { useState, useEffect } from "react";
import { SubSectionDatosObligatorios } from "./SubSectionDatosObligatorios";
import { SubSectionZonasCobertura } from "./SubSectionZonasCobertura";
import { SubSectionCertificados } from "./SubSectionCertificados";
import { SubSectionChecklistPublicacion } from "./SubSectionChecklistPublicacion";
import { SubSectionHeaderAcciones } from "./SubSectionHeaderAcciones";

export function SectionPerfilProfesional({ caregiverData, setCaregiverData, onSaveProfile }) {
    const specialtiesOptions = ["Alzheimer", "Parkinson", "Post-operatorio", "Rehabilitación", "Cuidados Paliativos", "Acompañamiento"];

    const [professionalType, setProfessionalType] = useState(caregiverData?.professionalType || "cuidador");
    const [matricula, setMatricula] = useState(caregiverData?.matricula || "");
    const [experience, setExperience] = useState(caregiverData?.experience || "");
    const [price, setPrice] = useState(caregiverData?.price || "");
    const [bio, setBio] = useState(caregiverData?.bio || "");
    const [mainZone, setMainZone] = useState(caregiverData?.mainZone || "");
    const [coverageZones, setCoverageZones] = useState(caregiverData?.coverageZones || []);
    const [selectedSpecs, setSelectedSpecs] = useState(caregiverData?.selectedSpecs || []);

    const [selProv, setSelProv] = useState("");
    const [selCity, setSelCity] = useState("");

    const [certs, setCerts] = useState(caregiverData?.certs || []);
    const [newCertTitle, setNewCertTitle] = useState("");
    const [newCertIssuer, setNewCertIssuer] = useState("");
    const [newCertDate, setNewCertDate] = useState("");
    const [newCertFile, setNewCertFile] = useState("");

    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (caregiverData) {
            setProfessionalType(caregiverData.professionalType || "cuidador");
            setMatricula(caregiverData.matricula || "");
            setExperience(caregiverData.experience !== undefined && caregiverData.experience !== null ? String(caregiverData.experience) : "");
            setPrice(caregiverData.price !== undefined && caregiverData.price !== null ? String(caregiverData.price) : "");
            setBio(caregiverData.bio || "");
            setMainZone(caregiverData.mainZone || "");
            setCoverageZones(caregiverData.coverageZones || []);
            setSelectedSpecs(caregiverData.selectedSpecs || []);
            setCerts(caregiverData.certs || []);
        }
    }, [caregiverData]);

    const isMatriculaValid = professionalType === "cuidador" || matricula.trim().length > 0;
    const isBioValid = bio.trim().length >= 20;
    const isExperienceValid = String(experience).trim().length > 0 && Number(experience) >= 0;
    const isPriceValid = Number(price) > 0;
    const isMainZoneValid = mainZone.trim().length > 0;
    const hasSpecialty = professionalType === "enfermero" || selectedSpecs.length > 0;
    const hasActiveCert = professionalType === "enfermero" || certs.some(c => c.active);

    const isProfileCompletable = isMatriculaValid && isBioValid && isExperienceValid && isPriceValid && isMainZoneValid && hasSpecialty && hasActiveCert;

    const toggleSpec = (spec) => {
        setSelectedSpecs(prev => prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]);
    };

    const addCoverageZone = () => {
        if (!selProv || !selCity) return;
        const newZone = `${selCity}, ${selProv}`;
        if (!coverageZones.includes(newZone)) {
            setCoverageZones(prev => [...prev, newZone]);
        }
        setSelCity("");
    };

    const removeCoverageZone = (zoneToRemove) => {
        setCoverageZones(prev => prev.filter(z => z !== zoneToRemove));
    };

    const addCert = (e) => {
        e.preventDefault();
        if (!newCertTitle || !newCertIssuer) return;
        const newCert = {
            id: certs.length + 1,
            title: newCertTitle,
            issuer: newCertIssuer,
            active: true,
            validUntil: newCertDate || "2028-12-31",
            fileUrl: newCertFile || "",
            archivoUrl: newCertFile || "",
        };
        setCerts([...certs, newCert]);
        setNewCertTitle("");
        setNewCertIssuer("");
        setNewCertDate("");
        setNewCertFile("");
    };

    const deleteCert = (id) => {
        setCerts(certs.filter(c => c.id !== id));
    };

    const executeSave = async (updatedData) => {
        setSaving(true);
        setSaveError("");
        try {
            if (onSaveProfile) {
                await onSaveProfile(updatedData);
            } else if (setCaregiverData) {
                setCaregiverData(updatedData);
            }
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error("Error al guardar perfil en la base de datos:", err);
            setSaveError(err.response?.data?.message || "Error al sincronizar con el servidor");
            setTimeout(() => setSaveError(""), 4000);
        } finally {
            setSaving(false);
        }
    };

    const buildProfilePayload = (extra = {}) => ({
        ...caregiverData,
        professionalType,
        matricula: professionalType === "enfermero" ? matricula : "",
        experience,
        price,
        bio,
        mainZone,
        coverageZones: professionalType === "cuidador" ? coverageZones : [],
        selectedSpecs: professionalType === "cuidador" ? selectedSpecs : [],
        certs: professionalType === "cuidador" ? certs : [],
        ...extra
    });

    const handleSave = () => executeSave(buildProfilePayload());
    const handlePublish = () => isProfileCompletable && executeSave(buildProfilePayload({ visible: true }));
    const handleUnpublish = () => executeSave({ ...caregiverData, visible: false });

    return (
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: "#f8fbfd" }}>
            <div className="max-w-5xl mx-auto">
                <SubSectionHeaderAcciones
                    caregiverData={caregiverData}
                    isProfileCompletable={isProfileCompletable}
                    saving={saving}
                    saveSuccess={saveSuccess}
                    saveError={saveError}
                    handlePublish={handlePublish}
                    handleUnpublish={handleUnpublish}
                    handleSave={handleSave}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Fields Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <SubSectionDatosObligatorios
                            professionalType={professionalType}
                            setProfessionalType={setProfessionalType}
                            matricula={matricula}
                            setMatricula={setMatricula}
                            isMatriculaValid={isMatriculaValid}
                            experience={experience}
                            setExperience={setExperience}
                            isExperienceValid={isExperienceValid}
                            price={price}
                            setPrice={setPrice}
                            isPriceValid={isPriceValid}
                            mainZone={mainZone}
                            setMainZone={setMainZone}
                            isMainZoneValid={isMainZoneValid}
                            bio={bio}
                            setBio={setBio}
                            isBioValid={isBioValid}
                            selectedSpecs={selectedSpecs}
                            toggleSpec={toggleSpec}
                            hasSpecialty={hasSpecialty}
                            specialtiesOptions={specialtiesOptions}
                        />

                        {professionalType === "cuidador" && (
                            <>
                                <SubSectionZonasCobertura
                                    coverageZones={coverageZones}
                                    addCoverageZone={addCoverageZone}
                                    removeCoverageZone={removeCoverageZone}
                                    selProv={selProv}
                                    setSelProv={setSelProv}
                                    selCity={selCity}
                                    setSelCity={setSelCity}
                                />

                                <SubSectionCertificados
                                    certs={certs}
                                    addCert={addCert}
                                    deleteCert={deleteCert}
                                    newCertTitle={newCertTitle}
                                    setNewCertTitle={setNewCertTitle}
                                    newCertIssuer={newCertIssuer}
                                    setNewCertIssuer={setNewCertIssuer}
                                    newCertDate={newCertDate}
                                    setNewCertDate={setNewCertDate}
                                    newCertFile={newCertFile}
                                    setNewCertFile={setNewCertFile}
                                />
                            </>
                        )}
                    </div>

                    {/* Right: Validation Checklist */}
                    <div>
                        <SubSectionChecklistPublicacion
                            professionalType={professionalType}
                            isMatriculaValid={isMatriculaValid}
                            isBioValid={isBioValid}
                            isExperienceValid={isExperienceValid}
                            isPriceValid={isPriceValid}
                            isMainZoneValid={isMainZoneValid}
                            hasSpecialty={hasSpecialty}
                            hasActiveCert={hasActiveCert}
                            isProfileCompletable={isProfileCompletable}
                            caregiverData={caregiverData}
                            handlePublish={handlePublish}
                            handleUnpublish={handleUnpublish}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SectionPerfilProfesional;
