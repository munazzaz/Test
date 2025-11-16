import { Document } from "../types";

type Props = {
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  contentLimit: number;
  uploadLoading: boolean;
  uploadError: string | null;
  currentDoc: Document | null;
  file: File | null;
  setFile: (f: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function UploadSection({
  title,
  setTitle,
  content,
  setContent,
  contentLimit,
  uploadLoading,
  uploadError,
  currentDoc,
  file,
  setFile,
  onSubmit,
}: Props) {
  return (
    <section className="mb-6 rounded-xl bg-slate-900/80 border border-slate-700 p-5 shadow-lg">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-sm font-semibold text-slate-50 flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold">
            1
          </span>
          Upload / enter a document
        </h2>
        {currentDoc && (
          <span className="hidden sm:inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-300 border border-slate-600">
            Using:&nbsp;
            <span className="font-semibold text-slate-50 truncate max-w-[160px]">
              {currentDoc.title}
            </span>
          </span>
        )}
      </div>

      <p className="text-[11px] text-slate-400 mb-4">
        Option A: paste text directly. Option B: upload a plain text document
        (.txt). The content will be stored and used by the AI in step 2.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1 text-slate-200">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g. FastAPI notes"
          />
        </div>

        {/* Option A: paste text */}
        <div>
          <label className="block text-xs font-semibold mb-1 text-slate-200">
            Text content{" "}
            <span className="font-normal text-[11px] text-slate-400">
              (max {contentLimit} characters)
            </span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Paste or type your text here..."
          />
          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span className="text-slate-400">
              {content.length}/{contentLimit}
            </span>
          </div>
        </div>

        {/* Option B: upload a file */}
        <div className="border-t border-slate-700 pt-3 mt-2">
          <label className="block text-xs font-semibold mb-1 text-slate-200">
            Or upload a document (.txt)
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              type="file"
              accept=".txt"
              onChange={(e) =>
                setFile(e.target.files && e.target.files[0]
                  ? e.target.files[0]
                  : null)
              }
              className="text-[11px] text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-50 hover:file:bg-slate-700"
            />
            {file && (
              <span className="text-[11px] text-slate-400 truncate max-w-[220px]">
                Selected: <span className="font-medium">{file.name}</span>
              </span>
            )}
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            If you choose a file, its text will be read on the server and saved
            as the document content (up to {contentLimit} characters).
          </p>
        </div>

        {uploadError && (
          <p className="text-xs text-red-400">{uploadError}</p>
        )}

        <button
          type="submit"
          disabled={uploadLoading}
          className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-600 disabled:opacity-60"
        >
          {uploadLoading && (
            <span className="mr-2 h-3 w-3 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
          )}
          {uploadLoading ? "Uploading..." : "Save document"}
        </button>
      </form>

      {currentDoc && (
        <p className="mt-4 text-[11px] text-slate-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1" />
          Document saved as{" "}
          <span className="font-semibold text-slate-100">
            {currentDoc.title}
          </span>{" "}
          (ID: {currentDoc.id}). You can now ask questions in step 2.
        </p>
      )}
    </section>
  );
}
