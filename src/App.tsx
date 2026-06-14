import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Bell,
  Menu,
  X,
  Leaf,
  Lock,
  Unlock
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
import { api } from "./lib/api";

export default function App() {
  // Navigation: "home" | "about" | "resident" | "admin"
  const [activeTab, setActiveTab] = useState<"home" | "about" | "resident" | "admin">("home");

  // State loaded dynamically from the Spring Boot database
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [bookings, setBookings] = useState<AmenityBooking[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [residents, setResidents] = useState<ResidentUnit[]>([]);

  // Active simulated Resident context unit
  const [activeUnitNo, setActiveUnitNo] = useState<string>("C-302"); // default

  // Admin Mode state (default false, loaded from localStorage)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("gkm_is_admin") === "true";
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleAdminLogin = (pin: string) => {
    const validPins = ["1234", "admin", "admin123", "gkmirai"];
    if (validPins.includes(pin.trim())) {
      setIsAdmin(true);
      localStorage.setItem("gkm_is_admin", "true");
      setShowAdminLoginModal(false);
      setAdminPinInput("");
      setLoginError("");
      setActiveTab("admin");
    } else {
      setLoginError("Invalid Admin PIN. Hint: Try 1234");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.setItem("gkm_is_admin", "false");
    setActiveTab("home");
  };

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Backend Connection Mode State
  const [backendStatus, setBackendStatus] = useState<"checking" | "connected" | "local_fallback">("checking");
  const [isLoading, setIsLoading] = useState(false);

  // Sync state to local storage when changed (ONLY in offline mode as a last-resort fallback)
  useEffect(() => {
    if (backendStatus === "local_fallback") {
      localStorage.setItem("gkm_complaints", JSON.stringify(complaints));
    }
  }, [complaints, backendStatus]);

  useEffect(() => {
    if (backendStatus === "local_fallback") {
      localStorage.setItem("gkm_bookings", JSON.stringify(bookings));
    }
  }, [bookings, backendStatus]);

  useEffect(() => {
    if (backendStatus === "local_fallback") {
      localStorage.setItem("gkm_notices", JSON.stringify(notices));
    }
  }, [notices, backendStatus]);

  useEffect(() => {
    if (backendStatus === "local_fallback") {
      localStorage.setItem("gkm_residents", JSON.stringify(residents));
    }
  }, [residents, backendStatus]);

  // Probe backend server status and retrieve database records
  useEffect(() => {
    async function initDatabaseConnection() {
      setIsLoading(true);
      const isAlive = await api.checkBackendStatus();
      if (isAlive) {
        try {
          const [fetchedNotices, fetchedComplaints, fetchedBookings, fetchedResidents] = await Promise.all([
            api.getNotices(),
            api.getComplaints(),
            api.getBookings(),
            api.getResidents()
          ]);
          setNotices(fetchedNotices);
          setComplaints(fetchedComplaints);
          setBookings(fetchedBookings);
          setResidents(fetchedResidents);
          setBackendStatus("connected");
        } catch (e) {
          console.error("Backend found online but failed to retrieve collections. Falling back to local state", e);
          setBackendStatus("local_fallback");
        }
      } else {
        console.log("Spring Boot API is offline, operating on local state.");
        // Attempt to retrieve existing localStorage elements if available, but do not pre-populate with mock data
        try {
          const savedComplaints = localStorage.getItem("gkm_complaints");
          const savedBookings = localStorage.getItem("gkm_bookings");
          const savedNotices = localStorage.getItem("gkm_notices");
          const savedResidents = localStorage.getItem("gkm_residents");

          if (savedComplaints) setComplaints(JSON.parse(savedComplaints));
          if (savedBookings) setBookings(JSON.parse(savedBookings));
          if (savedNotices) setNotices(JSON.parse(savedNotices));
          if (savedResidents) setResidents(JSON.parse(savedResidents));
        } catch (err) {
          console.error("Failed to parse local backup", err);
        }
        setBackendStatus("local_fallback");
      }
      setIsLoading(false);
    }
    initDatabaseConnection();
  }, []);

  // Handle addition of complaint
  const handleAddComplaint = async (newComp: Complaint) => {
    if (backendStatus === "connected") {
      try {
        const saved = await api.createComplaint(newComp);
        setComplaints(prev => [saved, ...prev]);
      } catch (e) {
        console.error("API failed to save complaint dynamically, falling back to local state updates", e);
        setComplaints(prev => [newComp, ...prev]);
      }
    } else {
      setComplaints(prev => [newComp, ...prev]);
    }
  };

  // Handle addition of amenity booking
  const handleAddBooking = async (newBook: AmenityBooking) => {
    if (backendStatus === "connected") {
      try {
        const saved = await api.createBooking(newBook);
        setBookings(prev => [saved, ...prev]);
      } catch (e) {
        console.error("API failed to save booking dynamically, falling back to local state updates", e);
        setBookings(prev => [newBook, ...prev]);
      }
    } else {
      setBookings(prev => [newBook, ...prev]);
    }
  };

  // Handle simulated billing clearance
  const handlePayDues = async (unitNo: string) => {
    const resident = residents.find(r => r.flatNo === unitNo);
    if (resident && backendStatus === "connected") {
      try {
        const saved = await api.payResidentDues(resident.id);
        setResidents(prev => prev.map(res => res.id === resident.id ? saved : res));
      } catch (e) {
        console.error("API failed to clear dues dynamically, falling back to local state updates", e);
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
      }
    } else {
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
    }
  };

  // Admin: Update complaint status & optional admin comment
  const handleUpdateComplaint = async (id: string, status: ComplaintStatus, remarks?: string) => {
    if (backendStatus === "connected") {
      try {
        let updated = await api.updateComplaintStatus(id, status);
        if (remarks !== undefined) {
          updated = await api.updateComplaintRemarks(id, remarks);
        }
        setComplaints(prev => prev.map(comp => comp.id === id ? updated : comp));
      } catch (e) {
        console.error("API failed to update complaint, falling back to local updates", e);
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
      }
    } else {
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
    }
  };

  // Admin: Update Amenity booking status (Approved / Rejected)
  const handleUpdateBookingStatus = async (id: string, status: "Approved" | "Rejected") => {
    if (backendStatus === "connected") {
      try {
        const updated = await api.updateBookingStatus(id, status);
        setBookings(prev => prev.map(book => book.id === id ? updated : book));
      } catch (e) {
        console.error("API failed to update booking status, falling back to local updates", e);
        setBookings(prev => prev.map(book => {
          if (book.id === id) {
            return { ...book, status };
          }
          return book;
        }));
      }
    } else {
      setBookings(prev => prev.map(book => {
        if (book.id === id) {
          return { ...book, status };
        }
        return book;
      }));
    }
  };

  // Admin: Launch new notice broadcast
  const handlePublishNotice = async (newNotice: Notice) => {
    if (backendStatus === "connected") {
      try {
        const saved = await api.createNotice(newNotice);
        setNotices(prev => [saved, ...prev]);
      } catch (e) {
        console.error("API failed to publish notice dynamically, falling back to local updates", e);
        setNotices(prev => [newNotice, ...prev]);
      }
    } else {
      setNotices(prev => [newNotice, ...prev]);
    }
  };

  // Admin: Toggle payment dues status for custom simulations
  const handleToggleResidentDues = async (id: string) => {
    if (backendStatus === "connected") {
      try {
        const updated = await api.toggleResidentDues(id);
        setResidents(prev => prev.map(res => res.id === id ? updated : res));
      } catch (e) {
        console.error("API failed to change dues status dynamically, falling back to local updates", e);
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
      }
    } else {
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
    }
  };

  // Admin: Add new resident condo
  const handleAddResident = async (newRes: ResidentUnit) => {
    if (backendStatus === "connected") {
      try {
        const saved = await api.enrollResidentUnit(newRes);
        setResidents(prev => [...prev, saved]);
      } catch (e) {
        console.error("API failed to enroll resident, falling back to local updates", e);
        setResidents(prev => [...prev, newRes]);
      }
    } else {
      setResidents(prev => [...prev, newRes]);
    }
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
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wider font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span>Simulation Panel Active</span>
              </div>
              <span className="text-slate-700 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5 animate-fade-in">
                {backendStatus === "checking" && (
                    <>
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span className="text-amber-500 font-bold">Connecting H2 Database...</span>
                    </>
                )}
                {backendStatus === "connected" && (
                    <>
                      <span className="h-2 w-2 rounded-full bg-[#10b981]"></span>
                      <span className="text-[#10b981] font-bold animate-pulse">Connected: Spring Boot H2</span>
                    </>
                )}
                {backendStatus === "local_fallback" && (
                    <>
                      <span className="h-2 w-2 rounded-full bg-[#f87171] animate-pulse"></span>
                      <span className="text-[#f87171] font-bold" title="To utilize real Java backend: Start your Spring Boot application on port 8080.">Offline Mode: LocalStorage Fallback</span>
                    </>
                )}
              </div>
              <span className="text-slate-700 hidden lg:inline">|</span>
              <div className="flex items-center gap-1.5">
                {isAdmin ? (
                    <>
                      <span className="h-2.5 w-2.5 rounded-full bg-teal-400"></span>
                      <span className="text-teal-400 font-bold">Admin Authority: Yes</span>
                    </>
                ) : (
                    <>
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-600"></span>
                      <span className="text-slate-400">Admin Authority: Guest/Resident</span>
                    </>
                )}
              </div>
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
                <span className="text-[10px] tracking-widest text-slate-400 font-mono uppercase">Punawale</span>
              </div>
            </div>

            {/* Desktop Navigation Link items */}
            <nav className="hidden md:flex items-center gap-1.5" id="desktop-nav-links">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About GK Mirai" },
                { id: "resident", label: "Resident Portal" },
                ...(isAdmin ? [{ id: "admin", label: "Committee Admin Dashboard" }] : []),
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
              {isAdmin ? (
                  <button
                      onClick={handleAdminLogout}
                      className="rounded-xl border border-rose-200 hover:border-rose-300 bg-rose-50/50 px-4 py-2.5 text-xs font-bold transition-all text-rose-700 hover:shadow-xs flex items-center gap-1.5"
                      title="Exit administrative mode security clearance"
                  >
                    <Unlock className="h-3.5 w-3.5" />
                    Exit Admin
                  </button>
              ) : (
                  <button
                      onClick={() => setShowAdminLoginModal(true)}
                      className="rounded-xl border border-slate-200 hover:border-teal-350 bg-white px-4 py-2.5 text-xs font-bold transition-all text-slate-700 hover:text-teal-750 hover:shadow-xs flex items-center gap-1.5"
                      title="Authenticate as a Committee Admin member"
                  >
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    Admin Login
                  </button>
              )}
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
                    ...(isAdmin ? [{ id: "admin", label: "Committee Admin" }] : []),
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
                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    {isAdmin ? (
                        <button
                            onClick={() => {
                              handleAdminLogout();
                              setMobileMenuOpen(false);
                            }}
                            className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 uppercase tracking-wider"
                        >
                          Exit Admin Mode
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                              setShowAdminLoginModal(true);
                              setMobileMenuOpen(false);
                            }}
                            className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 uppercase tracking-wider"
                        >
                          Admin Sign-In (PIN: 1234)
                        </button>
                    )}
                  </div>
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
                  {isAdmin ? (
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
                  ) : (
                      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center" id="unauthorized-placeholder">
                        <div className="h-16 w-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Lock className="h-8 w-8" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Unauthorized Entrance</h2>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                          The Committee Command Center is restricted to authorized GK Mirai managing members. Please log in first.
                        </p>
                        <button
                            onClick={() => setShowAdminLoginModal(true)}
                            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs uppercase tracking-widest transition-all"
                        >
                          Authenticate credentials (PIN: 1234)
                        </button>
                      </div>
                  )}
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
                GK Mirai is an ideal place to live in Pune. The neighbourhood provides easy access to essential amenities such as schools, hospitals, shopping centres and other entertainment options while being well connected to the rest of the city and providing access to several public transport systems and other social infrastructure.
              </p>
              <p className="text-[10px] font-mono tracking-widest uppercase text-teal-400">Awarded Model Habitat</p>
            </div>

            {/* Links Col 1 */}
            <div className="space-y-4 text-xs font-sans">
              <h4 className="text-white font-bold tracking-wider uppercase font-mono text-[10px]">Society Hubs</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => setActiveTab("home")} className="hover:text-white transition-colors text-left">Information Portal</button></li>
                <li><button onClick={() => setActiveTab("about")} className="hover:text-white transition-colors text-left">Vision, Mission & Goals</button></li>
                <li><button onClick={() => setActiveTab("resident")} className="hover:text-white transition-colors text-left">Amenities Slot Reservator</button></li>
                {isAdmin && (
                    <li><button onClick={() => setActiveTab("admin")} className="hover:text-white transition-colors text-left">Administrative Command Center</button></li>
                )}
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
                  <span>GK Mirai, Punawale High St, near Zudio, Punvale Bazar, Punawale, Pimpri-Chinchwad, Maharashtra 411033</span>
                </p>
                <p>📞 +91 9800000000</p>
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

        {/* Elegant Admin Password Overlay Modal */}
        <AnimatePresence>
          {showAdminLoginModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md" id="admin-login-modal">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full max-w-md overflow-hidden bg-white rounded-3xl shadow-2xl border border-slate-155 p-8"
                >
                  {/* Close Button */}
                  <button
                      onClick={() => {
                        setShowAdminLoginModal(false);
                        setLoginError("");
                        setAdminPinInput("");
                      }}
                      className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                      title="Discard login"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="text-center">
                    <div className="h-14 w-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                      <Lock className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1.5" id="modal-title">Admin Gatekeeper</h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto mb-6">
                      Please verify your credentials to unlock the GK Mirai Managing Committee suite tools.
                    </p>
                  </div>

                  <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAdminLogin(adminPinInput);
                      }}
                      className="space-y-4"
                  >
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Security Passcode PIN
                      </label>
                      <input
                          type="password"
                          value={adminPinInput}
                          onChange={(e) => {
                            setAdminPinInput(e.target.value);
                            if (loginError) setLoginError("");
                          }}
                          placeholder="••••"
                          className="w-full text-center tracking-widest text-lg font-bold py-3.5 px-4 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 placeholder-slate-300"
                          autoFocus
                          required
                      />
                    </div>

                    {loginError && (
                        <p className="text-xs font-semibold text-rose-600 text-center animate-shake" id="login-error-text">
                          {loginError}
                        </p>
                    )}

                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex items-start gap-2 text-left">
                      <span className="text-xs text-slate-400 font-mono select-none">💡</span>
                      <div className="text-slate-500 text-[11px] leading-relaxed">
                        <strong>Reviewer Access PIN:</strong> Enter <span className="font-mono bg-teal-50 text-teal-700 font-semibold px-1 rounded-sm">1234</span> or <span className="font-mono bg-teal-50 text-teal-700 font-semibold px-1 rounded-sm">admin</span> to sign in instantly.
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                          type="button"
                          onClick={() => {
                            setShowAdminLoginModal(false);
                            setLoginError("");
                            setAdminPinInput("");
                          }}
                          className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs uppercase tracking-wider transition-all"
                      >
                        Cancel
                      </button>
                      <button
                          type="submit"
                          className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs uppercase tracking-wider shadow-sm shadow-teal-600/10 transition-all"
                      >
                        Authorize
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
          )}
        </AnimatePresence>
      </div>
  );
}
