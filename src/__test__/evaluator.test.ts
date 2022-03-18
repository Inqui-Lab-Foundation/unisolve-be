import supertest from "supertest";

import createServer from "../utils/server";
import { evaluator } from "../models/evaluator.model";

const app = createServer();

// test cases for Evaluator API's
describe("Evaluator test cases", () => {
    describe("Evaluator: create the new entry", () => {
        beforeAll(() => jest.setTimeout(6000))
        const Payload = {
            "evaluator_name": "Vamshi krishna Hasanabada",
            "mobile": 8005860992,
            "email": "Vamshi@gmail.com"
        };
        test("Should return 200 & create entry", async () => {
            const mockCreateIntense = jest.fn((): any => Payload)
            jest
                .spyOn(evaluator, "create")
                .mockImplementation(() => mockCreateIntense());
            const { statusCode, body } = await supertest(app)
                .post("/api/v1/evaluator/create")
                .send(Payload)
            expect(statusCode).toBe(200)
        });
    });
    describe("Evaluator: get the list entires", () => {
        test("Should return 200", async () => {
            const { statusCode, body } = await supertest(app)
                .get("/api/v1/evaluator/list")
            expect(statusCode).toBe(200)
        });
    });
    describe("Evaluator: get the single entry", () => {
        test("Should return 200", async () => {
            const { statusCode, body } = await supertest(app)
                .get("/api/V1/evaluator/1")
            expect(statusCode).toBe(200)
        });
    });
    describe("Evaluator: update the single entry", () => {
        test("Should return 200", async () => {
            const { statusCode, body } = await supertest(app)
                .put("/api/v1/evaluator/1")
            expect(statusCode).toBe(200)
        });
    });
    describe("Evaluator: delete the single entry", () => {
        test("Should return 200", async () => {
            const { statusCode, body } = await supertest(app)
                .delete("/api/v1/evaluator/1")
            expect(statusCode).toBe(200)
        });
    });
});