const externalApiService = require("../services/characterService");
const {
  readCharacters,
  writeCharacters,
  readDeleted,
  writeDeleted,
} = require("../utils/characterInformation");

const getAndSaveCharacters = async (req, res) => {
  const { number } = req.params;

  const arrayParam = [];
  for (let i = 1; i <= Number(number); i++) {
    arrayParam.push(i);
  }

  try {
    const apiData = await externalApiService.fetchData(arrayParam);

    const data = apiData.map((item) => ({ ...item, deleted: false }));

    writeCharacters(data);
    writeDeleted({ deleted: [], undos: [] });

    res
      .status(200)
      .json({ message: "Data fetched and saved successfully", data: data });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Error fetching data from external API" });
  }
};

const readAndSortCharacters = async (req, res) => {
  try {
    const data = readCharacters();

    const sortedData = data.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

    res
      .status(200)
      .json({ message: "Data sorted successfully", data: sortedData });
  } catch (error) {
    res.status(500).json({ error: "Error reading or sorting data" });
  }
};

const deleteCharacter = async (req, res) => {
  const { id } = req.params;

  try {
    let data = readCharacters();

    const characterIndex = data.findIndex(
      (char) => char.id === parseInt(id) && char.deleted !== true
    );
    if (characterIndex === -1) {
      return res.status(404).json({ error: "Character not found" });
    }
    data[characterIndex].deleted = true;

    writeCharacters(data);

    let deletedData = readDeleted();

    console.log(deletedData);

    deletedData.deleted.push(id);

    writeDeleted(deletedData);

    res.status(200).json({ message: `Character with ID ${id} deleted` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting character" });
  }
};

const undoDelete = async (req, res) => {
  try {
    let deletedData = readDeleted();
    const lastDeletedId = deletedData.deleted.pop();

    if (!lastDeletedId) {
      return res.status(404).json({ error: "No characters to undo" });
    }

    let data = readCharacters();
    const characterIndex = data.findIndex(
      (char) => char.id === parseInt(lastDeletedId) && char.deleted === true
    );
    if (characterIndex === -1) {
      return res.status(404).json({ error: "Character not found" });
    }

    data[characterIndex].deleted = false;
    writeCharacters(data);

    deletedData.undos.push(lastDeletedId);
    writeDeleted(deletedData);

    res.status(200).json({ message: `Character restored successfully` });
  } catch (error) {
    res.status(500).json({ error: "Error undoing delete" });
  }
};

const redoDelete = async (req, res) => {
  try {
    let deletedData = readDeleted();
    const lastUndoId = deletedData.undos.pop();

    if (!lastUndoId) {
      return res.status(404).json({ error: "No characters to redo" });
    }

    let data = readCharacters();
    const characterIndex = data.findIndex(
      (char) => char.id === parseInt(lastUndoId) && char.deleted === false
    );
    if (characterIndex === -1) {
      return res.status(404).json({ error: "Character not found" });
    }

    data[characterIndex].deleted = true;
    writeCharacters(data);

    deletedData.deleted.push(lastUndoId);
    writeDeleted(deletedData);

    res.status(200).json({
      message: `Character re-deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error redoing delete" });
  }
};

module.exports = {
  getAndSaveCharacters,
  readAndSortCharacters,
  deleteCharacter,
  undoDelete,
  redoDelete,
};
