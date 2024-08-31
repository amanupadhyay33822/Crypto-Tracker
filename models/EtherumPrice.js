// models/EthereumPrice.js
const mongoose = require("mongoose");

const ethereumPriceSchema = new mongoose.Schema({
  timestamp: 
  { type: Date, default: Date.now 

  },
  priceInINR: 
  { type: Number, required: true 
    
  },
});

const EthereumPrice = mongoose.model("EthereumPrice", ethereumPriceSchema);
module.exports = EthereumPrice;
