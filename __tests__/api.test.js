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

describe("GET /api/articles/:article_id/comments", () => {
  test("returns status 200 and JSON comment object", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((result) => {
        const comments = result.body.comments;
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment.hasOwnProperty("comment_id")).toBe(true);
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("GET /api/articles/:invalid/comments - Status 404 - article ID does not exist", () => {
    return request(app)
      .get("/api/articles/66859/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article 66859 does not exist");
      });
  });
  test("GET /api/articles/banana/comments - Status 400 - invalid article ID value", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
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
  test("GET /api/articles/:invalid - Status 404 - article ID does not exist", () => {
    return request(app)
      .get("/api/articles/66859")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });

  test("GET /api/articles/banana - Status 400 - invalid article ID value", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
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
});

describe("GET /articles", () => {
  test("returns status 200 and JSON object with array of all the articles with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        res.body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
});
