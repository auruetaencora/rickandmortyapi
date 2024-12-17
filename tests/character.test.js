const request = require("supertest");
const app = require("../app");

describe("Character API Endpoints", () => {
  describe("GET /get/:number", () => {
    it("should fetch and save data for a valid number", async () => {
      const res = await request(app).get("/api/character/get/10");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Data fetched and saved successfully");
      expect(res.body.data).toHaveLength(10);
    });

    it("should return a 400 error if number is out of range", async () => {
      const res = await request(app).get("/api/character/get/827");
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(
        "The param must be a number between 1 and 826"
      );
    });
  });

  describe("GET /sort", () => {
    it("should return sorted data", async () => {
      const res = await request(app).get("/api/character/sort");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Data sorted successfully");
      expect(res.body.data).toBeDefined();
    });
  });

  describe("DELETE /:id", () => {
    it("should mark a character as deleted", async () => {
      const res = await request(app).delete("/api/character/1");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Character with ID 1 deleted");
    });

    it("should return 404 if the character is not found", async () => {
      const res = await request(app).delete("/api/character/999");
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Character not found");
    });
  });

  describe("GET /undo", () => {
    it("should undo the last delete", async () => {
      const res = await request(app).get("/api/character/undo");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Character restored successfully");
    });

    it("should return 404 if there are no characters to undo", async () => {
      const res = await request(app).get("/api/character/undo");
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("No characters to undo");
    });
  });

  describe("GET /redo", () => {
    it("should redo the last undo", async () => {
      const res = await request(app).get("/api/character/redo");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Character re-deleted successfully");
    });

    it("should return 404 if there are no characters to redo", async () => {
      const res = await request(app).get("/api/character/redo");
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("No characters to redo");
    });
  });
});