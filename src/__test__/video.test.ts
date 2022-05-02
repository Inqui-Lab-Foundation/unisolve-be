import supertest from "supertest";

import createServer from "../utils/server";
import operationalServices from "../services/operational.services";

const app = createServer();

// test cases for video API's
describe("Videos test cases", () => {
    describe("API - CreateVideo", () => {
        const VideoShcema = {
            "module": "1",
            "video_id": "4623236"
        };
        test("return 200 & create video", async () => {
            const mockCreateIntense = jest.fn((): any => VideoShcema)
            jest.spyOn(operationalServices, "build").mockImplementation(() => mockCreateIntense());
            const res = await supertest(app).post("/api/v1/video/create").send(VideoShcema).set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
            expect(mockCreateIntense).toHaveBeenCalledTimes(1);
            expect(res.body).toHaveProperty("product");
            expect(res.statusCode).toBe(200);
        });
        test("return 400 if the palyload is empty", async () => {
            const res = await supertest(app).post("/api/v1/video/create").send().set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY");
            expect(res.statusCode).toBe(400);
        });
        test("return 401 if the token is missing", async () => {
            const res = await supertest(app).post("/api/v1/video/create").send();
            expect(res.statusCode).toBe(401);
        });
    });
    describe("API - GetListVideos", () => {
        test("Should return 200", async () => {
            const res = await supertest(app)
                .get("/api/v1/video/list").set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("products")
        });
        test("return 401 if the token is missing", async () => {
            const res = await supertest(app).post("/api/v1/video/list").send();
            expect(res.statusCode).toBe(401);
        });
    });
    describe("API - GetSinglevideo", () => {
        const VideoShcema = {
            "module": "2",
            "video_id": "963258",
            "status": "Incomplete"
        }
        test("return 200 get the corse details", async () => {
            const mockCreateIntensevideo = jest.fn((): any => VideoShcema.video_id);
            jest.spyOn(operationalServices, "findOne").mockImplementation(() => mockCreateIntensevideo())
            const res = await supertest(app)
                .get(`/api/v1/video/get/${963258}`).set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
            expect(mockCreateIntensevideo).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("product")
        });
        test("return 401 if the token is missing", async () => {
            const res = await supertest(app).post("/api/v1/video/get/${2}").send();
            expect(res.statusCode).toBe(401);
        });
    });
    describe("API - UpdateSinglevideo", () => {
        const updatepayload = { "status": "Completed" }
        const VideoShcema = {
            "module": "2",
            "video_id": "963258",
            "status": "Incomplete"
        }
        const payload = [updatepayload, 1];
        test("return 200 update the video", async () => {
            const mockCreateIntensevideo = jest.fn((): any => VideoShcema.video_id);
            jest.spyOn(operationalServices, "findOne").mockImplementation(() => mockCreateIntensevideo())
            const mockCreateIntenseUpdate = jest.fn((): any => { payload[0], payload[1] });
            jest.spyOn(operationalServices, "updateOne").mockImplementation(() => mockCreateIntenseUpdate());
            const res = await supertest(app)
                .put(`/api/v1/video/update/963258`).send(updatepayload).set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
            expect(res.status).toBe(200);
        });
        test("return 400 if the palyload is empty", async () => {
            const res = await supertest(app).put("/api/v1/video/update/963258").send().set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY");
            expect(res.statusCode).toBe(400);
        });
        test("return 401 if the token is missing", async () => {
            const res = await supertest(app).put("/api/v1/video/update/963258").send();
            expect(res.statusCode).toBe(401);
        });
        
    });
    describe("API - DeleteSinglevideo", () => {
        const videoPayload = {
            "video_id": "963258",
        }
        test("return 200 delete the video", async () => {
            const mockCreateIntensevideo = jest.fn((): any => videoPayload);
            const mockCreateIntenseDelete = jest.fn((): any => videoPayload);
            jest.spyOn(operationalServices, "findOne").mockImplementation(() => mockCreateIntensevideo())
            jest.spyOn(operationalServices, "destroyOne").mockImplementation(() => mockCreateIntenseDelete())
            const res = await supertest(app)
                .delete(`/api/v1/video/delete/${963258}`).set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
            expect(mockCreateIntensevideo).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("deletedVideo");
        });
        test("return 401 if the token is missing", async () => {
            const res = await supertest(app).post("/api/v1/video/delete/${963258}").send();
            expect(res.statusCode).toBe(401);
        });
    });
});