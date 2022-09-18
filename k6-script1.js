import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';

// export const options = {
//   stages: [{ target: 70, duration: '30s' }],
//   thresholds: {
//     'http_req_duration': ['p(95)<500', 'p(99)<1500'],
//     'http_req_duration{name:PublicCrocs}': ['avg<400'],
//     'http_req_duration{name:Create}': ['avg<600', 'max<1000'],
//   },
// };

function randomString(length, charset = '') {
  if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';
  let res = '';
  while (length--) res += charset[(Math.random() * charset.length) | 0];
  return res;
}

const USERNAME = 'admin2e82KwsamoAUkG@unisolve.org"'; // Set your own email or `${randomString(10)}@example.com`;
const PASSWORD = 'wHm6eGCL7uFOArs=';
const BASE_URL = 'https://apiqa.inquitech.in/api/v1';

export default function setup() {
  // register a new user and authenticate via a Bearer token.
  const res = http.post(`${BASE_URL}/admins/login/`, {
    username: USERNAME,
    password: PASSWORD,
  });

  check(res, { 'created user': (r) => r.status === 201 });


 // const authToken = res.json(data[0].token);
  //check(authToken, { 'logged in successfully': () => authToken !== '' });
  console.log(res.body)
  //return authToken;
}

//export default authToken;