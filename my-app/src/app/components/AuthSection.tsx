// import { AuthMode } from "../types";

// type Props = {
//   authMode: AuthMode;
//   setAuthMode: (mode: AuthMode) => void;
//   email: string;
//   setEmail: (v: string) => void;
//   password: string;
//   setPassword: (v: string) => void;
//   authLoading: boolean;
//   authError: string | null;
//   onSubmit: (e: React.FormEvent) => void;
// };

// export function AuthSection({
//   authMode,
//   setAuthMode,
//   email,
//   setEmail,
//   password,
//   setPassword,
//   authLoading,
//   authError,
//   onSubmit,
// }: Props) {
//   return (
//     <section className="mb-8 rounded-xl bg-slate-900/80 border border-slate-700 p-5 shadow-lg">
//       <div className="flex gap-3 mb-5">
//         <button
//           type="button"
//           onClick={() => setAuthMode("login")}
//           className={`px-3 py-1.5 rounded-full text-xs font-medium ${
//             authMode === "login"
//               ? "bg-indigo-500 text-white shadow"
//               : "bg-slate-800 text-slate-300"
//           }`}
//         >
//           Login
//         </button>
//         <button
//           type="button"
//           onClick={() => setAuthMode("signup")}
//           className={`px-3 py-1.5 rounded-full text-xs font-medium ${
//             authMode === "signup"
//               ? "bg-indigo-500 text-white shadow"
//               : "bg-slate-800 text-slate-300"
//           }`}
//         >
//           Sign up
//         </button>
//       </div>

//       <form onSubmit={onSubmit} className="space-y-4">
//         <div>
//           <label className="block text-xs font-semibold mb-1 text-slate-200">
//             Email
//           </label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//           />
//         </div>
//         <div>
//           <label className="block text-xs font-semibold mb-1 text-slate-200">
//             Password
//           </label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//           />
//         </div>
//         {authError && (
//           <p className="text-xs text-red-400">{authError}</p>
//         )}
//         <button
//           type="submit"
//           disabled={authLoading}
//           className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-600 disabled:opacity-60"
//         >
//           {authLoading
//             ? "Please wait..."
//             : authMode === "login"
//             ? "Login"
//             : "Sign up"}
//         </button>
//       </form>
//     </section>
//   );
// }



// import { AuthMode } from "../types";
// import Gradient from "@/../public/images/gradient-bg.jpg"
// import image from "next/image"
// type Props = {
//   authMode: AuthMode;
//   setAuthMode: (mode: AuthMode) => void;
//   email: string;
//   setEmail: (v: string) => void;
//   password: string;
//   setPassword: (v: string) => void;
//   authLoading: boolean;
//   authError: string | null;
//   onSubmit: (e: React.FormEvent) => void;
// };

// export function AuthSection({
//   authMode,
//   setAuthMode,
//   email,
//   setEmail,
//   password,
//   setPassword,
//   authLoading,
//   authError,
//   onSubmit,
// }: Props) {
//   return (
//     <section className="mb-10 flex justify-center">
//       <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-slate-950/80 border border-slate-800">
//         <div className="flex flex-col md:flex-row">
//           {/* Left side – intro panel */}
//           <div className="md:w-5/12 bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500 p-8 flex flex-col justify-between">
//             <div>
//               <button
//                 type="button"
//                 className="text-xs text-indigo-100/80 mb-6 hover:text-white transition"
//               >
//                 &lt; Home
//               </button>

//               <h2 className="text-3xl font-bold text-white mb-2">
//                 Get started
//               </h2>
//               <p className="text-sm text-indigo-100/90">
//                 Already have an account?{" "}
//                 <button
//                   type="button"
//                   onClick={() => setAuthMode("login")}
//                   className="mt-1 inline-flex items-center gap-1 rounded-full border border-indigo-100/70 px-4 py-1 text-xs font-medium text-indigo-50 hover:bg-indigo-50/10"
//                 >
//                   Log in
//                 </button>
//               </p>
//             </div>

//             <p className="mt-8 text-[11px] text-indigo-100/80">
//               Secure JWT authentication, AI-powered Q&amp;A, and clean UI in a
//               single assessment project.
//             </p>
//           </div>

//           {/* Right side – form panel */}
//           <div className="md:w-7/12 bg-slate-950 px-8 py-7">
//             {/* Top row: toggle + small helper text */}
//             <div className="flex items-center justify-between mb-6">
//               <div className="inline-flex bg-slate-900 rounded-full p-1">
//                 <button
//                   type="button"
//                   onClick={() => setAuthMode("login")}
//                   className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
//                     authMode === "login"
//                       ? "bg-indigo-500 text-white shadow"
//                       : "text-slate-300"
//                   }`}
//                 >
//                   Login
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setAuthMode("signup")}
//                   className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
//                     authMode === "signup"
//                       ? "bg-indigo-500 text-white shadow"
//                       : "text-slate-300"
//                   }`}
//                 >
//                   Sign up
//                 </button>
//               </div>

//               <p className="text-[11px] text-slate-400 hidden sm:block">
//                 Need help?{" "}
//                 <span className="text-indigo-400 cursor-default">
//                   Contact support
//                 </span>
//               </p>
//             </div>

//             <h3 className="text-base font-semibold text-slate-50 mb-4">
//               {authMode === "signup" ? "Create an account" : "Welcome back"}
//             </h3>

//             <form onSubmit={onSubmit} className="space-y-4">
//               {/* Email */}
//               <div>
//                 <label className="block text-xs font-semibold mb-1 text-slate-300">
//                   Email
//                 </label>
//                 <div className="relative">
//                   <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500 text-sm">
//                     {/* simple mail icon */}
//                     ✉️
//                   </span>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="w-full rounded-md border border-slate-700 bg-slate-950 px-9 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                     placeholder="you@example.com"
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-xs font-semibold mb-1 text-slate-300">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500 text-sm">
//                     🔒
//                   </span>
//                   <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className="w-full rounded-md border border-slate-700 bg-slate-950 px-9 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                     placeholder="••••••••"
//                   />
//                 </div>
//               </div>

//               {/* Error */}
//               {authError && (
//                 <p className="text-xs text-red-400">{authError}</p>
//               )}

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={authLoading}
//                 className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-600 disabled:opacity-60"
//               >
//                 {authLoading
//                   ? "Please wait..."
//                   : authMode === "login"
//                   ? "Login"
//                   : "Sign up"}
//               </button>

//               <p className="mt-2 text-[10px] text-slate-500">
//                 By continuing you agree to the{" "}
//                 <span className="text-indigo-400">terms of use</span> and{" "}
//                 <span className="text-indigo-400">privacy policy</span>.
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


import { AuthMode } from "../types";
import Gradient from "@/../public/images/gradient-bg.jpg";
import Image from "next/image";

type Props = {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  authLoading: boolean;
  authError: string | null;
  onSubmit: (e: React.FormEvent) => void;
};

export function AuthSection({
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  authLoading,
  authError,
  onSubmit,
}: Props) {
  return (
    <section className="mb-10 flex justify-center">
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-slate-950/80 border border-slate-800">
        <div className="flex flex-col md:flex-row">
          {/* Left side – intro panel with background image */}
          <div className="relative md:w-5/12 min-h-[260px]">
            {/* Background image */}
            <Image
              src={Gradient}
              alt="Gradient background"
              fill
              priority
              className="object-cover"
            />
            {/* Soft overlay to match brand colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/70 via-indigo-500/60 to-blue-500/70" />

            <div className="relative z-10 h-full p-8 flex flex-col justify-between">
              <div>
                {/* <button
                  type="button"
                  className="text-xs text-indigo-100/80 mb-6 hover:text-white transition"
                >
                  &lt; Home
                </button> */}

                <h2 className="text-4xl font-bold text-white mb-3">
                  Get started
                </h2>
                <p className="text-sm text-indigo-100/90">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthMode("login")}
                    className="mt-2 inline-flex items-center gap-1 rounded-full border border-indigo-100/70 px-4 py-1 text-xs font-medium text-indigo-50 hover:bg-indigo-50/10"
                  >
                    Log in
                  </button>
                </p>
              </div>

             
            </div>
          </div>

          {/* Right side – form panel */}
          <div className="md:w-7/12 bg-slate-950 px-8 py-8">
            {/* Top row: toggle + small helper text */}
            <div className="flex items-center justify-between mb-7">
              <div className="inline-flex bg-slate-900 rounded-full p-1">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    authMode === "login"
                      ? "bg-indigo-500 text-white shadow"
                      : "text-slate-300"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    authMode === "signup"
                      ? "bg-indigo-500 text-white shadow"
                      : "text-slate-300"
                  }`}
                >
                  Sign up
                </button>
              </div>

              <p className="text-[11px] text-slate-400 hidden sm:block">
                Need help?{" "}
                <span className="text-indigo-400 cursor-default">
                  Contact support
                </span>
              </p>
            </div>

            <h3 className="text-xl font-semibold text-slate-50 mb-5">
              {authMode === "signup" ? "Create an account" : "Welcome back"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500 text-sm">
                    ✉️
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-9 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500 text-sm">
                    🔒
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-9 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Error */}
              {authError && (
                <p className="text-xs text-red-400">{authError}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={authLoading}
                className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-600 disabled:opacity-60"
              >
                {authLoading
                  ? "Please wait..."
                  : authMode === "login"
                  ? "Login"
                  : "Sign up"}
              </button>

              <p className="mt-3 text-[10px] text-slate-500 leading-relaxed">
                By continuing you agree to the{" "}
                <span className="text-indigo-400">terms of use</span> and{" "}
                <span className="text-indigo-400">privacy policy</span>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
