const devDb = {
    dialect:process.env.DB_CLIENT,
    databaseName: process.env.DEV_DB_NAME,
    userName: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    hostName: process.env.DEV_DB_HOST,
}

export default devDb;