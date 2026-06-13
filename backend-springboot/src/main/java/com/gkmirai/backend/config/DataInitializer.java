package com.gkmirai.backend.config;

import com.gkmirai.backend.model.*;
import com.gkmirai.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private AmenityBookingRepository bookingRepository;

    @Autowired
    private ResidentUnitRepository residentUnitRepository;

    @Override
    public void run(String... args) throws Exception {
        seedFacilities();
        seedNotices();
        seedComplaints();
        seedBookings();
        seedResidentUnits();
        System.out.println(">>> Seed Data successfully executed on H2 Database! <<<");
    }

    private void seedFacilities() {
        if (facilityRepository.count() == 0) {
            facilityRepository.save(Facility.builder()
                    .id("clubhouse")
                    .name("Mirai Grand Clubhouse")
                    .description("Our state-of-the-art multi-purpose clubhouse designed for celebrations, meetings, and community gatherings. Features luxury indoor games and private lounge seating.")
                    .capacity("150 guests")
                    .location("Block B, Ground Floor")
                    .operatingHours("07:00 AM - 10:00 PM")
                    .imageUrl("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80")
                    .features(Arrays.asList("Fully Air-Conditioned", "Premium Audio-Visual System", "Attached Catering Kitchen", "Executive Boardroom Lounge"))
                    .build());

            facilityRepository.save(Facility.builder()
                    .id("pool")
                    .name("Oasis Infinia Pool")
                    .description("An Olympic-size infinity swimming pool with temperature control, children's safe paddling pool, and wooden sun-deck chairs for relaxation.")
                    .capacity("50 swimmers")
                    .location("Central Courtyard")
                    .operatingHours("06:00 AM - 09:00 PM")
                    .imageUrl("https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80")
                    .features(Arrays.asList("Temperature Controlled water", "Separate Kids Padding Pool", "Certified Lifeguard on Duty", "Locker & Shower Rooms"))
                    .build());

            facilityRepository.save(Facility.builder()
                    .id("gym")
                    .name("FitVerse Gymnasium")
                    .description("A premium fitness arena equipped with professional cardio machines, heavy-duty free weights, and cross-fit sections guided by personal trainers.")
                    .capacity("35 athletes")
                    .location("Block C, 1st Floor")
                    .operatingHours("05:00 AM - 10:00 PM")
                    .imageUrl("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80")
                    .features(Arrays.asList("Premium Technogym Equipment", "Dedicated Yoga & Pilates Zone", "Steam & Sauna Rooms", "Certified Fitness Instructors"))
                    .build());

            facilityRepository.save(Facility.builder()
                    .id("tennis")
                    .name("Mirai Arena Tennis Court")
                    .description("A professional-grade synthetic lawn-tennis court with flood-lights for night matches, spectator seating benches, and equipment rentals.")
                    .capacity("4 players")
                    .location("North Sports Wing")
                    .operatingHours("06:00 AM - 09:30 PM")
                    .imageUrl("https://images.unsplash.com/photo-1622279457486-62dcc4a4b1ca?auto=format&fit=crop&w=800&q=80")
                    .features(Arrays.asList("Professional Acrylic Synthetic Surface", "High-Intensity LED Floodlights", "Racquets & Balls Rental", "Pre-booking Calendar Sync"))
                    .build());

            facilityRepository.save(Facility.builder()
                    .id("lounge")
                    .name("Nexus Co-Working Lounge")
                    .description("A quiet, aesthetically designed business center and co-working lounge for remote professionals. Perfect for video calls and focus work.")
                    .capacity("25 workstations")
                    .location("Block A, Lobby")
                    .operatingHours("08:00 AM - 11:00 PM")
                    .imageUrl("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80")
                    .features(Arrays.asList("Dual-Band Gigabit Wi-Fi", "Ergonomic Chairs", "Coffee & Tea Bar", "Soundproof Zoom Phone Booths"))
                    .build());
        }
    }

    private void seedNotices() {
        if (noticeRepository.count() == 0) {
            noticeRepository.save(Notice.builder()
                    .id("not-1")
                    .title("15th Annual General Meeting (AGM) Call")
                    .description("Notice is hereby given that the 15th Annual General Body Meeting of the Residents of GK Mirai will be held at the Grand Clubhouse on Sunday, June 20th, 2026 at 10:00 AM. Please find the detailed agenda attached. Main discussion points include solar power transition, security vendor review, and budget election for FY 2026-27.")
                    .category("Meeting")
                    .date("2026-06-12")
                    .author("GK Mirai Managing Committee")
                    .urgent(true)
                    .build());

            noticeRepository.save(Notice.builder()
                    .id("not-2")
                    .title("Eco-Friendly Solar Panel Installation Starting")
                    .description("We are thrilled to launch GK Mirai's Clean Energy Initiative ! Starting Monday, solar panel grids will be installed on the terrace roofs of Block A and Block B. Work will run from 9:00 AM to 5:00 PM. No heavy power cuts are planned, but minor drilling noises might occur. Please cooperate for a sustainable green tomorrow.")
                    .category("General")
                    .date("2026-06-10")
                    .author("Green Committee")
                    .urgent(false)
                    .build());

            noticeRepository.save(Notice.builder()
                    .id("not-3")
                    .title("Scheduled Overhead Water Tank Cleaning (Blocks C & D)")
                    .description("The periodic high-pressure washing and disinfection of overhead water storage tanks for Block C and Block D is scheduled for June 15th (Monday) between 10:00 AM and 04:00 PM. Water supply will remain suspended during these hours. Please store sufficient water in advance. Thank you.")
                    .category("Maintenance")
                    .date("2026-06-08")
                    .author("Maintenance Office")
                    .urgent(true)
                    .build());

            noticeRepository.save(Notice.builder()
                    .id("not-4")
                    .title("Smart Visitor RFID Gate Pass Upgrades")
                    .description("To boost community security, we are transitioning all visitors and housekeeper registrations to RFID-based automated QR scanners. Please ensure you download the resident App upgrade, list down your regular staff members & guests, and generate guest passes easily. Starting June 22nd, guard gating will mandate QR verification.")
                    .category("Security")
                    .date("2026-06-05")
                    .author("Security Head")
                    .urgent(false)
                    .build());

            noticeRepository.save(Notice.builder()
                    .id("not-5")
                    .title("Monsoon Wellness Yoga and Pilates Camp")
                    .description("Join your fellow neighbors of GK Mirai for a rejuvenating 7-day Monsoon Wellness Yoga & Pilates Workshop led by international instructors. Set up in the Pool Deck Garden every morning from 06:15 AM to 07:30 AM. Strictly free for all residents of GK Mirai. Kids welcome!")
                    .category("Event")
                    .date("2026-06-02")
                    .author("Spiritual & Social Cults")
                    .urgent(false)
                    .build());
        }
    }

    private void seedComplaints() {
        if (complaintRepository.count() == 0) {
            complaintRepository.save(Complaint.builder()
                    .id("comp-1")
                    .title("CCTV Blindspot Near Block B Basement Elevator")
                    .description("The security camera installed at Block B Basement parking zone-2 doesn't cover the elevators' lobby corner, leaving a blank spot where cars turn. Highly risky as children gather there.")
                    .category("Security")
                    .status("In Progress")
                    .raisedBy("Aravind Sharma")
                    .raisedByFlat("B-403")
                    .dateRaised("2026-06-11")
                    .urgency("High")
                    .adminRemarks("Assigned to Security Vendor 'SecureGuard'. New camera positioning adjustment is being done this Saturday.")
                    .build());

            complaintRepository.save(Complaint.builder()
                    .id("comp-2")
                    .title("Flickering Overhead Corridors Lights on 3rd Floor")
                    .description("The smart LED tubes outside flat C-302 and C-304 have been flickering constantly since last morning, causing strong visual distress to senior citizens walking in evening hours.")
                    .category("Electrical")
                    .status("Pending")
                    .raisedBy("Sunita Sen")
                    .raisedByFlat("C-302")
                    .dateRaised("2026-06-12")
                    .urgency("Medium")
                    .build());

            complaintRepository.save(Complaint.builder()
                    .id("comp-3")
                    .title("Water Seepage from Terrace in Block D Corridor")
                    .description("Visible water spots and moisture drippings are spreading in the public common passageway at Block D's top level (6th floor) near the utility duct doorway. Needs rapid attention.")
                    .category("Plumbing")
                    .status("Resolved")
                    .raisedBy("Kabir Mehra")
                    .raisedByFlat("D-601")
                    .dateRaised("2026-06-03")
                    .urgency("High")
                    .adminRemarks("Waterproofing team completed sealant injection on June 5th. No further logs of seeping water recorded.")
                    .build());

            complaintRepository.save(Complaint.builder()
                    .id("comp-4")
                    .title("Unauthorized Vehicle Parked on Spot A-12")
                    .description("An unfamiliar black SUV has been parked in my designated personal parking slot A-12 for the last two days. Security guard wasn't aware who it belongs to.")
                    .category("Parking")
                    .status("Resolved")
                    .raisedBy("Deepika Padukone")
                    .raisedByFlat("A-102")
                    .dateRaised("2026-06-01")
                    .urgency("Medium")
                    .adminRemarks("Identified vehicle as temporary guest of B-201. Vehicle was moved to the guest parking section.")
                    .build());
        }
    }

    private void seedBookings() {
        if (bookingRepository.count() == 0) {
            bookingRepository.save(AmenityBooking.builder()
                    .id("book-1")
                    .amenityId("clubhouse")
                    .amenityName("Mirai Grand Clubhouse")
                    .bookedBy("Siddharth Malhotra")
                    .bookedByFlat("C-504")
                    .date("2026-06-18")
                    .timeSlot("06:00 PM - 10:00 PM")
                    .status("Approved")
                    .guestsCount(45)
                    .bookedAt("2026-06-10 11:21 AM")
                    .build());

            bookingRepository.save(AmenityBooking.builder()
                    .id("book-2")
                    .amenityId("tennis")
                    .amenityName("Mirai Arena Tennis Court")
                    .bookedBy("Rahul Dravid")
                    .bookedByFlat("A-201")
                    .date("2026-06-14")
                    .timeSlot("07:00 AM - 09:00 AM")
                    .status("Approved")
                    .guestsCount(2)
                    .bookedAt("2026-06-12 04:15 PM")
                    .build());

            bookingRepository.save(AmenityBooking.builder()
                    .id("book-3")
                    .amenityId("gym")
                    .amenityName("FitVerse Gymnasium")
                    .bookedBy("Zara Khan")
                    .bookedByFlat("D-102")
                    .date("2026-06-15")
                    .timeSlot("08:00 AM - 09:30 AM")
                    .status("Pending")
                    .guestsCount(1)
                    .bookedAt("2026-06-13 09:12 AM")
                    .build());
        }
    }

    private void seedResidentUnits() {
        if (residentUnitRepository.count() == 0) {
            residentUnitRepository.save(ResidentUnit.builder()
                    .id("u-1")
                    .flatNo("A-101")
                    .block("A")
                    .ownerName("Anil Ambani")
                    .ownerEmail("anil@mirai.com")
                    .status("Owner")
                    .duesStatus("Paid")
                    .duesAmount(4500)
                    .lastPaymentDate("2026-06-02")
                    .build());

            residentUnitRepository.save(ResidentUnit.builder()
                    .id("u-2")
                    .flatNo("A-102")
                    .block("A")
                    .ownerName("Deepika Padukone")
                    .ownerEmail("deepika@mirai.com")
                    .status("Owner")
                    .duesStatus("Paid")
                    .duesAmount(4500)
                    .lastPaymentDate("2026-06-03")
                    .build());

            residentUnitRepository.save(ResidentUnit.builder()
                    .id("u-3")
                    .flatNo("A-201")
                    .block("A")
                    .ownerName("Rahul Dravid")
                    .ownerEmail("rahul@mirai.com")
                    .status("Owner")
                    .duesStatus("Paid")
                    .duesAmount(4500)
                    .lastPaymentDate("2026-06-01")
                    .build());

            residentUnitRepository.save(ResidentUnit.builder()
                    .id("u-4")
                    .flatNo("B-403")
                    .block("B")
                    .ownerName("Aravind Sharma")
                    .ownerEmail("aravind@mirai.com")
                    .status("Owner")
                    .duesStatus("Unpaid")
                    .duesAmount(5200)
                    .build());

            residentUnitRepository.save(ResidentUnit.builder()
                    .id("u-5")
                    .flatNo("C-302")
                    .block("C")
                    .ownerName("Sunita Sen")
                    .ownerEmail("sunita@mirai.com")
                    .status("Tenant")
                    .duesStatus("Unpaid")
                    .duesAmount(4800)
                    .build());

            residentUnitRepository.save(ResidentUnit.builder()
                    .id("u-6")
                    .flatNo("C-504")
                    .block("C")
                    .ownerName("Siddharth Malhotra")
                    .ownerEmail("siddharth@mirai.com")
                    .status("Owner")
                    .duesStatus("Paid")
                    .duesAmount(4800)
                    .lastPaymentDate("2026-06-05")
                    .build());

            residentUnitRepository.save(ResidentUnit.builder()
                    .id("u-7")
                    .flatNo("D-102")
                    .block("D")
                    .ownerName("Zara Khan")
                    .ownerEmail("zara@mirai.com")
                    .status("Tenant")
                    .duesStatus("Unpaid")
                    .duesAmount(4200)
                    .build());

            residentUnitRepository.save(ResidentUnit.builder()
                    .id("u-8")
                    .flatNo("D-601")
                    .block("D")
                    .ownerName("Kabir Mehra")
                    .ownerEmail("kabir@mirai.com")
                    .status("Owner")
                    .duesStatus("Paid")
                    .duesAmount(4200)
                    .lastPaymentDate("2026-06-04")
                    .build());
        }
    }
}
