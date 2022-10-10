// import "dotenv/config";
import http from 'k6/http';
import { check, group, sleep } from 'k6';
// import sequelize from 'sequelize';
// import database from './src/utils/dbconnection.util';
// import { mentor } from '../../../models/mentor.model';

const options = {
  vus: 1000,
  duration: '600s',
};

// database.sync();

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
    password: '112233'
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
    // mentor register
    const register_response = http.post('http://localhost:3002/api/v1/mentors/register', bodyRegister, params);
    check(register_response, {
      'is status 200': (r) => r.status === 200
    });
    //updating the flag
     mentor.update(
      { reg_status: 3 },
      { mentor_id: register_response.data.user_id }
    );
    //sleeping for sometime
    sleep(SLEEP_DURATION);
    // mentor login
    const login_response = http.post('http://localhost:3002/api/v1/mentors/login', bodyLogin, params);
    check(login_response, {
      'is status 200': (r) => r.status === 200,
      'is api key present': (r) => r.data.json().hasOwnProperty('token'),
    });
    params.headers['Authorization'] = 'Bearer ' + login_response.json()['token'];
    sleep(SLEEP_DURATION);
    // mentor verify 
    // mentor update password
    params.tags.name = 'login';
    const user_profile_response = http.get(
      'http://api.yourplatform.com/v2/users/user_' + __ITER + '/profile',
      params
    );
    sleep(SLEEP_DURATION);
    // Update user profile request
    body = JSON.stringify({
      first_name: 'user_' + __ITER,
    });
    params.tags.name = 'update-user-profile';
    const update_profile_response = http.post(
      'http://api.yourplatform.com/v2/users/user_' + __ITER + '/profile',
      body,
      params
    );
    sleep(SLEEP_DURATION);

    // Logout request
    params.tags.name = 'logout';
    const logout_response = http.get('http://api.yourplatform.com/v2/logout', params);
    sleep(SLEEP_DURATION);
  });
}
