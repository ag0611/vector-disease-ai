"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getDashboard, getMap } from "../services/api";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, TrendingUp, Activity, Shield } from "lucide-react";

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [mapData, setMapData] = useState<any[]>([]);
    const [disease, setDisease] = useState("Overall");
    const [selected, setSelected] = useState<any>(null);

    useEffect(() => {
        getDashboard().then(setData);
        getMap(disease).then(d => { setMapData(d); setSelected(d[0]); });
    }, [disease]);

    if (!data) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg-primary)", color: "var(--text-secondary)" }}>
            Loading VBD Intel...
        </div>
    );

    const getRiskColor = (r: number) => r >= 76 ? "#dc2626" : r >= 51 ? "#ef4444" : r >= 26 ? "#f97316" : "#22c55e";
    const getRiskBg = (r: number) => r >= 76 ? "rgba(220,38,38,0.15)" : r >= 51 ? "rgba(239,68,68,0.1)" : r >= 26 ? "rgba(249,115,22,0.1)" : "rgba(34,197,94,0.1)";
    const getRiskLabel = (r: number) => r >= 76 ? "Critical" : r >= 51 ? "High" : r >= 26 ? "Moderate" : "Low";

    return (
        <div style={{ display: "flex", height: "100vh", background: "var(--bg-primary)", overflow: "hidden" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Topbar disease={disease} setDisease={setDisease} />
                <div style={{ flex: 1, overflow: "auto", padding: 24, display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div>
                            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Overview</h2>
                            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Live risk intelligence · All diseases</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                            {[
                                { label: "OVERALL RISK", value: `${data.overall_risk}/100`, sub: data.risk_level, icon: Shield, color: "var(--accent-orange)" },
                                { label: "HIGH-RISK STATES", value: `${data.high_risk_states}/${data.total_states}`, sub: "≥ 60 risk score", icon: TrendingUp, color: "var(--accent-red)" },
                                { label: "ACTIVE ALERTS", value: data.active_alerts, sub: "Last 24 hours", icon: AlertTriangle, color: "var(--accent-yellow)" },
                                { label: "DISEASES MONITORED", value: data.diseases_monitored, sub: "Dengue · Malaria · Chikungunya · JE", icon: Activity, color: "var(--accent-blue)" },
                            ].map(c => (
                                <div key={c.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                        <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>{c.label}</span>
                                        <c.icon size={18} color={c.color} />
                                    </div>
                                    <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{c.value}</div>
                                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{c.sub}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                            <h3 style={{ marginBottom: 4, fontWeight: 600 }}>India — Risk Heatmap</h3>
                            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Click a state to see details</p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
                                {mapData.map(s => (
                                    <button key={s.state_code} onClick={() => setSelected(s)}
                                        style={{ background: selected?.state_code === s.state_code ? "rgba(59,130,246,0.2)" : getRiskBg(s.risk_score), border: `1px solid ${selected?.state_code === s.state_code ? "var(--accent-blue)" : "var(--border)"}`, borderRadius: 8, padding: "8px 6px", cursor: "pointer", textAlign: "center" }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: getRiskColor(s.risk_score) }}>{s.state_code}</div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: getRiskColor(s.risk_score) }}>{s.risk_score}</div>
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12, color: "var(--text-secondary)" }}>
                                <span>🟢 Low</span><span>🟠 Moderate</span><span>🔴 High</span><span style={{ color: "#dc2626" }}>⬤ Critical</span>
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                                <h3 style={{ marginBottom: 4, fontWeight: 600 }}>Overall case trend</h3>
                                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Reported vs predicted (12 mo)</p>
                                <ResponsiveContainer width="100%" height={180}>
                                    <LineChart data={data.monthly_cases}>
                                        <XAxis dataKey="month" tick={{ fill: "#8b8fa8", fontSize: 11 }} />
                                        <YAxis tick={{ fill: "#8b8fa8", fontSize: 11 }} />
                                        <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                                        <Line type="monotone" dataKey="cases" stroke="var(--accent-blue)" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                                <h3 style={{ marginBottom: 4, fontWeight: 600 }}>Rainfall trend</h3>
                                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>National avg (mm)</p>
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart data={data.rainfall_trend}>
                                        <XAxis dataKey="month" tick={{ fill: "#8b8fa8", fontSize: 11 }} />
                                        <YAxis tick={{ fill: "#8b8fa8", fontSize: 11 }} />
                                        <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                                        <Bar dataKey="rainfall" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                            <h3 style={{ marginBottom: 16, fontWeight: 600 }}>Hotspots — Live ranking</h3>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                        {["State", "Disease", "Risk", "Cases", "Status"].map(h => (
                                            <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {mapData.slice(0, 8).map(s => (
                                        <tr key={s.state_code} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "10px 12px" }}>
                                                <div style={{ fontWeight: 600, fontSize: 13 }}>{s.state}</div>
                                                <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{s.state_code}</div>
                                            </td>
                                            <td style={{ padding: "10px 12px", fontSize: 13, color: "var(--text-secondary)" }}>{s.primary_disease}</td>
                                            <td style={{ padding: "10px 12px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <span style={{ fontWeight: 700, color: getRiskColor(s.risk_score) }}>{s.risk_score}</span>
                                                    <div style={{ width: 60, height: 6, background: "var(--border)", borderRadius: 3 }}>
                                                        <div style={{ width: `${s.risk_score}%`, height: "100%", background: getRiskColor(s.risk_score), borderRadius: 3 }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: "10px 12px", fontSize: 13 }}>{s.cases?.toLocaleString()}</td>
                                            <td style={{ padding: "10px 12px" }}>
                                                <span style={{ background: getRiskBg(s.risk_score), color: getRiskColor(s.risk_score), padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
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
                        {selected && (
                            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                    <div>
                                        <h3 style={{ fontWeight: 700, fontSize: 16 }}>{selected.state} <span style={{ fontSize: 12, background: "var(--border)", padding: "2px 6px", borderRadius: 4, color: "var(--text-secondary)" }}>{selected.state_code}</span></h3>
                                        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Primary vector: {selected.primary_disease}</p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>CURRENT RISK</div>
                                        <div style={{ fontSize: 28, fontWeight: 700, color: getRiskColor(selected.risk_score) }}>{selected.risk_score}</div>
                                        <span style={{ background: getRiskBg(selected.risk_score), color: getRiskColor(selected.risk_score), padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{getRiskLabel(selected.risk_score)}</span>
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                                    {[{ l: "Temperature", v: `${selected.temperature}°C` }, { l: "Humidity", v: `${selected.humidity}%` }, { l: "Rainfall (30d)", v: `${selected.rainfall} mm` }, { l: "Population", v: `${(selected.population / 1000000).toFixed(0)}M` }].map(i => (
                                        <div key={i.l} style={{ background: "var(--bg-primary)", borderRadius: 8, padding: "10px 12px" }}>
                                            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{i.l}</div>
                                            <div style={{ fontWeight: 700, marginTop: 2 }}>{i.v}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                                    <div style={{ background: "var(--bg-primary)", borderRadius: 8, padding: "10px 12px" }}>
                                        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>PREDICTED (7D)</div>
                                        <div style={{ fontWeight: 700, color: "var(--accent-red)", marginTop: 2 }}>{selected.predicted_7d} ↗</div>
                                    </div>
                                    <div style={{ background: "var(--bg-primary)", borderRadius: 8, padding: "10px 12px" }}>
                                        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>HISTORICAL</div>
                                        <div style={{ fontWeight: 700, marginTop: 2 }}>{selected.historical_cases?.toLocaleString()}</div>
                                    </div>
                                    <div style={{ background: "var(--bg-primary)", borderRadius: 8, padding: "10px 12px" }}>
                                        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>CONFIDENCE</div>
                                        <div style={{ fontWeight: 700, color: "var(--accent-blue)", marginTop: 2 }}>{Math.round(selected.confidence * 100)}%</div>
                                    </div>
                                </div>
                                <h4 style={{ fontSize: 13, marginBottom: 12, color: "var(--text-secondary)" }}>Explainable AI — Risk drivers</h4>
                                {selected.risk_drivers && Object.entries(selected.risk_drivers).map(([k, v]: any) => (
                                    <div key={k} style={{ marginBottom: 10 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                                            <span>{k}</span><span style={{ fontWeight: 600 }}>{v}%</span>
                                        </div>
                                        <div style={{ height: 6, background: "var(--border)", borderRadius: 3 }}>
                                            <div style={{ width: `${v}%`, height: "100%", background: k === "Rainfall" ? "var(--accent-blue)" : k === "Humidity" ? "#06b6d4" : k === "Historical cases" ? "var(--accent-orange)" : "var(--accent-red)", borderRadius: 3 }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                            <h3 style={{ fontWeight: 600, marginBottom: 16 }}>
                                Alerts <span style={{ background: "rgba(239,68,68,0.2)", color: "var(--accent-red)", fontSize: 11, padding: "2px 8px", borderRadius: 20, marginLeft: 8 }}>{data.active_alerts} active</span>
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {data.alerts?.map((a: any, i: number) => (
                                    <div key={i} style={{ padding: "10px 12px", background: "var(--bg-primary)", borderRadius: 8, borderLeft: `3px solid ${a.severity === "Critical" ? "#dc2626" : "var(--accent-orange)"}` }}>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>{a.message}</div>
                                        <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{a.state} · {a.disease}</div>
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