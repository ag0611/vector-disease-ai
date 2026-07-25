"use client";
import { Search, RefreshCw } from "lucide-react";

export default function Topbar({ disease, setDisease }: { disease: string; setDisease: (d: string) => void }) {
    const diseases = ["Overall", "Dengue", "Malaria", "Chikungunya", "JE"];
    return (
        <div style={{ height: 56, background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Vector-Borne Disease Intelligence</span>
                <span style={{ background: "rgba(59,130,246,0.2)", color: "var(--accent-blue)", fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>INDIA · PROD</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 12px" }}>
                    <Search size={14} color="var(--text-secondary)" />
                    <input placeholder="Search states, diseases, alerts..." style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13, width: 220 }} />
                </div>
                <select value={disease} onChange={e => setDisease(e.target.value)}
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer" }}>
                    {diseases.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <button style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "var(--text-secondary)" }}>
                    <RefreshCw size={16} />
                </button>
            </div>
        </div>
    );
}