import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import "./db.js"; // Import the DB connection
import usersRouter from "./routes/users.js";
import photographyRoutes from "./routes/photographies.js";
import makeupsRouter from "./routes/makeups.js";
import receptionsRouter from "./routes/receptions.js";
import cateringRouter from "./routes/cateringRouter.js";
import cateringSelectionRouter from "./routes/cateringSelectionRouter.js";
import guestRouter from "./routes/guest.js";
import musicRouter from "./routes/music.js";
import musicOptionRouter from "./routes/musicOption.js";
import userInfoRoutes from './routes/userinfoes.js';
//import venueRouter from "./routes/venueRouter.js";
import venueRoutes from "./routes/venueRoutes.js";
import venueSelectionRouter from './routes/venueSelectionRouter.js';
import galleryRouter from './routes/galleryRouter.js';
import todolistRouter  from './routes/todolist.js';
import shoppingCardRouter from './routes/shoppingCardRouter.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { removeAllFromShoppingCard } from './controllers/shoppingCardController.js'; 

import audioRouter from './routes/audioRouter.js'; // Corrected path
import chatRouter from './routes/chatRouter.js'; // Corrected path
import imageRouter from './routes/imageRouter.js'; // Corrected path

// import errorHandler from './middlewares/errorHandler.js';
// import validateProvider from './middlewares/validateProvider.js';
// import validateMode from './middlewares/validateMode.js';




dotenv.config(); // Load environment variables

// Ensure 'uploads' directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
} 

const app = express();
const PORT = process.env.PORT || 3001;

//app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// Enable CORS for frontend requests


app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173", // Local development frontend
        "https://wedding-planner-2-7htl.onrender.com", // shabnam 
        "https://wedding-planner-1-5n78.onrender.com", // Azadeh
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    },
    credentials: true, // Allow sending cookies if needed
  })
);




// app.use(cors({ origin: '*' }), express.json(), validateProvider, validateMode);


// Setup file upload with Multer

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/users", usersRouter);
app.use("/photographies", photographyRoutes);
app.use("/makeups", makeupsRouter);
app.use("/receptions", receptionsRouter);
app.use("/caterings", cateringRouter);
app.use("/cateringselections", cateringSelectionRouter);
app.use("/guests", guestRouter);
app.use("/musics", musicRouter);
app.use("/musicoptions", musicOptionRouter);
app.use("/userInfoes", userInfoRoutes);
app.use("/venues", venueRoutes);
app.use("/venueSelections", venueSelectionRouter);
app.use("/galleries", galleryRouter);
app.use("/todolist", todolistRouter);
app.use("/shoppingcards", shoppingCardRouter);
app.use('/payment', paymentRoutes);

app.get('/cancel', (req, res) => {
  res.send('Payment was canceled. Please try again.');
});
app.get('/success', async (req, res) => {
  const sessionId = req.query.session_id;
  const userId = req.query.user_id;  // Assuming user_id is passed in the query to identify the user

  try {
    // Handle payment confirmation by checking the session ID (or any other logic you want to use)
    // After successful payment, remove items from shopping card and related services
    await removeAllFromShoppingCard({ userID: userId });

    res.send(`Payment successful, session ID: ${sessionId}. Your services have been removed from the cart.`);
  } catch (error) {
    console.error('Error during success handler:', error);
    res.status(500).send('Failed to clear shopping card and services after payment.');
  }
});


app.use('/v1/audio/speech', audioRouter);
app.use('/v1/chat/completions', chatRouter);
app.use('/v1/images/generations', imageRouter);
// app.use(errorHandler);


app.get("/", (req, res) => {
  console.log(`Unhandled request: ${req.method} ${req.url}`);
  res.status(404).send("Not found");
});

app.listen(PORT, () => {
  console.log(`Server with Database is listening on http://localhost:${PORT}`);
});