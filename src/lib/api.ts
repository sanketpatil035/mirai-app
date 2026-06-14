import { Notice, Complaint, AmenityBooking, ResidentUnit, ComplaintStatus } from "../types";

const API_BASE = "/api";

// Helper for fetch with an optional small timeout to check if API is alive
async function fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number } = {}): Promise<Response> {
    const { timeout = 5000, ...fetchOptions } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
        ...fetchOptions,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

export const api = {
    /**
     * Probes if the Spring Boot backend is active.
     */
    async checkBackendStatus(): Promise<boolean> {
        try {
            const res = await fetchWithTimeout(`${API_BASE}/notices`, { method: "GET", timeout: 1500 });
            const contentType = res.headers.get("content-type") || "";
            return res.ok && contentType.includes("application/json");
        } catch {
            return false;
        }
    },

    // --- NOTICES ---
    async getNotices(): Promise<Notice[]> {
        const res = await fetch(`${API_BASE}/notices`);
        if (!res.ok) throw new Error("Failed to fetch notices");
        return res.json();
    },

    async createNotice(notice: Notice): Promise<Notice> {
        const res = await fetch(`${API_BASE}/notices`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notice),
        });
        if (!res.ok) throw new Error("Failed to create notice");
        return res.json();
    },

    async deleteNotice(id: string): Promise<void> {
        const res = await fetch(`${API_BASE}/notices/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete notice");
    },

    // --- COMPLAINTS ---
    async getComplaints(): Promise<Complaint[]> {
        const res = await fetch(`${API_BASE}/complaints`);
        if (!res.ok) throw new Error("Failed to fetch complaints");
        return res.json();
    },

    async getComplaintsByFlat(flatNo: string): Promise<Complaint[]> {
        const res = await fetch(`${API_BASE}/complaints/flat/${flatNo}`);
        if (!res.ok) throw new Error("Failed to fetch complaints for flat: " + flatNo);
        return res.json();
    },

    async createComplaint(complaint: Complaint): Promise<Complaint> {
        const res = await fetch(`${API_BASE}/complaints`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(complaint),
        });
        if (!res.ok) throw new Error("Failed to create complaint");
        return res.json();
    },

    async updateComplaintStatus(id: string, status: ComplaintStatus): Promise<Complaint> {
        const res = await fetch(`${API_BASE}/complaints/${id}/status?status=${encodeURIComponent(status)}`, {
            method: "PATCH",
        });
        if (!res.ok) throw new Error("Failed to update complaint status");
        return res.json();
    },

    async updateComplaintRemarks(id: string, remarks: string): Promise<Complaint> {
        const res = await fetch(`${API_BASE}/complaints/${id}/remarks`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(remarks), // sends as raw string
        });
        if (!res.ok) throw new Error("Failed to update complaint remarks");
        return res.json();
    },

    // --- AMENITY BOOKINGS ---
    async getBookings(): Promise<AmenityBooking[]> {
        const res = await fetch(`${API_BASE}/bookings`);
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return res.json();
    },

    async getBookingsByFlat(flatNo: string): Promise<AmenityBooking[]> {
        const res = await fetch(`${API_BASE}/bookings/flat/${flatNo}`);
        if (!res.ok) throw new Error("Failed to fetch bookings for flat: " + flatNo);
        return res.json();
    },

    async createBooking(booking: AmenityBooking): Promise<AmenityBooking> {
        const res = await fetch(`${API_BASE}/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(booking),
        });
        if (!res.ok) throw new Error("Failed to create booking");
        return res.json();
    },

    async updateBookingStatus(id: string, status: "Approved" | "Rejected"): Promise<AmenityBooking> {
        const res = await fetch(`${API_BASE}/bookings/${id}/status?status=${status}`, {
            method: "PATCH",
        });
        if (!res.ok) throw new Error("Failed to update booking status");
        return res.json();
    },

    // --- RESIDENTS ---
    async getResidents(): Promise<ResidentUnit[]> {
        const res = await fetch(`${API_BASE}/residents`);
        if (!res.ok) throw new Error("Failed to fetch residents");
        return res.json();
    },

    async getResidentByFlat(flatNo: string): Promise<ResidentUnit> {
        const res = await fetch(`${API_BASE}/residents/flat/${flatNo}`);
        if (!res.ok) throw new Error("Failed to fetch resident details for flat: " + flatNo);
        return res.json();
    },

    async loginResident(flatNo: string, password: string): Promise<ResidentUnit> {
        const res = await fetch(`${API_BASE}/residents/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ flatNo, password })
        });
        if (!res.ok) {
            const errMsg = await res.text();
            throw new Error(errMsg || "Failed to log in");
        }
        return res.json();
    },

    enrollResidentUnit: async (unit: ResidentUnit): Promise<ResidentUnit> => {
        const res = await fetch(`${API_BASE}/residents`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(unit),
        });
        if (!res.ok) throw new Error("Failed to enroll resident unit");
        return res.json();
    },

    async toggleResidentDues(id: string): Promise<ResidentUnit> {
        const res = await fetch(`${API_BASE}/residents/${id}/toggle-dues`, {
            method: "PATCH",
        });
        if (!res.ok) throw new Error("Failed to toggle resident dues status");
        return res.json();
    },

    async payResidentDues(id: string): Promise<ResidentUnit> {
        const res = await fetch(`${API_BASE}/residents/${id}/pay`, {
            method: "POST",
        });
        if (!res.ok) throw new Error("Failed to process payment");
        return res.json();
    }
};
