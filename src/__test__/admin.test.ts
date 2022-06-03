import request from "supertest";
import createServer from "../utils/server";
import sessionService from "../services/session.services"
import adminServices from "../services/admin.services";

const app = createServer();

describe("API - AdminRegistration", () => {
    const registerSchema = {
        "email": "test123@gmail.com",
        "password": "AwaRHhghXJ22Ko=",
        "role": "1"
    }
    test("return 201 & expected a json object", async () => {
        const mockCreateIntense = jest.fn((): any => registerSchema);
        jest.spyOn(adminServices, "build").mockImplementation(() => mockCreateIntense());
        const res = await request(app).post("/api/v1/admin/register").send(registerSchema);
        expect(mockCreateIntense).toHaveBeenCalledTimes(1);
        expect(res.body).toHaveProperty("info");
        expect(res.body).toHaveProperty("message");
        expect(res.statusCode).toBe(201);
    });
    test("return 409 if duplicate account found", async () => {
        const mockCreateIntense = jest.fn((): any => registerSchema);
        jest.spyOn(adminServices, "find").mockImplementation(() => mockCreateIntense());
        const res = await request(app).post("/api/v1/admin/register").send(registerSchema);
        expect(mockCreateIntense).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBe(409);
    });
});

describe("API - AdminLogin", () => {
    const loginSchema = {
        "email": "test123@gmail.com",
        "password": "AwaRHhghXJ22Ko="
    };
    const sessionShema = {
        "userId": "1",
        "userAgent": "Testing-instance",
        "valid": true
    }
    test("return 200 & successful login into account", async () => {
        const mockCreateIntenseLogin = jest.fn((): any => loginSchema);
        const mockCreateIntenseSession = jest.fn((): any => sessionShema);
        const mockCreateIntenseDestory = jest.fn((): any => sessionShema.userId);
        jest.spyOn(adminServices, "find").mockImplementation(() => mockCreateIntenseLogin());
        jest.spyOn(sessionService, "destroySession").mockImplementation(() => mockCreateIntenseDestory());
        jest.spyOn(sessionService, "createSession").mockImplementation(() => mockCreateIntenseSession());
        const res = await request(app).post("/api/v1/admin/login").send(loginSchema)
        expect(mockCreateIntenseLogin).toBeCalledTimes(1);
        expect(mockCreateIntenseSession).toBeCalledTimes(1);
        expect(mockCreateIntenseDestory).toBeCalledTimes(1);
        expect(res.body).toHaveProperty("Token");
        expect(res.statusCode).toBe(200);
    });
    // test("return 403 if student password is not validated", async () => {
    //     const res = await request(app).post("/api/v1/admin/login").send(loginSchema)
    //     expect(res.statusCode).toBe(403);
    // });
    test("return 401 if student details not found", async () => {
        const res = await request(app).post("/api/v1/admin/login").send(loginSchema.email)
        expect(res.statusCode).toBe(401);
    });

});

describe("API - AdminChangePassword", () => {
    const changePassword = {
        "userId": "1",
        "oldPassword": "!1234aWe1Ro3$#",
        "newPassword": "$2a$10$CwTycUXWue0Thq9StjUM0udvtNYI4lZ50Nfy1IBiW.W0fZhVIRNRav"
    }
    const changePassword2 = {
        "userId": "",
        "oldPassword": "!1234aWe1Ro3$#",
        "newPassword": "$2a$10$CwTycUXWue0Thq9StjUM0udvtNYI4lZ50Nfy1IBiW.W0fZhVIRNRav"
    }
    test("return 202 change the password", async () => {
        const mockCreateIntense = jest.fn((): any => changePassword);
        jest.spyOn(adminServices, "changePassword").mockImplementation(() => mockCreateIntense());
        const res = await request(app).put("/api/v1/admin/changePassword").send(changePassword)
        expect(mockCreateIntense).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBe(202);
        expect(res.body).toHaveProperty("message");
    });
    test("return 503 if server fail to update the password", async () => {
        const res = await request(app).put("/api/v1/admin/changePassword").send(changePassword2)
        expect(res.statusCode).toBe(503);
        expect(res.body).toHaveProperty('message');
    });
});

describe("API - AdminLogout", () => {
    const sessionSchema = {
        userId: "1",
        userAgent: "Testing-instance",
        valid: true
    }
    test("return 200 logout", async () => {
        const res = await request(app).get(`/api/v1/admin/logout`)
        expect(res.statusCode).toBe(200);
    });
});

describe("API - createStudentConfig", () => {
    const payload = {
        "studentName": true,
        "email": true,
        "phNumber": true
    }
    test("return 200 created", async () => {
        const res = await request(app).post(`/api/v1/admin/setupStudentConfig`).send(payload);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message')
    });
});

describe("API - getStudentConfig", () => {
    test("return 200", async () => {
        const res = await request(app).get(`/api/v1/admin/getStudentConfig`)
        expect(res.statusCode).toBe(200);
    });
});