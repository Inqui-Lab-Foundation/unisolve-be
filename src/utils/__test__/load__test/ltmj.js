import http from 'k6/http';
import { check, group, sleep } from 'k6';

const options = {
  vus: 1000,
  duration: '600s',
};
const SLEEP_DURATION = 0.1;

export default function () {
  let bodyRegister= {
    "username": "mw6wementor@unisolve.org",
    "full_name": "mentor user",
    "password": "wHm6eGCL7uFOArs=",
    "mobile": "7989892334",
    "role": "MENTOR",
    "team_id": "12433",
    "date_of_birth": "1989-06-20",
    "organization_code" : "CHIREC1",
    "qualification": "bs.c",
    "city": "hyderabad",
    "district": "somehthing",
    "state": "tg",
    "country": "bs.c",
    "created_by": 1236547899
  }
  let body = JSON.stringify({
    username: 'user_' + __ITER,
    password: 'PASSWORD',
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    tags: {
      name: 'login', // first request
    },
  };

  group('simple mentor journey', (_) => {
    // Login request
    const login_response = http.post('http://api.yourplatform.com/v2/login', body, params);
    check(login_response, {
      'is status 200': (r) => r.status === 200,
      'is api key present': (r) => r.json().hasOwnProperty('api_key'),
    });
    params.headers['api-key'] = login_response.json()['api_key'];
    sleep(SLEEP_DURATION);

    // Get user profile request
    params.tags.name = 'get-user-profile';
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
