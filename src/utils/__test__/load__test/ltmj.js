// import * as envComfig from "./../../../../node_modules/dotenv/config";
import http from 'k6/http';
import { check, group, sleep } from 'k6';
// import sequelize from './../../../../node_modules/';
// import database from './../../dbconnection.util';
// import { mentor } from '../../../models/mentor.model';

// const options = {
//   vus: 1000,
//   duration: '600s',
// };

export const options = {  
  stages: [
    { duration: '60s', target: 5 }, // below normal load
],
  thresholds: {
   http_req_failed: ["rate<0.10"], // http errors should be less than 1%
    http_req_duration: ["p(95)<900"], // 95% of requests should be below 350ms
  },
  // httpDebug: "true",
  //userAgent: "K6GreetingsDemo/1.0",
}

const SLEEP_DURATION = 15;

export default function () {
  let bodyRegister = {
    username: 'prefUser' + __ITER + '@unisolve.org',
    "full_name": "mentor user",
    "password": "112233",
    "mobile": "7989892334",
    "role": "MENTOR",
    "team_id": __ITER,
    "date_of_birth": "1989-06-20",
    "organization_code": "33320100606",
    "qualification": "Degree",
    "city": "testingCity",
    "district": "testingDistrict",
    "state": "testState",
    "country": "testCountry"
  }
  
  let bodyLogin = JSON.stringify({
    username: 'prefUser' + __ITER + '@unisolve.org',
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

  group('simple mentor journey', (_) => {
    // let baseUrl = "http://127.0.0.1:3002/api/v1"
    let baseUrl = "https://apidev.inquitech.in/api/v1"
    // mentor register
    // console.log(bodyRegister)
    const register_response = http.post(baseUrl+'/mentors/register', bodyRegister, params);
    check(register_response, {
      'is status 200': (r) => r.status === 200
    });
    // console.log(register_response)
    const user_id = register_response.data.json()['user_id'];

    sleep(SLEEP_DURATION);

    //updating the flag /// not working ...!!
    // mentor.update(
    //   { reg_status: 3 },
    //   { mentor_id: register_response.data.user_id }
    // );
    // sleep(SLEEP_DURATION);
    
    // mentor verify 
    
    params.tags.name = 'verifyUser';
    let bodyVerify = JSON.stringify({
      user_id: user_id,
      otp: '112233'
    });
    const verify_response = http.post(baseUrl+'/mentors/verify', bodyVerify, params);
    check(verify_response, {
      'is status 200': (r) => r.status === 200,
      'is user_id key preset': (r) => r.data.json().hasOwnProperty('user_id'),
    });
    sleep(SLEEP_DURATION);

    // mentor update password
    params.tags.name = 'passwordUpdate';
    let bodyPassword = JSON.stringify({
      user_id: user_id,
      old_password: '112233',
      new_password: 'wHm6eGCL7uFOArs='
    });
    const password_update_response = http.post(baseUrl+'/mentors/updatePassword', bodyPassword, params);
    check(password_update_response, {
      'is status 200': (r) => r.status === 200
    });
    sleep(SLEEP_DURATION);

    // mentor login
    params.tags.name = 'login';
    const login_response = http.post(baseUrl+'/mentors/login', bodyLogin, params);
    check(login_response, {
      'is status 200': (r) => r.status === 200,
      'is api key present': (r) => r.data.json().hasOwnProperty('token'),
    });
    params.headers['Authorization'] = 'Bearer ' + login_response.data.json()['token'];
    sleep(SLEEP_DURATION);

    //quiz_survey
    params.tags.name = 'quizSurvey';
    const get_quiz_survey_response = http.post(baseUrl+'/mentors/quizSurvey/1', bodyPassword, params);
    check(get_quiz_survey_response, {
      'is status 200': (r) => r.status === 200
    });
    // sleep(SLEEP_DURATION);
  });
}
