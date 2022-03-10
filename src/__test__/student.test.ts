import supertest from "supertest";
import { omit } from "lodash";

import createServer from "../utils/server";
import { student } from "../models/student.model";

const app = createServer();

export const userLoginResponse = {
    "_id": expect.any(String),
    "name": "vamshi krishna",
    "email": "Vamshi@someone.com",
    "accessToken": expect.any(String),
    "refreshToken": expect.any(String)
}

// test cases for student
describe("Student test cases", () => {

    describe("GET: /api/healthCheck", () => {
        test("should return a 200 status", async () => {
            await supertest(app).get(`/api/healthCheck`)
                .expect(200);
        });
    });

    describe("POST: register the student /student/register", () => {
        const Payload = {
            "email": "vamshi@someone.com",
            "name": "vamshi Krishna",
            "password": "password@23",
            "passwordConfirmation": "password@23"
        };

        test("Should return 200 & create account", async () => {
            const mockCreateIntense = jest.fn((): any => Payload)
            jest
                .spyOn(student, "create")
                .mockImplementation(() => mockCreateIntense());
            const { statusCode, body } = await supertest(app)
                .post("/api/student/register")
                .send(Payload)
            expect(statusCode).toBe(200)
        });

        test("Should handle exception", async () => {
            const mockCreateError = jest.fn((): any => {
                throw "error";
            });
            jest.spyOn(student, "create")
                .mockImplementation(() => mockCreateError());
            const res = await supertest(app)
                .post("/api/student/register")
                .send(Payload)
            expect(mockCreateError).toHaveBeenCalledTimes(1);
            expect(res.body).toEqual({
                message: "failed to register student, something went wrong",
                status: 500,
                router: "/api/student/register",
            });
        });
    });

    describe("POST: login the student /student/login", () => {
        const Payload = {
            "name": "Vamshi",
            "email": "Vamshi@1234.com",
            "password": "Vamshi@1234",
            "passwordConfirmation": "Vamshi@1234"
        }

        test("Should return 200 & login into account", async () => {
            const { statusCode, body } = await supertest(app)
                .post("/api/student/login")
                .send(Payload)
            expect(statusCode).toBe(200)
        });

        test("Should handle exception", async () => {
            const res = await supertest(app)
                .post("/api/student/login")
                .send({
                    "name": "Vinay",
                    "email": "Vinay@1234.com",
                    "password": "Vinay@1234",
                    "passwordConfirmation": "Vinay@1234"
                })
            expect(res.statusCode).toBe(401);
        });
    });

    describe("POST: change password student /student/changePassword", () => {
        const Payload = {
            "email": "Vamshi@1234.com",
            "newPassword": "Vamshi@1234",
            "passwordConfirmation": "Vamshi@1234"
        }

        test("Should return 202 & change the password", async () => {
            const { statusCode, body } = await supertest(app)
                .post("/api/student/changePassword")
                .send(Payload)
            expect(statusCode).toBe(202)
            expect(body).toHaveProperty("message")
        });
    });
    
    describe("GET: /api/student/logout", () => {
        test("should return a 200 status", async () => {
            await supertest(app).get(`/api/student/logout`)
                .expect(200);
        });
    });
});
