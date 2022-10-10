import http from 'k6/http';
import encoding from 'k6/encoding';
import { check, group, sleep, fail } from 'k6';
import { describe } from 'https://jslib.k6.io/expect/0.0.4/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
 
let baseURL="https://apiprod.inquitech.in/api/v1"
let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6IkFkbWluQHVuaXNvbHZlLm9yZyIsImZ1bGxfbmFtZSI6IkFkbWluIE5hbWUiLCJzdGF0dXMiOiJBQ1RJVkUiLCJyb2xlIjoiQURNSU4iLCJpc19sb2dnZWRpbiI6IllFUyIsImxhc3RfbG9naW4iOiIyMDIyLTEwLTA3VDE2OjA1OjM1LjAwMFoiLCJjcmVhdGVkX2J5IjoxLCJjcmVhdGVkX2F0IjpudWxsLCJ1cGRhdGVkX2J5IjoxLCJ1cGRhdGVkX2F0IjoiMjAyMi0xMC0wN1QxNjowNTozNS4wMDBaIiwiaWF0IjoxNjY1MjM0ODEzLCJleHAiOjE2NjU0OTQwMTN9.XbTibYD8PAny2Er6uBuozHkBVZy-7lnqW6u_VF8tnSk';

export const options = {  
  stages: [
    { duration: '60s', target: 100 }, // below normal load
 


],
  thresholds: {
   http_req_failed: ["rate<0.10"], // http errors should be less than 1%
    http_req_duration: ["p(95)<900"], // 95% of requests should be below 350ms
  },
  // httpDebug: "true",
  //userAgent: "K6GreetingsDemo/1.0",
}
export default function () {

  

 

// teacher survey
const payload = JSON.stringify({
  "responses":[
      {
          "quiz_survey_question_id":1,
          "selected_option":"o1"   
      },
      {
          "quiz_survey_question_id":2,
          "selected_option":"o1"   
      },
      {
          "quiz_survey_question_id":3,
          "selected_option":"o1"   
      },
      {
          "quiz_survey_question_id":4,
          "selected_option":"o1"   
      },
      {
          "quiz_survey_question_id":5,
          "selected_option":"o1"   
      },
      {
          "quiz_survey_question_id":6,
          "selected_option":"o1"   
      }

  ]
}
);
const resSurvey = http.post(`${baseURL}/quizSurveys/1/responses`,payload, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `${token}`,
  },
  
});
check(resSurvey, { 'Teacher survey check': (r) => r.status === 200 },
{'success':(r)=>r.message === "OK"});
sleep(1);
//console.log(resSurvey.body)

}



export function handleSummary(data) {
  return {
    "resultTeacher1.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}