"use client";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Map, Bug, BarChart2, Flame, Bot } from "lucide-react";

const nav = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "India Map", icon: Map, href: "/map" },
    { label: "Diseases", icon: Bug, href: "/diseases" },
    { label: "Analytics", icon: BarChart2, href: "/analytics" },
    { label: "Hotspots", icon: Flame, href: "/hotspots" },
    { label: "AI Assistant", icon: Bot, href: "/ai-assistant" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    return (
        <aside style={{ width: 220, minHeight: "100vh", background: "var(--bg-secondary)", borderRight: "1px solid var(--border)", padding: "20px 0", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
            <div style={{ padding: "0 20px 24px", borderBottom: "1px solid var(--border)", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: "var(--accent-blue)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff" }}>V</div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>VBD Intel</div>
                        <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>Vector-Borne Disease AI</div>
                    </div>
                </div>
            </div>
            {nav.map(item => {
                const active = pathname === item.href;
                return (
                    <button key={item.href} onClick={() => router.push(item.href)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", background: active ? "rgba(59,130,246,0.15)" : "transparent", color: active ? "var(--accent-blue)" : "var(--text-secondary)", border: "none", cursor: "pointer", fontSize: 14, fontWeight: active ? 600 : 400, borderLeft: active ? "3px solid var(--accent-blue)" : "3px solid transparent", width: "100%", textAlign: "left" }}>
                        <item.icon size={18} />
                        {item.label}
                    </button>
                );
            })}
        </aside>
    );
}