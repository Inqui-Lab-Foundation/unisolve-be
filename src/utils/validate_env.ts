import { cleanEnv, str, port} from "envalid"; 

export default function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ["development", "production", "test"],
        }),
        APP_NAME: str({
            default: "Unisolve-APIs",
        }),
        APP_VERSION: str({
            default: "1.0.0",
        }),
        API_VERSION: str({
            default: "1",
        }),
        APP_PORT:port({
            default: 3002,
        }),
        APP_HOST: str({
            default: "127.0.0.1"
        }),
        APP_HOST_NAME: str({
            default: "localhost"
        }),

        LOG_LEVEL: str({
            choices: ["debug", "info", "warn", "error"],
            default: "debug",
        }),

        DB_TARGET: str({
            choices: ["local", "remote", "AWSDynamoDB", "AzureCosmoseDB"],
        }),
        DB_CLIENT: str({
            choices: ["mysql", "postgres", "mariadb", "mssql"],
            default: "mysql",
        }),
        DB_PORT: port({
            default: 3306,
        }),
        DB_HOST: str({
            default: "localhost",
        }),
        DB_USER: str({
            default: "root",
        }),
        DB_PASSWORD: str({
            default: "",
        }),
        DB_NAME: str({
            default: "unisolve_db_v1",
        }),

        SENTRY_DSN: str({
            default: "",
        }),

        PRIVATE_KEY: str({
            default: 'keys/jwtRS256.pem',
        }),
        PUBLIC_KEY: str({
            default: 'keys/jwtRS256.pem',
        }),
        SALT: str({
            default: "H1K9C218A3H7R4m6O5I5a6W4S7r3K2H8",
        }),
        TOKEN_DEFAULT_TIMEOUT: str({
            default: "1h",
        }),

        SERVE_STATIC_FILES: str({
            choices: ["true", "false"],
            default: "true",
        }),

        SHOW_ROUTES: str({
            choices: ["true", "false"],
            default: "false",
        }),
    });
}