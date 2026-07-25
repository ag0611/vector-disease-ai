"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { getDiseases } from "../../services/api";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const monthlyCases = [
    { month: "Jan", cases: 12000 }, { month: "Feb", cases: 15000 }, { month: "Mar", cases: 18000 },
    { month: "Apr", cases: 28000 }, { month: "May", cases: 45000 }, { month: "Jun", cases: 68000 },
    { month: "Jul", cases: 72000 }, { month: "Aug", cases: 70000 }, { month: "Sep", cases: 55000 },
    { month: "Oct", cases: 38000 }, { month: "Nov", cases: 22000 }, { month: "Dec", cases: 14000 },
];
const rainfallTrend = [
    { month: "Jan", rainfall: 120 }, { month: "Feb", rainfall: 140 }, { month: "Mar", rainfall: 130 },
    { month: "Apr", rainfall: 150 }, { month: "May", rainfall: 160 }, { month: "Jun", rainfall: 420 },
    { month: "Jul", rainfall: 460 }, { month: "Aug", rainfall: 480 }, { month: "Sep", rainfall: 440 },
    { month: "Oct", rainfall: 320 }, { month: "Nov", rainfall: 140 }, { month: "Dec", rainfall: 130 },
];

export default function DiseasesPage() {
    const [diseases, setDiseases] = useState<any[]>([]);
    const [disease, setDisease] = useState("Overall");

    useEffect(() => { getDiseases().then(setDiseases); }, []);

    return (
        <div style={{ display: "flex", height: "100vh", background: "var(--bg-primary)", overflow: "hidden" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Topbar disease={disease} setDisease={setDisease} />
                <div style={{ flex: 1, overflow: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Diseases</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Monitored vector-borne diseases across India</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                        {diseases.map((d: any) => (
                            <div key={d.name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                    <div style={{ width: 40, height: 40, background: "rgba(59,130,246,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🦟</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 16 }}>{d.name}</div>
                                        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{d.vector}</div>
                                    </div>
                                </div>
                                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>{d.description}</p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                    <div style={{ background: "var(--bg-primary)", borderRadius: 8, padding: "10px 12px" }}>
                                        <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>YTD CASES</div>
                                        <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2 }}>{d.ytd_cases?.toLocaleString()}</div>
                                    </div>
                                    <div style={{ background: "var(--bg-primary)", borderRadius: 8, padding: "10px 12px" }}>
                                        <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>AVG RISK</div>
                                        <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2, color: d.avg_risk > 60 ? "var(--accent-red)" : d.avg_risk > 40 ? "var(--accent-orange)" : "var(--accent-green)" }}>{d.avg_risk}</div>
                                    </div>
                                    <div style={{ background: "var(--bg-primary)", borderRadius: 8, padding: "10px 12px" }}>
                                        <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>TOP STATE</div>
                                        <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2 }}>{d.top_state}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                            <h3 style={{ marginBottom: 4, fontWeight: 600 }}>Overall case trend</h3>
                            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Reported vs predicted (12 mo)</p>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={monthlyCases}>
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
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={rainfallTrend}>
                                    <XAxis dataKey="month" tick={{ fill: "#8b8fa8", fontSize: 11 }} />
                                    <YAxis tick={{ fill: "#8b8fa8", fontSize: 11 }} />
                                    <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                                    <Bar dataKey="rainfall" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}