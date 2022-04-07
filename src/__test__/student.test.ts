import request from "supertest";
import createServer from "../utils/server";
import { student } from "../models/student.model";
import sessionService from "../services/session.services"

const app = createServer();

// test cases for Student  API's
describe("Student test cases", () => {

    describe("Server health check API", () => {
        test("should return a 200 status", async () => {
            await request(app).get(`/api/v1/healthCheck`)
                .expect(200);
        });
    });

    describe("Student: Registration API", () => {
        const register = {
            "student_name": "VamshiKrishnaHasanabada",
            "email": "Vamshi@gmail.com",
            "password": "vamshi@123",
            "passwordConfirmation": "vamshi@123",
            "date_of_birth": "25/05/1995",
            "mobile": 8005860992,
            "institute_name": "Vishwa Vishwani Institute of technology"
        }
        test("Should return 200 & create account", async () => {
            const mockCreateIntense = jest.fn((): any => register);
            jest.spyOn(student, "create").mockImplementation(() => mockCreateIntense());
            const res = await request(app).post("/api/v1/student/register").send(register);
            expect(mockCreateIntense).toHaveBeenCalledTimes(1);
            expect(res.body).toHaveProperty("record");
            expect(res.body).toHaveProperty("message");
        });
    });

    describe("Student: Authentication API", () => {
        const login = {
            "name": "VamshiKrishna",
            "email": "Vamshi@gmail.com",
            "password": "$2a$10$CwTycUXWue0Thq9StjUM0udvtNYI4lZ50Nfy1IBiW.W0fZhVIRNRav",
            "passwordConfirmation": "$2a$10$CwTycUXWue0Thq9StjUM0udvtNYI4lZ50Nfy1IBiW.W0fZhVIRNRav"
        };
        const sessionPayload = {
            userId: "5ad4f180-3aab-4f21-acf6-5b4b8444d8f0",
            userAgent: "Testing-instance",
            valid: true
        }
        test("Should return 200 & login into account", async () => {
            const mockCreateIntenseLogin = jest.fn((): any => login);
            const mockCreateIntenseSession = jest.fn((): any => sessionPayload);
            const mockCreateIntenseDestory = jest.fn((): any => { sessionPayload.userId });
            jest.spyOn(student, "findOne").mockImplementation(() => mockCreateIntenseLogin());
            jest.spyOn(sessionService, "destroySession").mockImplementation(() => mockCreateIntenseDestory());
            jest.spyOn(sessionService, "createSession").mockImplementation(() => mockCreateIntenseSession());
            const res = await request(app).post("/api/v1/student/login").send(login)
            expect(mockCreateIntenseLogin).toBeCalledTimes(1);
            expect(mockCreateIntenseSession).toBeCalledTimes(1);
            expect(mockCreateIntenseDestory).toBeCalledTimes(1);
            expect(res.body).toHaveProperty("accessToken");
            expect(res.body).toHaveProperty("refreshToken");
        });
    });

    describe("Student: Change password API", () => {
        const changePassword = {
            "userId": "5ad4f180-3aab-4f21-acf6-5b4b8444d8f0",
            "oldPassword": "!1234aWe1Ro3$#",
            "newPassword": "$2a$10$CwTycUXWue0Thq9StjUM0udvtNYI4lZ50Nfy1IBiW.W0fZhVIRNRav"
        }
        test("Should return 202 & change the password", async () => {
            const mockCreateIntense = jest.fn((): any => changePassword);
            jest.spyOn(student, "findByPk").mockImplementation(() => mockCreateIntense());
            const res = await request(app).post("/api/v1/student/changePassword").send(changePassword).set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
            expect(mockCreateIntense).toHaveBeenCalledTimes(1);
            expect(res.body).toHaveProperty("message");
        });
    });

    describe("Student: Logout API", () => {
        const sessionPayload = {
            userId: "5ad4f180-3aab-4f21-acf6-5b4b8444d8f0",
            userAgent: "Testing-instance",
            valid: true
        }
        test("should return a 200 status", async () => {
            const mockCreateIntenseLogout = jest.fn((): any => sessionPayload.userId);
            jest.spyOn(sessionService, "findSession").mockImplementation(() => mockCreateIntenseLogout())
            const res = await request(app).get(`/api/v1/student/logout`).set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY");
            expect(mockCreateIntenseLogout).toHaveBeenCalledTimes(1);
            expect(res.body).toHaveProperty("message");
        });
    });
});
