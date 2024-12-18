const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data.json");

const readCharacters = () => {
  try {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return {
      n: 0,
      currentNumberCharacters: 0,
      deleted: [],
      undos: [],
      characters: [],
    };
  }
};

const writeCharacters = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Error al escribir en el archivo JSON");
  }
};

// const readDeleted = () => {
//   try {
//     const data = fs.readFileSync(deletedFilePath, "utf-8");
//     return JSON.parse(data);
//   } catch (error) {
//     return { deleted: [], undos: [] };
//   }
// };

// const writeDeleted = (data) => {
//   try {
//     fs.writeFileSync(deletedFilePath, JSON.stringify(data, null, 2));
//   } catch (error) {
//     throw new Error("Error al escribir en el archivo JSON");
//   }
// };

module.exports = {
  readCharacters,
  writeCharacters,
  // readDeleted,
  // writeDeleted,
};
