export const getFavoriteCaregivers = (userId) => {
  const currentUserId = userId || localStorage.getItem("user_id") || "current";
  const storageKey = `user_favorites_${currentUserId}`;
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error al leer favoritos:", e);
    return [];
  }
};

export const isCaregiverFavorite = (caregiverId, userId) => {
  const list = getFavoriteCaregivers(userId);
  return list.some((c) => Number(c.id) === Number(caregiverId));
};

export const toggleFavoriteCaregiver = (caregiver, userId) => {
  if (!caregiver || !caregiver.id) return [];
  const currentUserId = userId || localStorage.getItem("user_id") || "current";
  const storageKey = `user_favorites_${currentUserId}`;
  const list = getFavoriteCaregivers(currentUserId);
  const exists = list.some((c) => Number(c.id) === Number(caregiver.id));

  let updated;
  if (exists) {
    updated = list.filter((c) => Number(c.id) !== Number(caregiver.id));
  } else {
    const normalized = {
      id: caregiver.id,
      name: caregiver.name,
      image: caregiver.image || caregiver.fotoPerfil || null,
      location: caregiver.location || "Buenos Aires",
      rating: caregiver.rating || 4.9,
      reviews: caregiver.reviews || 0,
      hourlyRate: caregiver.hourlyRate || 3500,
      specialties: caregiver.specialties || [],
      tipo: caregiver.tipo || "cuidador",
    };
    updated = [normalized, ...list];
  }

  localStorage.setItem(storageKey, JSON.stringify(updated));
  return updated;
};
