const externalApiService = require("../services/characterService");
const {
  readCharacters,
  writeCharacters,
} = require("../utils/characterInformation");

const getAndSaveCharacters = async (req, res) => {
  const { number } = req.params;

  try {
    const currentData = readCharacters();
    let start = 1;

    if (Number(number) > currentData.currentNumberCharacters) {
      start = currentData.n > 0 ? currentData.n + 1 : 1;
      const data = {
        n: Number(number) > currentData.n ? Number(number) : currentData.n,
        currentNumberCharacters: Number(number) - currentData.deleted.length,
        deleted: currentData.deleted,
        undos: currentData.undos,
        characters: currentData.characters,
      };

      const arrayParam = [];
      for (
        let i = start;
        i <= Number(number) + currentData.deleted.length;
        i++
      ) {
        arrayParam.push(i);
      }

      const apiData = await externalApiService.fetchData(arrayParam);

      const characters = apiData.map((item) => ({ ...item, deleted: false }));

      characters.forEach((char) => {
        data.characters.push(char);
      });

      writeCharacters(data);

      let counter = 0;
      const response = data.characters.filter((char) => {
        if (!char.deleted && counter < Number(number)) {
          counter++;
          return true;
        }
      });

      res
        .status(200)
        .json({ message: "Data fetched successfully", data: response });
    } else {
      let counter = 0;
      const response = currentData.characters.filter((char) => {
        if (!char.deleted && counter < Number(number)) {
          counter++;
          return true;
        }
      });

      res
        .status(200)
        .json({ message: "Data fetched successfully", data: response });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Error fetching data from external API" });
  }
};

const readAndSortCharacters = async (req, res) => {
  try {
    const data = readCharacters();

    const sortedData = data.characters.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

    const response = sortedData.filter((char, index) => !char.deleted);

    res
      .status(200)
      .json({ message: "Data sorted successfully", data: response });
  } catch (error) {
    res.status(500).json({ error: "Error reading or sorting data" });
  }
};

const deleteCharacter = async (req, res) => {
  const { id } = req.params;

  try {
    let data = readCharacters();

    const characterIndex = data.characters.findIndex(
      (char) => char.id === parseInt(id) && char.deleted !== true
    );
    if (characterIndex === -1) {
      return res.status(404).json({ error: "Character not found" });
    }
    data.characters[characterIndex].deleted = true;

    data.deleted.push(id);
    data.currentNumberCharacters--;

    writeCharacters(data);

    res.status(200).json({ message: `Character with ID ${id} deleted` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting character" });
  }
};

const undoDelete = async (req, res) => {
  try {
    let data = readCharacters();
    const lastDeletedId = data.deleted.pop();

    if (!lastDeletedId) {
      return res.status(404).json({ error: "No characters to undo" });
    }

    const characterIndex = data.characters.findIndex(
      (char) => char.id === parseInt(lastDeletedId) && char.deleted === true
    );
    if (characterIndex === -1) {
      return res.status(404).json({ error: "Character not found" });
    }

    data.characters[characterIndex].deleted = false;

    data.undos.push(lastDeletedId);
    data.currentNumberCharacters++;

    writeCharacters(data);

    res.status(200).json({ message: `Character restored successfully` });
  } catch (error) {
    res.status(500).json({ error: "Error undoing delete" });
  }
};

const redoDelete = async (req, res) => {
  try {
    let data = readCharacters();
    const lastUndoId = data.undos.pop();

    if (!lastUndoId) {
      return res.status(404).json({ error: "No characters to redo" });
    }

    const characterIndex = data.characters.findIndex(
      (char) => char.id === parseInt(lastUndoId) && char.deleted === false
    );
    if (characterIndex === -1) {
      return res.status(404).json({ error: "Character not found" });
    }

    data.characters[characterIndex].deleted = true;

    data.deleted.push(lastUndoId);
    data.currentNumberCharacters--;

    writeCharacters(data);

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
