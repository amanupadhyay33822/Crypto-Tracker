const EthereumPrice = require("../models/EtherumPrice");
const User = require("../models/UserModal");
const axios = require("axios");
require('dotenv').config({})
const getUser = async (req, res) => {
  try {
    const address = req.params.address;
    let existingData = await User.findOne({ address });
    if (existingData) {
      return res.json({
        message: "address already exists",
      });
    }
     const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=asc&apikey=${process.env.API_KEY}`;
    const response = await axios.get(url);
    const transactions = response.data.result;
   
    const user = new User({
      address: address,
    });

 
    // Save the user to the database
    await user.save();
     // Storing the array of transactions
    await User.findOneAndUpdate(
      {address: address},
      {
        $push:{transcations:transactions}
      }
    )
    return res.json({
      response: response.data.result,
    })
    
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const fetchAndStoreEthereumPrice = async (req,res) => {
  try {
    // Fetch the Ethereum price from CoinGecko API
   
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr";
    const response = await axios.get(url);
  
    const priceInINR = response.data.ethereum.inr;

    // Create a new EthereumPrice document
    const ethereumPrice = new EthereumPrice({
      priceInINR: priceInINR,
    });

    // Save the document to the database
    await ethereumPrice.save();
    console.log(`Ethereum price stored successfully: ${priceInINR} INR`);
    
  } catch (error) {
    console.error("Error fetching and storing Ethereum price:", error.message);
  }
};

const getUserExpensesAndPrice = async (req, res) => {
  try {
    const address = req.params.address;

    // Fetch the user's transactions from the database
    const user = await User.findOne({ address });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate total expenses
    let totalExpenses = 0;
    user.transcations.forEach(transaction => {
      const gasUsed = parseFloat(transaction.gasUsed);
      const gasPrice = parseFloat(transaction.gasPrice);
      totalExpenses += (gasUsed * gasPrice) / 1e18;
    });

    // Fetch the current price of Ether from CoinGecko API
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr";
    const response = await axios.get(url);
    const priceInINR = response.data.ethereum.inr;

    // Return the results
    return res.json({
      totalExpenses: totalExpenses.toFixed(6), // Formatting for readability
      currentPriceInINR: priceInINR,
    });
  } catch (error) {
    console.error("Error fetching user data or price:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


module.exports = {getUser,fetchAndStoreEthereumPrice,getUserExpensesAndPrice};