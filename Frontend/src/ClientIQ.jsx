import { useState, useRef, useEffect } from "react";

const BACKEND_URL = "http://localhost:8000";

const IQIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="7" fill="#0D9488" />
    <path d="M8 9h2v10H8V9zm4 0h2l4 5V9h2v10h-2l-4-5v5h-2V9z" fill="#FFFFFF" />
  </svg>
);

const RESEARCH_STEPS = [
  { icon: "🔍", label: "Scanning market landscape..." },
  { icon: "🏢", label: "Identifying competitors..." },
  { icon: "📊", label: "Analyzing market trends..." },
  { icon: "🎯", label: "Profiling target audience..." },
  { icon: "💡", label: "Crafting USP insights..." },
  { icon: "📧", label: "Sending report to email..." },
];


function LoadingResearch() {
  const [step, setStep] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const stepInterval = setInterval(() => setStep(s => Math.min(s + 1, RESEARCH_STEPS.length - 1)), 2200);
    const dotInterval = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400);
    return () => { clearInterval(stepInterval); clearInterval(dotInterval); };
  }, []);

  return (
    <div style={{ display: "flex", gap: 14 }}>
      <div style={{ flexShrink: 0, marginTop: 4 }}><IQIcon /></div>
      <div style={{ flex: 1, background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px 16px 16px 16px", padding: "24px 28px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0D9488", boxShadow: "0 0 8px #0D9488", animation: "glowPulse 1.2s infinite" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0D9488", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            AI Agent is Researching{dots}
          </span>
        </div>

        {/* Big message */}
        <div style={{ marginBottom: 28, padding: "16px 20px", background: "#F0FDFA", border: "1px solid #CCFBF1", borderRadius: 10 }}>
          <p style={{ margin: 0, fontSize: 15, color: "#115E59", lineHeight: 1.6 }}>
            ⏳ Please wait a few seconds — our AI Agent is deeply researching your business idea, scanning competitors, analyzing market trends, and preparing a comprehensive report just for you.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {RESEARCH_STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: i > step ? 0.4 : 1, transition: "opacity 0.4s" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: done ? "#0D9488" : active ? "#E0F2FE" : "#F1F5F9",
                  border: active ? "2px solid #0D9488" : done ? "2px solid #0D9488" : "2px solid #E2E8F0",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
                  transition: "all 0.4s"
                }}>
                  {done ? <span style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 13 }}>✓</span> : <span>{s.icon}</span>}
                </div>
                <span style={{ fontSize: 13.5, color: done ? "#0D9488" : active ? "#0F172A" : "#64748B", fontWeight: active ? 600 : 400, transition: "all 0.4s" }}>
                  {s.label}
                </span>
                {active && (
                  <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
                    {[0, 1, 2].map(j => (
                      <span key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: "#0D9488", display: "inline-block", animation: `bounce 0.9s ${j * 0.2}s infinite` }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Badge({ children, color = "#0D9488" }) {
  const bg = color === "#0D9488" ? "#F0FDFA" : color === "#F59E0B" ? "#FEF3C7" : "#FEE2E2";
  const border = color === "#0D9488" ? "#CCFBF1" : color === "#F59E0B" ? "#FDE68A" : "#FECACA";
  return (
    <span style={{ display: "inline-block", padding: "4px 12px", background: bg, border: `1px solid ${border}`, borderRadius: 20, fontSize: 11, color, fontWeight: 700, letterSpacing: "0.03em" }}>
      {children}
    </span>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div style={{ marginBottom: 20, padding: "18px 22px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#0D9488", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function AnalysisResult({ data }) {
  const d = data.data;
  const confidenceColor = d.confidence === "High" ? "#0D9488" : d.confidence === "Medium" ? "#F59E0B" : "#EF4444";

  return (
    <div style={{ display: "flex", gap: 14, animation: "fadeIn 0.5s ease" }}>
      <div style={{ flexShrink: 0, marginTop: 4 }}><IQIcon /></div>
      <div style={{ flex: 1, background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px 16px 16px 16px", padding: "26px 30px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0D9488", display: "inline-block" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0D9488", letterSpacing: "0.08em", textTransform: "uppercase" }}>ClientIQ Research Report</span>
          </div>
          <Badge color={confidenceColor}>Confidence: {d.confidence}</Badge>
        </div>

        {/* Business Idea */}
        <div style={{ marginBottom: 22, padding: "16px 20px", background: "#F0FDFA", border: "1px solid #CCFBF1", borderRadius: 10 }}>
          <div style={{ fontSize: 10, color: "#0D9488", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontWeight: 700 }}>Business Idea</div>
          <div style={{ fontSize: 15, color: "#0F172A", fontWeight: 700, lineHeight: 1.5 }}>{d.businessIdea}</div>
        </div>

        {/* Competitors */}
        <SectionCard title="Competitor Landscape" icon="🏢">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {d.competitors?.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0D9488", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A", marginBottom: 3 }}>{c.name}</div>
                  <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.5 }}>{c.description}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Market Trends */}
        <SectionCard title="Market Trends" icon="📈">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {d.marketTrends?.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ color: "#0D9488", fontSize: 14, marginTop: 1, flexShrink: 0, fontWeight: 700 }}>→</span>
                <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{t}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Target Audience */}
        <SectionCard title="Target Audience" icon="🎯">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "12px 16px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#0D9488", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>Primary</div>
              <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{d.targetAudience?.primary}</div>
            </div>
            <div style={{ padding: "12px 16px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: "#F59E0B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>Secondary</div>
              <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{d.targetAudience?.secondary}</div>
            </div>
          </div>
        </SectionCard>

        {/* USP */}
        <SectionCard title="Unique Selling Proposition" icon="💡">
          <div style={{ fontSize: 13.5, color: "#1E293B", lineHeight: 1.8, fontWeight: 500 }}>{d.UniqueSellingProposition}</div>
        </SectionCard>

        {/* Challenges */}
        <SectionCard title="Key Challenges" icon="⚠️">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {d.challenges?.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ color: "#EF4444", fontSize: 14, marginTop: 1, flexShrink: 0, fontWeight: 700 }}>✕</span>
                <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{c}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* SEO Keywords */}
        <SectionCard title="Top SEO Keywords" icon="🔑">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {d.topKeywordsforSEO?.map((k, i) => (
              <div key={i} style={{ padding: "6px 12px", background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: 20, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
                <span style={{ fontSize: 12, color: "#0F172A", fontWeight: 600 }}>{k.name}</span>
                {k.searchVolume !== "N/A" && (
                  <span style={{ fontSize: 10, color: "#0D9488", fontWeight: 700, background: "#F0FDFA", padding: "2px 6px", borderRadius: 10 }}>{k.searchVolume}/mo</span>
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Actions Taken */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "#F0FDFA", border: "1px solid #CCFBF1", borderRadius: 10 }}>
          <span style={{ fontSize: 15 }}>✅</span>
          <div>
            <div style={{ fontSize: 11, color: "#115E59", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3, fontWeight: 700 }}>Actions Completed</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {d.actionsTaken?.map((a, i) => (
                <span key={i} style={{ fontSize: 12.5, color: "#0D9488", fontWeight: 600 }}>• {a}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ClientIQ() {
  const [idea, setIdea] = useState("");
  const [email, setEmail] = useState(() => {
    return localStorage.getItem("clientiq_email") || "";
  });
  const [emailError, setEmailError] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loadedHistory, setLoadedHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyTrigger, setHistoryTrigger] = useState(0);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [sessions, loading]);

  // Fetch Firestore history dynamically when a complete email address is entered or refreshed
  useEffect(() => {
    const target = email.trim();
    if (target.includes("@") && target.includes(".")) {
      const fetchPastReports = async () => {
        setLoadingHistory(true);
        try {
          const res = await fetch(`${BACKEND_URL}/research/${encodeURIComponent(target)}`);
          if (res.ok) {
            const json = await res.json();
            if (json?.success && json?.data) {
              const histArray = Array.isArray(json.data) ? json.data : [json.data];
              setLoadedHistory(histArray);
            } else {
              setLoadedHistory([]);
            }
          } else {
            setLoadedHistory([]);
          }
        } catch (_) {
          setLoadedHistory([]);
        } finally {
          setLoadingHistory(false);
        }
      };
      const timer = setTimeout(fetchPastReports, 400);
      return () => clearTimeout(timer);
    } else {
      setLoadedHistory([]);
    }
  }, [email, historyTrigger]);

  const loadPastAnalysis = (item) => {
    if (!item?.response) return;
    setSessions(prev => [...prev, {
      user: { idea: item.input_message || "Saved Business Idea", email: item.email },
      result: { success: true, data: item.response }
    }]);
  };

  const handleAnalyze = async () => {
    if (!idea.trim() || !email.trim() || loading) return;

    // Verify given email format using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError("Please enter a valid email address format (e.g., name@example.com)");
      return;
    }
    setEmailError("");

    const userMsg = { idea: idea.trim(), email: email.trim() };
    // Persist email in local storage instantly so sidebar history persists across page reloads
    localStorage.setItem("clientiq_email", userMsg.email);

    setSessions(prev => [...prev, { user: userMsg, result: null }]);
    setIdea(""); setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/run-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.idea, email: userMsg.email })
      });

      if (!res.ok) {
        let errMsg = `Server returned ${res.status}`;
        try {
          const errData = await res.json();
          if (errData?.detail) {
            errMsg += `: ${typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail)}`;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await res.json();
      setSessions(prev => {
        const updated = [...prev];
        updated[updated.length - 1].result = data;
        return updated;
      });

      // Increment trigger to forcefully refresh and pull the newly saved cloud report into the sidebar
      setTimeout(() => {
        setHistoryTrigger(t => t + 1);
      }, 1200);
    } catch (err) {
      setSessions(prev => {
        const updated = [...prev];
        updated[updated.length - 1].result = { error: true, message: err?.message || "Unable to connect to backend" };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey && idea.trim() && email.trim() && !emailError) { 
      e.preventDefault(); 
      handleAnalyze(); 
    }
  };

  const canSubmit = idea.trim() && email.trim() && !emailError && !loading;
  const hasContent = sessions.length > 0 || loading;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", color: "#334155" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 6px #0D9488} 50%{box-shadow:0 0 14px #0D9488} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        ::placeholder { color:#94A3B8 !important; }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:3px; }
        ::-webkit-scrollbar-thumb:hover { background:#94A3B8; }
        input { outline:none; }
        button:active { transform:scale(0.97); }
      `}</style>

      {/* Sidebar */}
      <div style={{ position:"fixed", left:0, top:0, bottom:0, width:256, background:"#FFFFFF", borderRight:"1px solid #E2E8F0", display:"flex", flexDirection:"column", zIndex:10, boxShadow:"1px 0 10px rgba(0,0,0,0.02)" }}>
        <div style={{ padding:"22px 18px 18px", borderBottom:"1px solid #E2E8F0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
            <IQIcon />
            <span style={{ fontSize:20, fontWeight:800, letterSpacing:"-0.04em", color:"#0F172A" }}>
              Client<span style={{ color:"#0D9488" }}>IQ</span>
            </span>
          </div>
          <button onClick={() => { setSessions([]); setIdea(""); setEmailError(""); }} 
            style={{ width:"100%", padding:"9px 14px", background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:8, color:"#0D9488", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:8, fontFamily:"inherit", cursor:"pointer", transition:"all 0.15s" }}
            onMouseOver={e => { e.currentTarget.style.background="#F0FDFA"; e.currentTarget.style.borderColor="#CCFBF1"; }}
            onMouseOut={e => { e.currentTarget.style.background="#F8FAFC"; e.currentTarget.style.borderColor="#E2E8F0"; }}>
            <span style={{ fontSize:16, fontWeight:700 }}>+</span> New Analysis
          </button>
        </div>
        <div style={{ padding:14, flex:1, overflowY:"auto" }}>
          <div style={{ fontSize:10, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, padding:"0 4px", display:"flex", justifyContent:"space-between", fontWeight:700 }}>
            <span>History</span>
            {loadingHistory && <span style={{ color:"#0D9488", textTransform:"none", fontSize:9 }}>Loading...</span>}
          </div>

          {/* Current Active Analyses */}
          {sessions.slice().reverse().map((s, i) => (
            <div key={`cur-${i}`} style={{ padding:"8px 12px", borderRadius:8, marginBottom:4, background:"#F0FDFA", color:"#0D9488", fontSize:13, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", border:"1px solid #CCFBF1" }}
              title="Active session view">
              ● {s.user.idea}
            </div>
          ))}

          {/* Clickable Cloud History Reports */}
          {loadedHistory.map((hItem, i) => (
            <div key={`hist-${i}`} onClick={() => loadPastAnalysis(hItem)}
              style={{ padding:"8px 12px", borderRadius:8, marginBottom:2, color:"#475569", fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", cursor:"pointer", transition:"all 0.15s" }}
              onMouseOver={e => { e.currentTarget.style.background="#F1F5F9"; e.currentTarget.style.color="#0F172A"; }}
              onMouseOut={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#475569"; }}
              title="Click to instantly reload this complete analysis report">
              🕒 {hItem.input_message || "Saved Research"}
            </div>
          ))}

          {!sessions.length && !loadedHistory.length && (
            <div style={{ color:"#94A3B8", fontSize:12, padding:"8px 10px", fontStyle:"italic" }}>
              {email.includes("@") ? "No saved cloud reports" : "Type email below to view saved cloud history"}
            </div>
          )}
        </div>

      </div>

      {/* Main Content Area */}
      <div style={{ marginLeft:256, flex:1, display:"flex", flexDirection:"column", minHeight:"100vh" }}>
        {/* Top Sticky Header */}
        <div style={{ padding:"14px 32px", borderBottom:"1px solid #E2E8F0", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,0.9)", backdropFilter:"blur(8px)", position:"sticky", top:0, zIndex:5 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:13, color:"#64748B" }}>Business Intelligence</span>
            <span style={{ color:"#CBD5E1" }}>›</span>
            <span style={{ fontSize:13, color:"#0F172A", fontWeight:600 }}>Analysis Session</span>
          </div>
          {/* <div style={{ padding:"3px 12px", background:"#F0FDFA", border:"1px solid #CCFBF1", borderRadius:20, fontSize:11, color:"#0D9488", fontWeight:700 }}>
            ● Live
          </div> */}
        </div>

        {/* Chat / Report Area */}
        <div style={{ flex:1, overflowY:"auto", padding:"36px 0 20px" }}>
          {!hasContent ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"58vh", animation:"fadeIn 0.5s ease" }}>
              <div style={{ marginBottom:20 }}><IQIcon /></div>
              <h1 style={{ fontSize:36, fontWeight:800, color:"#0F172A", letterSpacing:"-0.04em", margin:"0 0 8px" }}>
                Client<span style={{ color:"#0D9488" }}>IQ</span>
              </h1>
              <p style={{ color:"#64748B", fontSize:16, margin:"0 0 42px", textAlign:"center" }}>
                AI-powered business research & intelligence
              </p>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center", maxWidth:560 }}>
                {["Gift shop in Chennai","SaaS analytics platform","EdTech tutoring app","B2B HR software"].map((ex, i) => (
                  <button key={i} onClick={() => setIdea(ex)} style={{ padding:"8px 18px", background:"#FFFFFF", border:"1px solid #E2E8F0", borderRadius:20, color:"#475569", fontSize:13.5, fontWeight:500, fontFamily:"inherit", cursor:"pointer", transition:"all 0.15s", boxShadow:"0 1px 3px rgba(0,0,0,0.02)" }}
                    onMouseOver={e => { e.currentTarget.style.borderColor="#0D9488"; e.currentTarget.style.color="#0D9488"; e.currentTarget.style.background="#F0FDFA"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor="#E2E8F0"; e.currentTarget.style.color="#475569"; e.currentTarget.style.background="#FFFFFF"; }}>
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth:800, margin:"0 auto", padding:"0 24px" }}>
              {sessions.map((session, i) => (
                <div key={i} style={{ marginBottom:36 }}>
                  {/* User Question bubble */}
                  <div style={{ display:"flex", justifyContent:"flex-end", gap:12, marginBottom:22, animation:"fadeIn 0.3s ease" }}>
                    <div style={{ maxWidth:"70%" }}>
                      <div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:"16px 16px 4px 16px", padding:"14px 20px", color:"#FFFFFF", boxShadow:"0 4px 12px rgba(0,0,0,0.06)" }}>
                        <div style={{ fontSize:10, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5, fontWeight:600 }}>Business Idea</div>
                        <div style={{ fontSize:15, color:"#FFFFFF", fontWeight:700, marginBottom:6 }}>{session.user.idea}</div>
                        <div style={{ fontSize:12, color:"#CBD5E1" }}>📧 {session.user.email}</div>
                      </div>
                    </div>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:"#E2E8F0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#334155", fontWeight:700, flexShrink:0, marginTop:4 }}>U</div>
                  </div>

                  {/* Generated Result */}
                  {session.result === null && i === sessions.length - 1 && loading ? (
                    <LoadingResearch />
                  ) : session.result?.error ? (
                    <div style={{ display:"flex", gap:14 }}>
                      <div style={{ flexShrink:0, marginTop:4 }}><IQIcon /></div>
                      <div style={{ flex:1, background:"#FEF2F2", border:"1px solid #FCA5A5", borderRadius:"4px 16px 16px 16px", padding:"22px 26px" }}>
                        <p style={{ color:"#991B1B", fontSize:14.5, fontWeight:600, margin:0 }}>
                          ⚠️ Could not connect to the agent. Make sure your backend is running at <code style={{ color:"#0D9488" }}>{BACKEND_URL}/run-agent</code>.
                        </p>
                        {session.result.message && (
                          <p style={{ color:"#B91C1C", fontSize:13.5, marginTop:8, marginBottom:0 }}>
                            Error: {session.result.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : session.result ? (
                    <AnalysisResult data={session.result} />
                  ) : null}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Action Panel */}
        <div style={{ padding:"12px 24px 24px", background:"linear-gradient(to bottom, rgba(248,250,252,0) 0%, #F8FAFC 28%)", position:"sticky", bottom:0 }}>
          <div style={{ maxWidth:800, margin:"0 auto" }}>
            {emailError && (
              <div style={{ marginBottom:8, color:"#DC2626", fontSize:12.5, fontWeight:600, animation:"fadeIn 0.2s ease", padding:"0 6px" }}>
                ✕ {emailError}
              </div>
            )}
            <div style={{ background:"#FFFFFF", border:`1px solid ${emailError ? "#F87171" : "#CBD5E1"}`, borderRadius:16, overflow:"hidden", transition:"all 0.2s", boxShadow:"0 4px 14px rgba(0,0,0,0.04)" }}
              onFocusCapture={e => e.currentTarget.style.borderColor=emailError ? "#DC2626" : "#0D9488"}
              onBlurCapture={e => e.currentTarget.style.borderColor=emailError ? "#F87171" : "#CBD5E1"}>
              <div style={{ display:"flex" }}>
                <div style={{ flex:1, borderRight:"1px solid #E2E8F0" }}>
                  <div style={{ padding:"12px 18px 0", fontSize:10, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700 }}>Business Idea</div>
                  <input value={idea} onChange={e => { setIdea(e.target.value); setEmailError(""); }} onKeyDown={handleKey}
                    placeholder="e.g. offline gift shop in Chennai"
                    style={{ width:"100%", background:"transparent", border:"none", padding:"6px 18px 14px", color:"#0F172A", fontSize:14.5, fontFamily:"inherit", fontWeight:500 }} />
                </div>
                <div style={{ width:230 }}>
                  <div style={{ padding:"12px 18px 0", fontSize:10, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700 }}>Email Address</div>
                  <input type="email" value={email} onChange={e => { 
                    const val = e.target.value;
                    setEmail(val);
                    if (val.trim().length > 0) {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(val.trim())) {
                        setEmailError("Invalid email format");
                      } else {
                        setEmailError("");
                      }
                    } else {
                      setEmailError("");
                    }
                  }} onKeyDown={handleKey}
                    placeholder="you@company.com"
                    style={{ width:"100%", background:"transparent", border:"none", padding:"6px 18px 14px", color:"#0F172A", fontSize:14.5, fontFamily:"inherit", fontWeight:500 }} />
                </div>
              </div>
              <div style={{ padding:"10px 16px", borderTop:"1px solid #E2E8F0", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#F8FAFC" }}>
                {/* <span style={{ fontSize:11.5, color:"#64748B", fontWeight:500 }}>Connected to <span style={{ color:"#0D9488", fontWeight:700 }}>{BACKEND_URL}/run-agent</span></span> */}
                <button onClick={handleAnalyze} disabled={!canSubmit}
                  style={{ padding:"9px 22px", background:canSubmit?"linear-gradient(135deg, #0D9488, #059669)":"#E2E8F0", border:"none", borderRadius:10, color:canSubmit?"#FFFFFF":"#94A3B8", fontSize:13.5, fontWeight:700, fontFamily:"inherit", cursor:canSubmit?"pointer":"not-allowed", display:"flex", alignItems:"center", gap:8, transition:"all 0.2s", boxShadow:canSubmit?"0 2px 6px rgba(13,148,136,0.2)":"none" }}>
                  {loading ? (
                    <><span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.4)", borderTop:"2px solid #FFFFFF", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }} /> Researching</>
                  ) : "Analyze →"}
                </button>
              </div>
            </div>
            <div style={{ textAlign:"center", marginTop:10, fontSize:11.5, color:"#94A3B8", fontWeight:500 }}>
              ClientIQ connects to your AI agent backend · Verify critical decisions independently
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
