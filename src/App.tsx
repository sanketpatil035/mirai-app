import { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  Bell, 
  Menu,
  X,
  Leaf
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types and mock imports
import { Notice, Complaint, AmenityBooking, ResidentUnit, ComplaintStatus } from "./types";
import { 
  initialFacilities, 
  initialNotices, 
  initialComplaints, 
  initialBookings, 
  initialResidentUnits 
} from "./data";

// Components
import { LandingPage } from "./components/LandingPage";
import { AboutUs } from "./components/AboutUs";
import { ResidentPortal } from "./components/ResidentPortal";
import { AdminDashboard } from "./components/AdminDashboard";

export default function App() {
  // Navigation: "home" | "about" | "resident" | "admin"
  const [activeTab, setActiveTab] = useState<"home" | "about" | "resident" | "admin">("home");

  // State with LocalStorage fallbacks to simulate durable local persistence
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem("gkm_complaints");
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  const [bookings, setBookings] = useState<AmenityBooking[]>(() => {
    const saved = localStorage.getItem("gkm_bookings");
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem("gkm_notices");
    return saved ? JSON.parse(saved) : initialNotices;
  });

  const [residents, setResidents] = useState<ResidentUnit[]>(() => {
    const saved = localStorage.getItem("gkm_residents");
    return saved ? JSON.parse(saved) : initialResidentUnits;
  });

  // Active simulated Resident context unit
  const [activeUnitNo, setActiveUnitNo] = useState<string>("C-302"); // default

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync state to local storage when changed
  useEffect(() => {
    localStorage.setItem("gkm_complaints", JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem("gkm_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("gkm_notices", JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem("gkm_residents", JSON.stringify(residents));
  }, [residents]);

  // Handle addition of complaint
  const handleAddComplaint = (newComp: Complaint) => {
    setComplaints(prev => [newComp, ...prev]);
  };

  // Handle addition of amenity booking
  const handleAddBooking = (newBook: AmenityBooking) => {
    setBookings(prev => [newBook, ...prev]);
  };

  // Handle simulated billing clearance
  const handlePayDues = (unitNo: string) => {
    setResidents(prev => prev.map(res => {
      if (res.flatNo === unitNo) {
        return {
          ...res,
          duesStatus: "Paid",
          lastPaymentDate: new Date().toISOString().split("T")[0]
        };
      }
      return res;
    }));
  };

  // Admin: Update complaint status & optional admin comment
  const handleUpdateComplaint = (id: string, status: ComplaintStatus, remarks?: string) => {
    setComplaints(prev => prev.map(comp => {
      if (comp.id === id) {
        return {
          ...comp,
          status,
          ...(remarks !== undefined && { adminRemarks: remarks })
        };
      }
      return comp;
    }));
  };

  // Admin: Update Amenity booking status (Approved / Rejected)
  const handleUpdateBookingStatus = (id: string, status: "Approved" | "Rejected") => {
    setBookings(prev => prev.map(book => {
      if (book.id === id) {
        return { ...book, status };
      }
      return book;
    }));
  };

  // Admin: Launch new notice broadcast
  const handlePublishNotice = (newNotice: Notice) => {
    setNotices(prev => [newNotice, ...prev]);
  };

  // Admin: Toggle payment dues status for custom simulations
  const handleToggleResidentDues = (id: string) => {
    setResidents(prev => prev.map(res => {
      if (res.id === id) {
        const nextStatus = res.duesStatus === "Paid" ? "Unpaid" : "Paid";
        return {
          ...res,
          duesStatus: nextStatus,
          ...(nextStatus === "Paid" && { lastPaymentDate: new Date().toISOString().split("T")[0] })
        };
      }
      return res;
    }));
  };

  // Admin: Add new resident condo
  const handleAddResident = (newRes: ResidentUnit) => {
    setResidents(prev => [...prev, newRes]);
  };

  // General: Handles Hero Section Quick action events
  const handleQuickAction = (action: "complaint" | "booking" | "notices" | "emergency") => {
    // When click a quick action, we want to route them to the Resident Portal
    // and trigger the active subtab inside ResidentPortal by proxy
    setActiveTab("resident");
    // Wait for render, then scroll slightly if necessary
    setTimeout(() => {
      const targetBtn = document.getElementById(`tab-btn-${action}`);
      if (targetBtn) {
        targetBtn.click();
        targetBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleClearLocalStorageSimulation = () => {
    if (confirm("Reset GK Mirai data back to default factory settings?")) {
      localStorage.removeItem("gkm_complaints");
      localStorage.removeItem("gkm_bookings");
      localStorage.removeItem("gkm_notices");
      localStorage.removeItem("gkm_residents");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800 selection:bg-teal-100 selection:text-teal-900" id="applet-viewport">
      
      {/* Top Banner announcing simulated credentials */}
      <div className="bg-slate-900 text-slate-300 py-2.5 px-4 text-xs font-medium border-b border-slate-800" id="simulation-banner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-mono">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>Simulation Panel Active</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">As Acting Identity:</span>
              <select 
                value={activeUnitNo}
                onChange={(e) => {
                  setActiveUnitNo(e.target.value);
                  // Auto redirect to resident portal if switching flats for direct feedback
                  if (activeTab !== "admin" && activeTab !== "resident") {
                    setActiveTab("resident");
                  }
                }}
                className="bg-slate-850 hover:bg-slate-800 text-white rounded-md border border-slate-700 px-2 py-1 text-[11px] font-mono focus:outline-hidden"
                id="header-role-identity-picker"
              >
                <optgroup label="Select Resident Condo unit">
                  {residents.map(res => (
                    <option key={res.flatNo} value={res.flatNo}>
                      Resident (Unit {res.flatNo} - {res.ownerName.split(" ")[0]})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <button 
              onClick={handleClearLocalStorageSimulation}
              className="text-[10px] uppercase font-mono tracking-widest text-[#f87171] hover:text-[#ef4444] transition-colors"
              title="Clear simulate database logs"
            >
              Reset Data Default
            </button>
          </div>
        </div>
      </div>

      {/* Main Header navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs" id="site-primary-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo element */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("home")} id="header-logo-container">
            <div className="h-10 w-10 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-teal-600/10 hover:rotate-6 transition-transform">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-bold text-lg tracking-tight text-slate-900 leading-none">GK Mirai</span>
                <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm border border-teal-200/50">SMART</span>
              </div>
              <span className="text-[10px] tracking-widest text-slate-400 font-mono uppercase">Living Habitat</span>
            </div>
          </div>

          {/* Desktop Navigation Link items */}
          <nav className="hidden md:flex items-center gap-1.5" id="desktop-nav-links">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About GK Mirai" },
              { id: "resident", label: "Resident Portal" },
              { id: "admin", label: "Committee Admin Dashboard" },
            ].map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                    isActive 
                      ? "bg-teal-600 text-white shadow-sm" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  id={`nav-btn-${link.id}`}
                >
                  {link.label}
                  {link.id === "resident" && (
                    <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab("resident");
                setTimeout(() => {
                  const billsBtn = document.getElementById("tab-btn-bills");
                  if (billsBtn) billsBtn.click();
                }, 100);
              }}
              className="relative text-slate-600 hover:text-red-600 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              title="Maintenance Outstanding"
            >
              <Bell className="h-4 w-4" />
              {residents.some(r => r.flatNo === activeUnitNo && r.duesStatus === "Unpaid") && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("resident")}
              className="rounded-xl border border-slate-200 hover:border-slate-350 bg-white px-4 py-2.5 text-xs font-bold transition-all text-slate-700 hover:shadow-xs"
            >
              Access Portal
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl"
            id="mobile-menu-hamburger-btn"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown Menu Box */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-100 bg-white overflow-hidden px-4 py-4 space-y-2"
              id="mobile-nav-dropdown-box"
            >
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About GK Mirai" },
                { id: "resident", label: "Resident Portal" },
                { id: "admin", label: "Committee Admin" },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider ${
                    activeTab === link.id 
                      ? "bg-slate-950 text-white" 
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                  id={`mobile-nav-btn-${link.id}`}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Current Flat Active:</span>
                <span className="font-bold text-teal-600">{activeUnitNo}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Primary Container space */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="main-content-flow-zone">
        
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <LandingPage 
                onQuickAction={handleQuickAction} 
                onNavigateToAbout={() => {
                  setActiveTab("about");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <AboutUs />
            </motion.div>
          )}

          {activeTab === "resident" && (
            <motion.div
              key="resident"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ResidentPortal 
                complaints={complaints}
                bookings={bookings}
                notices={notices}
                residents={residents}
                activeUnitNo={activeUnitNo}
                onAddComplaint={handleAddComplaint}
                onAddBooking={handleAddBooking}
                onPayDues={handlePayDues}
              />
            </motion.div>
          )}

          {activeTab === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <AdminDashboard 
                complaints={complaints}
                bookings={bookings}
                notices={notices}
                residents={residents}
                onUpdateComplaint={handleUpdateComplaint}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onPublishNotice={handlePublishNotice}
                onToggleResidentDues={handleToggleResidentDues}
                onAddResident={handleAddResident}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Corporate Styled Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-16" id="site-primary-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="h-8 w-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <Leaf className="h-4.5 w-4.5" />
              </div>
              <span className="font-bold text-base tracking-tight">GK Mirai</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs">
              Bengaluru's premium smart residential housing society, integrating world-class green solar energy grids, efficient garbage compositing, and modern automated gate operations.
            </p>
            <p className="text-[10px] font-mono tracking-widest uppercase text-teal-400">Awarded Model Habitat</p>
          </div>

          {/* Links Col 1 */}
          <div className="space-y-4 text-xs font-sans">
            <h4 className="text-white font-bold tracking-wider uppercase font-mono text-[10px]">Society Hubs</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => setActiveTab("home")} className="hover:text-white transition-colors">Information Portal</button></li>
              <li><button onClick={() => setActiveTab("about")} className="hover:text-white transition-colors">Vision, Mission & Goals</button></li>
              <li><button onClick={() => setActiveTab("resident")} className="hover:text-white transition-colors">Amenities Slot Reservator</button></li>
              <li><button onClick={() => setActiveTab("admin")} className="hover:text-white transition-colors">Administrative Command Center</button></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="space-y-4 text-xs font-sans">
            <h4 className="text-white font-bold tracking-wider uppercase font-mono text-[10px]">Security Integrations</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white transition-colors">MyGate RFID Smart Entry</a></li>
              <li><a href="#" className="hover:text-white transition-colors">RFID FastPass Guest Generator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">CCTV Grid Command Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cantonment Emergency Hotline</a></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-4 text-xs">
            <h4 className="text-white font-bold tracking-wider uppercase font-mono text-[10px]">Mailing Contacts</h4>
            <div className="space-y-2 leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                <span>GK Mirai Smart Township, Outer Ring Rd, Sarjapur Cross, Bengaluru, Karnataka 560103</span>
              </p>
              <p>📞 +91 98765 00002</p>
              <p>✉️ administration@gkmirai.com</p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-[11px] flex flex-col sm:flex-row justify-between gap-4">
          <p>© 2026 GK Mirai Managing Committee (GK SmartLiving). All rights reserved.</p>
          <div className="flex gap-4 justify-center">
            <a href="#" className="hover:text-white transition-colors">Bylaws Agenda</a>
            <a href="#" className="hover:text-white transition-colors">Security Rules</a>
            <a href="#" className="hover:text-white transition-colors">Privacy and Data Protection</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
