# Coin Transfer

## Prerequisites

- Install docker
- install docker compose

## Local Setup

- Clone repo
- Do `npm install`
- Change the name of `sample.env` to `env`
- Fill the missing values in the `.env` file
- **TO START** run `docker-compose up -d`
- For production **TO START** run `docker-compose docker-compose.prod.yml up -d`

### Check the Functionality 

- Setup admin accounts for Ethereum, Bitcoin and Binance.
- Send initial amount to admin accounts
- Use the APIs to transfer ETH/BTC/BNB from admin accounts to specified accounts
