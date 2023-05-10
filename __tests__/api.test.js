const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");

const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /topics", () => {
  test("returns status 200 and JSON object with key of topics and array of all the topics with description and seed", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        res.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api", () => {
  test("returns status 200 and JSON object describing all of the available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        expect(res.body.hasOwnProperty("GET /api")).toBe(true);
        expect(res.body.hasOwnProperty("GET /api/topics")).toBe(true);
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("returns status 200 and JSON article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((result) => {
        const body = result.body.article;

        expect(body.hasOwnProperty("author")).toBe(true);
        expect(body.hasOwnProperty("title")).toBe(true);
        expect(body.hasOwnProperty("article_id")).toBe(true);
        expect(body.hasOwnProperty("body")).toBe(true);
        expect(body.hasOwnProperty("topic")).toBe(true);
        expect(body.hasOwnProperty("created_at")).toBe(true);
        expect(body.hasOwnProperty("votes")).toBe(true);
        expect(body.hasOwnProperty("article_img_url")).toBe(true);
      });
  });
  test("GET /api/articles/:invalid - Status 400 - invalid article ID", () => {
    return request(app)
      .get("/api/articles/66859")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
});
