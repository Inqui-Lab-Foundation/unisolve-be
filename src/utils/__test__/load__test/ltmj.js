import http from 'k6/http';

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { check, group, sleep } from 'k6';
// const options = {
//   vus: 5,
//   duration: '600ms',
// };

export const options = {  
  scenarios: {
    contacts: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '120s', target: 50 },
        { duration: '600s', target: 500 },
        // { duration: '1500s', target: 500 },
      ],
      gracefulRampDown: '0s',
    },
  },

    // vus: 5,
    // duration: '60s',

//   stages: [
//     { duration: '60s', target: 1 }, // below normal load
//     // { duration: '600s', target: 500 }, // average load
//     // { duration: '1500s', target: 5000 }, // high load
    
//     // { duration: '60s', target: 5 },
// ],
  thresholds: {
   http_req_failed: ["rate<0.10"], // http errors should be less than 1%
    http_req_duration: ["p(95)<900"], // 95% of requests should be below 350ms
  },
  // httpDebug: "true",
  //userAgent: "K6GreetingsDemo/1.0",
}

const SLEEP_DURATION = 5;

// let baseUrl = "http://127.0.0.1:3002/api/v1"
// let baseUrl = "https://apidev.inquitech.in/api/v1"
let baseUrl = "https://apiprod.inquitech.in/api/v1"
// let baseUrl = "http://15.207.254.154:3002/api/v1"//dev
// let baseUrl = "http://3.109.59.130:3002/api/v1"//prod


export default function () {
  group('simple mentor journey', (_) => {

    let id = new Date().getTime();
    id = ""+ id+ Math.random();
    let bodyRegister = JSON.stringify({
    username: 'prefUser' + id  + '@unisolve.org',
    "full_name": "mentor user",
    "password": "112233",
    "mobile": "9619118917",
    "role": "MENTOR",
    "team_id": 1,
    "date_of_birth": "1989-06-20",
    "organization_code": "33320501503",
    "qualification": "Degree",
    "city": "testingCity",
    "district": "testingDistrict",
    "state": "testState",
    "country": "testCountry"
  });
  
  let bodyLogin = JSON.stringify({
    username: 'prefUser' + id + '@unisolve.org',
    password: 'wHm6eGCL7uFOArs='
  });

  const params = {
    headers: {
      'Content-Type': 'application/json'
    },
    tags: {
      name: 'register' // first request
    }
  };

    
    // mentor register
    console.log(bodyRegister)
    const register_response = http.post(baseUrl+'/mentors/register', bodyRegister, params);
    check(register_response, {
      'is status register 201': (r) => r.status === 201
    });
    console.log(getTimeStamp()+" register_response",register_response.json())
    // console.log(getTimeStamp()+" register_response_timing",register_response.timings)
    const user_id = register_response.json()["data"][0]['user_id'];
    console.log("user_id",user_id)
    sleep(SLEEP_DURATION);
    
    // mentor verify 
    
    params.tags.name = 'validateOtp';
    let bodyValidateOtp = JSON.stringify({
      user_id: user_id,
      otp: '112233'
    });
    console.log(getTimeStamp()+" bodyValidateOtp",bodyValidateOtp);
    const verify_response = http.post(baseUrl+'/mentors/validateOtp', bodyValidateOtp, params);
    check(verify_response, {
      'is status otp 200': (r) => r.status === 200,
      // 'is user_id key preset': (r) => r.json().hasOwnProperty('data'),
    });
    console.log(getTimeStamp()+" verify_response",verify_response.json())
    // console.log(getTimeStamp()+" verify_response_timing",verify_response.timings)
    sleep(SLEEP_DURATION);

    // mentor update password
    params.tags.name = 'passwordUpdate';
    let bodyPassword = JSON.stringify({
      user_id: user_id,
      old_password: '112233',
      new_password: 'wHm6eGCL7uFOArs='
    });
    console.log(getTimeStamp()+" bodyPassword",bodyPassword);
    const password_update_response = http.put(baseUrl+'/mentors/updatePassword', bodyPassword, params);
    check(password_update_response, {
      'is status password 202': (r) => r.status === 202
    });
    console.log(getTimeStamp()+" password_update_response",password_update_response.json());
    // console.log(getTimeStamp()+" password_update_response_timings",password_update_response.timings);
    // console.log("password_update_response",password_update_response.json())
    sleep(SLEEP_DURATION);

    // mentor login
    params.tags.name = 'login';
    const login_response = http.post(baseUrl+'/mentors/login', bodyLogin, params);
    console.log(getTimeStamp()+" bodyLogin",bodyLogin)
    check(login_response, {
      'is status login 200': (r) => r.status === 200,
      // 'is api key present': (r) => r.json().hasOwnProperty('data'),
    });
    
    console.log(getTimeStamp()+" login_response",login_response.json())
    // console.log(getTimeStamp()+" login_response_timing",login_response.timings)
    if(login_response && 
       login_response.json()&&
       login_response.json()['data'] && 
       login_response.json()['data'][0]&& 
       login_response.json()['data'][0]['token']){

      
      params.headers['Authorization'] = 'Bearer ' + login_response.json()['data'][0]['token'];
      // console.log("Authorization",params.headers['Authorization'] )
      sleep(SLEEP_DURATION);
      //quiz_survey
      params.tags.name = 'quizSurvey';
      const get_quiz_survey_response = http.get(baseUrl+'/quizSurveys/1', params);
      check(get_quiz_survey_response, {
        'is status quizSurvey 200': (r) => r.status === 200
      });
      // console.log("get_quiz_survey_response",get_quiz_survey_response.json())
      // console.log(getTimeStamp()+" get_quiz_survey_response",get_quiz_survey_response.timings)
      // sleep(SLEEP_DURATION);
    }else{
      console.log(getTimeStamp()+" login failed : response ==",login_response);
    }

  });
}


export function handleSummary(data) {
  return {
    "resultTeacher1.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

function getTimeStamp(){
  const date =new Date() ; 
  return "" + date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+":::"+date.getHours()+":"+
  date.getMinutes()+":"+
  date.getSeconds()+":"+date.getMilliseconds();
}



////use below command to run the file (ps change the path to the file to be path to this file on ur computer)
//k6 run /Users/amn/amn_local/dev/projects/inquilab/makenthink/backend/workspace/unisolve-be/src/utils/__test__/load__test/ltmj.js 2>&1 | tee -a output.log