// const express = require("express");
// const weatherData = require("./weatherData");

// const app = express();
// const PORT = process.env.PORT || 5500;

// app.get("/weather", (req, res) => {
//   const { city } = req.query;

//   if (!city) {
//     return res.status(400).json({ error: "City parameter is required" });
//   }

//   const data = weatherData[city];

//   if (!data) {
//     return res.status(404).json({ error: "City not found" });
//   }

//   res.json({ city, ...data });
// });

// app.listen(PORT, () => {
//   console.log(`Custom Weather API running on port ${PORT}`);
// });

// module.exports = app;

import express from "express";
import weatherData from "./weatherData.js";

const app = express();
const PORT = process.env.PORT || 5500;

app.get("/weather", (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City parameter is required" });
  }

  const normalizedCity = city.toLowerCase();
  const data = Object.keys(weatherData).find(
    (key) => key.toLowerCase() === normalizedCity
  );
  
  if (!data) {
    return res.status(404).json({ error: "City not found" });
  }
  
  res.json({ city: data, ...weatherData[data] });
});

app.listen(PORT, () => {
  console.log(`Custom Weather API running on port ${PORT}`);
});

export default app;
