import React from 'react';

const techNewsData = [
  {
    id: 1,
    title: "India Semiconductor Mission Reaches Fabrication Milestone",
    category: "Semiconductors",
    date: "Oct 2026",
    summary: "Domestic commercial wafer output accelerates, reducing reliance on global chip supply chains for critical civic infrastructure and defense systems.",
    readTime: "4 min read"
  },
  {
    id: 2,
    title: "AI-Powered Grievance Redressal (CPGRAMS 3.0) Deployed Nationwide",
    category: "GovTech / AI",
    date: "Oct 2026",
    summary: "Large language models adapted for 22 regional Indian languages enable rapid citizen petition summarization and municipal issue dispatching.",
    readTime: "3 min read"
  },
  {
    id: 3,
    title: "Quantum Communications Ring Activated Between Strategic Public Data Centers",
    category: "Cybersecurity",
    date: "Sep 2026",
    summary: "QKD network establishes tamper-proof data corridors between civic governance data centers and telecom utilities.",
    readTime: "5 min read"
  }
];

export default function TechNewsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Latest Technology News</h2>
        <p className="text-sm text-slate-500">Breakthroughs in GovTech, Open Infrastructure, and Emerging Technologies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {techNewsData.map((news) => (
          <article key={news.id} className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded">{news.category}</span>
                <span>{news.date}</span>
              </div>
              <h3 className="font-semibold text-slate-900 text-base leading-snug mb-2">{news.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{news.summary}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-400">{news.readTime}</span>
              <button className="text-[#0a66c2] font-semibold hover:underline">Read Article →</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}