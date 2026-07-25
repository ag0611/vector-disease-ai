"use client";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { chat } from "../../services/api";
import { Send } from "lucide-react";

export default function AIAssistantPage() {
    const [messages, setMessages] = useState<{ role: string; text: string }[]>([
        { role: "assistant", text: "Hi — I'm the VBD analyst assistant. Ask me about state-level risk, drivers, recommended actions, or historical trends across dengue, malaria and chikungunya." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [disease, setDisease] = useState("Overall");

    const suggestions = [
        "Which states have the highest dengue risk this week?",
        "Explain the risk drivers for Kerala",
        "Recommend interventions for Maharashtra",
        "Compare rainfall vs cases in West Bengal",
    ];

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;
        const userMsg = { role: "user", text };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);
        try {
            const res = await chat({ message: text, conversation_history: [] });
            setMessages(prev => [...prev, { role: "assistant", text: res.response }]);
        } catch {
            setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I couldn't process that. Please try again." }]);
        }
        setLoading(false);
    };

    return (
        <div style={{ display: "flex", height: "100vh", background: "var(--bg-primary)", overflow: "hidden" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Topbar disease={disease} setDisease={setDisease} />
                <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
                    <div style={{ marginBottom: 24 }}>
                        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>AI Assistant</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Ask questions about India's disease surveillance</p>
                    </div>
                    <div style={{ maxWidth: 800, margin: "0 auto" }}>
                        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 16 }}>Analyst Assistant · Grounded on state-level risk models</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: 300, maxHeight: 400, overflow: "auto", marginBottom: 16 }}>
                                {messages.map((m, i) => (
                                    <div key={i} style={{ display: "flex", gap: 12, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                                        {m.role === "assistant" && (
                                            <div style={{ width: 32, height: 32, background: "var(--accent-blue)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
                                        )}
                                        <div style={{ background: m.role === "user" ? "var(--accent-blue)" : "var(--bg-primary)", color: "var(--text-primary)", borderRadius: 12, padding: "12px 16px", maxWidth: "80%", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-line" }}>
                                            {m.text}
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div style={{ display: "flex", gap: 12 }}>
                                        <div style={{ width: 32, height: 32, background: "var(--accent-blue)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>🤖</div>
                                        <div style={{ background: "var(--bg-primary)", borderRadius: 12, padding: "12px 16px", color: "var(--text-secondary)", fontSize: 14 }}>Analyzing...</div>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                                {suggestions.map(s => (
                                    <button key={s} onClick={() => sendMessage(s)}
                                        style={{ background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: 20, padding: "6px 14px", fontSize: 12, cursor: "pointer" }}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 12 }}>
                                <input value={input} onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                                    placeholder="Ask about states, risk, or interventions..."
                                    style={{ flex: 1, background: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)", borderRadius: 8, padding: "10px 16px", fontSize: 14, outline: "none" }} />
                                <button onClick={() => sendMessage(input)}
                                    style={{ background: "var(--accent-blue)", border: "none", borderRadius: 8, padding: "10px 16px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center" }}>
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}