import { Building2, Award, History, Compass, Target, Shield, Users, Trophy } from "lucide-react";
import { initialFacilities } from "../data";

export function AboutUs() {
  const milestones = [
    { year: "2012", title: "Project Architectural Vision", desc: "GK Developers designs the blueprint for GK Mirai, emphasizing high efficiency glass panels, structural cross-ventilations and high eco-focus." },
    { year: "2015", title: "Inaugural Resident Gifting", desc: "First 150 apartments handed over at Block A and B. Mirai Clubhouse starts with baseline pool operations." },
    { year: "2018", title: "Pioneering Smart Solar Transition", desc: "Installed 350kW rooftop grid to power 100% of the common corridors and dynamic peripheral lighting." },
    { year: "2021", title: "MyGate Integrated Safety Shield", desc: "Partnered to create automated RFID gate entries and dynamic QR authorization passes for housekeepers." },
    { year: "2024", title: "Model Green Habitat Award", desc: "Officially named Bengaluru's 'Top Sustainable Residential Society' by the Urban Development Council." },
  ];

  const awards = [
    { title: "National Green Star Trophy", body: "Awarded to GK Mirai for achieving 92% garbage segregation at source and zero spill municipal trash output.", year: "2023, 2024" },
    { title: "Smart Gating Security Excellence", body: "Best smart app integration platform with near zero unauthorized break-ins.", year: "2022" },
    { title: "Aesthetic Urban Landscape Award", body: "Presented by Bengaluru Horticultural Society for maximum local canopy retention and micro forest.", year: "2025" }
  ];

  return (
    <div className="space-y-16 pb-16 animate-fade-in" id="about-us-view">
      {/* Overview Block */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 font-mono">Society Legacy</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
            Society Overview & Culture
          </h1>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            Mirai is an ideal place to live in Pune. The neighbourhood provides easy access to essential amenities such as schools, hospitals, shopping centres and other entertainment options while being well connected to the rest of the city and providing access to several public transport systems and other social infrastructure.
          </p>
          <div className="rounded-2xl border border-slate-100 bg-teal-50/50 p-6 space-y-4">
            <h3 className="font-sans font-bold text-slate-800 text-sm tracking-wider uppercase font-mono text-teal-700">Resident Demographics</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="text-slate-500 font-medium font-sans">Total Units</p>
                <p className="text-slate-800 font-bold text-base">450 Smart Condos</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-medium font-sans">Green Canopy cover</p>
                <p className="text-slate-800 font-bold text-base">65% Botanical Area</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Families Registered</p>
                <p className="text-slate-800 font-bold text-base">380+ Connected</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-medium">Volunteer Clubs</p>
                <p className="text-slate-800 font-bold text-base">8 Active Circles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Core Block */}
      <section className="grid md:grid-cols-2 gap-8" id="vision-and-mission-block">
        <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow space-y-4">
          <div className="inline-flex rounded-xl bg-slate-50 p-3 text-teal-600">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Our Sacred Vision</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            To create a smart, harmonious, and highly sustainable micro-neighborhood where residents can flourish, experience absolute security, and communicate transparently using state-of-the-art technological tools. GK Mirai aims to be the blueprint for urban environmental preservation globally.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow space-y-4">
          <div className="inline-flex rounded-xl bg-slate-50 p-3 text-teal-600">
            <Compass className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Our Mission Focus</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            To implement and maintain sustainable zero-solid-waste structures, generate over 60% of common power via micro solar panel arrays, automate security pass entries with full personal data protection, and empower the managing committee through dynamic digital complaints resolution.
          </p>
        </div>
      </section>

      {/* History Milestones Timeline */}
      <section className="space-y-8" id="society-history-timeline">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 font-mono">Our Timeline</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">The Story of GK Mirai</h2>
        </div>

        <div className="relative border-l-2 border-teal-100 pl-6 ml-4 space-y-8">
          {milestones.map((mil, idx) => (
            <div key={idx} className="relative space-y-2">
              <span className="absolute -left-[35px] top-1 h-4 w-4 rounded-full border-2 border-white bg-teal-500 shadow-md"></span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-sm">
                  {mil.year}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{mil.title}</h4>
              </div>
              <p className="text-xs text-slate-500 font-sans max-w-2xl leading-relaxed">
                {mil.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities Quick Catalog */}
      <section className="space-y-8" id="facilities-detailed-catalog">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 font-mono">Resident Privileges</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">All Facilities Available</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {initialFacilities.map((fac) => (
            <div key={fac.id} className="flex gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
              <img 
                src={fac.imageUrl} 
                alt={fac.name} 
                className="h-20 w-24 rounded-lg object-cover bg-slate-50"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1 my-auto">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{fac.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono uppercase tracking-widest">{fac.location} • {fac.capacity}</p>
                <p className="text-[11px] text-slate-500 font-sans line-clamp-1">{fac.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Awards & Achievements Gallery */}
      <section className="space-y-8" id="awards-achievements-cards-section">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 font-mono">Trophies & Credentials</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Society Milestone Awards</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {awards.map((aw, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-4">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-500 w-fit">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans text-sm font-bold text-slate-900">{aw.title}</h4>
                <p className="text-[11px] text-teal-600 font-mono leading-none">{aw.year}</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">{aw.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
