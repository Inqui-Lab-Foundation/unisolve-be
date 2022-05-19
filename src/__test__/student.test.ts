import request from "supertest";
import createServer from "../utils/server";
import sessionService from "../services/session.services"
import studentServices from "../services/student.services";

const app = createServer();

describe("API - HealthCheck", () => {
    test("return 200 if server is healthy", async () => {
        const res = await request(app).get('/api/v1/healthcheck')
        expect(200);
        expect(res.body.uptime).toBeGreaterThan(0);
    });
});

describe("API - StudentRegistration", () => {
    const registerSchema = {
        "student_name": "automatedTesting",
        "email": "testing@gmail.com",
        "password": "$2a$10$CwTycUXWue0Thq9StjUM0udvtNYI4lZ50Nfy1IBiW.W0fZhVIRNRav",
        "date_of_birth": "25/05/1995",
        "mobile": 7799345219,
        "institute_name": "Automated Testing Institute of technology"
    }
    test("return 201 & expected a json object with studentInfo, message", async () => {
        const mockCreateIntense = jest.fn((): any => registerSchema);
        jest.spyOn(studentServices, "build").mockImplementation(() => mockCreateIntense());
        const res = await request(app).post("/api/v1/student/register").send(registerSchema);
        expect(mockCreateIntense).toHaveBeenCalledTimes(1);
        expect(res.body).toHaveProperty("info");
        expect(res.body).toHaveProperty("message");
        expect(res.statusCode).toBe(201);
    });
    test("return 400 if the palyload is empty", async () => {
        const res = await request(app).post("/api/v1/student/register").send();
        expect(res.statusCode).toBe(400);
    });
    test("return 409 if duplicate account found", async () => {
        const mockCreateIntense = jest.fn((): any => registerSchema);
        jest.spyOn(studentServices, "find").mockImplementation(() => mockCreateIntense());
        const res = await request(app).post("/api/v1/student/register").send(registerSchema);
        expect(mockCreateIntense).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBe(409);
    });
});

describe("API - StudentLogin", () => {
    const loginSchema = {
        "email": "inqui-lab@unisolve.org",
        "password": "$2a$10$CwTycUXWue0Thq9StjUM0udvtNYI4lZ50Nfy1IBiW.W0fZhVIRNRav"
    };
    const passwordSchema = {
        "email": "inqui-lab@unisolve.org",
        "password": ""
    };
    const sessionShema = {
        "userId": "5ad4f180-3aab-4f21-acf6-5b4b8444d8f0",
        "userAgent": "Testing-instance",
        "valid": true
    }
    test("return 200 & successful login into account", async () => {
        const mockCreateIntenseLogin = jest.fn((): any => loginSchema);
        const mockCreateIntenseSession = jest.fn((): any => sessionShema);
        const mockCreateIntenseDestory = jest.fn((): any => sessionShema.userId);
        jest.spyOn(studentServices, "find").mockImplementation(() => mockCreateIntenseLogin());
        jest.spyOn(sessionService, "destroySession").mockImplementation(() => mockCreateIntenseDestory());
        jest.spyOn(sessionService, "createSession").mockImplementation(() => mockCreateIntenseSession());
        const res = await request(app).post("/api/v1/student/login").send(loginSchema)
        expect(mockCreateIntenseLogin).toBeCalledTimes(1);
        expect(mockCreateIntenseSession).toBeCalledTimes(1);
        expect(mockCreateIntenseDestory).toBeCalledTimes(1);
        expect(res.body).toHaveProperty("Token");
        expect(res.statusCode).toBe(200);
    });
    test("return 403 if student password is not validated", async () => {
        const res = await request(app).post("/api/v1/student/login").send(passwordSchema)
        expect(res.statusCode).toBe(403);
    });
    test("return 401 if student details not found", async () => {
        const res = await request(app).post("/api/v1/student/login").send(loginSchema.email)
        expect(res.statusCode).toBe(401);
    });
});

describe("API - studentChangePassword", () => {
    const changePassword = {
        "userId": "5ad4f180-3aab-4f21-acf6-5b4b8444d8f0",
        "oldPassword": "!1234aWe1Ro3$#",
        "newPassword": "$2a$10$CwTycUXWue0Thq9StjUM0udvtNYI4lZ50Nfy1IBiW.W0fZhVIRNRav"
    }
    test("return 202 change the password", async () => {
        const mockCreateIntense = jest.fn((): any => changePassword);
        jest.spyOn(studentServices, "changePassword").mockImplementation(() => mockCreateIntense());
        const res = await request(app).post("/api/v1/student/changePassword").send(changePassword).set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
        expect(mockCreateIntense).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBe(202);
        expect(res.body).toHaveProperty("message");
    });
    test("return 400 if the palyload is empty", async () => {
        const res = await request(app).post("/api/v1/student/changePassword").send().set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY");
        expect(res.statusCode).toBe(400);
    });
    test("return 401 if the token is missing", async () => {
        const res = await request(app).post("/api/v1/student/changePassword").send(changePassword)
        expect(res.statusCode).toBe(401);
    });
    // test("return 503 if server fail to update the password", async () => {
    //     const res = await request(app).post("/api/v1/student/changePassword").send(changePassword).set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY");
    //     expect(res.statusCode).toBe(503);
    //     expect(res.body).toHaveProperty('message');
    // });
    
});

describe("API - studentLogout", () => {
    const sessionSchema = {
        userId: "5ad4f180-3aab-4f21-acf6-5b4b8444d8f0",
        userAgent: "Testing-instance",
        valid: true
    }
    test("return 200 logout", async () => {
        const res = await request(app).get(`/api/v1/student/logout`)
        expect(res.statusCode).toBe(200);
    });
});
