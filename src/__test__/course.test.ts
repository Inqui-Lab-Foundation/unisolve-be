import supertest from "supertest";

import createServer from "../utils/server";
import courseService from "../services/course.services";
import { course } from "../models/course.model";

const app = createServer();

// test cases for Course API's
describe("course test cases", () => {
    describe("course: create the course", () => {
        const Payload = {
            "course_name": "JVAAa Course",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inde sermone vario sex illa a Dipylo stadia confecimus. Idem iste, inquam, de voluptate quid sentit? Paulum, cum regem Persem captum adduceret, eodem flumine invectio? Itaque hic ipse iam pridem est reiectus; Duo Reges: constructio interrete. Primum in nostrane potestate est"
        };
        test("Should return 200 & create account", async () => {
            const mockCreateIntense = jest.fn((): any => Payload)
            jest.spyOn(course, "create").mockImplementation(() => mockCreateIntense());
            const res = await supertest(app).post("/api/v1/course/create").send(Payload).set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
            expect(mockCreateIntense).toHaveBeenCalledTimes(1);
            expect(res.body).toHaveProperty("course_name");
            expect(res.body).toHaveProperty("description");
            expect(res.status).toBe(200);
        });
    });
    describe("course: get the list of the courses", () => {
        test("Should return 200", async () => {
            const res = await supertest(app)
                .get("/api/v1/video/list").set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("videos")
        });
    });
    describe("course: get the single course", () => {
        const videoPayload = {
            "module": "2",
            "id": "2",
            "status": "Incomplete"
        }
        test("Should return 200", async () => {
            const mockCreateIntenseCourse = jest.fn((): any => videoPayload.id);
            jest.spyOn(courseService, "findCourse").mockImplementation(() => mockCreateIntenseCourse())
            const res = await supertest(app)
                .get(`/api/v1/course/get/${2}`).set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
            expect(mockCreateIntenseCourse).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("product")
        });
    });
    describe("course: update the single course", () => {
        const updatepayload = { "status": "Completed" } 
        const payload = [updatepayload, 1];
        test("Should return 200", async () => {
            const mockCreateIntenseUpdate = jest.fn((): any => { payload[0], payload[1] });
            jest.spyOn(courseService, "updateCourse").mockImplementation(() => mockCreateIntenseUpdate());
            const res = await supertest(app)
                .put(`/api/v1/course/update/1`).send(updatepayload).set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
            // expect(mockCreateIntenseUpdate).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(200);
            // expect(res.body).toHaveProperty("id")
        });
    });
    describe("course: delete the single course", () => {
        const videoPayload = {
            "id": "1",
        }
        test("Should return 200", async () => {
            const mockCreateIntenseCourse = jest.fn((): any => videoPayload);
            const mockCreateIntenseDelete = jest.fn((): any => videoPayload);
            jest.spyOn(courseService, "findCourse").mockImplementation(() => mockCreateIntenseCourse())
            jest.spyOn(courseService, "destroyCourse").mockImplementation(() => mockCreateIntenseDelete())
            const res = await supertest(app)
                .delete(`/api/v1/course/delete/${1}`).set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY")
            expect(mockCreateIntenseCourse).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("deleteCourse")
            expect(res.body).toHaveProperty("text")
        });
    });
});