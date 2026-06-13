import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  Award, 
  Users, 
  Target, 
  Compass, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  Shield, 
  Trees, 
  Zap, 
  Sparkles,
  ChevronRight,
  Flame,
  Wrench,
  CalendarDays,
  Grid
} from "lucide-react";
import { initialFacilities } from "../data";
import { Facility } from "../types";

interface LandingPageProps {
  onQuickAction: (action: "complaint" | "booking" | "notices" | "emergency") => void;
  onNavigateToAbout: () => void;
}

export function LandingPage({ onQuickAction, onNavigateToAbout }: LandingPageProps) {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  
  // Custom Society info for layout
  const stats = [
    { label: "Community Homes", value: "450+", icon: Building2 },
    { label: "Lush Green Cover", value: "65%", icon: Trees },
    { label: "Global Smart Design Awards", value: "4 Nos", icon: Award },
    { label: "Active Residents", value: "1,800+", icon: Users },
  ];

  const societyHighlights = [
    {
      title: "Smart Security Shield",
      desc: "Fully gated perimeter with continuous dynamic AI monitoring, automatic license-plate recognitions, and quick-response security teams.",
      icon: Shield,
    },
    {
      title: "Clean Renewable Grid",
      desc: "Powered with sustainable rooftop solar installations, rainwater recycling ducts, and dynamic smart-waste composers.",
      icon: Zap,
    },
    {
      title: "Active Neighborhood Culture",
      desc: "Weekly physical workshops, seasonal block celebrations, wellness sessions, and continuous cultural events.",
      icon: Sparkles,
    }
  ];

  const galleryImages = [
    {
      url: "https://gk-mirai.com/assets/banner-web.jpg",
      caption: "GK Mirai Tower A & B Facade",
      desc: "Sustainable premium double-glazed thermal insulated exterior layout."
    },
    {
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=700&q=80",
      caption: "Mirai Leisure Pool Deck",
      desc: "Temperature controlled relaxation pool surrounded by wood decks."
    },
    {
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80",
      caption: "Private Entrance Plaza",
      desc: "Automatic RFID gates ensuring strict yet smooth visitor validation."
    },
    {
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=700&q=80",
      caption: "Nexus Work Café Lobby",
      desc: "Equipped with fast gigabit lines and dynamic phone booths."
    },
  ];

  return (
    <div className="space-y-20 pb-16 animate-fade-in" id="landing-page-root">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl" id="society-hero-section">
        {/* Background Image with elegant overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://gk-mirai.com/assets/banner-web.jpg"
            alt="GK Mirai Residential Society" 
            className="h-full w-full object-cover object-bottom transition-transform duration-10000 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl px-8 py-20 md:py-32 md:px-16 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-4 py-1.5 text-xs font-semibold tracking-wider text-teal-400 uppercase border border-teal-500/30">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
            Next-Gen Smart Living
          </span>
          <h1 className="font-sans text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            GK Mirai <br />
            <span className="text-teal-400 bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent">
              Co-Operative Housing Society
            </span>
          </h1>
          <p className="max-w-xl text-base sm:text-lg text-slate-300 font-sans font-light leading-relaxed">
            Welcome to Punawale's premier eco-smart residential community. Experience a flawless interface of high-speed automation and peaceful green living spaces tailored perfectly for modern families.
          </p>

          {/* Quick Access Grid */}
          <div className="pt-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-mono">Quick Member Portals</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl" id="quick-action-buttons-grid">
              <button 
                onClick={() => onQuickAction("complaint")}
                id="btn-raise-complaint"
                className="flex flex-col items-start p-4 rounded-xl bg-slate-800/80 hover:bg-teal-500 hover:text-white transition-all duration-300 border border-slate-700/60 shadow-lg text-left group"
              >
                <Wrench className="h-5 w-5 mb-2 text-teal-400 group-hover:text-white transition-colors" />
                <span className="text-sm font-semibold tracking-wide">Raise Complaint</span>
                <span className="text-[11px] text-slate-400 group-hover:text-teal-100 transition-colors">Instant Fix</span>
              </button>

              <button 
                onClick={() => onQuickAction("booking")}
                id="btn-book-clubhouse"
                className="flex flex-col items-start p-4 rounded-xl bg-slate-800/80 hover:bg-teal-500 hover:text-white transition-all duration-300 border border-slate-700/60 shadow-lg text-left group"
              >
                <CalendarDays className="h-5 w-5 mb-2 text-teal-400 group-hover:text-white transition-colors" />
                <span className="text-sm font-semibold tracking-wide">Book Amenities</span>
                <span className="text-[11px] text-slate-400 group-hover:text-teal-100 transition-colors">Reserve Slots</span>
              </button>

              <button 
                onClick={() => onQuickAction("notices")}
                id="btn-view-notices"
                className="flex flex-col items-start p-4 rounded-xl bg-slate-800/80 hover:bg-teal-500 hover:text-white transition-all duration-300 border border-slate-700/60 shadow-lg text-left group"
              >
                <Grid className="h-5 w-5 mb-2 text-teal-400 group-hover:text-white transition-colors" />
                <span className="text-sm font-semibold tracking-wide">View Notices</span>
                <span className="text-[11px] text-slate-400 group-hover:text-teal-100 transition-colors">Recent Updates</span>
              </button>

              <button 
                onClick={() => onQuickAction("emergency")}
                id="btn-emergency-contacts"
                className="flex flex-col items-start p-4 rounded-xl bg-slate-800/80 hover:bg-rose-600 hover:text-white transition-all duration-300 border border-slate-700/60 shadow-lg text-left group"
              >
                <PhoneCall className="h-5 w-5 mb-2 text-rose-400 group-hover:text-white transition-colors animate-pulse" />
                <span className="text-sm font-semibold tracking-wide">Emergency Desk</span>
                <span className="text-[11px] text-slate-400 group-hover:text-rose-100 transition-colors">24/7 Hotlines</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6" id="stats-section">
        {stats.map((stat, i) => {
          const IconComp = stat.icon;
          return (
            <div key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="p-3 rounded-xl bg-slate-50 text-teal-600">
                <IconComp className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-bold tracking-tight text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 font-sans tracking-wide">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Smart Amenities & Facilities Grid */}
      <section className="space-y-8" id="facilities-overview-section">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 font-mono">Premium Conveniences</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">World-Class Club & Facilities</h2>
            <p className="max-w-xl text-sm text-slate-500">
              Every facility within GK Mirai has been meticulously built using sustainable materials and integrated with modern booking services.
            </p>
          </div>
          <button 
            onClick={() => onQuickAction("booking")}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-600 transition-colors hover:shadow-lg"
          >
            Check Slot Bookings 
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Facility cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {initialFacilities.map((fac) => (
            <div 
              key={fac.id} 
              className="group overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
              id={`facility-card-${fac.id}`}
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  src={fac.imageUrl} 
                  alt={fac.name} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 rounded-md bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium text-white font-mono uppercase tracking-wider">
                  {fac.capacity}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-sans text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-3">
                    {fac.description}
                  </p>
                </div>
                <div className="border-t border-slate-50 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-teal-600" />
                    <span>{fac.operatingHours}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedFacility(fac)}
                    className="text-xs font-semibold text-slate-800 hover:text-teal-600 flex items-center gap-1 group/btn"
                  >
                    View Details
                    <ChevronRight className="h-3 w-3 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed About Us Segment */}
      <section className="p-8 md:p-12 rounded-3xl bg-slate-50 border border-slate-100 grid md:grid-cols-2 gap-12 items-center" id="about-gk-mirai-highlight">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 font-mono">Society Heritage</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">
              About GK Mirai
            </h2>
          </div>
          
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            GK Mirai was founded in 2012 by the award-winning GK Developers as a visionary smart township. Spread across 12 verdant acres, GK Mirai has pioneered eco-friendly water preservation systems, standard dynamic security screening apps, and premium community-led garbage recycling systems.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-teal-100 p-1 text-teal-600">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Visionary Focus</h4>
                <p className="text-xs text-slate-500">Zero-waste lifestyle integrated with effortless, transparent local communication portals.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-teal-100 p-1 text-teal-600">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Awards & Green Excellence</h4>
                <p className="text-xs text-slate-500">Winner of the Bengaluru Smart Society Green Star award consecutively for three years.</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={onNavigateToAbout}
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2.5 rounded-xl hover:bg-teal-100 transition-colors"
                id="btn-navigate-about"
            >
              Learn More & Read Corporate Agenda 
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Small Interactive Image Gallery Grid */}
        <div className="grid grid-cols-2 gap-4">
          {galleryImages.map((img, index) => (
            <div key={index} className="group relative h-40 overflow-hidden rounded-2xl bg-white shadow-xs hover:shadow-md transition-shadow border border-slate-100">
              <img 
                src={img.url} 
                alt={img.caption} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <div className="space-y-0.5 text-white">
                  <p className="text-[11px] font-bold tracking-wide">{img.caption}</p>
                  <p className="text-[9px] text-slate-300 leading-tight">{img.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sustainable Goals / Core Values Grid */}
      <section className="space-y-12" id="smart-living-ideals-section">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 font-mono">Our Smart Philosophy</span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Built Upon Green Foundations</h2>
          <p className="text-sm text-slate-500">
            GK Mirai sets the national benchmark for residential ecosystem models. Discover how we balance luxury standards with sustainable footprints.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {societyHighlights.map((high, index) => {
            const IconComponent = high.icon;
            return (
              <div key={index} className="p-6 md:p-8 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-lg transition-all duration-300 space-y-4">
                <div className="inline-flex rounded-xl bg-slate-50 p-3.5 text-teal-600">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">{high.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{high.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Facility Detail Modal Dialog */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" id="facility-detail-modal">
          <div className="relative max-w-xl w-full rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 animate-slide-up">
            <div className="relative h-64 bg-slate-100">
              <img 
                src={selectedFacility.imageUrl} 
                alt={selectedFacility.name} 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
              <button 
                onClick={() => setSelectedFacility(null)}
                className="absolute top-4 right-4 rounded-full bg-slate-950/40 text-white hover:bg-slate-950/70 p-2 transition-colors"
                id="btn-close-facility-modal"
              >
                ✕
              </button>
              <div className="absolute bottom-6 left-6 text-white space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-teal-400">Premium Amenity</span>
                <h3 className="text-2xl font-bold tracking-tight">{selectedFacility.name}</h3>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedFacility.description}
              </p>

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-400 font-medium">Capacity Limit</p>
                  <p className="text-slate-800 font-semibold">{selectedFacility.capacity}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 font-medium">Site Location</p>
                  <p className="text-slate-800 font-semibold">{selectedFacility.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 font-medium font-sans">Operating Hours</p>
                  <p className="text-slate-800 font-semibold">{selectedFacility.operatingHours}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 font-medium">Integration Pass</p>
                  <p className="text-slate-800 font-semibold">Instant Smart QR Access</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-900 tracking-wider uppercase font-mono">Special Inclusions</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedFacility.features.map((fea, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                      <span>{fea}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => {
                    setSelectedFacility(null);
                    onQuickAction("booking");
                  }}
                  id="btn-modal-reserve"
                  className="flex-1 rounded-xl bg-teal-600 text-white font-semibold py-3 text-sm hover:bg-teal-700 transition-colors shadow-md hover:shadow-teal-100"
                >
                  Proceed to Booking Slots
                </button>
                <button 
                  onClick={() => setSelectedFacility(null)}
                  className="rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold px-4 py-3 text-sm hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
