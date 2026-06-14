import React, { useState } from "react";
import {
  Building2,
  Wrench,
  CalendarCheck,
  BellRing,
  CreditCard,
  Plus,
  Trash2,
  Check,
  X,
  CheckCircle,
  Clock,
  MessageSquare,
  Search,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";
import { Notice, Complaint, AmenityBooking, ResidentUnit, NoticeCategory, ComplaintStatus } from "../types";

interface AdminDashboardProps {
  complaints: Complaint[];
  bookings: AmenityBooking[];
  notices: Notice[];
  residents: ResidentUnit[];
  onUpdateComplaint: (id: string, status: ComplaintStatus, remarks?: string) => void;
  onUpdateBookingStatus: (id: string, status: "Approved" | "Rejected") => void;
  onPublishNotice: (newNotice: Notice) => void;
  onToggleResidentDues: (id: string) => void;
  onAddResident: (newRes: ResidentUnit) => void;
}

export function AdminDashboard({
                                 complaints,
                                 bookings,
                                 notices,
                                 residents,
                                 onUpdateComplaint,
                                 onUpdateBookingStatus,
                                 onPublishNotice,
                                 onToggleResidentDues,
                                 onAddResident
                               }: AdminDashboardProps) {
  // Tabs: "complaints" | "bookings" | "notices" | "residents"
  const [adminTab, setAdminTab] = useState<"complaints" | "bookings" | "notices" | "residents">("complaints");

  // Local forms state
  // Notice form
  const [pubTitle, setPubTitle] = useState("");
  const [pubDesc, setPubDesc] = useState("");
  const [pubCategory, setPubCategory] = useState<NoticeCategory>("General");
  const [pubUrgent, setPubUrgent] = useState(false);
  const [pubSuccess, setPubSuccess] = useState(false);

  // Resident form
  const [resFlatNo, setResFlatNo] = useState("");
  const [resBlock, setResBlock] = useState<"A" | "B" | "C" | "D">("A");
  const [resOwner, setResOwner] = useState("");
  const [resEmail, setResEmail] = useState("");
  const [resStatus, setResStatus] = useState<"Owner" | "Tenant">("Owner");
  const [resDues, setResDues] = useState(4500);
  const [resPassword, setResPassword] = useState("");
  const [showAddResForm, setShowAddResForm] = useState(false);

  // Administrative remark local states
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [compRemarkText, setCompRemarkText] = useState("");

  // Filters for Complaints list
  const [compFilterStatus, setCompFilterStatus] = useState<string>("All");

  // Metrics helper computations
  const totalOutstandingDues = residents
      .filter(r => r.duesStatus === "Unpaid")
      .reduce((sum, current) => sum + current.duesAmount, 0);

  const pendingComplaintsCount = complaints.filter(c => c.status === "Pending" || c.status === "In Progress").length;
  const pendingBookingsCount = bookings.filter(b => b.status === "Pending").length;
  const totalPaidResidents = residents.filter(r => r.duesStatus === "Paid").length;
  const totalResidentsCount = residents.length;
  const collectionPercentage = totalResidentsCount > 0
      ? Math.round((totalPaidResidents / totalResidentsCount) * 100)
      : 100;

  // Submit dynamic Notice Broadcaster
  const handlePublishNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle.trim() || !pubDesc.trim()) return;

    const newNotice: Notice = {
      id: "not-" + Date.now(),
      title: pubTitle,
      description: pubDesc,
      category: pubCategory,
      date: new Date().toISOString().split("T")[0],
      author: "GK Mirai Admin Panel (Authorized)",
      urgent: pubUrgent
    };

    onPublishNotice(newNotice);
    setPubTitle("");
    setPubDesc("");
    setPubCategory("General");
    setPubUrgent(false);
    setPubSuccess(true);
    setTimeout(() => setPubSuccess(false), 5000);
  };

  // Submit dynamic Resident Unit adder
  const handleAddResidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resFlatNo.trim() || !resOwner.trim()) return;

    // Check duplicate
    if (residents.some(r => r.flatNo.toUpperCase() === resFlatNo.toUpperCase())) {
      alert(`Unit ${resFlatNo} is already registered!`);
      return;
    }

    const newResident: ResidentUnit = {
      id: "u-" + Date.now(),
      flatNo: resFlatNo,
      block: resBlock,
      ownerName: resOwner,
      ownerEmail: resEmail || `${resOwner.toLowerCase().replace(/ /g, "")}@mirai.com`,
      status: resStatus,
      duesStatus: "Unpaid",
      duesAmount: resDues,
      password: resPassword || "password"
    };

    onAddResident(newResident);
    setResFlatNo("");
    setResOwner("");
    setResEmail("");
    setResDues(4500);
    setResPassword("");
    setShowAddResForm(false);
  };

  // Trigger updating local complaint remarks details
  const startEditingRemark = (c: Complaint) => {
    setSelectedCompId(c.id);
    setCompRemarkText(c.adminRemarks || "");
  };

  const saveComplaintRemark = (id: string, status: ComplaintStatus) => {
    onUpdateComplaint(id, status, compRemarkText);
    setSelectedCompId(null);
    setCompRemarkText("");
  };

  return (
      <div className="space-y-8 animate-fade-in" id="admin-dashboard-root">
        {/* Dynamic Summary Cards Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="admin-insights-row">

          {/* Metric 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-orange-50 text-orange-600 p-2.5 rounded-xl">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Escalated Complaints</p>
              <h3 className="text-2xl font-bold text-slate-900">{pendingComplaintsCount} Active</h3>
              <p className="text-xs text-slate-500 font-sans">Awaiting technical checkups</p>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
              <div
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (pendingComplaintsCount / Math.max(1, complaints.length)) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-blue-50 text-blue-600 p-2.5 rounded-xl">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Amenities Bookings</p>
              <h3 className="text-2xl font-bold text-slate-900">{pendingBookingsCount} Pending</h3>
              <p className="text-xs text-slate-500 font-sans">Club house & court schedules</p>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
              <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (pendingBookingsCount / Math.max(1, bookings.length)) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-teal-50 text-teal-600 p-2.5 rounded-xl">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Finances Collection</p>
              <h3 className="text-2xl font-bold text-slate-900">{collectionPercentage}% Cleared</h3>
              <p className="text-xs text-slate-500 font-sans">₹{totalOutstandingDues} outstanding bills</p>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
              <div
                  className="h-full bg-teal-500 transition-all duration-300"
                  style={{ width: `${collectionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-violet-50 text-violet-600 p-2.5 rounded-xl">
              <BellRing className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Broadcasting Status</p>
              <h3 className="text-2xl font-bold text-slate-900">{notices.length} Live Notices</h3>
              <p className="text-xs text-slate-500 font-sans">Community notices active</p>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 w-3/4"></div>
            </div>
          </div>

        </section>

        {/* Internal Navigation Sub-Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
          {[
            { id: "complaints", label: "Resolve Complaints Desk", icon: Wrench },
            { id: "bookings", label: "Amenity Reservation approvals", icon: CalendarCheck },
            { id: "notices", label: "Publish Broadcast Announcement", icon: BellRing },
            { id: "residents", label: "Resident Directory & Levy Dues", icon: Building2 }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = adminTab === tab.id;
            return (
                <button
                    key={tab.id}
                    onClick={() => {
                      setAdminTab(tab.id as any);
                      setSelectedCompId(null);
                      setCompRemarkText("");
                    }}
                    id={`admin-tab-btn-${tab.id}`}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                        isActive
                            ? "bg-teal-600 text-white shadow-xs"
                            : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                >
                  <IconComp className="h-4 w-4" />
                  {tab.label}
                </button>
            );
          })}
        </div>

        {/* Dynamic Tab Body */}
        <div className="mt-4" id="admin-dynamic-body">

          {/* Resolve Complaints Desk Tab */}
          {adminTab === "complaints" && (
              <div className="space-y-6 animate-fade-in" id="admin-tab-complaints">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-sans text-base font-bold text-slate-900">Manage Society Repair Log Book</h3>
                    <p className="text-xs text-slate-500">
                      Update statuses of electrical, security, plumbing, and housekeeping complaints. Post real-time remarks for tracking.
                    </p>
                  </div>

                  {/* Status Select Filter */}
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                    <select
                        value={compFilterStatus}
                        onChange={(e) => setCompFilterStatus(e.target.value)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 bg-white focus:outline-hidden"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending Only</option>
                      <option value="In Progress">In Progress Only</option>
                      <option value="Resolved">Resolved Fixed</option>
                    </select>
                  </div>
                </div>

                {/* Complaints list */}
                <div className="space-y-4">
                  {complaints
                      .filter(c => compFilterStatus === "All" || c.status === compFilterStatus)
                      .map((comp) => {
                        const isEditingThis = selectedCompId === comp.id;
                        return (
                            <div
                                key={comp.id}
                                className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow grid lg:grid-cols-4 gap-6 items-start"
                                id={`admin-complaint-row-${comp.id}`}
                            >
                              {/* Left: Metadata */}
                              <div className="space-y-2 lg:col-span-3">
                                <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider ${
                              comp.status === "Pending" ? "bg-amber-100 text-amber-800" :
                                  comp.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                                      "bg-teal-100 text-teal-800 border border-teal-200/40"
                          }`}>
                            {comp.status}
                          </span>
                                  <span className="text-[10px] text-slate-400 font-mono">Unit {comp.raisedByFlat} • {comp.raisedBy}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">• Raised: {comp.dateRaised}</span>
                                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono ${
                                      comp.urgency === "High" ? "text-rose-600 bg-rose-50" : "text-indigo-600 bg-indigo-50"
                                  }`}>{comp.urgency} Urgency</span>
                                </div>
                                <h4 className="text-base font-bold text-slate-900 tracking-tight">{comp.title}</h4>
                                <p className="text-xs text-slate-600 leading-relaxed font-sans">{comp.description}</p>

                                {/* Remark form/view */}
                                {isEditingThis ? (
                                    <div className="pt-4 space-y-2" id={`remark-input-container-${comp.id}`}>
                                      <label className="text-[10px] font-mono uppercase font-bold text-slate-400">Update Administrative Remark Response</label>
                                      <input
                                          type="text"
                                          value={compRemarkText}
                                          onChange={(e) => setCompRemarkText(e.target.value)}
                                          placeholder="Type updates (e.g. assigned electricians, tentative fix date)..."
                                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                                      />
                                      <div className="flex gap-2">
                                        <button
                                            onClick={() => saveComplaintRemark(comp.id, comp.status)}
                                            className="rounded-lg bg-teal-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-teal-750"
                                        >
                                          Save Remark
                                        </button>
                                        <button
                                            onClick={() => {
                                              setSelectedCompId(null);
                                              setCompRemarkText("");
                                            }}
                                            className="rounded-lg border border-slate-200 bg-white text-slate-600 px-3 py-1.5 text-xs hover:bg-slate-50"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                ) : (
                                    comp.adminRemarks && (
                                        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs border border-slate-100 flex items-start gap-2">
                                          <MessageSquare className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                                          <p className="text-slate-600 italic">"{comp.adminRemarks}"</p>
                                        </div>
                                    )
                                )}
                              </div>

                              {/* Right: Quick Action Controls */}
                              <div className="flex flex-col gap-2 justify-center h-full border-t lg:border-t-0 lg:border-l border-slate-50 pt-4 lg:pt-0 lg:pl-6">
                                <p className="text-[10px] font-mono uppercase text-slate-400 font-bold">Action Switcher</p>

                                <div className="grid grid-cols-3 lg:grid-cols-1 gap-1.5">
                                  <button
                                      onClick={() => onUpdateComplaint(comp.id, "Pending")}
                                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                                          comp.status === "Pending"
                                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                                              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                      }`}
                                  >
                                    Mark Pending
                                  </button>
                                  <button
                                      onClick={() => onUpdateComplaint(comp.id, "In Progress")}
                                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                                          comp.status === "In Progress"
                                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                                              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                      }`}
                                  >
                                    In Progress
                                  </button>
                                  <button
                                      onClick={() => onUpdateComplaint(comp.id, "Resolved")}
                                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                                          comp.status === "Resolved"
                                              ? "bg-teal-100 text-teal-800 border border-teal-200"
                                              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                      }`}
                                  >
                                    Mark Resolved
                                  </button>
                                </div>

                                {!isEditingThis && (
                                    <button
                                        onClick={() => startEditingRemark(comp)}
                                        className="mt-2 text-left text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline"
                                    >
                                      + Edit Remark Message
                                    </button>
                                )}
                              </div>
                            </div>
                        );
                      })}
                </div>
              </div>
          )}

          {/* Amenity Reservation Approvals Tab */}
          {adminTab === "bookings" && (
              <div className="space-y-6 animate-fade-in" id="admin-tab-bookings">
                <div className="space-y-1">
                  <h3 className="font-sans text-base font-bold text-slate-900">Amenity Reservation Approvals</h3>
                  <p className="text-xs text-slate-500">
                    Grant or reject clubhouse bookings, tennis court night slots, and wellness arenas. Keep track of guest headcounts.
                  </p>
                </div>

                {/* List of Bookings */}
                <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                    <tr className="bg-slate-50 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-100 text-[10px]">
                      <th className="p-4 font-bold">Applicant / Flat</th>
                      <th className="p-4 font-bold">Target Amenity</th>
                      <th className="p-4 font-bold">Date & Time</th>
                      <th className="p-4 font-bold">Guests Count</th>
                      <th className="p-4 font-bold text-center">Status</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookings.map((book) => (
                        <tr key={book.id} className="border-b border-slate-100 hover:bg-slate-50/50" id={`admin-booking-row-${book.id}`}>
                          <td className="p-4 font-semibold text-slate-800">
                            <p>{book.bookedBy}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Flat {book.bookedByFlat}</p>
                          </td>
                          <td className="p-4 text-slate-600 font-medium">
                            {book.amenityName}
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-slate-700">{book.date}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{book.timeSlot}</p>
                          </td>
                          <td className="p-4 font-semibold text-slate-700 text-center sm:text-left">
                            {book.guestsCount} Guests
                          </td>
                          <td className="p-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-sm font-mono font-bold uppercase tracking-wider text-[9px] ${
                            book.status === "Approved" ? "bg-teal-50 text-teal-800 border border-teal-200" :
                                book.status === "Rejected" ? "bg-rose-50 text-rose-800 border border-rose-250" :
                                    "bg-amber-50 text-amber-800 border border-amber-250"
                        }`}>
                          {book.status}
                        </span>
                          </td>
                          <td className="p-4 text-right">
                            {book.status === "Pending" ? (
                                <div className="flex gap-2 justify-end">
                                  <button
                                      onClick={() => onUpdateBookingStatus(book.id, "Approved")}
                                      title="Approve Slot"
                                      className="p-1.5 rounded-md bg-teal-100 text-teal-700 hover:bg-teal-600 hover:text-white transition-colors"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                      onClick={() => onUpdateBookingStatus(book.id, "Rejected")}
                                      title="Reject Slot"
                                      className="p-1.5 rounded-md bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                            ) : (
                                <span className="text-[10px] italic text-slate-400">Validated</span>
                            )}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
          )}

          {/* Publish Broadcast Announcement Tab */}
          {adminTab === "notices" && (
              <div className="grid md:grid-cols-3 gap-8 animate-fade-in" id="admin-tab-notices">
                {/* Notice Form */}
                <div className="p-6 md:p-8 bg-white border border-slate-100 rounded-2xl shadow-xs space-y-6 h-fit">
                  <div className="space-y-1">
                    <h3 className="font-sans text-base font-bold text-slate-900">Broadcast Notice</h3>
                    <p className="text-xs text-slate-500">
                      Publish system declarations, general water suspends, security guidelines, or special events directly to all community dashboard screens.
                    </p>
                  </div>

                  {pubSuccess && (
                      <div className="p-3 bg-teal-50 text-teal-850 rounded-xl flex items-center gap-2 text-xs border border-teal-100">
                        <CheckCircle className="h-4 w-4 text-teal-600" />
                        <span>Notice broadcast launched to resident portals.</span>
                      </div>
                  )}

                  <form onSubmit={handlePublishNoticeSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Notice Category</label>
                      <select
                          value={pubCategory}
                          onChange={(e) => setPubCategory(e.target.value as any)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-500 bg-white"
                      >
                        <option value="General">General Announcement</option>
                        <option value="Meeting">Meeting / AGM Call</option>
                        <option value="Maintenance">Water/Power Maintenance</option>
                        <option value="Security">Security RFID/Lockdowns</option>
                        <option value="Event">Community Event</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Headline Title</label>
                      <input
                          type="text"
                          required
                          placeholder="Short bold title..."
                          value={pubTitle}
                          onChange={(e) => setPubTitle(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 font-sans text-slate-750">Notice Details</label>
                      <textarea
                          rows={5}
                          required
                          placeholder="Write detailed descriptions here (parking rules, timing cuts, coordinator contacts)..."
                          value={pubDesc}
                          onChange={(e) => setPubDesc(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          id="chk-urgent-notice"
                          checked={pubUrgent}
                          onChange={(e) => setPubUrgent(e.target.checked)}
                          className="h-4 w-4 rounded-sm border-slate-200 text-teal-600 focus:ring-teal-500 bg-white"
                      />
                      <label htmlFor="chk-urgent-notice" className="text-xs font-semibold text-rose-600">
                        Mark as URGENT (Flashing highlight)
                      </label>
                    </div>

                    <button
                        type="submit"
                        id="btn-publish-notice"
                        className="w-full rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-semibold py-2.5 text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Broadcast Announcement
                    </button>
                  </form>
                </div>

                {/* Existing notice catalog list to view */}
                <div className="md:col-span-2 space-y-4 font-sans">
                  <h3 className="text-base font-semibold text-slate-900 font-sans">Current Live Broadcasts ({notices.length})</h3>

                  <div className="space-y-3">
                    {notices.map((n) => (
                        <div key={n.id} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs flex justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase ${
                            n.urgent ? "bg-rose-500 text-white animate-pulse" : "bg-slate-100 text-slate-600"
                        }`}>
                          {n.category}
                        </span>
                              <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">{n.title}</h4>
                            <p className="text-xs text-slate-500 line-clamp-3 font-sans leading-relaxed">{n.description}</p>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
          )}

          {/* Resident Directory & Levy Dues */}
          {adminTab === "residents" && (
              <div className="space-y-6 animate-fade-in" id="admin-tab-residents">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-sans text-base font-bold text-slate-900">Resident Registry & Levy Dues</h3>
                    <p className="text-xs text-slate-500">
                      Update unit occupants, catalog block alignments. Toggle or cancel outstanding maintenance bills.
                    </p>
                  </div>

                  {/* Toggle new resident form */}
                  <button
                      onClick={() => setShowAddResForm(!showAddResForm)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white px-3.5 py-2 text-xs font-semibold hover:bg-teal-600 transition-colors"
                  >
                    {showAddResForm ? "Hide Form" : "+ Enroll New Unit"}
                  </button>
                </div>

                {/* Dynamic Resident creation Form code inside dashboard */}
                {showAddResForm && (
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl max-w-xl animate-slide-up" id="enroll-resident-form">
                      <h4 className="font-sans font-bold text-slate-900 text-sm mb-4">Enroll New Resident Condo</h4>
                      <form onSubmit={handleAddResidentSubmit} className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 select-none">
                          <label className="text-xs font-semibold text-slate-700">Flat Code (e.g. A-402)</label>
                          <input
                              type="text"
                              required
                              placeholder="e.g. B-504"
                              value={resFlatNo}
                              onChange={(e) => setResFlatNo(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 hover:text-teal-600">Complex Block</label>
                          <select
                              value={resBlock}
                              onChange={(e) => setResBlock(e.target.value as any)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 bg-white"
                          >
                            <option value="A">Block A (Luxury Corner)</option>
                            <option value="B">Block B (Poolside Deck)</option>
                            <option value="C">Block C (Gymnasium Wing)</option>
                            <option value="D">Block D (North Canopy)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">Occupant Name</label>
                          <input
                              type="text"
                              required
                              placeholder="Full legal name..."
                              value={resOwner}
                              onChange={(e) => setResOwner(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">Contact Email (Optional)</label>
                          <input
                              type="email"
                              placeholder="name@email.com"
                              value={resEmail}
                              onChange={(e) => setResEmail(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">Agreement Type</label>
                          <select
                              value={resStatus}
                              onChange={(e) => setResStatus(e.target.value as any)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 bg-white"
                          >
                            <option value="Owner">Landed Owner</option>
                            <option value="Tenant">Registered Tenant</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">Maintenance Fee (₹)</label>
                          <input
                              type="number"
                              required
                              min={100}
                              value={resDues}
                              onChange={(e) => setResDues(parseInt(e.target.value) || 0)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold text-slate-700">Resident Passcode</label>
                            <span className="text-[10px] text-teal-600 bg-teal-50 px-1 rounded-sm">Default: password</span>
                          </div>
                          <input
                              type="text"
                              placeholder="e.g. secret123"
                              value={resPassword}
                              onChange={(e) => setResPassword(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 bg-white"
                          />
                        </div>

                        <div className="col-span-2 pt-2 flex gap-3">
                          <button
                              type="submit"
                              id="btn-confirm-add-resident"
                              className="flex-1 rounded-xl bg-slate-900 text-white font-semibold py-2.5 text-xs hover:bg-teal-600 transition-colors"
                          >
                            Register Apartment Unit
                          </button>
                          <button
                              type="button"
                              onClick={() => setShowAddResForm(false)}
                              className="rounded-xl border border-slate-250 bg-white text-slate-700 px-4 py-2.5 text-xs hover:bg-slate-100 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                )}

                {/* Resident units grid with dues toggles */}
                <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                    <tr className="bg-slate-50 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-100 text-[10px]">
                      <th className="p-4 font-bold">Flat No</th>
                      <th className="p-4 font-bold">Occupant / Owner</th>
                      <th className="p-4 font-bold">Block Zone</th>
                      <th className="p-4 font-bold">Occupancy status</th>
                      <th className="p-4 font-bold">Dues Status</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {residents.map((res) => (
                        <tr key={res.id} className="border-b border-slate-100 hover:bg-slate-50/50" id={`resident-directory-row-${res.flatNo}`}>
                          <td className="p-4 font-bold text-slate-900 font-mono">
                            {res.flatNo}
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-slate-800">{res.ownerName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{res.ownerEmail}</p>
                          </td>
                          <td className="p-4 text-slate-650 font-medium">
                            Block {res.block}
                          </td>
                          <td className="p-4 text-slate-600">
                        <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 tracking-wide text-[10px]">
                          {res.status}
                        </span>
                          </td>
                          <td className="p-4">
                            <div className="space-y-0.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-sm font-mono font-bold uppercase tracking-wider text-[9px] ${
                              res.duesStatus === "Paid"
                                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                                  : "bg-amber-50 text-amber-800 border border-amber-250 animate-pulse"
                          }`}>
                            {res.duesStatus}
                          </span>
                              {res.duesStatus === "Paid" ? (
                                  <p className="text-[10px] text-slate-400 font-mono">Paid-on: {res.lastPaymentDate || "2026-06-03"}</p>
                              ) : (
                                  <p className="text-[10px] text-rose-500 font-sans">Owing: ₹{res.duesAmount}</p>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button
                                onClick={() => onToggleResidentDues(res.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                                    res.duesStatus === "Paid"
                                        ? "bg-amber-50 text-amber-700 border-amber-250 hover:bg-amber-100"
                                        : "bg-teal-50 text-teal-700 border-teal-250 hover:bg-teal-100"
                                }`}
                            >
                              {res.duesStatus === "Paid" ? "Mark Unpaid" : "Collect & Clear"}
                            </button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>

              </div>
          )}

        </div>
      </div>
  );
}