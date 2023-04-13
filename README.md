# La Coco Crypto Exchange Backend
This backend server is developed with Typescript and NestJs for the La Coco Crypto Exchange

2 endponts are implemented:

## Endpoints
`GET /tokens`
### Description
Returns all the supported tokens and info about those tokens

### Sample response

Status code: 200
``` Typescript
{
  "BTC": {
      symbol: 'BTC',
      name: 'Bitcoin',
      decimals: 6,
      icon: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',
    },
  "ETH": {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 6,
    icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
  },
}
```

`GET /tokens/prices`
### Description
Returns the prices for all tokens in USD

### Sample response
Status code: 200
``` Typescript
{
  "BTC": 30000.10,
  "ETH": 2000.20,
}
```

## Getting Started
### Install packages
1. Clone this repo
2. Make sure you have `npm` installed, 
3. Open a terminal and navigate to the source folder, then run:
```
npm install
```

### Start the server
Run this before attempting to start the front end server
```
npm run start:dev
```

This will spin with the server in http://localhost:3000

Now you are ready to start the front end server: https://github.com/yamiyukiharu/lacoco-exchange-web


## Testing
To run all unit tests
```
npm run test
```

To run all integration tests
```
npm run test:e2e
```
