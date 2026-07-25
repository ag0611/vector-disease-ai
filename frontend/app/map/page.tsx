"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { getMap } from "../../services/api";

export default function MapPage() {
    const [mapData, setMapData] = useState<any[]>([]);
    const [disease, setDisease] = useState("Overall");
    const [selected, setSelected] = useState<any>(null);

    useEffect(() => {
        getMap(disease).then(d => { setMapData(d); setSelected(d[0]); });
    }, [disease]);

    const getRiskColor = (r: number) => r >= 76 ? "#dc2626" : r >= 51 ? "#ef4444" : r >= 26 ? "#f97316" : "#22c55e";
    const getRiskBg = (r: number) => r >= 76 ? "rgba(220,38,38,0.15)" : r >= 51 ? "rgba(239,68,68,0.1)" : r >= 26 ? "rgba(249,115,22,0.1)" : "rgba(34,197,94,0.1)";
    const getRiskLabel = (r: number) => r >= 76 ? "Critical" : r >= 51 ? "High" : r >= 26 ? "Moderate" : "Low";

    return (
        <div style={{ display: "flex", height: "100vh", background: "var(--bg-primary)", overflow: "hidden" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Topbar disease={disease} setDisease={setDisease} />
                <div style={{ flex: 1, overflow: "auto", padding: 24, display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
                    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                        <h3 style={{ marginBottom: 4, fontWeight: 600 }}>India — Risk Heatmap</h3>
                        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 20 }}>All monitored diseases · Click state for details</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, marginBottom: 20 }}>
                            {mapData.map(s => (
                                <button key={s.state_code} onClick={() => setSelected(s)}
                                    style={{ background: selected?.state_code === s.state_code ? "rgba(59,130,246,0.25)" : getRiskBg(s.risk_score), border: `2px solid ${selected?.state_code === s.state_code ? "var(--accent-blue)" : "transparent"}`, borderRadius: 10, padding: "12px 8px", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: getRiskColor(s.risk_score), marginBottom: 4 }}>{s.state_code}</div>
                                    <div style={{ fontSize: 9, color: "var(--text-secondary)", marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.state}</div>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: getRiskColor(s.risk_score) }}>{s.risk_score}</div>
                                </button>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 20, fontSize: 12, color: "var(--text-secondary)", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "#22c55e", display: "inline-block" }} />Low (0–25)</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "#f97316", display: "inline-block" }} />Moderate (26–50)</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "#ef4444", display: "inline-block" }} />High (51–75)</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "#dc2626", display: "inline-block" }} />Critical (76–100)</span>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {selected && (
                            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                    <div>
                                        <h3 style={{ fontWeight: 700, fontSize: 18 }}>{selected.state}</h3>
                                        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>Primary vector: <strong>{selected.primary_disease}</strong></p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>CURRENT RISK</div>
                                        <div style={{ fontSize: 36, fontWeight: 800, color: getRiskColor(selected.risk_score) }}>{selected.risk_score}</div>
                                        <span style={{ background: getRiskBg(selected.risk_score), color: getRiskColor(selected.risk_score), padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{getRiskLabel(selected.risk_score)}</span>
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                                    {[{ l: "Temperature", v: `${selected.temperature}°C` }, { l: "Humidity", v: `${selected.humidity}%` }, { l: "Rainfall (30d)", v: `${selected.rainfall} mm` }, { l: "Population", v: `${(selected.population / 1000000).toFixed(0)}M` }].map(i => (
                                        <div key={i.l} style={{ background: "var(--bg-primary)", borderRadius: 8, padding: "12px 14px" }}>
                                            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{i.l}</div>
                                            <div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>{i.v}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                                    <div style={{ background: "var(--bg-primary)", borderRadius: 8, padding: "12px 14px" }}>
                                        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>PREDICTED (7D)</div>
                                        <div style={{ fontWeight: 700, color: "var(--accent-red)", fontSize: 18, marginTop: 4 }}>{selected.predicted_7d} ↗</div>
                                    </div>
                                    <div style={{ background: "var(--bg-primary)", borderRadius: 8, padding: "12px 14px" }}>
                                        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>HISTORICAL</div>
                                        <div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>{selected.historical_cases?.toLocaleString()}</div>
                                    </div>
                                    <div style={{ background: "var(--bg-primary)", borderRadius: 8, padding: "12px 14px" }}>
                                        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>CONFIDENCE</div>
                                        <div style={{ fontWeight: 700, color: "var(--accent-blue)", fontSize: 16, marginTop: 4 }}>{Math.round(selected.confidence * 100)}%</div>
                                    </div>
                                </div>
                                <h4 style={{ fontSize: 13, marginBottom: 12, color: "var(--text-secondary)", fontWeight: 600 }}>Explainable AI — Risk drivers</h4>
                                {selected.risk_drivers && Object.entries(selected.risk_drivers).map(([k, v]: any) => (
                                    <div key={k} style={{ marginBottom: 12 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                                            <span>{k}</span><span style={{ fontWeight: 700 }}>{v}%</span>
                                        </div>
                                        <div style={{ height: 8, background: "var(--border)", borderRadius: 4 }}>
                                            <div style={{ width: `${v}%`, height: "100%", background: k === "Rainfall" ? "var(--accent-blue)" : k === "Humidity" ? "#06b6d4" : k === "Historical cases" ? "var(--accent-orange)" : "var(--accent-red)", borderRadius: 4 }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}