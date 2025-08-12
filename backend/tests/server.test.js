const request = require("supertest");
const app = require("../server");

describe("ESPE Micro-Blog API", () => {
  let server;

  beforeAll(() => {
    server = app.listen(3001);
  });

  afterAll(() => {
    server.close();
  });

  describe("GET /api/posts", () => {
    test("Debe retornar una lista vacía inicialmente", async () => {
      const response = await request(app).get("/api/posts");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /api/posts", () => {
    test("Debe crear un nuevo post exitosamente", async () => {
      const newPost = {
        content: "Este es un mensaje de prueba para ESPE",
      };

      const response = await request(app).post("/api/posts").send(newPost);

      expect(response.status).toBe(201);
      expect(response.body.content).toBe(newPost.content);
      expect(response.body.author).toBe("Usuario ESPE");
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("timestamp");
    });

    test("Debe rechazar posts vacíos", async () => {
      const response = await request(app)
        .post("/api/posts")
        .send({ content: "" });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("280 caracteres");
    });

    test("Debe rechazar posts con más de 280 caracteres", async () => {
      const longContent = "a".repeat(281);
      const response = await request(app)
        .post("/api/posts")
        .send({ content: longContent });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("280 caracteres");
    });
  });

  describe("GET /health", () => {
    test("Debe retornar estado de salud", async () => {
      const response = await request(app).get("/health");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("OK");
    });
  });
});
