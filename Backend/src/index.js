import express from 'express'
import connectDB from './database/db.database.js'
import nutritionRouter from './routes/nutrition.routes.js'
import userRouter from './routes/user.routes.js'
import statsRouter from './routes/stats.routes.js'
import progressRouter from './routes/progress.routes.js'

import dotenv from "dotenv"
dotenv.config({
  path: './.env'
})

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Custom CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use('/api/v1/nutrition', nutritionRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/stats', statsRouter)
app.use('/api/v1/progress', progressRouter)

// Fallback for unmatched routes (404 Error)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "This endpoint does not exist (404 Error)"
  });
});

connectDB()
.then(()=>{
  app.listen(process.env.PORT || 3000, () => {
      console.log(`server is running on port ${process.env.PORT || 3000}`);
    });
})
.catch((err)=>{
  console.log("Mongo DB connection failed!!!",err)
})

