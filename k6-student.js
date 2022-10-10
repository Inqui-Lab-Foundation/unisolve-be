import http from 'k6/http';
import encoding from 'k6/encoding';
import { check, group, sleep, fail } from 'k6';
import { describe } from 'https://jslib.k6.io/expect/0.0.4/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

let baseURL="https://apiprod.inquitech.in/api/v1"
// https://apiqa.inquitech.in/api/v1/quiz/1/response
let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6IkFkbWluQHVuaXNvbHZlLm9yZyIsImZ1bGxfbmFtZSI6IkFkbWluIE5hbWUiLCJzdGF0dXMiOiJBQ1RJVkUiLCJyb2xlIjoiQURNSU4iLCJpc19sb2dnZWRpbiI6IllFUyIsImxhc3RfbG9naW4iOiIyMDIyLTEwLTA4VDEzOjEzOjMzLjAwMFoiLCJjcmVhdGVkX2J5IjoxLCJjcmVhdGVkX2F0IjpudWxsLCJ1cGRhdGVkX2J5IjoxLCJ1cGRhdGVkX2F0IjoiMjAyMi0xMC0wOFQxMzoxMzozMy4wMDBaIiwiaWF0IjoxNjY1Mjk5OTc5LCJleHAiOjE2NjU1NTkxNzl9.ZjhYQ5IS7lqlRYkSejJgp2y1pRWMAMBL0ppqvjGASw4';
 export const options = {  
  stages: [
    { duration: '30m', target: 5000 }, // below normal load

  ],
  thresholds: {
   http_req_failed: ["rate<0.10"], // http errors should be less than 1%
    http_req_duration: ["p(95)<900"], // 95% of requests should be below 1s
  },
  // httpDebug: "true",
  //userAgent: "K6GreetingsDemo/1.0",
}
export default function () {

// student survey
const payload = JSON.stringify({
            "quiz_question_id":6,
            "selected_option":"o1"   
    
    });
const resSurvey = http.post(`${baseURL}/quiz/1/response`,payload, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `${token}`,
},
  
});
check(resSurvey, { 'Student quiz check': (r) => r.status === 200 },
{'success':(r)=>r.message === "OK"});
sleep(1);
//console.log(resSurvey.body)

}


export function handleSummary(data) {
    return {
      "resultStudent1.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }