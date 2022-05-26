import 'dotenv/config';

export default {
    port: process.env.APP_PORT || 3002,
    slatWorkFactor: 10,
    privateKey: process.env.PRIVATE_KEY,
    publicKey: process.env.PUBLIC_KEY, 
    accessTokenTtl: "3d"
}