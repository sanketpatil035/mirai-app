package com.gkmirai.backend.controller;

import com.gkmirai.backend.model.AmenityBooking;
import com.gkmirai.backend.repository.AmenityBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/bookings")
public class AmenityBookingController {

    @Autowired
    private AmenityBookingRepository bookingRepository;

    @GetMapping
    public List<AmenityBooking> getAllBookings() {
        return bookingRepository.findAllByOrderByBookedAtDesc();
    }

    @GetMapping("/flat/{flatNo}")
    public List<AmenityBooking> getBookingsByFlat(@PathVariable String flatNo) {
        return bookingRepository.findAllByBookedByFlatOrderByBookedAtDesc(flatNo);
    }

    @PostMapping
    public AmenityBooking createBooking(@RequestBody AmenityBooking booking) {
        if (booking.getId() == null || booking.getId().isEmpty()) {
            booking.setId("book-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (booking.getStatus() == null || booking.getStatus().isEmpty()) {
            booking.setStatus("Pending");
        }
        if (booking.getBookedAt() == null || booking.getBookedAt().isEmpty()) {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a");
            booking.setBookedAt(LocalDateTime.now().format(dtf));
        }
        return bookingRepository.save(booking);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AmenityBooking> updateBookingStatus(@PathVariable String id, @RequestParam String status) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    booking.setStatus(status);
                    return ResponseEntity.ok(bookingRepository.save(booking));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
