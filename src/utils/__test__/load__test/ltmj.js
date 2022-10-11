// import * as envComfig from "./../../../../node_modules/dotenv/config";
import http from 'k6/http';
import exec from 'k6/execution'
import { check, group, sleep } from 'k6';
// import sequelize from './../../../../node_modules/';
// import database from './../../dbconnection.util';
// import { mentor } from '../../../models/mentor.model';

// const options = {
//   vus: 5,
//   duration: '600ms',
// };

export const options = {  
  stages: [
    { duration: '60s', target: 5 }, // below normal load
    // { duration: '60s', target: 5 },
],
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


export default function () {
  group('simple mentor journey', (_) => {

    const id = new Date().getTime();
    let bodyRegister = JSON.stringify({
    username: 'prefUser' + id  + '@unisolve.org',
    "full_name": "mentor user",
    "password": "112233",
    "mobile": "7989892334",
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
    console.log("register_response",register_response.json())
    const user_id = register_response.json()["data"][0]['user_id'];
    console.log("user_id",user_id)
    sleep(SLEEP_DURATION);

    //updating the flag /// not working ...!!
    // mentor.update(
    //   { reg_status: 3 },
    //   { mentor_id: register_response.data.user_id }
    // );
    // sleep(SLEEP_DURATION);
    
    // mentor verify 
    
    params.tags.name = 'validateOtp';
    let bodyValidateOtp = JSON.stringify({
      user_id: user_id,
      otp: '112233'
    });
    console.log("bodyValidateOtp",bodyValidateOtp);
    const verify_response = http.post(baseUrl+'/mentors/validateOtp', bodyValidateOtp, params);
    check(verify_response, {
      'is status otp 200': (r) => r.status === 200,
      // 'is user_id key preset': (r) => r.json().hasOwnProperty('data'),
    });
    console.log("verify_response",verify_response.json())
    sleep(SLEEP_DURATION);

    // mentor update password
    params.tags.name = 'passwordUpdate';
    let bodyPassword = JSON.stringify({
      user_id: user_id,
      old_password: '112233',
      new_password: 'wHm6eGCL7uFOArs='
    });
    const password_update_response = http.put(baseUrl+'/mentors/updatePassword', bodyPassword, params);
    check(password_update_response, {
      'is status password 202': (r) => r.status === 202
    });
    // console.log("password_update_response",password_update_response.json())
    sleep(SLEEP_DURATION);

    // mentor login
    params.tags.name = 'login';
    const login_response = http.post(baseUrl+'/mentors/login', bodyLogin, params);
    console.log("bodyLogin",bodyLogin)
    check(login_response, {
      'is status login 200': (r) => r.status === 200,
      // 'is api key present': (r) => r.json().hasOwnProperty('data'),
    });
    console.log("login_response",login_response.json())
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
      // sleep(SLEEP_DURATION);
    }else{
      comsole.log("login failed : response ==",login_response);
    }
    

    
  });
}
