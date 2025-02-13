import dotenv from "dotenv"
import connectDB from './db/index.js';
import {app} from './app.js';

dotenv.config();
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch(error => {
    console.error("MongoDB connection failed", error);
    process.exit(1);
});


/*
import express from 'express';

const app = express();

;(async () => {
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error", (error) => {
           console.error(`Error: ${error}`);
           throw error;
       });

       app.listen(3000, () => {
           console.log(`Server is running on port ${process.env.PORT}`);
       });

    } catch(error) {
        console.error(error);
        throw error;
    }
})

connectDB();

*/