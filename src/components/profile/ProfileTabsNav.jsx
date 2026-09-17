import { P } from "../../shared";

const TABS = [
  { id: "bio", label: "Biografía" },
  { id: "certifications", label: "Certificaciones" },
  { id: "reviews", label: "Reseñas" },
];

export function ProfileTabsNav({ activeTab, setActiveTab }) {
  return (
    <div className="flex border-b" style={{ borderColor: P.baseNeutral }}>
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className="flex-1 py-3.5 text-sm font-semibold transition-colors"
          style={{
            color: activeTab === id ? P.primary : P.neutralDark,
            borderBottom: `2px solid ${activeTab === id ? P.primary : "transparent"}`,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
