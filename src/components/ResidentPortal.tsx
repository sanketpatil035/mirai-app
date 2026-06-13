import React, { useState } from "react";
import { 
  Wrench, 
  CalendarDays, 
  Bell, 
  CreditCard, 
  PhoneCall, 
  Plus, 
  AlertCircle, 
  Check, 
  Clock, 
  Sparkles, 
  Search, 
  Copy, 
  Printer, 
  CheckCircle2, 
  ShieldAlert,
  Loader2
} from "lucide-react";
import { Facility, Notice, Complaint, AmenityBooking, ResidentUnit, ComplaintCategory } from "../types";
import { initialFacilities, emergencyContacts } from "../data";

interface ResidentPortalProps {
  complaints: Complaint[];
  bookings: AmenityBooking[];
  notices: Notice[];
  residents: ResidentUnit[];
  activeUnitNo: string;
  onAddComplaint: (newComp: Complaint) => void;
  onAddBooking: (newBook: AmenityBooking) => void;
  onPayDues: (unitNo: string) => void;
}

export function ResidentPortal({
  complaints,
  bookings,
  notices,
  residents,
  activeUnitNo,
  onAddComplaint,
  onAddBooking,
  onPayDues
}: ResidentPortalProps) {
  // Tabs: "complaints" | "bookings" | "notices" | "bills" | "emergency"
  const [activeTab, setActiveTab] = useState<"notices" | "complaints" | "bookings" | "bills" | "emergency">("notices");

  // Get active unit details
  const activeUnit = residents.find(r => r.flatNo === activeUnitNo) || residents[0];

  // Search/Filters states for Notices
  const [noticeSearch, setNoticeSearch] = useState("");
  const [selectedNoticeCategory, setSelectedNoticeCategory] = useState<string>("All");

  // Complaint form states
  const [compTitle, setCompTitle] = useState("");
  const [compDesc, setCompDesc] = useState("");
  const [compCategory, setCompCategory] = useState<ComplaintCategory>("Plumbing");
  const [compUrgency, setCompUrgency] = useState<"Low" | "Medium" | "High">("Medium");
  const [compRaisedSuccess, setCompRaisedSuccess] = useState(false);

  // Booking form states
  const [bookAmenityId, setBookAmenityId] = useState(initialFacilities[0].id);
  const [bookDate, setBookDate] = useState("2026-06-16");
  const [bookTimeSlot, setBookTimeSlot] = useState("06:00 PM - 10:00 PM");
  const [bookGuests, setBookGuests] = useState(2);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingConflictMsg, setBookingConflictMsg] = useState("");

  // Payment process simulation state
  const [isPaying, setIsPaying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [lastReceiptNo, setLastReceiptNo] = useState("");

  // Handler for Complaint Submission
  const handleRaiseComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compTitle.trim() || !compDesc.trim()) return;

    const newComplaint: Complaint = {
      id: "comp-" + Date.now(),
      title: compTitle,
      description: compDesc,
      category: compCategory,
      status: "Pending",
      raisedBy: activeUnit.ownerName,
      raisedByFlat: activeUnit.flatNo,
      dateRaised: new Date().toISOString().split("T")[0],
      urgency: compUrgency
    };

    onAddComplaint(newComplaint);
    setCompTitle("");
    setCompDesc("");
    setCompCategory("Plumbing");
    setCompUrgency("Medium");
    setCompRaisedSuccess(true);
    setTimeout(() => setCompRaisedSuccess(false), 5000);
  };

  // Handler for Booking Submission with conflict checker
  const handleAmenityBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConflictMsg("");

    const amenityName = initialFacilities.find(f => f.id === bookAmenityId)?.name || "Facility";

    // Standard Conflict Checker
    const isConflict = bookings.some(b => 
      b.amenityId === bookAmenityId && 
      b.date === bookDate && 
      b.timeSlot === bookTimeSlot && 
      b.status !== "Rejected"
    );

    if (isConflict) {
      setBookingConflictMsg(`The ${amenityName} is already booked for ${bookTimeSlot} on ${bookDate}. Please select another time slot or date.`);
      return;
    }

    const newBooking: AmenityBooking = {
      id: "book-" + Date.now(),
      amenityId: bookAmenityId,
      amenityName,
      bookedBy: activeUnit.ownerName,
      bookedByFlat: activeUnit.flatNo,
      date: bookDate,
      timeSlot: bookTimeSlot,
      status: "Pending",
      guestsCount: bookGuests,
      bookedAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    onAddBooking(newBooking);
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  // Handler for simulated billing payment
  const handlePaymentSubmit = () => {
    setIsPaying(true);
    setTimeout(() => {
      onPayDues(activeUnit.flatNo);
      setIsPaying(false);
      setPaymentDone(true);
      setLastReceiptNo("REC-" + Math.floor(100000 + Math.random() * 900000));
    }, 2000);
  };

  // Help categories filtered notices
  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(noticeSearch.toLowerCase()) || 
                          n.description.toLowerCase().includes(noticeSearch.toLowerCase());
    const matchesCategory = selectedNoticeCategory === "All" || n.category === selectedNoticeCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter complaints raised by active flat
  const myComplaints = complaints.filter(c => c.raisedByFlat === activeUnit.flatNo);

  // Filter bookings requested by active flat
  const myBookings = bookings.filter(b => b.bookedByFlat === activeUnit.flatNo);

  return (
    <div className="space-y-8 animate-fade-in" id="resident-portal-root">
      {/* Resident Identity Ribbon */}
      <div className="rounded-3xl bg-slate-900 text-white p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" id="resident-ribbon">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="space-y-2 relative z-10">
          <span className="text-[10px] font-mono tracking-widest uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-1 rounded-full">Connected Resident Session</span>
          <h2 className="text-xl font-bold font-sans pt-1">
            Flat {activeUnit.flatNo} • {activeUnit.ownerName}
          </h2>
          <p className="text-xs text-slate-300 font-sans font-light">
            Authorized as <strong className="font-semibold text-white">{activeUnit.status}</strong> tied to Block {activeUnit.block} • Smart Gateway Link Active
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="rounded-2xl bg-white/5 px-4 py-3 border border-white/10 text-right">
            <span className="block text-[10px] uppercase text-teal-400 font-bold tracking-wider mb-0.5">Maintenance Dues</span>
            <span className={`text-sm font-bold ${activeUnit.duesStatus === "Paid" ? "text-teal-400" : "text-amber-450"}`}>
              {activeUnit.duesStatus === "Paid" ? "■ Fully Paid" : `₹ ${activeUnit.duesAmount} Outstanding`}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
        {[
          { id: "notices", label: "Notice Board", icon: Bell },
          { id: "complaints", label: "Complaint Desk", icon: Wrench },
          { id: "bookings", label: "Amenities Booking", icon: CalendarDays },
          { id: "bills", label: "Maintenance Bills", icon: CreditCard },
          { id: "emergency", label: "Emergency contacts", icon: PhoneCall },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setPaymentDone(false);
              }}
              id={`tab-btn-${tab.id}`}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                isActive 
                  ? "bg-slate-900 text-white shadow-xs" 
                  : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <IconComp className="h-4 w-4" />
              {tab.label}
              {tab.id === "notices" && notices.some(n => n.urgent) && (
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Body */}
      <div className="mt-4" id="resident-tab-content-container">
        
        {/* Notices Board Tab */}
        {activeTab === "notices" && (
          <div className="space-y-6" id="resident-tab-notices">
            {/* Search and Categories row */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search announcements..." 
                  value={noticeSearch}
                  onChange={(e) => setNoticeSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
                {["All", "Meeting", "General", "Maintenance", "Security", "Event"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedNoticeCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedNoticeCategory === cat 
                        ? "bg-teal-600 text-white shadow-xs" 
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Notice Cards List */}
            <div className="space-y-4">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((not) => (
                  <div 
                    key={not.id} 
                    className={`p-6 rounded-2xl bg-white border shadow-xs transition-hover hover:shadow-md ${
                      not.urgent 
                        ? "border-rose-200 bg-rose-50/10" 
                        : "border-slate-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                            not.urgent 
                              ? "bg-rose-500 text-white animate-pulse" 
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {not.category} {not.urgent && "• URGENT"}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">{not.date}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">{not.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans pre-line">{not.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                      <span>Publisher ID: <strong className="font-semibold">{not.author}</strong></span>
                      <span className="italic font-mono">Verified Broadcast</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 space-y-2">
                  <Bell className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">No notices broadcasted</p>
                  <p className="text-xs text-slate-400">Try adjusting your search criteria or filter categories.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Complaint Desk Tab */}
        {activeTab === "complaints" && (
          <div className="grid md:grid-cols-3 gap-8" id="resident-tab-complaints">
            {/* Form to raise complaint */}
            <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-100 shadow-xs h-fit space-y-6">
              <div className="space-y-1">
                <h3 className="font-sans text-base font-bold text-slate-900">File Local Complaint</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Notice issues in public areas? File high-priority plumbing, security or utility repairs directly to the committee.
                </p>
              </div>

              {compRaisedSuccess && (
                <div className="p-3 bg-teal-50 text-teal-850 rounded-xl flex items-center gap-2 text-xs border border-teal-100">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  <span>Complaint logged successfully! Tracking active.</span>
                </div>
              )}

              <form onSubmit={handleRaiseComplaint} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Repair Category</label>
                  <select 
                    value={compCategory} 
                    onChange={(e) => setCompCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  >
                    <option value="Plumbing">Plumbing Maintenance</option>
                    <option value="Electrical">Common Area Electricals</option>
                    <option value="Housekeeping">Housekeeping / Garbage</option>
                    <option value="Security">Safety & Security</option>
                    <option value="Parking">Reserved Parking Conflict</option>
                    <option value="Other">Other Civic Complaint</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Complaint Title</label>
                  <input 
                    type="text" 
                    placeholder="Short summary of issue..."
                    value={compTitle}
                    onChange={(e) => setCompTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Urgency Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Low", "Medium", "High"].map((lev) => (
                      <button
                        type="button"
                        key={lev}
                        onClick={() => setCompUrgency(lev as any)}
                        className={`py-1.5 rounded-md text-xs font-medium border transition-colors ${
                          compUrgency === lev 
                            ? "bg-slate-900 text-white border-slate-900" 
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {lev}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe location, timing and other details..."
                    value={compDesc}
                    onChange={(e) => setCompDesc(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  id="btn-submit-complaint"
                  className="w-full rounded-xl bg-slate-900 text-white py-2.5 text-xs font-semibold hover:bg-teal-600 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Register Complaint
                </button>
              </form>
            </div>

            {/* Previous Complaints List */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-sans text-base font-semibold text-slate-900">Your Filed Trackings ({myComplaints.length})</h3>

              {myComplaints.length > 0 ? (
                <div className="space-y-3">
                  {myComplaints.map((c) => (
                    <div key={c.id} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[9px] font-mono uppercase tracking-wider border border-slate-250/20">
                              {c.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono uppercase font-bold tracking-wider ${
                              c.urgency === "High" 
                                ? "bg-rose-50 text-rose-600" 
                                : "bg-indigo-50 text-indigo-600"
                            }`}>
                              {c.urgency} Priority
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{c.dateRaised}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 tracking-tight">{c.title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-sans">{c.description}</p>
                        </div>

                        <span className={`px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider ${
                          c.status === "Pending" ? "bg-amber-100 text-amber-850" :
                          c.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                          "bg-teal-100 text-teal-800 border border-teal-200/40"
                        }`}>
                          {c.status}
                        </span>
                      </div>

                      {c.adminRemarks && (
                        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs">
                          <p className="font-mono text-[10px] uppercase font-bold text-slate-400 mb-1">Administrative Remark</p>
                          <p className="text-slate-700 italic font-sans">"{c.adminRemarks}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-teal-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">Perfect Status!</p>
                  <p className="text-xs text-slate-400">No active complaints filed under flat {activeUnit.flatNo}. Click 'File local complaint' to begin.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clubhouse/Amenity Booking Tab */}
        {activeTab === "bookings" && (
          <div className="grid md:grid-cols-3 gap-8" id="resident-tab-bookings">
            
            {/* Booking Form */}
            <div className="p-6 md:p-8 bg-white border border-slate-100 rounded-2xl shadow-xs space-y-6 h-fit">
              <div className="space-y-1">
                <h3 className="font-sans text-base font-bold text-slate-900">Reserve Amenity Slots</h3>
                <p className="text-xs text-slate-500">
                  Select key amenities and available time slots. System automatically approves slots based on community standards & capacity limits.
                </p>
              </div>

              {bookingSuccess && (
                <div className="p-3 bg-teal-50 text-teal-850 rounded-xl flex items-center gap-2 text-xs border border-teal-100">
                  <Check className="h-4 w-4 bg-teal-500 text-white rounded-full p-0.5" />
                  <span>Amenity request filed successfully as PENDING status!</span>
                </div>
              )}

              {bookingConflictMsg && (
                <div className="p-3 bg-rose-50 text-rose-800 rounded-xl flex items-start gap-2 text-xs border border-rose-100">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{bookingConflictMsg}</span>
                </div>
              )}

              <form onSubmit={handleAmenityBooking} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Select Amenity</label>
                  <select
                    value={bookAmenityId}
                    onChange={(e) => setBookAmenityId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  >
                    {initialFacilities.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} (Max {f.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Event Date</label>
                  <input
                    type="date"
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Preferred Time Slot</label>
                  <select
                    value={bookTimeSlot}
                    onChange={(e) => setBookTimeSlot(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-500 bg-white"
                  >
                    <option value="06:00 AM - 08:00 AM">Morning Early: 06:00 AM - 08:00 AM</option>
                    <option value="08:00 AM - 11:00 AM">Morning Standard: 08:00 AM - 11:00 AM</option>
                    <option value="03:00 PM - 05:00 PM">Afternoon Quick: 03:00 PM - 05:00 PM</option>
                    <option value="06:00 PM - 10:00 PM">Evening Leisure: 06:00 PM - 10:00 PM</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Expected Guests Count</label>
                  <input
                    type="number"
                    min={1}
                    max={150}
                    value={bookGuests}
                    onChange={(e) => setBookGuests(parseInt(e.target.value) || 1)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    required
                  />
                  <span className="block text-[10px] text-slate-400">Required for security guard pre-passes.</span>
                </div>

                <button
                  type="submit"
                  id="btn-submit-booking"
                  className="w-full rounded-xl bg-slate-900 text-white py-2.5 text-xs font-semibold hover:bg-teal-600 transition-colors flex items-center justify-center gap-1"
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  Request Booking Slot
                </button>
              </form>
            </div>

            {/* Active Bookings History list */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-sans text-base font-semibold text-slate-900">Your Booking Passes ({myBookings.length})</h3>

              {myBookings.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {myBookings.map((b) => (
                    <div key={b.id} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider ${
                            b.status === "Approved" ? "bg-teal-50 text-teal-805" :
                            b.status === "Rejected" ? "bg-rose-50 text-rose-800" :
                            "bg-amber-50 text-amber-800"
                          }`}>
                            {b.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {b.id.substring(5, 10)}</span>
                        </div>
                        <h4 className="font-sans text-sm font-bold text-slate-800 mt-2">{b.amenityName}</h4>
                        <div className="space-y-1 text-xs text-slate-500 pt-1 font-sans">
                          <p>📅 {b.date}</p>
                          <p>⏰ {b.timeSlot}</p>
                          <p>👥 Guests: {b.guestsCount} Persons</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Booked At: {b.bookedAt.split(" ")[0]}</span>
                        {b.status === "Approved" && (
                          <span className="text-teal-600 font-bold tracking-wider font-sans uppercase text-[9px] border border-teal-200/50 px-1 py-0.5 bg-teal-50">■ QR Pass Ready</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 space-y-2">
                  <CalendarDays className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">No Reservations yet</p>
                  <p className="text-xs text-slate-400">Request any clubhouse, pool, or gym deck slots using the side panel form.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Maintenance Dues Tab */}
        {activeTab === "bills" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in" id="resident-tab-bills">
            {activeUnit.duesStatus === "Unpaid" ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-md space-y-6 text-center">
                <div className="h-14 w-14 bg-amber-50 rounded-2xl text-amber-500 flex items-center justify-center mx-auto border border-amber-100">
                  <CreditCard className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] tracking-widest text-[#9ca3af] font-mono uppercase">Outstanding Maintenance Levy</p>
                  <h3 className="font-sans text-3xl font-extrabold text-[#111827]">₹ {activeUnit.duesAmount}</h3>
                  <p className="text-xs text-[#6b7280] font-sans">
                    Due for financial quarter covering <strong>April - June 2026</strong>. Late fee penalty of ₹500 applicable post June 30th.
                  </p>
                </div>

                <div className="border-t border-slate-50 pt-4 text-xs flex justify-between text-left px-4">
                  <div className="space-y-1">
                    <p className="text-slate-400">Society Unit</p>
                    <p className="text-slate-800 font-semibold">{activeUnit.flatNo} ({activeUnit.status})</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-slate-400">Tax Invoice ID</p>
                    <p className="text-slate-800 font-mono font-semibold">INV-2026-F402</p>
                  </div>
                </div>

                {isPaying ? (
                  <div className="pt-2">
                    <button 
                      disabled
                      className="w-full rounded-xl bg-slate-900 text-white font-semibold py-3 text-sm flex items-center justify-center gap-2 cursor-none"
                    >
                      <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
                      Securing Safe Payment Gateway Link... Keep Open
                    </button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button 
                      onClick={handlePaymentSubmit}
                      id="btn-pay-now"
                      className="w-full rounded-xl bg-slate-900 text-white font-semibold py-3 text-sm hover:bg-teal-600 transition-colors shadow-sm hover:shadow-teal-100/50 flex items-center justify-center gap-1"
                    >
                      Pay Now via Simulated Gateway (₹ {activeUnit.duesAmount})
                    </button>
                    <span className="block text-[10px] text-slate-400 mt-2 font-mono">128-bit SSL encrypted transactional secure bridge</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Fully Paid visual Card */}
                <div className="p-8 rounded-3xl bg-linear-to-b from-teal-50/10 to-teal-50/70 border border-teal-100 shadow-sm text-center space-y-4">
                  <div className="h-12 w-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-sans text-xl font-bold text-slate-900">All Cleared! No Dues Pending</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Thank you for your timely contribution toward society utilities and development. You are in good standing with the society.
                    </p>
                  </div>
                </div>

                {/* Simulated receipt block */}
                {paymentDone && lastReceiptNo && (
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 font-sans text-xs text-slate-600" id="payment-receipt-block">
                    <div className="flex items-center justify-between font-mono font-bold uppercase pb-3 border-b border-dashed border-slate-200">
                      <span>Society Payment Receipt</span>
                      <span className="text-teal-600 font-sans tracking-wide font-bold">SUCCESSFUL</span>
                    </div>

                    <div className="space-y-2 pt-2 text-slate-500">
                      <div className="flex justify-between">
                        <span>Receipt ID</span>
                        <strong className="text-slate-800 font-mono">{lastReceiptNo}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Date</span>
                        <strong className="text-slate-800">{new Date().toISOString().split("T")[0]}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Allocated Unit No</span>
                        <strong className="text-slate-800">{activeUnit.flatNo}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount Paid</span>
                        <strong className="text-slate-800 font-bold">₹ {activeUnit.duesAmount}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Channel</span>
                        <strong className="text-slate-800">Unified Payments Interface (UPI)</strong>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between">
                      <button 
                        onClick={() => window.print()}
                        className="text-[10px] uppercase font-bold text-slate-800 flex items-center gap-1 hover:text-teal-600"
                      >
                        <Printer className="h-3 w-3" /> Print Document
                      </button>
                      <span className="text-[9px] text-slate-400 self-center font-mono uppercase">GK Mirai Smart Board</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Emergency Contacts Tab */}
        {activeTab === "emergency" && (
          <div className="space-y-6 animate-fade-in" id="resident-tab-emergency">
            <div className="rounded-xl bg-rose-50/10 p-5 border border-rose-200 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-rose-900 leading-none">Emergency Quick-Response Instructions</h4>
                <p className="text-xs text-rose-700 font-sans leading-relaxed">
                  In case of heavy fire hazard, physical threats, or severe cardiac instances, call the respective standard 101/100 channels. Concurrently alert the <strong>Main Guard Gate Desk</strong> so they can clear roads for rapid ambulance influx.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {emergencyContacts.map((contact, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">{contact.name}</h4>
                    <p className="text-xs text-slate-400 lowercase italic line-clamp-2 leading-tight">{contact.role}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-600 font-mono tracking-wider">{contact.phone}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(contact.phone);
                        alert(`Copied phone ${contact.phone} to clipboard.`);
                      }}
                      className="inline-flex rounded-lg bg-slate-50 p-2 text-slate-500 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                      title="Copy Number"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
