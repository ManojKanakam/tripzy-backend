const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());


// In-memory storage - simple arrays
let bookings = [];
let bookingCounter = 1;

// Hardcoded trip data
const trips = [
  {
    id: 1,
    title: "Mountain Adventure",
    description: "Explore scenic mountain trails and enjoy breathtaking views. Perfect for nature lovers and adventure seekers.",
    price: 2999,
    duration: "3 days",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
  },
  {
    id: 2,
    title: "Beach Paradise",
    description: "Relax on pristine beaches and enjoy water sports. Includes surfing lessons and beachside dining.",
    price: 2499,
    duration: "2 days",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"
  },
  {
    id: 3,
    title: "City Explorer",
    description: "Discover urban attractions, museums, and local cuisine. Perfect for culture enthusiasts.",
    price: 1999,
    duration: "1 day",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400"
  },
  {
    id: 4,
    title: "Forest Retreat",
    description: "Immerse yourself in tranquil forests with hiking trails and wildlife spotting opportunities.",
    price: 3499,
    duration: "4 days",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"
  },
  {
    id: 5,
    title: "Desert Safari",
    description: "Experience the magic of desert landscapes with camel rides and stargazing sessions.",
    price: 3999,
    duration: "3 days",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400"
  }
];

// Routes

// Get all trips
app.get('/api/trips', (req, res) => {
  res.json(trips);
});

// Check availability
app.post('/api/check-availability', (req, res) => {
  const { date } = req.body;
  
  // Count bookings for this date
  const bookingsForDate = bookings.filter(b => b.date === date).length;
  const available = bookingsForDate < 5;
  
  res.json({ 
    available, 
    availableVans: 5 - bookingsForDate,
    totalVans: 5,
    bookedVans: bookingsForDate
  });
});

// Create booking
app.post('/api/bookings', (req, res) => {
  const { tripId, userName, userEmail, date } = req.body;

  
  // Find trip
  const trip = trips.find(t => t.id === parseInt(tripId));
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  
  // Check availability
  const bookingsForDate = bookings.filter(b => b.date === date).length;
  if (bookingsForDate >= 5) {
    return res.status(400).json({ error: 'No vans available for the selected date. Please choose another date.' });
  }
  
  // Create booking
  const newBooking = {
    id: `booking-${bookingCounter++}`,
    tripId: parseInt(tripId),
    tripName: trip.title,
    userName,
    userEmail,
    date,
    price: trip.price,
    status: 'confirmed',
    bookingDate: new Date().toISOString()
  };
  
  bookings.push(newBooking);

  console.log("Booking stored in backend:");
  console.log(bookings);
  
  res.json({ 
    message: 'Booking created successfully',
    booking: newBooking
  });
});

// Get all bookings (admin)
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});


// Get booking by ID  
app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json(booking);
});

// Update booking status
app.put('/api/bookings/:id', (req, res) => {
  const { status } = req.body;
  const booking = bookings.find(b => b.id === req.params.id);
  
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  
  booking.status = status;
  res.json({ message: 'Booking updated', booking });
});

// Delete booking
app.delete('/api/bookings/:id', (req, res) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  
  const deleted = bookings.splice(index, 1)[0];
  res.json({ message: 'Booking deleted', booking: deleted });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
