const express = require('express');
const cron = require("node-cron");
const { connectDb } = require('./db/dbConfig');
const userRouter= require("./routes/UserRoute");
const app = express();
const { fetchAndStoreEthereumPrice } = require("./controller/User");
app.use(express.json())

const PORT = 3000;
connectDb();


app.use("/user",userRouter);





cron.schedule("*/10 * * * *", () => {
    console.log("Fetching and storing Ethereum price...");
    fetchAndStoreEthereumPrice();
  });
app.get("/",(req,res)=>{
  res.send("Backend is live")
})
app.listen(PORT,(req,res)=>{
    console.log(`listening on ${PORT}`);
})