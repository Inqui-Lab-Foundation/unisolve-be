import http from 'k6/http';
import encoding from 'k6/encoding';
import { check, group, sleep, fail } from 'k6';
import { describe } from 'https://jslib.k6.io/expect/0.0.4/index.js';
 
export const options = {  
  stages: [
    { target: 10, duration: '10s' },
    // { target: 20, duration: '1m' },
    // { target: 30, duration: '1m' },
],
  thresholds: {
  //  http_req_failed: ["rate<0.10"], // http errors should be less than 1%
    http_req_duration: ["p(95)<350"], // 95% of requests should be below 350ms
  },
  // httpDebug: "true",
  //userAgent: "K6GreetingsDemo/1.0",
}
export default function () {

 
  // encrypt your credentials in base64 format
  // send post request with custom header and payload
  http.post('https://apiqa.inquitech.in/api/v1/admins/login', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozMCwidXNlcm5hbWUiOiJhZG1pbjJlODJLd3NhbW9BVWtHQHVuaXNvbHZlLm9yZyIsImZ1bGxfbmFtZSI6ImFkbWluIHVzZXIiLCJzdGF0dXMiOiJBQ1RJVkUiLCJyb2xlIjoiQURNSU4iLCJpc19sb2dnZWRpbiI6IllFUyIsImxhc3RfbG9naW4iOiIyMDIyLTA5LTE3VDExOjE1OjQ0LjAwMFoiLCJjcmVhdGVkX2J5IjoxMjM2NTQ3ODk5LCJjcmVhdGVkX2F0IjoiMjAyMi0wOS0wN1QwNDo1ODozMi4wMDBaIiwidXBkYXRlZF9ieSI6bnVsbCwidXBkYXRlZF9hdCI6IjIwMjItMDktMTdUMTE6MTU6NDQuMDAwWiIsImlhdCI6MTY2MzQ2NjIzOSwiZXhwIjoxNjYzNzI1NDM5fQ.eHsasKU8s2iaLdQU5X_Y3W7PF1yzUjhdkPvJnbCnKnY',
    },
  });
  sleep(1);
  //check(res, { 'Admin check': (r) => r.status === 200 });

 //{'success':(r)=>r.message === "Login Successful"}

 const res = http.get('https://apiqa.inquitech.in/api/v1/faqCategories', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozMCwidXNlcm5hbWUiOiJhZG1pbjJlODJLd3NhbW9BVWtHQHVuaXNvbHZlLm9yZyIsImZ1bGxfbmFtZSI6ImFkbWluIHVzZXIiLCJzdGF0dXMiOiJBQ1RJVkUiLCJyb2xlIjoiQURNSU4iLCJpc19sb2dnZWRpbiI6IllFUyIsImxhc3RfbG9naW4iOiIyMDIyLTA5LTE3VDExOjE1OjQ0LjAwMFoiLCJjcmVhdGVkX2J5IjoxMjM2NTQ3ODk5LCJjcmVhdGVkX2F0IjoiMjAyMi0wOS0wN1QwNDo1ODozMi4wMDBaIiwidXBkYXRlZF9ieSI6bnVsbCwidXBkYXRlZF9hdCI6IjIwMjItMDktMTdUMTE6MTU6NDQuMDAwWiIsImlhdCI6MTY2MzQ2NjIzOSwiZXhwIjoxNjYzNzI1NDM5fQ.eHsasKU8s2iaLdQU5X_Y3W7PF1yzUjhdkPvJnbCnKnY',
    },
    
  });
  check(res, { 'FAQ get endpoint check': (r) => r.status === 200 },
  {'success':(r)=>r.message === "OK"});
  sleep(1);
//console.log(res.body)

}