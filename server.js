require('dotenv').config();
// console.log('Mongo URI:', process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    // Create uploads folder if doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter (optional) - only accept images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Schema for form data (optional)
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Form = mongoose.model('Form', formSchema);



// User schema
const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

// API routes

// Test API
app.get('/api', (req, res) => {
  res.send('Backend API running');
});

// Form submission route (if needed)
app.post('/submit-form', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newFormEntry = new Form({ name, email, message });
    await newFormEntry.save();
    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



// User registration route
app.post('/api/register', async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Please fill all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      full_name,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


//login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Please provide email and password' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: 'Invalid email or password' });


    // Send success response (add token if you implement it)
   res.json({
  message: 'Login successful',
  user: {
    _id: user._id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  }
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//pet

const petSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // link pet to user
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String },
  birthdate: { type: Date },
  gender: { type: String },
  weight: { type: String },
  vaccinationStatus: { type: String },
  allergies: [String],
  medicalHistory: [
    {
      date: Date,
      description: String,
    }
  ],
  photoUrl: { type: String }, // You can store image URL or path here
  createdAt: { type: Date, default: Date.now },
});

const Pet = mongoose.model('Pet', petSchema);

app.post('/api/pets', upload.single('petPhoto'), async (req, res) => {
  try {
    const {
      ownerId,
      name,
      species,
      breed,
      birthdate,
      gender,
      weight,
      vaccinationStatus,
      allergies,
      medicalHistory,
    } = req.body;

    if (!ownerId || !name || !species) {
      return res.status(400).json({ error: 'Owner, pet name and species are required.' });
    }

    // Parse allergies and medicalHistory strings if sent as JSON strings
    const parsedAllergies = allergies ? JSON.parse(allergies) : [];
    const parsedMedicalHistory = medicalHistory ? JSON.parse(medicalHistory) : [];

    let photoUrl = null;
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`; // relative URL for frontend
    }

    const newPet = new Pet({
      ownerId,
      name,
      species,
      breed,
      birthdate,
      gender,
      weight,
      vaccinationStatus,
      allergies: parsedAllergies,
      medicalHistory: parsedMedicalHistory,
      photoUrl,
    });

    await newPet.save();

    res.status(201).json({ message: 'Pet profile created successfully', pet: newPet });
    formData.append('ownerId', loggedInUserId); // loggedInUserId retrieved from localStorage

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


//get pet
app.get('/api/pets/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json({ error: 'Owner ID is required' });
    }

    const pets = await Pet.find({ ownerId }).sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching pets' });
  }
});

//booking

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  petName: { type: String, required: true },
  serviceType: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  notes: { type: String },
  status: { type: String, default: 'submitted' },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model('Booking', bookingSchema);


// generate booking id
function generateBookingId() {
  const date = new Date();
  return `BK${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${Date.now().toString().slice(-5)}`;
}

const { v4: uuidv4 } = require('uuid'); // For unique bookingId, install with npm i uuid

app.post('/api/bookings', async (req, res) => {
  try {
    const {
      ownerId,
      petId,
      petName,
      serviceType,
      date,
      time,
      location,
      paymentMethod,
      notes,
    } = req.body;

    // Validation
    if (!ownerId || !petId || !petName || !serviceType || !date || !time || !location || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Generate bookingId like BK-xxxx-xxxx
    const bookingId = 'BK-' + uuidv4().slice(0, 8).toUpperCase();

    const newBooking = new Booking({
      bookingId,
      ownerId,
      petId,
      petName,
      serviceType,
      date,
      time,
      location,
      paymentMethod,
      notes,
      status: 'submitted',
    });

    await newBooking.save();

    // Create notification
    const newNotification = new Notification({
      ownerId,
      bookingId,
      message: `Booking ${serviceType} for ${petName} has been submitted.`,
    });

    await newNotification.save();

    res.status(201).json({ message: 'Booking submitted successfully', bookingId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



// booking history
app.get('/api/bookings/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params;
    const bookings = await Booking.find({ ownerId })
      .populate('petId')  // This assumes you store `petId` ObjectId in booking schema
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
});


//notification
const notificationSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

// In your server.js (Node.js backend)
app.get('/api/notifications/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params;
    if (!ownerId) return res.status(400).json({ error: 'Owner ID required' });

    const notifications = await Notification.find({ ownerId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching notifications' });
  }
});



app.get('/api/admin/bookings', async (req, res) => {
  try {
    // Fetch all bookings, populate pet info and owner info
    const bookings = await Booking.find({})
      .populate('petId')     // get pet details
      .populate('ownerId')   // get owner user details
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
});

// Assuming Booking model exists and petId & ownerId are refs

app.get('/api/admin/bookings/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find booking by bookingId field, populate petId and ownerId details
    const booking = await Booking.findOne({ bookingId })
      .populate('petId')    // Populate pet details
      .populate('ownerId'); // Populate owner details

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// update status
app.put('/api/admin/bookings/:bookingId/status', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, rejectionReason } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    booking.status = status;
    booking.rejectionReason = status.toLowerCase() === 'rejected' ? rejectionReason || '' : undefined;
    await booking.save();

    // Create notification
    const newNotification = new Notification({
      ownerId: booking.ownerId,
      bookingId,
      message: `Booking ${booking.serviceType} for ${booking.petName} status changed to ${status}.`
    });
    await newNotification.save();

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// admin notification
app.get('/api/admin/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



// profile
app.get('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);  // Assuming User is your model
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Serve frontend static files from 'public' folder
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Catch-all route for frontend (exclude API routes)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
