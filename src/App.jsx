import { useEffect, useRef, useState } from "react";

// ── CDN libs ──────────────────────────────────────────────────────────────
const _katexCSS = document.createElement("link");
_katexCSS.rel = "stylesheet";
_katexCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css";
document.head.appendChild(_katexCSS);
["https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js",
 "https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js"]
  .forEach(src => { const s = document.createElement("script"); s.src = src; document.head.appendChild(s); });

// ── Styles ────────────────────────────────────────────────────────────────
const _style = document.createElement("style");
_style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#0b0c10;--bg2:#10131a;--bg3:#161b26;
    --border:rgba(255,255,255,0.06);--border2:rgba(255,255,255,0.10);
    --text:#e8e6df;--text2:#9b9994;--text3:#6a6863;
    --gold:#c9a84c;--gold2:#e8c96a;--blue2:#6bb3f5;--green:#4caf7d;
    --shadow:0 32px 80px rgba(0,0,0,0.7);
  }
  html,body,#root{height:100%;overflow:hidden;background:var(--bg)}
  .app{display:flex;height:100vh;font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);overflow:hidden;position:relative}
  .app::before{content:'';position:fixed;top:-40%;left:-20%;width:70%;height:70%;background:radial-gradient(ellipse,rgba(201,168,76,0.04) 0%,transparent 70%);pointer-events:none;z-index:0}

  /* ── API KEY OVERLAY ── */
  .overlay{position:fixed;inset:0;z-index:100;background:rgba(11,12,16,0.97);backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .card{background:var(--bg2);border:1px solid var(--border2);border-radius:24px;padding:52px 60px;max-width:460px;width:90%;text-align:center;box-shadow:var(--shadow),0 0 0 1px rgba(201,168,76,0.06) inset;position:relative;overflow:hidden}
  .card::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:200px;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
  .cardLogo{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;letter-spacing:-0.02em;margin-bottom:6px}
  .cardLogo span{color:var(--gold)}
  .cardSub{color:var(--text3);font-size:12px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:36px}
  .cardLabel{text-align:left;font-size:11px;font-weight:500;color:var(--text3);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:9px}
  .cardInputWrap{position:relative;margin-bottom:14px}
  .cardInput{width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:12px;padding:13px 46px 13px 15px;color:var(--text);font-size:14px;font-family:'DM Mono',monospace;outline:none;transition:border-color 0.2s;letter-spacing:0.03em}
  .cardInput:focus{border-color:var(--gold)}
  .cardInput::placeholder{color:var(--text3);font-family:'DM Sans',sans-serif;letter-spacing:0}
  .eyeBtn{position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text3);padding:4px;display:flex;transition:color 0.2s}
  .eyeBtn:hover{color:var(--text2)}
  .cardBtn{width:100%;background:linear-gradient(135deg,var(--gold),#a8862e);border:none;border-radius:12px;padding:14px;color:#0b0c10;font-size:14px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;letter-spacing:0.02em;transition:all 0.2s;box-shadow:0 8px 24px rgba(201,168,76,0.25);margin-bottom:18px}
  .cardBtn:hover{transform:translateY(-1px);box-shadow:0 12px 32px rgba(201,168,76,0.38)}
  .cardBtn:disabled{opacity:0.35;cursor:not-allowed;transform:none}
  .cardNote{font-size:11.5px;color:var(--text3);line-height:1.7}
  .cardNote a{color:var(--gold);text-decoration:none}
  .cardNote a:hover{text-decoration:underline}
  .cardSteps{text-align:left;margin:20px 0 0;background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:14px 16px;font-size:12px;color:var(--text2);line-height:2}
  .cardSteps b{color:var(--text)}

  /* ── SIDEBAR ── */
  .sidebar{width:270px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;z-index:1}
  .sidebarHeader{padding:26px 22px 18px;border-bottom:1px solid var(--border)}
  .logoText{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;letter-spacing:-0.02em;margin-bottom:3px}
  .logoText span{color:var(--gold)}
  .logoSub{font-size:11px;color:var(--text3);letter-spacing:0.08em;text-transform:uppercase}
  .sidebarSection{padding:16px 13px 0}
  .sidebarLabel{font-size:10px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.12em;padding:0 8px;margin-bottom:7px}
  .topicList{display:flex;flex-direction:column;gap:2px}
  .topicBtn{display:flex;align-items:center;gap:10px;padding:8px 11px;border-radius:10px;cursor:pointer;border:1px solid transparent;background:transparent;color:var(--text2);font-size:13px;font-family:'DM Sans',sans-serif;transition:all 0.15s;text-align:left;width:100%}
  .topicBtn:hover{background:var(--bg3);color:var(--text)}
  .topicBtn.active{background:rgba(201,168,76,0.09);color:var(--gold2);border-color:rgba(201,168,76,0.18)}
  .topicIcon{font-size:15px;flex-shrink:0;width:20px;text-align:center}
  .sidebarFooter{margin-top:auto;padding:13px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:7px}
  .clearBtn{background:transparent;border:1px solid var(--border2);border-radius:10px;color:var(--text3);font-size:12.5px;font-family:'DM Sans',sans-serif;padding:8px 13px;cursor:pointer;width:100%;display:flex;align-items:center;justify-content:center;gap:7px;transition:all 0.15s}
  .clearBtn:hover{background:var(--bg3);color:var(--text2)}
  .changeKeyBtn{background:transparent;border:1px solid rgba(201,168,76,0.2);border-radius:10px;color:var(--gold);font-size:12.5px;font-family:'DM Sans',sans-serif;padding:8px 13px;cursor:pointer;width:100%;display:flex;align-items:center;justify-content:center;gap:7px;transition:all 0.15s}
  .changeKeyBtn:hover{background:rgba(201,168,76,0.08)}

  /* ── MAIN ── */
  .main{flex:1;display:flex;flex-direction:column;height:100vh;overflow:hidden;z-index:1}
  .topbar{height:62px;background:rgba(11,12,16,0.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 26px;flex-shrink:0}
  .topbarTitle{font-size:15px;font-weight:500}
  .topbarSub{font-size:11px;color:var(--text3);margin-top:2px}
  .topicTag{display:inline-block;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.2);border-radius:20px;padding:2px 9px;font-size:11px;color:var(--gold);margin-left:8px;vertical-align:middle}
  .modelBadge{display:flex;align-items:center;gap:7px;background:var(--bg3);border:1px solid var(--border2);border-radius:20px;padding:5px 13px;font-size:12px;color:var(--text2)}
  .dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green);flex-shrink:0}
  .dot.loading{background:var(--gold2);box-shadow:0 0 8px var(--gold2);animation:dotPulse 1s ease-in-out infinite}
  @keyframes dotPulse{0%,100%{opacity:0.35}50%{opacity:1}}

  /* ── CHAT ── */
  .chat{flex:1;overflow-y:auto;padding:34px 18px;display:flex;justify-content:center}
  .chat::-webkit-scrollbar{width:5px}
  .chat::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:20px}
  .chat::-webkit-scrollbar-track{background:transparent}
  .chatInner{width:100%;max-width:820px}

  /* ── MESSAGES ── */
  .row{display:flex;margin-bottom:24px;animation:slideUp 0.18s ease}
  @keyframes slideUp{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
  .avatar{width:34px;height:34px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600}
  .row.assistant .avatar{background:linear-gradient(135deg,#1c2233,#253048);border:1px solid rgba(201,168,76,0.25);color:var(--gold);margin-right:13px;font-family:'Playfair Display',serif;font-size:13px}
  .row.user{flex-direction:row-reverse}
  .row.user .avatar{background:linear-gradient(135deg,#1a2b4a,#1e3a6e);border:1px solid rgba(74,144,217,0.28);color:var(--blue2);margin-left:13px;font-size:11px}
  .bubble{padding:14px 17px;border-radius:16px;line-height:1.72;font-size:14.5px;max-width:calc(100% - 56px)}
  .row.user .bubble{background:linear-gradient(135deg,#1a3a6e,#1e4a8f);border:1px solid rgba(74,144,217,0.22);color:#ddeeff;box-shadow:0 6px 24px rgba(74,144,217,0.14);white-space:pre-wrap}
  .row.assistant .bubble{background:var(--bg3);border:1px solid var(--border2);color:var(--text);box-shadow:0 4px 16px rgba(0,0,0,0.28)}

  /* ── MARKDOWN ── */
  .bubble p{margin:7px 0}.bubble p:first-child{margin-top:0}.bubble p:last-child{margin-bottom:0}
  .bubble h1,.bubble h2,.bubble h3{font-family:'Playfair Display',serif;color:var(--text);margin:15px 0 7px;line-height:1.3}
  .bubble h1{font-size:20px}.bubble h2{font-size:17px;border-bottom:1px solid var(--border);padding-bottom:5px}.bubble h3{font-size:15px;color:var(--gold2)}
  .bubble ul,.bubble ol{padding-left:22px;margin:8px 0}.bubble li{margin:4px 0;line-height:1.65}
  .bubble strong{font-weight:600;color:var(--text)}.bubble em{color:var(--gold2);font-style:italic}
  .bubble a{color:var(--blue2);text-decoration:underline;opacity:0.85}
  .bubble hr{border:none;border-top:1px solid var(--border);margin:12px 0}
  .bubble blockquote{border-left:3px solid var(--gold);padding:5px 13px;margin:9px 0;background:rgba(201,168,76,0.05);border-radius:0 8px 8px 0;color:var(--text2);font-style:italic}
  .bubble code{font-family:'DM Mono',monospace;background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:5px;font-size:13px;border:1px solid rgba(255,255,255,0.07)}
  .bubble pre{background:rgba(0,0,0,0.45);border:1px solid var(--border2);border-radius:10px;padding:13px 15px;margin:11px 0;overflow-x:auto;font-family:'DM Mono',monospace;font-size:13px;line-height:1.65}
  .bubble pre code{background:none;border:none;padding:0}
  .bubble table{border-collapse:collapse;width:100%;margin:11px 0;font-size:13.5px}
  .bubble th,.bubble td{border:1px solid var(--border2);padding:7px 11px;text-align:left}
  .bubble th{background:rgba(201,168,76,0.08);color:var(--gold2);font-weight:600}
  .bubble tr:nth-child(even){background:rgba(255,255,255,0.02)}
  .bubble .katex-display{margin:13px 0;overflow-x:auto}.bubble .katex{font-size:1.05em}

  /* ── TYPING ── */
  .typingDots{display:flex;gap:5px;align-items:center;padding:3px 0}
  .typingDots span{width:6px;height:6px;border-radius:50%;background:var(--gold);opacity:0.35;animation:blink 1.2s ease-in-out infinite}
  .typingDots span:nth-child(2){animation-delay:0.2s}.typingDots span:nth-child(3){animation-delay:0.4s}
  @keyframes blink{0%,100%{opacity:0.2;transform:scale(0.85)}50%{opacity:0.9;transform:scale(1.1)}}

  /* ── INPUT ── */
  .inputWrapper{padding:13px 20px 19px;border-top:1px solid var(--border);background:rgba(11,12,16,0.85);backdrop-filter:blur(10px);flex-shrink:0;display:flex;justify-content:center}
  .inputOuter{width:100%;max-width:820px}
  .inputRow{background:var(--bg3);border:1px solid var(--border2);border-radius:16px;display:flex;align-items:flex-end;padding:9px 9px 9px 15px;gap:9px;box-shadow:var(--shadow);transition:border-color 0.2s}
  .inputRow:focus-within{border-color:rgba(201,168,76,0.35)}
  .inputRow textarea{flex:1;background:transparent;border:none;color:var(--text);font-size:14.5px;font-family:'DM Sans',sans-serif;font-weight:300;outline:none;resize:none;line-height:1.6;min-height:24px;max-height:160px;padding:4px 0}
  .inputRow textarea::placeholder{color:var(--text3)}
  .sendBtn{background:linear-gradient(135deg,var(--gold),#a8862e);border:none;color:#0b0c10;width:38px;height:38px;border-radius:10px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all 0.2s;box-shadow:0 4px 14px rgba(201,168,76,0.25)}
  .sendBtn:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(201,168,76,0.38)}
  .sendBtn:disabled{opacity:0.3;cursor:not-allowed;transform:none;box-shadow:none}
  .inputHint{text-align:center;font-size:11px;color:var(--text3);margin-top:8px}
`;
document.head.appendChild(_style);

// ── Topics ────────────────────────────────────────────────────────────────
const TOPICS = [
  { id: "matematica", label: "Matematica",               icon: "∑",  desc: "Algebra, Analisi, Geometria" },
  { id: "fisica",     label: "Fisica",                   icon: "⚛",  desc: "Meccanica, Termodinamica, EM" },
  { id: "statistica", label: "Statistica",               icon: "📊", desc: "Inferenza, Probabilità, Test" },
  { id: "ai",         label: "Intelligenza Artificiale", icon: "🧠", desc: "ML, Deep Learning, NLP" },
  { id: "dataviz",    label: "Data Visualization",       icon: "📈", desc: "Grafici, Dashboard, UX dati" },
  { id: "r",          label: "R",                        icon: "Ⓡ",  desc: "Tidyverse, ggplot2, Analisi" },
  { id: "python",     label: "Python",                   icon: "🐍", desc: "NumPy, Pandas, Scikit-learn" },
  { id: "sql",        label: "SQL",                      icon: "🗄",  desc: "Query, Join, Ottimizzazione" },
  { id: "web",        label: "Programmazione Web",       icon: "🌐", desc: "HTML, CSS, JS, React" },
];

const SYSTEM_PROMPTS = {
  matematica: "Sei un tutor universitario esperto di Matematica. Usa LaTeX per le formule: $...$ inline, $$...$$ display. Spiega step-by-step con rigore, proponi esercizi graduali. Usa Markdown per strutturare (## titoli, **grassetto**, elenchi).",
  fisica:     "Sei un tutor esperto di Fisica universitaria. Usa LaTeX per equazioni fisiche ($...$ inline, $$...$$ display). Collega teoria ed esempi pratici. Usa Markdown per strutturare le risposte.",
  statistica: "Sei un tutor di Statistica e Probabilità. Usa LaTeX per formule statistiche. Spiega distribuzioni, test di ipotesi, inferenza con chiarezza. Usa Markdown per strutturare.",
  ai:         "Sei un tutor di Intelligenza Artificiale e Machine Learning. Usa LaTeX per formule dei modelli. Spiega algoritmi, architetture e training con precisione. Usa Markdown per strutturare.",
  dataviz:    "Sei un tutor di Data Visualization. Spiega principi grafici, scelta chart, librerie (D3, ggplot2, Matplotlib, Tableau). Usa Markdown per strutturare le risposte.",
  r:          "Sei un tutor esperto di R per data science. Fornisci codice R commentato in blocchi ```r. Usa tidyverse e ggplot2. Spiega ogni passaggio del codice con chiarezza.",
  python:     "Sei un tutor esperto di Python per data science. Fornisci codice Python commentato in blocchi ```python. Usa NumPy, Pandas, Scikit-learn. Usa LaTeX per formule. Spiega ogni passaggio.",
  sql:        "Sei un tutor di SQL. Scrivi query in blocchi ```sql. Spiega join, subquery, funzioni finestra, ottimizzazione. Usa Markdown per strutturare le risposte.",
  web:        "Sei un tutor di programmazione web. Copri HTML, CSS, JS ES6+, React. Scrivi codice in blocchi con il linguaggio corretto. Applica best practice e accessibilità.",
};

// ── Markdown + LaTeX renderer ─────────────────────────────────────────────
function renderContent(text) {
  if (!text) return "";
  const store = [];
  let safe = text;
  safe = safe.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => { store.push({ m, block: true });  return `MATHPH_${store.length-1}_END`; });
  safe = safe.replace(/\$([^$\n]+?)\$/g,     (_, m) => { store.push({ m, block: false }); return `MATHPH_${store.length-1}_END`; });
  let html;
  try { window.marked.setOptions({ breaks: true, gfm: true }); html = window.marked.parse(safe); }
  catch { html = `<p>${safe.replace(/\n/g, "<br/>")}</p>`; }
  html = html.replace(/MATHPH_(\d+)_END/g, (_, i) => {
    const { m, block } = store[+i];
    try { return window.katex.renderToString(m, { throwOnError: false, displayMode: block }); }
    catch { return block ? `$$${m}$$` : `$${m}$`; }
  });
  return html;
}

function MessageContent({ text, isUser }) {
  const [html, setHtml] = useState(null);
  const [ready, setReady] = useState(!!(window.marked && window.katex));
  useEffect(() => {
    if (isUser) return;
    if (ready) { setHtml(renderContent(text)); return; }
    const t = setInterval(() => { if (window.marked && window.katex) { setReady(true); clearInterval(t); } }, 150);
    return () => clearInterval(t);
  }, [text, ready, isUser]);
  if (isUser) return <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>;
  if (!html)  return <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

// ── OpenRouter call ───────────────────────────────────────────────────────
async function callOpenRouter(apiKey, systemPrompt, messages, onChunk) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      stream: true,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? "Errore HTTP " + res.status);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    for (const line of chunk.split("\n")) {
      if (!line.startsWith("data:")) continue;
      const json = line.replace("data:", "").trim();
      if (json === "[DONE]") break;
      try {
        const parsed = JSON.parse(json);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (!delta) continue;
        fullText += delta;
        onChunk(fullText);
      } catch {}
    }
  }

  return fullText;
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [apiKey, setApiKey]       = useState(() => localStorage.getItem("or_key") ?? "");
  const [keyOk, setKeyOk]         = useState(() => !!localStorage.getItem("or_key"));
  const [showKey, setShowKey]     = useState(false);
  const [keyError, setKeyError]   = useState("");
  const [validating, setValidating] = useState(false);

  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [topic, setTopic]         = useState("matematica");

  const chatRef     = useRef(null);
  const textareaRef = useRef(null);
  const currentTopic = TOPICS.find(t => t.id === topic);

  // Welcome message
  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: `Benvenuto in **EduAI**.\n\nHai selezionato il modulo: **${currentTopic.label}**.\n\nSono pronto ad aiutarti con spiegazioni teoriche, esercizi, simulazioni d'esame e dimostrazioni. Puoi usare LaTeX nelle domande: $f(x)$ per inline, $$\\int_a^b f(x)\\,dx$$ per display.\n\nCosa vuoi studiare?`,
    }]);
  }, [topic]);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  // Textarea auto-resize
  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };

  // Validate key with a tiny test call
  async function handleKeySubmit() {
    const k = apiKey.trim();
    if (!k) return;
    setValidating(true);
    setKeyError("");
    try {
      // Quick validation: non-streaming ping
      const testRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${k}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [{ role: "user", content: "ok?" }],
          max_tokens: 5,
          stream: true,
        }),
      });
      if (!testRes.ok) {
        const e = await testRes.json().catch(() => ({}));
        throw new Error(e?.error?.message ?? "Chiave non valida");
      }
      localStorage.setItem("or_key", k);
      setKeyOk(true);
    } catch (err) {
      setKeyError(err.message);
    } finally {
      setValidating(false);
    }
  }

  function handleChangeKey() {
    localStorage.removeItem("or_key");
    setKeyOk(false);
    setApiKey("");
    setKeyError("");
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    const apiMessages = updated
      .filter((m, i) => !(i === 0 && m.role === "assistant"))
      .map(m => ({ role: m.role, content: m.content }));

    // Add empty assistant message to fill via streaming
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      await callOpenRouter(apiKey, SYSTEM_PROMPTS[topic], apiMessages, (text) => {
        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: text };
          return copy;
        });
      });
    } catch (err) {
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: `❌ **Errore:** ${err.message}` };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([{
      role: "assistant",
      content: `Modulo **${currentTopic.label}** — chat resettata. Cosa vuoi studiare?`,
    }]);
  }

  // ── API KEY OVERLAY ──
  if (!keyOk) return (
    <div className="overlay">
      <div className="card">
        <div className="cardLogo">Edu<span>AI</span></div>
        <div className="cardSub">University Tutor</div>

        <div className="cardLabel">OpenRouter API Key</div>
        <div className="cardInputWrap">
          <input
            className="cardInput"
            type={showKey ? "text" : "password"}
            placeholder="sk-or-v1-..."
            value={apiKey}
            onChange={e => { setApiKey(e.target.value.replace(/[^ -~]/g, "")); setKeyError(""); }}
            onKeyDown={e => e.key === "Enter" && handleKeySubmit()}
            autoFocus
          />
          <button className="eyeBtn" onClick={() => setShowKey(s => !s)}>
            {showKey
              ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        </div>

        {keyError && (
          <div style={{ fontSize: 12, color: "#e08080", marginBottom: 12, textAlign: "left" }}>
            ⚠️ {keyError}
          </div>
        )}

        <button className="cardBtn" disabled={!apiKey.trim() || validating} onClick={handleKeySubmit}>
          {validating ? "Verifica in corso…" : "Inizia a studiare →"}
        </button>

        <div className="cardNote">
          La chiave viene salvata solo nel tuo browser (localStorage).<br/>
          Non viene mai inviata a server esterni tranne OpenRouter.
        </div>

        <div className="cardSteps">
          <b>Come ottenere la chiave gratis:</b><br/>
          1. Vai su <a href="https://openrouter.ai" target="_blank" rel="noreferrer">openrouter.ai</a><br/>
          2. Crea un account gratuito<br/>
          3. <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer">Genera una API key</a><br/>
          4. Il modello usato è <b>completamente gratuito</b> (openrouter/free)
        </div>
      </div>
    </div>
  );

  // ── MAIN APP ──
  return (
    <div className="app">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebarHeader">
          <div className="logoText">Edu<span>AI</span></div>
          <div className="logoSub">University Tutor</div>
        </div>
        <div className="sidebarSection">
          <div className="sidebarLabel">Materie</div>
          <div className="topicList">
            {TOPICS.map(t => (
              <button key={t.id} className={`topicBtn ${topic === t.id ? "active" : ""}`} onClick={() => setTopic(t.id)}>
                <span className="topicIcon">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="sidebarFooter">
          <button className="clearBtn" onClick={clearChat}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.36"/></svg>
            Reset chat
          </button>
          <button className="changeKeyBtn" onClick={handleChangeKey}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Cambia API Key
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="topbar">
          <div>
            <div className="topbarTitle">
              {currentTopic.icon} {currentTopic.label}
              <span className="topicTag">{currentTopic.desc}</span>
            </div>
            <div className="topbarSub">Markdown & LaTeX · OpenRouter · modello gratuito</div>
          </div>
          <div className="modelBadge">
            <div className={`dot ${loading ? "loading" : ""}`} />
            openrouter/free
          </div>
        </div>

        <div className="chat" ref={chatRef}>
          <div className="chatInner">
            {messages.map((msg, i) => (
              <div key={i} className={`row ${msg.role}`}>
                <div className="avatar">{msg.role === "assistant" ? "AI" : "Tu"}</div>
                <div className="bubble">
                  <MessageContent text={msg.content} isUser={msg.role === "user"} />
                </div>
              </div>
            ))}
            {loading && (
              <div className="row assistant">
                <div className="avatar">AI</div>
                <div className="bubble"><div className="typingDots"><span/><span/><span/></div></div>
              </div>
            )}
          </div>
        </div>

        <div className="inputWrapper">
          <div className="inputOuter">
            <div className="inputRow">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={e => { setInput(e.target.value); autoResize(); }}
                placeholder={`Chiedi qualcosa su ${currentTopic.label}… usa $formula$ per LaTeX`}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              />
              <button className="sendBtn" onClick={sendMessage} disabled={!input.trim() || loading}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <div className="inputHint">Invio per inviare · Shift+Invio per andare a capo · $x^2$ inline · $$\int$$ display</div>
          </div>
        </div>
      </div>
    </div>
  );
}
