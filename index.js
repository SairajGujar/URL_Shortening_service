import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import ShortUniqueId from "short-unique-id";
import dbConnect from "./config/dbConnect.js";
dotenv.config();
const app = express();
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  accessCount:{
    type:Number,
    default:0
  }
});
const Url = mongoose.model('Url', urlSchema);
const uid = new ShortUniqueId({ length: 10 });

app.use(bodyParser.json());

app.post("/shorten", async (req, res) => {
  try {
    const { url } = req.body;
    const uniqueId = uid.rnd();
    const newUrl = new Url({
        originalUrl: url,
        shortUrl:uniqueId,
      })
    await newUrl.save();
    return res.status(201).json(process.env.BASE+"/"+uniqueId);
  } catch (error) {
    console.log(error.message);
    return res.status(500);
  }
});

app.get("/:short", async (req, res) => {
    try {
      const { short } = req.params;
  
      const url = await Url.findOne({ shortUrl: short });
        url.accessCount+=1;
        await Url.updateOne({shortUrl: short, accessCount: url.accessCount})
      if (url) {
        console.log("URL found, redirecting...");
        return res.redirect(url.originalUrl);
      } else {
        console.log("URL not found");
        return res.status(404).json({ error: "URL not found" });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
app.listen(process.env.PORT, () => {
  dbConnect();
  console.log(`app listening on port ${process.env.PORT}`);
});
