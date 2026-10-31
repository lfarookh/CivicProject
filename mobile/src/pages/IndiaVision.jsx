import React, { useState } from 'react';

const visionData = {
  2030: {
    headline: "India 2030: The Digital & Sustainable Growth Engine",
    pillars: [
      {
        title: "Clean Energy Leadership",
        detail: "Achievement of 500 GW renewable energy capacity and 50% energy generation via non-fossil sources."
      },
      {
        title: "Digital Public Infrastructure Expansion",
        detail: "Universal digital literacy, DPI-enabled decentralized logistics (ONDC), and healthcare data parity across all tier-3 towns."
      },
      {
        title: "$7 Trillion Economy Benchmark",
        detail: "Consolidation as the world's 3rd largest economy fueled by advanced manufacturing and service exports."
      }
    ]
  },
  2040: {
    headline: "India 2040: Industrial High-Tech & Urban Transformation",
    pillars: [
      {
        title: "Smart Cities & Bullet Rail Corridors",
        detail: "Over 15 high-speed rail corridors connecting all regional economic clusters with zero-emission public transit."
      },
      {
        title: "Next-Gen Quantum & Semiconductor Hub",
        detail: "Complete domestic self-reliance in aerospace chips, photonics, and quantum key distribution infrastructure."
      },
      {
        title: "Circular Water & Waste Autonomy",
        detail: "100% recycling of urban wastewater and nationwide watershed rejuvenation systems in place."
      }
    ]
  },
  2050: {
    headline: "India 2050: Viksit Bharat — Global Knowledge & Net-Zero Powerhouse",
    pillars: [
      {
        title: "Net-Zero Trajectory & Fusion Energy",
        detail: "Accelerated phaseout of legacy fossil systems; deployment of modular nuclear and green hydrogen grids."
      },
      {
        title: "Global Education & Innovation Nexus",
        detail: "Hosting premier global research centers in deep tech, space exploration, and life sciences."
      },
      {
        title: "Equitable & Decentralized Governance",
        detail: "Real-time transparent public resource allocation using open-source civic computing protocols."
      }
    ]
  }
};

export default function IndiaVisionPage() {
  const [selectedHorizon, setSelectedHorizon] = useState(2030);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">INDIA Vision Roadmap</h1>
        <p className="text-sm text-slate-500 mt-2">
          Strategic national milestones guiding civic infrastructure, technology, and economic transformation towards Viksit Bharat.
        </p>

        {/* Milestone Buttons */}
        <div className="inline-flex bg-slate-100 p-1.5 rounded-full mt-6 gap-2">
          {[2030, 2040, 2050].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedHorizon(year)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-150 ${
                selectedHorizon === year
                  ? "bg-[#0a66c2] text-white shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Vision {year}
            </button>
          ))}
        </div>
      </div>

      {/* Target Details Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">Strategic Horizon</span>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">{visionData[selectedHorizon].headline}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visionData[selectedHorizon].pillars.map((pillar, index) => (
            <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-5">
              <div className="text-xs font-bold text-[#0a66c2] mb-1">Pillar 0{index + 1}</div>
              <h3 className="font-semibold text-slate-900 text-base mb-2">{pillar.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{pillar.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}