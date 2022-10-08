import http from 'k6/http';
import encoding from 'k6/encoding';
import { check, group, sleep, fail } from 'k6';
import { describe } from 'https://jslib.k6.io/expect/0.0.4/index.js';
 
export const options = {  
  stages: [
    { duration: '60s', target: 500},
],
  thresholds: {
   http_req_failed: ["rate<0.10"], // http errors should be less than 1%
    http_req_duration: ["p(95)<250"], // 95% of requests should be below 350ms
  },
  // httpDebug: "true",
  //userAgent: "K6GreetingsDemo/1.0",
}
export default function () {

 
  // encrypt your credentials in base64 format
  // send post request with custom header and payload
  http.post('https://apiqa.inquitech.in/api/v1/admins/login', {
  //  http.post('https://apiqa.inquitech.in/api/v1/students/login', {

    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozMCwidXNlcm5hbWUiOiJhZG1pbjJlODJLd3NhbW9BVWtHQHVuaXNvbHZlLm9yZyIsImZ1bGxfbmFtZSI6ImFkbWluIHVzZXIiLCJzdGF0dXMiOiJBQ1RJVkUiLCJyb2xlIjoiQURNSU4iLCJpc19sb2dnZWRpbiI6IllFUyIsImxhc3RfbG9naW4iOiIyMDIyLTA5LTIzVDA5OjU1OjQwLjAwMFoiLCJjcmVhdGVkX2J5IjoxMjM2NTQ3ODk5LCJjcmVhdGVkX2F0IjoiMjAyMi0wOS0wN1QwNDo1ODozMi4wMDBaIiwidXBkYXRlZF9ieSI6bnVsbCwidXBkYXRlZF9hdCI6IjIwMjItMDktMjNUMDk6NTU6NDAuMDAwWiIsImlhdCI6MTY2NDYwMjM4NywiZXhwIjoxNjY0ODYxNTg3fQ.K1JarxtCyTCoV_6IXtYWqNF2p-89n9yTyBkg0vCivZo',
    },
  });
  sleep(1);
  //check(res, { 'Admin check': (r) => r.status === 200 });

 //{'success':(r)=>r.message === "Login Successful"}
// faq categories...
//  const res = http.get('https://apiqa.inquitech.in/api/v1/faqCategories', {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozMCwidXNlcm5hbWUiOiJhZG1pbjJlODJLd3NhbW9BVWtHQHVuaXNvbHZlLm9yZyIsImZ1bGxfbmFtZSI6ImFkbWluIHVzZXIiLCJzdGF0dXMiOiJBQ1RJVkUiLCJyb2xlIjoiQURNSU4iLCJpc19sb2dnZWRpbiI6IllFUyIsImxhc3RfbG9naW4iOiIyMDIyLTA5LTIzVDA5OjU1OjQwLjAwMFoiLCJjcmVhdGVkX2J5IjoxMjM2NTQ3ODk5LCJjcmVhdGVkX2F0IjoiMjAyMi0wOS0wN1QwNDo1ODozMi4wMDBaIiwidXBkYXRlZF9ieSI6bnVsbCwidXBkYXRlZF9hdCI6IjIwMjItMDktMjNUMDk6NTU6NDAuMDAwWiIsImlhdCI6MTY2NDYwMjM4NywiZXhwIjoxNjY0ODYxNTg3fQ.K1JarxtCyTCoV_6IXtYWqNF2p-89n9yTyBkg0vCivZo',
//     },
    
//   });
//   check(res, { 'FAQ get endpoint check': (r) => r.status === 200 },
//   {'success':(r)=>r.message === "OK"});
//   sleep(1);
// //console.log(res.body)

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
const resSurvey = http.post('https://apiqa.inquitech.in/api/v1/quizSurveys/1/responses',payload, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozMCwidXNlcm5hbWUiOiJhZG1pbjJlODJLd3NhbW9BVWtHQHVuaXNvbHZlLm9yZyIsImZ1bGxfbmFtZSI6ImFkbWluIHVzZXIiLCJzdGF0dXMiOiJBQ1RJVkUiLCJyb2xlIjoiQURNSU4iLCJpc19sb2dnZWRpbiI6IllFUyIsImxhc3RfbG9naW4iOiIyMDIyLTA5LTIzVDA5OjU1OjQwLjAwMFoiLCJjcmVhdGVkX2J5IjoxMjM2NTQ3ODk5LCJjcmVhdGVkX2F0IjoiMjAyMi0wOS0wN1QwNDo1ODozMi4wMDBaIiwidXBkYXRlZF9ieSI6bnVsbCwidXBkYXRlZF9hdCI6IjIwMjItMDktMjNUMDk6NTU6NDAuMDAwWiIsImlhdCI6MTY2NDYwMjM4NywiZXhwIjoxNjY0ODYxNTg3fQ.K1JarxtCyTCoV_6IXtYWqNF2p-89n9yTyBkg0vCivZo',
  },
  
});
check(resSurvey, { 'Teacher survey check': (r) => r.status === 200 },
{'success':(r)=>r.message === "OK"});
sleep(1);
//console.log(resSurvey.body)

}