import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <header className="px-8 py-6 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-[#0a66c2] tracking-tight">
          Civic<span className="text-slate-900 font-extrabold">Project</span>
        </h1>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Sign in</h2>
          <p className="text-sm text-slate-500 mb-6">Stay updated on your civic & professional network</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email or Phone</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0a66c2] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0a66c2] focus:outline-none"
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center text-slate-600">
                <input type="checkbox" className="rounded text-[#0a66c2] mr-2" /> Remember me
              </label>
              <a href="#forgot" className="text-[#0a66c2] font-semibold hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold py-2.5 rounded-full transition duration-150"
            >
              Sign in
            </button>
          </form>

          <div className="relative my-6 text-center">
            <hr className="border-slate-200" />
            <span className="absolute left-1/2 -top-3 -translate-x-1/2 bg-white px-3 text-xs text-slate-400">or</span>
          </div>

          <button className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 rounded-full flex items-center justify-center gap-2 text-sm mb-3">
            <span>Continue with Google</span>
          </button>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500">
        CivicProject © 2026 • User Agreement • Privacy Policy
      </footer>
    </div>
  );
}