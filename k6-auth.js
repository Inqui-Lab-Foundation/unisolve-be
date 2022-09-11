import http from 'k6/http';
import encoding from 'k6/encoding';
import { check } from 'k6';

export default function () {

  // send custom payload/post data
  const payload = JSON.stringify({
      username: 'admin@unisolve.org',
      password: 'Welcome@123',
  });

  const BASE_URL = 'http://qa.inquitech.in:3002/api/v1';

  // encrypt your credentials in base64 format
  const encodedCredentials = encoding.b64encode("username:password");

 // send post request with custom header and payload
  http.post(`${BASE_URL}/auth/login`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedCredentials}`,
    },
  });


//   const res = http.get(`${BASE_URL}/faqs`, {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Basic ${encodedCredentials}`,
//     },
    
//   });
      


}
