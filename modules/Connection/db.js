import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_ATLAS}`;

let cachedConnection = null;

//MONGODB FUNCTIONS
async function connect() {
    if (cachedConnection) {
        return cachedConnection;
      }
    
      try {
        const connection = await mongoose.connect(dbUrl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
    
        cachedConnection = connection;
        return connection;
    
      } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error; 
      }
    }


export default connect;