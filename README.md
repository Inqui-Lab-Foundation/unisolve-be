![](https://codebuild.ap-south-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoibngrZm9wOWpSTzVmMDc2b04vaWM2MnJZallaWHBReUIyQVhDNi9wZDNHUGk0a1UrYVllNnVHQm5FMzkyUXMrN2Qyd2h4ekRSdHhCYTRmSFVGRVViVXUwPSIsIml2UGFyYW1ldGVyU3BlYyI6InpVeDR2dkU4dnZ2V0JaMkQiLCJtYXRlcmlhbFNldFNlcmlhbCI6Mn0%3D&branch=develop)
# Student's Learning Platform backend

# UNISLOVE-BE

Unislove backend containing All list API's and server hosted in port <3002>

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes. See deployment
for notes on deploying the project on a live system.

### Prerequisites

- Node.js 
- Typescript 
- Express
- MySQL

Requirements for the software and other tools to build, test and push 

### Installing

1. You need to install PostgreSQL
   - For Windows
     - Install mySql and set following environment variable C:\Program Files\mysql\10\bin
   - For Ubuntu
     - Installation 
        sudo apt update 
        sudo apt-get install mysql
  
2. rename .env-sample to .env in the file the DB connection string need to be updated according to your credentials. ex : mysql://<YourUserName>:<YourPassword>@localhost:5432/<YourDatabase>

3. you can find the DB and other details under unislove-be/config there is a file called database.config.js you are changed the database username password

4. install all dependencies need for application to run locally 
   - git clone https://github.com/Inqui-Lab-Foundation/unisolve-be.git
   - yarn install || npm install
   - yarn start:dev || npm start:dev This will start the application in development mode
   - yarn start:prod || npm start:prod  This will start the application and run on port 3002

5. you can change port and others details in `config.json` file check path: `./config/default.ts`

## Folder Structure

```
config
└───database.config.ts
└───default.ts
src
└───__test__             # API Testing files
└───controllers          # Express route controllers for all the endpoints of the app
└───middleware           # express middleware
└───models               # DB Models (mysql)
└───schemas              # validation schemas for API Request object validations
└───services             # All the database interaction logic is here
└───utils                # third party service required application to up and running
└───index.ts             # Application entry point
└───routes.ts            # Application routes / endpoints

```

## Features

- CRUD operations for student
- Authentication for student
- REST API Request object validations - Basic
- Error Logs
- Setup docs

## Database migrates

one of the mandatory steps to update database tables

- go to .env add ```DB_MIGRATE_FORCE=true```
- go to .env add ```DB_MIGRATE_ALTER=false```
- npm run build
- node migrate.js

Note: ```DB_MIGRATE_FORCE=false```,```DB_MIGRATE_ALTER=true``` make sure you have add two .env file

## Database rules

- Use underscore_names instead of CamelCase
- Table names should be plural
- Spell out id fields (item_id instead of id)
- Don't use ambiguous column names
- When possible, name foreign key columns the same as the columns they refer to 

read more: https://db-migrate.readthedocs.io/en/latest/

## Running the tests

yarn run test || npm run test

testing with converge of the files

yarn run test:coverage || npm run test:coverage

## Planned

- \[x] JWT login
- \[x] Unit Testing
- \[x] Postman collections
- \[x] Improve request Object Validations
- \[x] Improve Error Messages for request failures
- \[x] Swagger Docs
- \[x] Security
- \[x] SQL Database
- \[ ] Hosting


### Sample Tests

Explain what these tests test and why

    Give an example

### Style test

Checks if the best practices and the right coding style has been used.

    Es-lint

## Deployment

Add additional notes to deploy this on a live system

## Built With

  - [Contributor Covenant](https://www.contributor-covenant.org/) - Used
    for the Code of Conduct
  - [Creative Commons](https://creativecommons.org/) - Used to choose
    the license

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code
of conduct, and the process for submitting pull requests to us.

## Versioning

We use [Semantic Versioning](http://semver.org/) for versioning. For the versions
available, see the [tags on this
repository](https://github.com/PurpleBooth/a-good-readme-template/tags).

## Authors

  - **Pradeep Gandla**

See also the list of
[contributors](https://github.com/PurpleBooth/a-good-readme-template/contributors)
who participated in this project.

## Recommended / Preferred

[VSCode](https://code.visualstudio.com/download)

## License

This project is licensed under the [CC0 1.0 Universal](LICENSE.md)
Creative Commons License - see the [LICENSE.md](LICENSE.md) file for
details

## Acknowledgments

  - Hat tip to anyone whose code is used
  - Inspiration
  - etc
