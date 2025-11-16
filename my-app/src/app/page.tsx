// "use client";

// import { useEffect, useState } from "react";

// const API_BASE_URL = "http://localhost:8000";

// type AuthMode = "login" | "signup";

// type Document = {
//   id: number;
//   title: string;
//   content: string;
// };

// type Message = {
//   id: number;
//   role: "user" | "assistant";
//   content: string;
// };

// export default function HomePage() {
//   const [authMode, setAuthMode] = useState<AuthMode>("login");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [token, setToken] = useState<string | null>(null);
//   const [authLoading, setAuthLoading] = useState(false);
//   const [authError, setAuthError] = useState<string | null>(null);

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [uploadError, setUploadError] = useState<string | null>(null);
//   const [currentDoc, setCurrentDoc] = useState<Document | null>(null);

//   const [question, setQuestion] = useState("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [chatLoading, setChatLoading] = useState(false);
//   const [chatError, setChatError] = useState<string | null>(null);

//   // ---- Load token from localStorage on first render ----
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const stored = window.localStorage.getItem("token");
//     if (stored) {
//       setToken(stored);
//     }
//   }, []);

//   // ---- Auth handlers ----
//   const handleAuthSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setAuthError(null);
//     setAuthLoading(true);

//     try {
//       const endpoint =
//         authMode === "signup" ? "/auth/signup" : "/auth/login";

//       const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data.detail || "Authentication failed");
//       }

//       if (authMode === "signup") {
//         // signup returns user; after signup we can automatically switch to login
//         setAuthMode("login");
//       } else {
//         // login returns token
//         const data = await res.json();
//         const accessToken: string = data.access_token;
//         setToken(accessToken);
//         if (typeof window !== "undefined") {
//           window.localStorage.setItem("token", accessToken);
//         }
//       }
//     } catch (err: any) {
//       setAuthError(err.message || "Something went wrong");
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     setToken(null);
//     setCurrentDoc(null);
//     setMessages([]);
//     if (typeof window !== "undefined") {
//       window.localStorage.removeItem("token");
//     }
//   };

//   // ---- Upload handlers ----
//   const contentLimit = 5000;

//   const handleUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!token) {
//       setUploadError("You must be logged in to upload.");
//       return;
//     }
//     if (!title.trim() || !content.trim()) {
//       setUploadError("Title and content are required.");
//       return;
//     }
//     if (content.length > contentLimit) {
//       setUploadError(`Content must be at most ${contentLimit} characters.`);
//       return;
//     }

//     setUploadError(null);
//     setUploadLoading(true);

//     try {
//       const res = await fetch(`${API_BASE_URL}/upload/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ title, content }),
//       });

//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data.detail || "Upload failed");
//       }

//       const doc: Document = await res.json();
//       setCurrentDoc(doc);
//       // Reset content but keep title (optional)
//       setContent("");
//       // Clear chat when new doc selected
//       setMessages([]);
//     } catch (err: any) {
//       setUploadError(err.message || "Something went wrong");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   // ---- Chat / query handlers ----
//   const handleAsk = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!token) {
//       setChatError("You must be logged in.");
//       return;
//     }
//     if (!currentDoc) {
//       setChatError("Please upload a document first.");
//       return;
//     }
//     if (!question.trim()) {
//       setChatError("Please enter a question.");
//       return;
//     }

//     setChatError(null);

//     const userMessage: Message = {
//       id: Date.now(),
//       role: "user",
//       content: question,
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setChatLoading(true);

//     try {
//       const res = await fetch(`${API_BASE_URL}/query/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           query: question,
//           document_id: currentDoc.id,
//         }),
//       });

//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data.detail || "Query failed");
//       }

//       const data = await res.json();
//       const assistantMessage: Message = {
//         id: Date.now() + 1,
//         role: "assistant",
//         content: data.answer,
//       };

//       setMessages((prev) => [...prev, assistantMessage]);
//       setQuestion("");
//     } catch (err: any) {
//       setChatError(err.message || "Something went wrong");
//     } finally {
//       setChatLoading(false);
//     }
//   };

//   // ---- UI ----
//   return (
//     <main className="min-h-screen bg-slate-100 text-slate-900">
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <header className="flex items-center justify-between mb-8">
//           <h1 className="text-2xl font-bold">
//             Nexal Assessment – AI Document Q&A
//           </h1>
//           {token ? (
//             <button
//               onClick={handleLogout}
//               className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
//             >
//               Logout
//             </button>
//           ) : null}
//         </header>

//         {/* Auth section */}
//         {!token && (
//           <section className="mb-8 bg-white rounded shadow p-4">
//             <div className="flex gap-4 mb-4">
//               <button
//                 onClick={() => setAuthMode("login")}
//                 className={`px-3 py-1 rounded text-sm ${
//                   authMode === "login"
//                     ? "bg-slate-900 text-white"
//                     : "bg-slate-100"
//                 }`}
//               >
//                 Login
//               </button>
//               <button
//                 onClick={() => setAuthMode("signup")}
//                 className={`px-3 py-1 rounded text-sm ${
//                   authMode === "signup"
//                     ? "bg-slate-900 text-white"
//                     : "bg-slate-100"
//                 }`}
//               >
//                 Sign up
//               </button>
//             </div>

//             <form onSubmit={handleAuthSubmit} className="space-y-3">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full border rounded px-3 py-2 text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full border rounded px-3 py-2 text-sm"
//                 />
//               </div>
//               {authError && (
//                 <p className="text-sm text-red-600">{authError}</p>
//               )}
//               <button
//                 type="submit"
//                 disabled={authLoading}
//                 className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
//               >
//                 {authLoading
//                   ? "Please wait..."
//                   : authMode === "login"
//                   ? "Login"
//                   : "Sign up"}
//               </button>
//             </form>
//           </section>
//         )}

//         {/* Main app when logged in */}
//         {token && (
//           <>
//             {/* Upload panel */}
//             <section className="mb-6 bg-white rounded shadow p-4">
//               <h2 className="text-lg font-semibold mb-3">
//                 1. Upload / enter a document
//               </h2>
//               <form onSubmit={handleUpload} className="space-y-3">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Title
//                   </label>
//                   <input
//                     type="text"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     className="w-full border rounded px-3 py-2 text-sm"
//                     placeholder="e.g. FastAPI notes"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Content (max {contentLimit} characters)
//                   </label>
//                   <textarea
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     rows={5}
//                     className="w-full border rounded px-3 py-2 text-sm"
//                     placeholder="Paste or type your text here..."
//                   />
//                   <div className="text-xs text-slate-500 mt-1">
//                     {content.length}/{contentLimit}
//                   </div>
//                 </div>
//                 {uploadError && (
//                   <p className="text-sm text-red-600">{uploadError}</p>
//                 )}
//                 <button
//                   type="submit"
//                   disabled={uploadLoading}
//                   className="px-4 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-60"
//                 >
//                   {uploadLoading ? "Uploading..." : "Save document"}
//                 </button>
//               </form>
//               {currentDoc && (
//                 <p className="mt-3 text-xs text-slate-600">
//                   Current document: <strong>{currentDoc.title}</strong> (ID:{" "}
//                   {currentDoc.id})
//                 </p>
//               )}
//             </section>

//             {/* Chat panel */}
//             <section className="bg-white rounded shadow p-4">
//               <h2 className="text-lg font-semibold mb-3">
//                 2. Ask questions about your document
//               </h2>
//               {!currentDoc && (
//                 <p className="text-sm text-slate-600 mb-3">
//                   Upload a document first to start chatting.
//                 </p>
//               )}

//               {/* Chat history */}
//               <div className="border rounded p-3 mb-3 h-64 overflow-y-auto bg-slate-50 text-sm">
//                 {messages.length === 0 && (
//                   <p className="text-slate-500">
//                     No messages yet. Ask your first question once a document is
//                     uploaded.
//                   </p>
//                 )}
//                 {messages.map((m) => (
//                   <div
//                     key={m.id}
//                     className={`mb-2 flex ${
//                       m.role === "user" ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className={`max-w-[80%] px-3 py-2 rounded ${
//                         m.role === "user"
//                           ? "bg-blue-600 text-white"
//                           : "bg-slate-200 text-slate-900"
//                       }`}
//                     >
//                       <span className="block text-xs font-semibold mb-1">
//                         {m.role === "user" ? "You" : "AI"}
//                       </span>
//                       <span>{m.content}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Question input */}
//               <form onSubmit={handleAsk} className="flex flex-col gap-2">
//                 <textarea
//                   value={question}
//                   onChange={(e) => setQuestion(e.target.value)}
//                   rows={2}
//                   className="w-full border rounded px-3 py-2 text-sm"
//                   placeholder={
//                     currentDoc
//                       ? `Ask something about "${currentDoc.title}"...`
//                       : "Upload a document first."
//                   }
//                   disabled={!currentDoc || chatLoading}
//                 />
//                 {chatError && (
//                   <p className="text-sm text-red-600">{chatError}</p>
//                 )}
//                 <button
//                   type="submit"
//                   disabled={!currentDoc || chatLoading}
//                   className="self-end px-4 py-2 rounded bg-slate-900 text-white text-sm hover:bg-slate-800 disabled:opacity-60"
//                 >
//                   {chatLoading ? "Thinking..." : "Ask"}
//                 </button>
//               </form>
//             </section>
//           </>
//         )}
//       </div>
//     </main>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL, CONTENT_LIMIT } from "./config";
import { AuthMode, Document, Message } from "./types";
import { AuthSection } from "./components/AuthSection";
import { UploadSection } from "./components/UploadSection";
import { ChatSection } from "./components/ChatSection";

export default function HomePage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
const [file, setFile] = useState<File | null>(null);


  // Load token from localStorage on first render
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("token");
    if (stored) {
      setToken(stored);
    }
  }, []);

  // ----- Auth -----
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const endpoint =
        authMode === "signup" ? "/auth/signup" : "/auth/login";

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Authentication failed");
      }

      if (authMode === "signup") {
        setAuthMode("login");
      } else {
        const data = await res.json();
        const accessToken: string = data.access_token;
        setToken(accessToken);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("token", accessToken);
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "Something went wrong");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentDoc(null);
    setMessages([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
    }
  };

  // // ----- Upload -----
  // const handleUpload = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!token) {
  //     setUploadError("You must be logged in to upload.");
  //     return;
  //   }
  //   if (!title.trim() || !content.trim()) {
  //     setUploadError("Title and content are required.");
  //     return;
  //   }
  //   if (content.length > CONTENT_LIMIT) {
  //     setUploadError(
  //       `Content must be at most ${CONTENT_LIMIT} characters.`
  //     );
  //     return;
  //   }

  //   setUploadError(null);
  //   setUploadLoading(true);

  //   try {
  //     const res = await fetch(`${API_BASE_URL}/upload/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ title, content }),
  //     });

  //     if (!res.ok) {
  //       const data = await res.json().catch(() => ({}));
  //       throw new Error(data.detail || "Upload failed");
  //     }

  //     const doc: Document = await res.json();
  //     setCurrentDoc(doc);
  //     setContent("");
  //     setMessages([]);
  //   } catch (err: any) {
  //     setUploadError(err.message || "Something went wrong");
  //   } finally {
  //     setUploadLoading(false);
  //   }
  // };


  const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!token) {
    setUploadError("You must be logged in to upload.");
    return;
  }

  const usingFile = !!file;

  // Require either content OR file
  if (!usingFile && !content.trim()) {
    setUploadError("Please either paste some text or choose a file to upload.");
    return;
  }

  // Title is optional; we can fallback to file name or generic
  const finalTitle =
    title.trim() || (file ? file.name : "Untitled document");

  // Length check only for manual text (file is truncated server-side)
  if (!usingFile && content.length > CONTENT_LIMIT) {
    setUploadError(`Content must be at most ${CONTENT_LIMIT} characters.`);
    return;
  }

  setUploadError(null);
  setUploadLoading(true);

  try {
    let res: Response;

    if (usingFile) {
      const formData = new FormData();
      formData.append("file", file as File);
      formData.append("title", finalTitle);

      res = await fetch(`${API_BASE_URL}/upload/file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // no Content-Type; browser sets boundary
      });
    } else {
      res = await fetch(`${API_BASE_URL}/upload/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: finalTitle, content }),
      });
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || "Upload failed");
    }

    const doc: Document = await res.json();
    setCurrentDoc(doc);
    setContent("");
    setFile(null);
    setMessages([]);
    setTitle(doc.title); // keep title in UI in sync
  } catch (err: any) {
    setUploadError(err.message || "Something went wrong");
  } finally {
    setUploadLoading(false);
  }
};


  // ----- Chat / query -----
  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setChatError("You must be logged in.");
      return;
    }
    if (!currentDoc) {
      setChatError("Please upload a document first.");
      return;
    }
    if (!question.trim()) {
      setChatError("Please enter a question.");
      return;
    }

    setChatError(null);

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMessage]);
    setChatLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/query/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: question,
          document_id: currentDoc.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Query failed");
      }

      const data = await res.json();
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setQuestion("");
    } catch (err: any) {
      setChatError(err.message || "Something went wrong");
    } finally {
      setChatLoading(false);
    }
  };

  // ----- UI -----
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-400 mb-1">
              Nexal Assessment
            </p>
            <h1 className="text-2xl font-bold">
              AI-powered Document Q&amp;A
            </h1>
          </div>
          {token && (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs rounded-full bg-slate-800 border border-slate-600 text-slate-100 hover:bg-slate-700"
            >
              Logout
            </button>
          )}
        </header>

        {!token && (
          <AuthSection
            authMode={authMode}
            setAuthMode={setAuthMode}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            authLoading={authLoading}
            authError={authError}
            onSubmit={handleAuthSubmit}
          />
        )}

        {token && (
          <>
            {/* <UploadSection
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
              contentLimit={CONTENT_LIMIT}
              uploadLoading={uploadLoading}
              uploadError={uploadError}
              currentDoc={currentDoc}
              onSubmit={handleUpload}
            /> */}
<UploadSection
  title={title}
  setTitle={setTitle}
  content={content}
  setContent={setContent}
  contentLimit={CONTENT_LIMIT}
  uploadLoading={uploadLoading}
  uploadError={uploadError}
  currentDoc={currentDoc}
  file={file}
  setFile={setFile}
  onSubmit={handleUpload}
/>
          

            <ChatSection
              currentDoc={currentDoc}
              messages={messages}
              question={question}
              setQuestion={setQuestion}
              chatLoading={chatLoading}
              chatError={chatError}
              onSubmit={handleAsk}
            />
          </>
        )}
      </div>
    </main>
  );
}
