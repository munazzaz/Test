import { Document, Message } from "../types";

type Props = {
  currentDoc: Document | null;
  messages: Message[];
  question: string;
  setQuestion: (v: string) => void;
  chatLoading: boolean;
  chatError: string | null;
  onSubmit: (e: React.FormEvent) => void;
};

export function ChatSection({
  currentDoc,
  messages,
  question,
  setQuestion,
  chatLoading,
  chatError,
  onSubmit,
}: Props) {
  return (
    <section className="rounded-xl bg-slate-900/80 border border-slate-700 p-5 shadow-lg mt-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-sm font-semibold text-slate-50 flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold">
            2
          </span>
          Ask questions about your document
        </h2>

        {currentDoc && (
          <span className="hidden sm:inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-300 border border-slate-600">
            Document:&nbsp;
            <span className="font-semibold text-slate-50 truncate max-w-[160px]">
              {currentDoc.title}
            </span>
          </span>
        )}
      </div>

      {!currentDoc && (
        <p className="text-xs text-slate-400 mb-3">
          Step 1: upload a document above. Once it’s saved, you can ask the AI
          questions here and see the conversation history.
        </p>
      )}

      {/* Chat history */}
      <div className="border border-slate-700 rounded-lg p-3 mb-3 h-64 overflow-y-auto bg-slate-950/70 text-sm">
        {messages.length === 0 && !chatLoading && (
          <p className="text-slate-500 text-xs">
            No messages yet. After you upload a document, ask your first
            question and the AI will respond here.
          </p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-2 flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg ${
                m.role === "user"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-800 text-slate-50"
              }`}
            >
              <span className="block text-[10px] font-semibold mb-1 opacity-80">
                {m.role === "user" ? "You" : "AI"}
              </span>
              <span className="text-xs leading-relaxed">{m.content}</span>
            </div>
          </div>
        ))}

        {/* Typing / thinking indicator */}
        {chatLoading && (
          <div className="mt-2 flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/90 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="h-2 w-2 rounded-full bg-indigo-400/70 animate-pulse [animation-delay:120ms]" />
              <span className="h-2 w-2 rounded-full bg-indigo-400/50 animate-pulse [animation-delay:240ms]" />
              <span className="text-[11px] text-slate-200">
                AI is thinking...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Question input */}
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <label className="text-[11px] text-slate-400">
          Type a question about the uploaded document and press{" "}
          <span className="font-semibold text-slate-200">Ask</span>.
        </label>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
          placeholder={
            currentDoc
              ? `e.g. "Summarize ${currentDoc.title}" or "What are the key points?"`
              : "Upload a document first."
          }
          disabled={!currentDoc || chatLoading}
        />

        {chatError && (
          <p className="text-xs text-red-400">{chatError}</p>
        )}

        <button
          type="submit"
          disabled={!currentDoc || chatLoading}
          className="self-end inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-600 disabled:opacity-60"
        >
          {chatLoading && (
            <span className="mr-2 h-3 w-3 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
          )}
          {chatLoading ? "Thinking..." : "Ask"}
        </button>
      </form>
    </section>
  );
}
