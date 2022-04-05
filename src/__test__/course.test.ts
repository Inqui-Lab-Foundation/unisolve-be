import supertest from "supertest";

import createServer from "../utils/server";
import { courses } from "../models/course.model";

const app = createServer();

// test cases for Course API's
describe("Courser test cases", () => {
    describe("Courser: create the course", () => {
        const Payload = {
            "module": "1",
            "courser_id": "4623236",
            "statue": "Completed"
        };
        test("Should return 200 & create account", async () => {
            const mockCreateIntense = jest.fn((): any => Payload)
            jest.spyOn(courses, "create").mockImplementation(() => mockCreateIntense());
            const { statusCode, body } = await supertest(app).post("/api/v1/course/create").send(Payload).set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
            expect(mockCreateIntense).toHaveBeenCalledTimes(1);
            expect(body).toHaveProperty("courser_id");
            expect(statusCode).toBe(200);
        });
    });
    describe("Courser: get the list of the courses", () => {
        test("Should return 200", async () => {
            const { statusCode, body } = await supertest(app)
                .get("/api/v1/course/list").set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
            expect(statusCode).toBe(200)
            expect(body).toHaveProperty("product")
        });
    });
    // describe("Courser: get the single course", () => {
    //     test("Should return 200", async () => {
    //         const { statusCode, body } = await supertest(app)
    //             .get("/api/v1/course/get/1").set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
    //         expect(statusCode).toBe(200)
    //         expect(body).toHaveProperty("courser_id")
    //     });
    // });
    // describe("Courser: update the single course", () => {
    //     test("Should return 200", async () => {
    //         const { statusCode, body } = await supertest(app)
    //             .put("/api/course/1")
    //         expect(statusCode).toBe(200)
    //     });
    // });
    // describe("Courser: update the single course", () => {
    //     test("Should return 200", async () => {
    //         const { statusCode, body } = await supertest(app)
    //             .delete("/api/course/1")
    //         expect(statusCode).toBe(200)
    //     });
    // });
});