import api from "../api/client";

// Fallback local si el backend está apagado
const getLocalSeniors = (familiarId) => {
  const localDetails = JSON.parse(localStorage.getItem("seniors_details") || "{}");
  const allSeniors = Object.keys(localDetails).map(id => ({
    idAdultoMayor: Number(id),
    id: Number(id),
    ...localDetails[id]
  }));
  return allSeniors.filter(s => Number(s.familiarId) === Number(familiarId));
};

export const getAdultosMayores = async (familiarId) => {
  try {
    const response = await api.get("/adultos-mayores");
    const resData = response.data;
    const localDetails = JSON.parse(localStorage.getItem("seniors_details") || "{}");
    
    return resData
      .filter(s => Number(s.familiarId) === Number(familiarId))
      .map(s => {
        const id = s.idAdultoMayor || s.id;
        const localDet = localDetails[id] || {};
        return {
          ...s,
          idAdultoMayor: id,
          foto: localDet.foto || s.foto || s.fotoPerfil || undefined,
          condiciones: localDet.condiciones || s.condiciones || [],
          medicamentos: localDet.medicamentos || s.medicamentos || [],
          necesidades: localDet.necesidades || s.necesidades || []
        };
      });
  } catch (err) {
    console.warn("Error al conectar al backend. Usando mocks locales:", err);
    return getLocalSeniors(familiarId);
  }
};

export const createAdultoMayor = async (payload) => {
  try {
    const response = await api.post("/adultos-mayores", payload);
    const resData = response.data;
    const id = resData.idAdultoMayor || resData.id;
    
    const localDetails = JSON.parse(localStorage.getItem("seniors_details") || "{}");
    localDetails[id] = {
      ...payload,
      idAdultoMayor: id,
      foto: payload.foto || undefined,
      condiciones: [],
      medicamentos: [],
      necesidades: []
    };
    localStorage.setItem("seniors_details", JSON.stringify(localDetails));
    
    return {
      ...resData,
      idAdultoMayor: id,
      foto: payload.foto || undefined,
      condiciones: [],
      medicamentos: [],
      necesidades: []
    };
  } catch (err) {
    console.warn("Backend offline. Guardando localmente:", err);
    const localDetails = JSON.parse(localStorage.getItem("seniors_details") || "{}");
    const newId = Date.now();
    const mockSenior = {
      ...payload,
      idAdultoMayor: newId,
      id: newId,
      condiciones: [],
      medicamentos: [],
      necesidades: []
    };
    localDetails[newId] = mockSenior;
    localStorage.setItem("seniors_details", JSON.stringify(localDetails));
    return mockSenior;
  }
};

export const updateAdultoMayorLocalDetails = (id, details) => {
  const localDetails = JSON.parse(localStorage.getItem("seniors_details") || "{}");
  localDetails[id] = {
    ...(localDetails[id] || {}),
    ...details
  };
  localStorage.setItem("seniors_details", JSON.stringify(localDetails));
};
