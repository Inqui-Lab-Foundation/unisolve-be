import supertest, { agent } from "supertest";

import createServer from "../utils/server";
import { student } from "../models/student.model";

const app = createServer();

// test cases for Student  API's
describe("Student test cases", () => {

    describe("Server health check API", () => {
        test("should return a 200 status", async () => {
            await supertest(app).get(`/api/v1/healthCheck`)
                .expect(200);
        });
    });

    describe("Student: Registration API", () => {
        const Payload = {
            "student_name": "VamshiKrishnaHasanabada",
            "email": "Vamshi@gmail.com",
            "password": "vamshi@123",
            "passwordConfirmation": "vamshi@123",
            "date_of_birth": "25/05/1995",
            "mobile": 8005860992,
            "institute_name": "Vishwa Vishwani Institute of technology"
        }
        const validationPayload = {
            "student_name": "VamshiKrishnaHasanabada",
            "email": "Vamshi@gmail.com",
            "password": "vamshi@123",
            "passwordConfirmation": "vamshi@123",
            "institute_name": "Vishwa Vishwani Institute of technology"
        }
        test("Should return 200 & create account", async () => {
            const mockCreateIntense = jest.fn((): any => Payload)
            jest.spyOn(student, "create")
                .mockImplementation(() => mockCreateIntense());
            const { statusCode, body } = await supertest(app)
                .post("/api/v1/student/register")
                .send(Payload)
            expect(statusCode).toBe(200);
        });
        test("Should handle validation", async () => {
            const mockCreateError = jest.fn((): any => validationPayload);
            jest.spyOn(student, "create")
                .mockImplementation(() => mockCreateError());
            const res = await supertest(app)
                .post("/api/v1/student/register")
                .send(validationPayload)
            expect(res.statusCode).toBe(400);
        });
    });

    describe("Student: Authentication API", () => {
        const Payload = {
            "name": "VamshiKrishna",
            "email": "Vamshi@gmail.com",
            "password": "vamshi@123",
            "passwordConfirmation": "vamshi@123"
        }
        test("Should return 200 & login into account", async () => {
            const { statusCode } = await supertest(app)
                .post("/api/v1/student/login")
                .send(Payload)
            expect(statusCode).toBe(200);
        });                                                                              
        test("Should handle exception", async () => {
            const res = await supertest(app)
                .post("/api/v1/student/login")
                .send({
                    "name": "Vinay",
                    "email": "Vinay@1234.com",
                    "password": "Vinay@1234",
                    "passwordConfirmation": "Vinay@1234"
                })
            expect(res.statusCode).toBe(401);
        });
    });

    describe("Student: Change password API", () => {
        const Payload = {
            "email": "Vamshi@1234.com",
            "newPassword": "Vamshi@1234",
            "passwordConfirmation": "Vamshi@1234"
        }
        const validationPayload = {
            "email": "Vamshi@1234.com",
            "newPassword": "Vamshi@1234",
        }
        test("Should return 202 & change the password", async () => {
            const { statusCode, body } = await supertest(app)
                .post("/api/v1/student/changePassword")
                .send(Payload)
                console.log(body)
            expect(statusCode).toBe(202)
            expect(body).toHaveProperty("message")
        });
        test("Should return 400 & validation error", async () => {
            await supertest(app)
                .post("/api/v1/student/changePassword")
                .send(validationPayload)
                .expect(400)
        });
    });

    // describe("Student: Logout API", () => {
    //     test("should return a 200 status", async () => {
    //         await supertest(app).get(`/api/v1/student/logout`)
    //             .expect(200);
    //     });
    // });
});
