const prodDb = {
    dialect:process.env.DB_CLIENT,
    databaseName: process.env.DB_NAME,
    userName: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    hostName: process.env.DB_HOST,
}

export default prodDb;