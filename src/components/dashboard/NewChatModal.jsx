import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, MessageSquare, Search, ArrowRight, UserCheck, ShieldAlert, Loader2, Calendar } from "lucide-react";
import { P } from "../../shared";
import { getBookings, getCaregiverRequests } from "../../services/bookingService";
import { UserAvatar } from "../ui/UserAvatar";

export function NewChatModal({ isOpen, onClose, onSelectContact, userRole, userId }) {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const isFamiliar = String(userRole || "").toLowerCase().includes("familiar") || !String(userRole || "").toLowerCase().includes("cuidador");

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchAllowedContacts = async () => {
      setLoading(true);
      try {
        if (isFamiliar) {
          // Familiar: Solo puede chatear con cuidadores contratados / reservados
          const bookings = await getBookings(userId);
          if (isMounted) {
            const uniqueMap = new Map();
            bookings.forEach((b) => {
              if (b.caregiver && b.caregiver.id && !uniqueMap.has(b.caregiver.id)) {
                uniqueMap.set(b.caregiver.id, {
                  id: b.caregiver.id,
                  name: b.caregiver.name,
                  foto: b.caregiver.image,
                  role: b.serviceType || "Cuidador Profesional",
                  status: b.status,
                  datesText: b.datesText,
                  shift: b.shift,
                });
              }
            });
            setContacts(Array.from(uniqueMap.values()));
          }
        } else {
          // Cuidador / Enfermero: Solo puede chatear con familiares que lo hayan contratado / reservado
          const requests = await getCaregiverRequests(userId);
          if (isMounted) {
            const uniqueMap = new Map();
            requests.forEach((r) => {
              const famId = r.familiarId || r.id;
              if (famId && !uniqueMap.has(famId)) {
                uniqueMap.set(famId, {
                  id: famId,
                  name: r.family || "Familia Contratante",
                  foto: r.familiarFoto,
                  role: `Paciente: ${r.patient || "Adulto Mayor"}`,
                  status: r.status,
                  datesText: r.date,
                  shift: r.hours,
                });
              }
            });
            setContacts(Array.from(uniqueMap.values()));
          }
        }
      } catch (err) {
        console.error("Error al cargar contactos autorizados para chat:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllowedContacts();

    return () => {
      isMounted = false;
    };
  }, [isOpen, userId, isFamiliar]);

  if (!isOpen) return null;

  const filteredContacts = contacts.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 flex flex-col max-h-[85vh]">
        {/* Header del Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {isFamiliar ? "Iniciar Chat con Cuidador" : "Iniciar Chat con Familiar"}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {isFamiliar ? "Contactos con servicios contratados o reservados" : "Familiares con reservas activas"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Buscador de contactos */}
        {contacts.length > 0 && (
          <div className="mt-3.5 mb-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o servicio..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-teal-600 outline-none"
            />
          </div>
        )}

        {/* Lista de Contactos */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 my-2 pr-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              <p className="text-xs font-semibold">Cargando contactos autorizados...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-3 text-amber-700">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">
                {isFamiliar ? "Sin Cuidadores Contratados" : "Sin Reservas de Clientes"}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mb-5">
                {isFamiliar
                  ? "Desde el panel solo puedes iniciar conversaciones con profesionales que hayas contratado o reservado previamente. Para contactar a un nuevo cuidador, envía una solicitud desde su perfil en el Directorio."
                  : "Aún no tienes solicitudes o turnos asignados por familiares. Podrás iniciar chats con ellos en cuanto recibas una contratación."}
              </p>

              {isFamiliar && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate("/directory");
                  }}
                  className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-white font-bold text-xs shadow-sm hover:opacity-95 transition-opacity"
                  style={{ backgroundColor: P.primary }}
                >
                  <span>Explorar Directorio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No se encontraron contactos que coincidan con la búsqueda.
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => {
                  onSelectContact(contact);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-teal-50/70 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar
                    src={contact.foto}
                    name={contact.name}
                    size="sm"
                    shape="rounded-full"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-teal-900 truncate">
                      {contact.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {contact.role}
                    </p>
                    {contact.datesText && (
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{contact.datesText}</span>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-teal-700 bg-teal-50 group-hover:bg-teal-700 group-hover:text-white transition-all shadow-2xs flex-shrink-0 ml-2"
                >
                  Chatear
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        {contacts.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              {contacts.length} {contacts.length === 1 ? "contacto contratado" : "contactos contratados"}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="font-semibold text-slate-500 hover:text-slate-800"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewChatModal;
