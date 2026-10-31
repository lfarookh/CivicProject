import React, { useState } from 'react';

const mockData = [
  { id: 1, type: "People", title: "Priya Nair", subtitle: "Public Policy Consultant", tags: ["Governance", "Civic Tech"] },
  { id: 2, type: "People", title: "Amit Sengupta", subtitle: "IAS Officer & Urban Planner", tags: ["Infrastructure"] },
  { id: 3, type: "Organisation", title: "National Digital Health Mission", subtitle: "Govt / Public Sector Org", tags: ["Health", "Open Data"] },
  { id: 4, type: "Organisation", title: "Civic Action Network India", subtitle: "Non-Profit Organization", tags: ["Community"] },
  { id: 5, type: "Topic", title: "Digital Rupee & CBDC Adoption", subtitle: "Financial Tech Policy Discussion", tags: ["Finance", "RBI"] },
  { id: 6, type: "Topic", title: "Green Hydrogen Hubs 2030", subtitle: "Renewable Energy Transition", tags: ["Climate", "Energy"] },
  { id: 7, type: "Video", title: "Panel: AI in Local Governance", subtitle: "Watch 42 min round-table recording", tags: ["AI", "Webinar"] },
  { id: 8, type: "Video", title: "Smart Traffic Systems Demo - Pune", subtitle: "Field demonstration video", tags: ["Traffic", "IoT"] }
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "People", "Organisation", "Topic", "Video"];

  const filteredItems = mockData.filter((item) => {
    const matchesTab = activeTab === "All" || item.type === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Explore & Search</h2>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by name, organization, policy topic, or recorded sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-slate-300 rounded-lg py-3 px-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <span className="absolute left-3 top-3.5 text-slate-400">🔍</span>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-[#0a66c2] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center hover:shadow-sm">
              <div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded mb-1">
                  {item.type}
                </span>
                <h3 className="font-semibold text-slate-900 text-base">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.subtitle}</p>
                <div className="flex gap-2 mt-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <button className="border border-[#0a66c2] text-[#0a66c2] text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-blue-50">
                View
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 py-8 text-sm">No results found for "{searchTerm}".</p>
        )}
      </div>
    </div>
  );
}