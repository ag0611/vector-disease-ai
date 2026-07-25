"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { getAnalytics } from "../../services/api";
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [disease, setDisease] = useState("Overall");

    useEffect(() => { getAnalytics().then(setData); }, []);

    if (!data) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg-primary)", color: "var(--text-secondary)" }}>Loading...</div>;

    return (
        <div style={{ display: "flex", height: "100vh", background: "var(--bg-primary)", overflow: "hidden" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Topbar disease={disease} setDisease={setDisease} />
                <div style={{ flex: 1, overflow: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Analytics</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Trends, correlations and comparisons</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                            <h3 style={{ marginBottom: 4, fontWeight: 600 }}>Overall case trend</h3>
                            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Reported vs predicted (12 mo)</p>
                            <ResponsiveContainer width="100%" height={160}>
                                <LineChart data={data.monthly_cases}>
                                    <XAxis dataKey="month" tick={{ fill: "#8b8fa8", fontSize: 10 }} />
                                    <YAxis tick={{ fill: "#8b8fa8", fontSize: 10 }} />
                                    <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                                    <Line type="monotone" dataKey="cases" stroke="var(--accent-blue)" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                            <h3 style={{ marginBottom: 4, fontWeight: 600 }}>Rainfall trend</h3>
                            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>National avg (mm)</p>
                            <ResponsiveContainer width="100%" height={160}>
                                <BarChart data={data.rainfall_trend}>
                                    <XAxis dataKey="month" tick={{ fill: "#8b8fa8", fontSize: 10 }} />
                                    <YAxis tick={{ fill: "#8b8fa8", fontSize: 10 }} />
                                    <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                                    <Bar dataKey="rainfall" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                            <h3 style={{ marginBottom: 4, fontWeight: 600 }}>Risk timeline</h3>
                            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Last 30 days</p>
                            <ResponsiveContainer width="100%" height={160}>
                                <LineChart data={data.risk_timeline}>
                                    <XAxis dataKey="day" tick={{ fill: "#8b8fa8", fontSize: 10 }} />
                                    <YAxis tick={{ fill: "#8b8fa8", fontSize: 10 }} />
                                    <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                                    <Line type="monotone" dataKey="risk" stroke="var(--accent-red)" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                            <h3 style={{ marginBottom: 4, fontWeight: 600 }}>State comparison</h3>
                            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Top risk (Overall)</p>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={data.state_comparison}>
                                    <XAxis dataKey="state" tick={{ fill: "#8b8fa8", fontSize: 11 }} />
                                    <YAxis tick={{ fill: "#8b8fa8", fontSize: 11 }} />
                                    <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                                    <Bar dataKey="risk" fill="var(--accent-red)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
                            <h3 style={{ marginBottom: 4, fontWeight: 600 }}>Weather correlation</h3>
                            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Humidity vs cases</p>
                            <ResponsiveContainer width="100%" height={200}>
                                <ScatterChart>
                                    <XAxis dataKey="humidity" name="Humidity" tick={{ fill: "#8b8fa8", fontSize: 11 }} label={{ value: "Humidity %", position: "bottom", fill: "#8b8fa8", fontSize: 11 }} />
                                    <YAxis dataKey="cases" name="Cases" tick={{ fill: "#8b8fa8", fontSize: 11 }} />
                                    <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                                    <Scatter data={data.weather_correlation} fill="var(--accent-blue)" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}