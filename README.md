[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)
# rca-barfoot-team3-bn

[![.github/workflows/lint.yml](https://github.com/atlp-rwanda/rca-barfoot-team3-bn/actions/workflows/lint.yml/badge.svg)](https://github.com/atlp-rwanda/rca-barfoot-team3-bn/actions/workflows/lint.yml)
### Prerequisites

1. JavaScript
1. NodeJS
2. PostgreSQL


## Getting Started

### Prerequisites

To get this project up and running locally, you must already have ruby and necessary gems installed on your computer

To get this project set up on your local machine, follow these simple steps:

- Open terminal
- Clone the repository ``` https://github.com/atlp-rwanda/rca-barfoot-team3-bn.git ```
- Cd in the project ``` rca-barfoot-team3-bn ```
- Install dependencies ``` yarn install ```
- Run ``` yarn run createMigration -- --name User ``` if you need it
- Import a model file you want to sync if we already have a model created
- Run ``` yarn migrate ```
- In case you want to undo migrations run ``` yarn undoMigration ```
- Start your server ``` yarn dev ```
- Run the app ``` http://localhost:8000/ ```
   
3. Create .env file 


4. Run tests
   ```sh
   yarn test
   ```

#### Steps to configure your env file

- [ ] Clone the repo
- [ ] Copy the.env.example file and rename it to.env
- [ ] Edit the.env file with your details
- [ ] All of your environment variables will be accessible using (process.env.VARIABLE_NAME)


### A guide on running ESLint

- To check the code against the rules run `yarn lint`
- To fix the files run `yarn lint:fix`


### LIVE VERSION
Check the app [live](https://team-3-barefoot.onrender.com/)