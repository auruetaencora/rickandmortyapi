const axios = require("axios");

require("dotenv").config();

const BASE_URL = process.env.API_URL;

if (!BASE_URL) {
  throw new Error("API_URL is not defined");
}

const fetchData = async (arrayParam) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${JSON.stringify(arrayParam)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error("Error getting the information");
  }
};

module.exports = {
  fetchData,
};
