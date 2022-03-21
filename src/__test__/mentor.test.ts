import supertest from "supertest";

import createServer from "../utils/server";
import { mentor } from "../models/mentor.model";

const app = createServer();

// test cases for Mentor  API's
describe("Mentor test cases", () => {
    describe("Mentor: create the new entry", () => {
        beforeAll(() => jest.setTimeout(6000))
        const Payload = {
            "mentor_name": "vamshi",
            "mobile": 8005860992,
            "email": "Vamshi@gmail.com"
        }
        test("Should return 200 & create entry", async () => {
            const mockCreateIntense = jest.fn((): any => Payload)
            jest
                .spyOn(mentor, "create")
                .mockImplementation(() => mockCreateIntense());
            const { statusCode, body } = await supertest(app)
                .post("/api/v1/course/create")
                .send(Payload)
            expect(statusCode).toBe(200)
        });
    });
    describe("Mentor: get the list of the courses", () => {
        test("Should return 200", async () => {
            const { statusCode, body } = await supertest(app)
                .get("/api/v1/mentor/list")
            expect(statusCode).toBe(200)
            expect(body).toHaveProperty("product")
        });
    });
    describe("Mentor: get the single entry", () => {
        test("Should return 200", async () => {
            const { statusCode, body } = await supertest(app)
                .get("/api/v1/course/1")
            expect(statusCode).toBe(200)
            expect(body).toHaveProperty("product")
        });
    });
    describe("mentor: update the single entry", () => {
        test("Should return 200", async () => {
            const { statusCode, body } = await supertest(app)
                .put("/api/v1/course/1")
            expect(statusCode).toBe(200)
        });
    });
    describe("mentor: update the single entry", () => {
        test("Should return 200", async () => {
            const { statusCode } = await supertest(app)
                .delete("/api/v1/course/1")
            expect(statusCode).toBe(200)
        });
    });
});