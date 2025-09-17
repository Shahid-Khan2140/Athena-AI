import { useState, useRef, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import AthenaLogo from "./assets/FinalLOGPai.png";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";


const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;


function AuthModal({ open, onClose }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [msg, setMsg] = useState("");
  const [closing, setClosing] = useState(false); // for exit animation

  if (!open && !closing) return null;

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", confirm: "" });
    setMsg("");
  };

  // Animate close
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
      setMode("login");
      resetForm();
    }, 400); // match modalFadeOut duration
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setMsg("");
    if (!form.email || !form.password) {
      setMsg("Please fill in all fields.");
      return;
    }
    if (form.email === "user@example.com" && form.password === "password123") {
      setMsg("Login successful!");
      setTimeout(onClose, 1000);
    } else {
      setMsg("Invalid email or password.");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setMsg("");
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setMsg("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setMsg("Passwords do not match.");
      return;
    }
    setMsg("Sign up successful! Redirecting to login...");
    setTimeout(() => {
      setMode("login");
      resetForm();
    }, 1200);
  };

  const handleForgot = (e) => {
    e.preventDefault();
    setMsg("");
    if (!form.email) {
      setMsg("Please enter your email.");
      return;
    }
    setMsg("If this email is registered, a reset link has been sent.");
  };

  // Welcome card (left column)
  const WelcomeCard = (
    <div className="welcome-card animated-welcome" style={{
      background: "#181a1b",
      borderRadius: "18px",
      boxShadow: "0 8px 40px #000c",
      padding: "2.5rem 2.5rem 2rem 2.5rem",
      minWidth: 340,
      maxWidth: 370,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      <h2 style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.7rem", textAlign: "center" }}>
        Welcome to <span className="brand" style={{ color: "#10a37f", fontWeight: 700, textShadow: "0 0 8px #10a37f88" }}>AthenaAI</span> 👋
      </h2>
      <img
        src={AthenaLogo}
        alt="AthenaAI Logo"
        className="animated-logo"
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid #10a37f",
          boxShadow: "0 4px 24px #10a37f55, 0 1.5px 8px #000a",
          background: "linear-gradient(135deg, #10a37f22 0%, #23272a 100%)",
          padding: 4,
          marginBottom: "1rem"
        }}
      />
      <p style={{ color: "#b5bac1", fontSize: "1.05rem", marginBottom: "1.2rem", textAlign: "center" }}>
        I'm here to help you with anything you'd like to know. You can ask me about:
      </p>
      <div className="welcome-options" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.7rem", marginBottom: "1.2rem" }}>
        <button className="welcome-option" style={welcomeOptionStyle} onClick={() => alert("General knowledge example!")}>
          <span className="icon" style={iconStyle}>💡</span> General knowledge
        </button>
        <button className="welcome-option" style={welcomeOptionStyle} onClick={() => alert("Technical questions example!")}>
          <span className="icon" style={iconStyle}>🛠</span> Technical questions
        </button>
        <button className="welcome-option" style={welcomeOptionStyle} onClick={() => alert("Writing assistance example!")}>
          <span className="icon" style={iconStyle}>📝</span> Writing assistance
        </button>
        <button className="welcome-option" style={welcomeOptionStyle} onClick={() => alert("Problem solving example!")}>
          <span className="icon" style={iconStyle}>🤔</span> Problem solving
        </button>
      </div>
      <div className="desc" style={{ color: "#b5bac1", fontSize: "0.98rem", marginTop: "0.7rem", textAlign: "center" }}>
        Just type your question below and press Enter or click Send!
      </div>
    </div>
  );

  // Form (right column)
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 ${closing ? "animated-modal out" : "animated-modal"}`}
      style={{ fontFamily: "'Segoe UI', Arial, sans-serif", overflow: "hidden" }}
    >
      <div style={{
        background: "#181a1b",
        borderRadius: 16,
        boxShadow: "0 4px 32px #000a",
        padding: "2rem 2.5rem",
        minWidth: 320,
        maxWidth: "90vw",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        gap: "2.5rem"
      }}>
        {WelcomeCard}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 320, flex: 1 }}>
          <button
            style={{
              position: "absolute",
              top: 24,
              right: 32,
              background: "none",
              border: "none",
              color: "#b5bac1",
              fontSize: 28,
              cursor: "pointer"
            }}
            onClick={handleClose}
            aria-label="Close"
          >&times;</button>
          <img
            src={AthenaLogo}
            alt="AthenaAI Logo"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #10a37f",
              boxShadow: "0 4px 24px #10a37f55, 0 1.5px 8px #000a",
              background: "linear-gradient(135deg, #10a37f22 0%, #23272a 100%)",
              padding: 4,
              marginBottom: "1rem"
            }}
          />
          {mode === "login" && (
            <>
              <h2 style={{ color: "#10a37f", marginBottom: "1.2rem" }}>Login to AthenaAI</h2>
              <form onSubmit={handleLogin} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <label style={labelStyle}>Email address</label>
                <input type="email" name="email" placeholder="your@gmail.com" required value={form.email} onChange={handleChange} style={inputStyle} />
                <label style={labelStyle}>Password</label>
                <input type="password" name="password" placeholder="Enter your password" required value={form.password} onChange={handleChange} style={inputStyle} />
                {msg && <div style={{ color: "#ff6b6b", fontSize: "0.95rem", textAlign: "center" }}>{msg}</div>}
                <button type="submit" style={buttonStyle}>Login</button>
              </form>
              <div style={{ marginTop: "0.7rem", width: "100%", display: "flex", justifyContent: "space-between" }}>
                <button style={linkStyle} onClick={() => { setMode("forgot"); resetForm(); }}>Forgot password?</button>
                <button style={linkStyle} onClick={() => { setMode("signup"); resetForm(); }}>Sign Up</button>
              </div>
            </>
          )}
          {mode === "signup" && (
            <>
              <h2 style={{ color: "#10a37f", marginBottom: "1.2rem" }}>Create your AthenaAI account</h2>
              <form onSubmit={handleSignup} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <label style={labelStyle}>Full Name</label>
                <input type="text" name="name" placeholder="Your name" required value={form.name} onChange={handleChange} style={inputStyle} />
                <label style={labelStyle}>Email address</label>
                <input type="email" name="email" placeholder="your@gmail.com" required value={form.email} onChange={handleChange} style={inputStyle} />
                <label style={labelStyle}>Password</label>
                <input type="password" name="password" placeholder="Create a password" required value={form.password} onChange={handleChange} style={inputStyle} />
                <label style={labelStyle}>Confirm Password</label>
                <input type="password" name="confirm" placeholder="Confirm your password" required value={form.confirm} onChange={handleChange} style={inputStyle} />
                {msg && <div style={{ color: "#10a37f", fontSize: "0.95rem", textAlign: "center" }}>{msg}</div>}
                <button type="submit" style={buttonStyle}>Sign Up</button>
              </form>
              <div style={{ marginTop: "0.7rem" }}>
                <span style={{ color: "#b5bac1" }}>Already have an account? </span>
                <button style={linkStyle} onClick={() => { setMode("login"); resetForm(); }}>Sign in</button>
              </div>
            </>
          )}
          {mode === "forgot" && (
            <>
              <h2 style={{ color: "#10a37f", marginBottom: "1.2rem" }}>Reset your password</h2>
              <form onSubmit={handleForgot} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <label style={labelStyle}>Email address</label>
                <input type="email" name="email" placeholder="your@gmail.com" required value={form.email} onChange={handleChange} style={inputStyle} />
                {msg && <div style={{ color: "#10a37f", fontSize: "0.95rem", textAlign: "center" }}>{msg}</div>}
                <button type="submit" style={buttonStyle}>Send Reset Link</button>
              </form>
              <div style={{ marginTop: "0.7rem" }}>
                <button style={linkStyle} onClick={() => { setMode("login"); resetForm(); }}>Back to Login</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Styles for inline use
const welcomeOptionStyle = {
  background: "#23272a",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "0.9rem 1rem",
  fontSize: "1.08rem",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: "0.7rem",
  cursor: "pointer",
  transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: "transparent"
};
const iconStyle = {
  fontSize: "1.2rem",
  animation: "floatIcon 2.2s ease-in-out infinite"
};
const labelStyle = {
  color: "#b5bac1",
  fontSize: "1rem",
  textAlign: "left"
};
const inputStyle = {
  padding: "0.8rem",
  borderRadius: 8,
  border: "1px solid #23272a",
  background: "#23272a",
  color: "#fff",
  fontSize: "1rem"
};
const buttonStyle = {
  background: "#10a37f",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "0.9rem 1.5rem",
  fontSize: "1.08rem",
  fontWeight: 600,
  cursor: "pointer"
};
const linkStyle = {
  color: "#10a37f",
  background: "none",
  border: "none",
  textDecoration: "none",
  fontSize: "1rem",
  cursor: "pointer"
};

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [chatMenuOpen, setChatMenuOpen] = useState(false); // Add this state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("General");
  const [documentText, setDocumentText] = useState(""); // Add this state

  const chatContainerRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const recognitionActiveRef = useRef(false); // <-- add this

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  // Voice search logic
  useEffect(() => {
    if (!SpeechRecognition) return;
    if (!isListening) {
      // If stopped, stop recognition if running
      if (recognitionRef.current && recognitionActiveRef.current) {
        recognitionRef.current.stop();
        recognitionActiveRef.current = false;
      }
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";
    }

    const recognition = recognitionRef.current;

    recognition.onstart = () => {
      recognitionActiveRef.current = true;
    };
    recognition.onend = () => {
      recognitionActiveRef.current = false;
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion((prev) => (prev ? prev + " " : "") + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => {
      recognitionActiveRef.current = false;
      setIsListening(false);
    };

    // Only start if not already running
    if (!recognitionActiveRef.current) {
      try {
        recognition.start();
      } catch (e) {
        // Ignore "recognition has already started" error
      }
    }

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      if (recognitionActiveRef.current) {
        recognition.stop();
        recognitionActiveRef.current = false;
      }
    };
  }, [isListening, SpeechRecognition, setQuestion]);

  const handleClearChat = () => {
    setChatHistory([]);
    if (!question.trim()) setShowWelcome(true);
  };
  const handleHistory = () => alert("History feature coming soon!");
  const handleSettings = () => alert("Settings feature coming soon!");

  const handleFeaturePrompt = (feature) => {
    let example = "";
    switch (feature) {
      case "General knowledge":
        example = "What is the capital of France?";
        break;
      case "Technical questions":
        example = "How do I center a div in CSS?";
        break;
      case "Writing assistance":
        example = "Can you help me write a professional email?";
        break;
      case "Problem solving":
        example = "How can I improve my time management skills?";
        break;
      default:
        example = "";
    }
    setQuestion(example);
    setShowWelcome(false);
  };

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion(""); // Clear input immediately after sending

    setChatHistory((prev) => [
      ...prev,
      { type: "user", content: currentQuestion },
    ]);

    try {
      // If documentText exists, prepend it to the prompt
      const prompt = documentText
        ? `Document:\n${documentText}\n\nQuestion: ${currentQuestion}`
        : currentQuestion;

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB3ixPasXS_kry52GjyPh0NZ8iJfzusBE8",
        {
          contents: [{ parts: [{ text: prompt }] }],
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      setChatHistory((prev) => [...prev, { type: "ai", content: aiResponse }]);
      setAnswer(aiResponse);
    } catch (error) {
      console.log(error);
      setChatHistory((prev) => [
        ...prev,
        { type: "ai", content: "Sorry - Something went wrong. Please try again!" },
      ]);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  const handleAuthOpen = () => {
    setAuthOpen(true);
    setShowWelcome(false);
  };

  const handlePromptFocus = () => setShowWelcome(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const text = await file.text();
      setDocumentText(text);
      setQuestion("Document loaded. Ask a question about it!");
    } else if (file.type === "application/pdf") {
      // PDF extraction
      const reader = new FileReader();
      reader.onload = async function () {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(" ") + "\n";
        }
        setDocumentText(text);
        setQuestion("PDF loaded. Ask a question about it!");
      };
      reader.readAsArrayBuffer(file);
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.endsWith(".docx")
    ) {
      // DOCX extraction
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setDocumentText(result.value);
      setQuestion("Word document loaded. Ask a question about it!");
    } else if (
      file.type === "application/msword" ||
      file.name.endsWith(".doc")
    ) {
      // Optionally handle old DOC files
      alert("Old .doc files are not supported. Please use .docx, .pdf, or .txt.");
    } else {
      alert("Only TXT, PDF, and DOCX files are supported.");
    }
  };

  return (
    <div className="flex h-screen bg-[#181a1b] font-sans" style={{ overflow: "hidden" }}>
      {/* Sidebar */}
      <aside className="w-64 bg-[#23272a] flex flex-col py-6 px-4 border-r border-[#23272a]">
        {/* Logo and App Name */}
        <div className="flex items-center gap-3 mb-8">
          <img
            src={AthenaLogo}
            alt="AthenaAI Logo"
            className="h-8 w-8"
            style={{
              borderRadius: "50%",
              border: "2px solid #10a37f",
              boxShadow: "0 2px 12px #10a37f44, 0 1px 4px #000a",
              background: "linear-gradient(135deg, #10a37f22 0%, #23272a 100%)",
              padding: 2
            }}
          />
          <span className="text-xl font-bold text-[#10a37f]">AthenaAI</span>
        </div>
        {/* Navigation */}
        <nav className="flex-1">
          <div className="mb-2">
            {/* Chat menu button */}
            <button
              className="flex items-center justify-between w-full text-gray-200 font-medium px-2 py-2 rounded hover:bg-[#181a1b] transition focus:outline-none"
              onClick={() => setChatMenuOpen((open) => !open)}
            >
              <span>Chat</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${chatMenuOpen ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {/* Submenu */}
            {chatMenuOpen && (
              <div className="ml-4 mt-1 flex flex-col gap-1">
                <button
                  onClick={handleClearChat}
                  className="text-xs text-red-400 hover:text-red-600 transition text-left"
                  title="Clear Chat"
                >
                  Clear Chat
                </button>
                <button
                  onClick={handleHistory}
                  className="text-xs text-gray-300 hover:text-[#10a37f] transition text-left"
                >
                  History
                </button>
              </div>
            )}
          </div>
          {/* Settings remains as a top-level button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-full text-left px-2 py-2 rounded text-gray-300 hover:bg-[#181a1b] hover:text-[#10a37f] transition"
          >
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Bar */}
        <div className="flex items-center justify-end px-8 py-4 border-b border-[#23272a]">
          <button className="mr-4 p-2 rounded-full hover:bg-[#23272a] transition">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button
            onClick={handleAuthOpen}
            className="px-5 py-2 bg-[#23272a] text-gray-200 rounded-lg font-semibold border border-[#23272a] hover:bg-[#10a37f] hover:text-white transition"
          >
            Log in
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 relative">
          <div className="w-full max-w-2xl flex flex-col h-full pb-32">
            {/* Welcome Card */}
            {showWelcome && (
              <div className="bg-[#23272a] rounded-2xl shadow-2xl p-8 border border-[#23272a] flex flex-col items-center mb-4 animate-fadeInUp mt-8">
                <h2 className="text-2xl font-extrabold text-white text-center mb-6">What can I help with?</h2>
                <div className="bg-[#181a1b] rounded-xl p-6 shadow-inner w-full">
                  <h3 className="text-lg font-semibold text-white mb-3 text-center">
                    Welcome to <span className="text-[#10a37f]">AthenaAI</span> <span className="align-middle">👋</span>
                  </h3>
                  <p className="text-gray-300 text-center mb-6">
                    I'm here to help you with anything you'd like to know. You can ask me about:
                  </p>
                  <div className="flex flex-col gap-3 mb-2 w-full">
                    <button
                      className="flex items-center gap-3 bg-[#23272a] text-gray-200 px-4 py-3 rounded-lg hover:bg-[#10a37f]/20 transition w-full font-medium text-base"
                      onClick={() => handleFeaturePrompt("General knowledge")}
                    >
                      <span role="img" aria-label="bulb" className="text-xl">💡</span> General knowledge
                    </button>
                    <button
                      className="flex items-center gap-3 bg-[#23272a] text-gray-200 px-4 py-3 rounded-lg hover:bg-[#10a37f]/20 transition w-full font-medium text-base"
                      onClick={() => handleFeaturePrompt("Technical questions")}
                    >
                      <span role="img" aria-label="tools" className="text-xl">🛠</span> Technical questions
                    </button>
                    <button
                      className="flex items-center gap-3 bg-[#23272a] text-gray-200 px-4 py-3 rounded-lg hover:bg-[#10a37f]/20 transition w-full font-medium text-base"
                      onClick={() => handleFeaturePrompt("Writing assistance")}
                    >
                      <span role="img" aria-label="writing" className="text-xl">📝</span> Writing assistance
                    </button>
                    <button
                      className="flex items-center gap-3 bg-[#23272a] text-gray-200 px-4 py-3 rounded-lg hover:bg-[#10a37f]/20 transition w-full font-medium text-base"
                      onClick={() => handleFeaturePrompt("Problem solving")}
                    >
                      <span role="img" aria-label="thinking" className="text-xl">🤔</span> Problem solving
                    </button>
                  </div>
                  <p className="text-gray-400 text-center text-sm mt-6">
                    Just type your question below and press Enter or click Send!
                  </p>
                </div>
              </div>
            )}

            {/* Chat history display */}
            <div
              ref={chatContainerRef}
              className="flex flex-col gap-4 px-2 py-4 overflow-y-auto"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                flex: 1,
                minHeight: 0,
                maxHeight: "calc(100vh - 220px)",
              }}
            >
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-xl px-4 py-3 max-w-[80%] whitespace-pre-wrap break-words shadow
                      ${msg.type === "user"
                        ? "bg-[#10a37f] text-white rounded-br-md"
                        : "bg-[#23272a] text-gray-100 rounded-bl-md border border-[#393e41]"}
                    `}
                  >
                    {msg.type === "ai" ? (
                      <ReactMarkdown className="prose prose-invert">{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {generatingAnswer && (
                <div className="flex justify-start">
                  <div className="rounded-xl px-4 py-3 max-w-[80%] bg-[#23272a] text-gray-100 border border-[#393e41] animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Prompt bar - OpenAI style */}
            <form
              onSubmit={generateAnswer}
              className="fixed bottom-0 left-0 w-full flex justify-center bg-gradient-to-t from-[#181a1b] via-[#181a1b]/90 to-transparent pt-6 pb-4 z-30"
            >
              <div className="w-full max-w-2xl flex items-end gap-2 bg-[#23272a] border border-[#393e41] rounded-xl px-4 py-3 shadow-lg">
                <textarea
                  aria-label="Type your message"
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none border-none text-base resize-none min-h-[40px] max-h-[120px] focus:ring-2 focus:ring-[#10a37f] transition"
                  placeholder="Ask anything..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onFocus={handlePromptFocus}
                  rows={1}
                  onInput={e => {
                    e.target.style.height = "40px";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      generateAnswer(e);
                    }
                  }}
                  disabled={generatingAnswer}
                  style={{ lineHeight: "1.5" }}
                />
                {/* Microphone button for voice search */}
                <button
                  type="button"
                  onClick={() => {
                    if (SpeechRecognition) setIsListening((v) => !v);
                    else alert("Voice search is not supported in this browser.");
                  }}
                  className={`p-2 rounded-full border-2 transition flex items-center justify-center
                    ${isListening ? "bg-[#10a37f] border-[#10a37f] text-white animate-pulse" : "bg-[#23272a] border-[#393e41] text-gray-400 hover:bg-[#10a37f]/20"}
                  `}
                  aria-label={isListening ? "Listening..." : "Start voice input"}
                  title={isListening ? "Listening..." : "Voice Search"}
                  style={{ width: 40, height: 40 }}
                >
                  {/* Standard mic icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v3m-6-6a6 6 0 0012 0V9a6 6 0 00-12 0v6z" />
                  </svg>
                  {isListening && (
                    <span className="sr-only">Listening...</span>
                  )}
                </button>
                {/* Document search button */}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  style={{ display: "none" }}
                  id="file-upload"
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="file-upload"
                  className="p-2 rounded-full border-2 transition flex items-center justify-center bg-[#23272a] border-[#393e41] text-gray-400 hover:bg-[#10a37f]/20 cursor-pointer"
                  style={{ width: 40, height: 40 }}
                  aria-label="Document Search"
                  title="Document Search"
                >
                  {/* Document icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7V3a1 1 0 011-1h6a1 1 0 011 1v4M7 7h10M7 7v10a1 1 0 001 1h8a1 1 0 001-1V7M7 7h10" />
                  </svg>
                </label>
                <button
                  type="submit"
                  className="bg-[#10a37f] hover:bg-[#10a37f]/80 text-white font-semibold px-5 py-2 rounded-lg transition disabled:opacity-50"
                  aria-label="Send message"
                  disabled={!question.trim() || generatingAnswer}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Auth Modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      {/* Settings Panel */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Settings Sidebar */}
          <div className="w-64 bg-[#23272a] border-r border-[#23272a] flex flex-col py-6 px-4">
            <button
              className="mb-6 text-left text-gray-400 hover:text-white"
              onClick={() => setSettingsOpen(false)}
            >
              &larr; Back
            </button>
            {[
              "General",
              "Notifications",
              "Personalization",
              "Data controls",
              "Security",
              "Account"
            ].map(tab => (
              <button
                key={tab}
                onClick={() => setSettingsTab(tab)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-left mb-1 ${
                  settingsTab === tab ? "bg-[#10a37f]/10 text-[#10a37f]" : "text-gray-300 hover:bg-[#10a37f]/20 transition"
                }`}
              >
                {getSettingsIcon(tab)}
                <span className="font-medium">{tab}</span>
              </button>
            ))}
          </div>
          {/* Settings Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            {/* Tab content based on settingsTab state */}
            {settingsTab === "General" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">General Settings</h2>
                <div className="bg-[#181a1b] p-6 rounded-lg shadow-md border border-[#393e41]">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Language</label>
                      <select className="w-full bg-[#23272a] text-white rounded-lg border border-[#393e41] px-4 py-2 focus:ring-2 focus:ring-[#10a37f] transition">
                        <option value="english">English</option>
                        <option value="spanish">Español</option>
                        <option value="french">Français</option>
                        <option value="german">Deutsch</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Theme</label>
                      <select className="w-full bg-[#23272a] text-white rounded-lg border border-[#393e41] px-4 py-2 focus:ring-2 focus:ring-[#10a37f] transition">
                        <option value="system">System default</option>
                        <option value="dark">Dark mode</option>
                        <option value="light">Light mode</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Text Size</label>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        defaultValue="16"
                        className="w-full accent-[#10a37f] bg-[#23272a] rounded-lg h-2.5 focus:ring-2 focus:ring-[#10a37f] transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {settingsTab === "Notifications" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Notification Settings</h2>
                <div className="bg-[#181a1b] p-6 rounded-lg shadow-md border border-[#393e41]">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Enable notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only" />
                        <div className="w-10 h-6 bg-[#393e41] rounded-full shadow-inner"></div>
                        <div className="dot absolute w-4 h-4 bg-[#10a37f] rounded-full shadow transition" style={{ top: "50%", left: "4px", transform: "translateY(-50%)" }}></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Notification sound</label>
                      <select className="w-full bg-[#23272a] text-white rounded-lg border border-[#393e41] px-4 py-2 focus:ring-2 focus:ring-[#10a37f] transition">
                        <option value="default">Default</option>
                        <option value="ding">Ding</option>
                        <option value="beep">Beep</option>
                        <option value="none">No sound</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {settingsTab === "Personalization" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Personalization Settings</h2>
                <div className="bg-[#181a1b] p-6 rounded-lg shadow-md border border-[#393e41]">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Nickname</label>
                      <input
                        type="text"
                        className="w-full bg-[#23272a] text-white rounded-lg border border-[#393e41] px-4 py-2 focus:ring-2 focus:ring-[#10a37f] transition"
                        placeholder="Enter your nickname"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Profile picture</label>
                      <div className="flex items-center gap-3">
                        <img
                          src="https://via.placeholder.com/40"
                          alt="Profile"
                          className="w-10 h-10 rounded-full border-2 border-[#10a37f] shadow-md"
                        />
                        <button className="bg-[#10a37f] text-white rounded-lg px-4 py-2 text-sm font-semibold transition hover:bg-[#10a37f]/80">
                          Change picture
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {settingsTab === "Data controls" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Data Controls</h2>
                <div className="bg-[#181a1b] p-6 rounded-lg shadow-md border border-[#393e41]">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Share usage data</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only" />
                        <div className="w-10 h-6 bg-[#393e41] rounded-full shadow-inner"></div>
                        <div className="dot absolute w-4 h-4 bg-[#10a37f] rounded-full shadow transition" style={{ top: "50%", left: "4px", transform: "translateY(-50%)" }}></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Allow data export</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only" />
                        <div className="w-10 h-6 bg-[#393e41] rounded-full shadow-inner"></div>
                        <div className="dot absolute w-4 h-4 bg-[#10a37f] rounded-full shadow transition" style={{ top: "50%", left: "4px", transform: "translateY(-50%)" }}></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {settingsTab === "Security" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Security Settings</h2>
                <div className="bg-[#181a1b] p-6 rounded-lg shadow-md border border-[#393e41]">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Enable two-factor authentication</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only" />
                        <div className="w-10 h-6 bg-[#393e41] rounded-full shadow-inner"></div>
                        <div className="dot absolute w-4 h-4 bg-[#10a37f] rounded-full shadow transition" style={{ top: "50%", left: "4px", transform: "translateY(-50%)" }}></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Backup codes</label>
                      <button className="bg-[#10a37f] text-white rounded-lg px-4 py-2 text-sm font-semibold transition hover:bg-[#10a37f]/80">
                        Generate backup codes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {settingsTab === "Account" && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Account Settings</h2>
                <div className="bg-[#181a1b] p-6 rounded-lg shadow-md border border-[#393e41]">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Email address</label>
                      <input
                        type="email"
                        className="w-full bg-[#23272a] text-white rounded-lg border border-[#393e41] px-4 py-2 focus:ring-2 focus:ring-[#10a37f] transition"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Password</label>
                      <input
                        type="password"
                        className="w-full bg-[#23272a] text-white rounded-lg border border-[#393e41] px-4 py-2 focus:ring-2 focus:ring-[#10a37f] transition"
                        placeholder="Enter a new password"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Confirm Password</label>
                      <input
                        type="password"
                        className="w-full bg-[#23272a] text-white rounded-lg border border-[#393e41] px-4 py-2 focus:ring-2 focus:ring-[#10a37f] transition"
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getSettingsIcon(tab) {
  switch (tab) {
    case "General":
      return <span className="material-icons">settings</span>;
    case "Notifications":
      return <span className="material-icons">notifications</span>;
    case "Personalization":
      return <span className="material-icons">palette</span>;
    case "Data controls":
      return <span className="material-icons">storage</span>;
    case "Security":
      return <span className="material-icons">security</span>;
    case "Account":
      return <span className="material-icons">person</span>;
    default:
      return null;
  }
}

// Set the PDF.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default App;