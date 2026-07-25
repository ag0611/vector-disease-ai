"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { getHotspots, getAlerts } from "../../services/api";

export default function HotspotsPage() {
    const [data, setData] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [disease, setDisease] = useState("Overall");
    const [search, setSearch] = useState("");

    useEffect(() => {
        getHotspots(disease).then(setData);
        getAlerts().then(setAlerts);
    }, [disease]);

    const getRiskColor = (r: number) => r >= 76 ? "#dc2626" : r >= 51 ? "#ef4444" : r >= 26 ? "#f97316" : "#22c55e";
    const getRiskBg = (r: number) => r >= 76 ? "rgba(220,38,38,0.15)" : r >= 51 ? "rgba(239,68,68,0.1)" : r >= 26 ? "rgba(249,115,22,0.1)" : "rgba(34,197,94,0.1)";
    const getRiskLabel = (r: number) => r >= 76 ? "Critical" : r >= 51 ? "High" : r >= 26 ? "Moderate" : "Low";

    const filtered = data.filter(s => s.state.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{ display: "flex", height: "100vh", background: "var(--bg-primary)", overflow: "hidden" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Topbar disease={disease} setDisease={setDisease} />
                <div style={{ flex: 1, overflow: "auto", padding: 24, display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                            <div>
                                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Hotspots</h2>
                                <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Live state-level risk ranking</p>
                            </div>
                            <input placeholder="Search state..." value={search} onChange={e => setSearch(e.target.value)}
                                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: 8, padding: "8px 14px", fontSize: 13, outline: "none", width: 200 }} />
                        </div>
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-primary)" }}>
                                        {["State", "Disease", "Risk", "Cases", "Trend", "Status"].map(h => (
                                            <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((s, i) => (
                                        <tr key={s.state_code} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                                            <td style={{ padding: "12px 16px" }}>
                                                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.state}</div>
                                                <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{s.state_code}</div>
                                            </td>
                                            <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{s.primary_disease}</td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <span style={{ fontWeight: 700, color: getRiskColor(s.risk_score), fontSize: 15, minWidth: 28 }}>{s.risk_score}</span>
                                                    <div style={{ width: 80, height: 6, background: "var(--border)", borderRadius: 3 }}>
                                                        <div style={{ width: `${s.risk_score}%`, height: "100%", background: getRiskColor(s.risk_score), borderRadius: 3 }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: "12px 16px", fontSize: 13 }}>{s.cases?.toLocaleString()}</td>
                                            <td style={{ padding: "12px 16px", fontSize: 16, color: s.risk_score > 60 ? "var(--accent-red)" : "var(--accent-green)" }}>{s.risk_score > 60 ? "↗" : "→"}</td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <span style={{ background: getRiskBg(s.risk_score), color: getRiskColor(s.risk_score), padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                                                    {getRiskLabel(s.risk_score)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                            <h3 style={{ fontWeight: 600, marginBottom: 16 }}>
                                Alerts <span style={{ background: "rgba(239,68,68,0.2)", color: "var(--accent-red)", fontSize: 11, padding: "2px 8px", borderRadius: 20, marginLeft: 8 }}>{alerts.length} active</span>
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {alerts.map((a: any, i: number) => (
                                    <div key={i} style={{ padding: "12px 14px", background: "var(--bg-primary)", borderRadius: 8, borderLeft: `3px solid ${a.severity === "Critical" ? "#dc2626" : "var(--accent-orange)"}` }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                            <span style={{ fontSize: 13, fontWeight: 600 }}>{a.disease} — {a.state}</span>
                                            <span style={{ background: a.severity === "Critical" ? "rgba(220,38,38,0.2)" : "rgba(249,115,22,0.2)", color: a.severity === "Critical" ? "#dc2626" : "var(--accent-orange)", padding: "1px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>{a.severity}</span>
                                        </div>
                                        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{a.message}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}