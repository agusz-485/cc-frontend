import api from "../api/client";

/**
 * Servicio para subir archivos (imágenes de perfil, diplomas, certificados médicos, PDFs)
 * hacia el backend local de Spring Boot.
 *
 * @param {File} file - El archivo seleccionado por el usuario.
 * @param {string} folder - Carpeta de destino ("perfiles", "certificados", "documentos", "general").
 * @returns {Promise<{url: string, fileName: string, originalName: string, size: number}>}
 */
export const uploadFile = async (file, folder = "general") => {
  if (!file) {
    throw new Error("No se ha seleccionado ningún archivo.");
  }

  // Validación de tamaño máximo (5MB)
  const MAX_SIZE_MB = 5;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`El archivo supera el tamaño máximo permitido de ${MAX_SIZE_MB} MB.`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  try {
    const response = await api.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al subir archivo:", error);
    const msg = error.response?.data?.error || error.response?.data?.message || "Error al subir el archivo al servidor.";
    throw new Error(msg);
  }
};

export default {
  uploadFile,
};
