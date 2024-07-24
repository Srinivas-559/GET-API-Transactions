
# A GET API for Transactions Details 




## Environment Variables

To run this code , you will need to add the following environment variables to your .env file

`SOLANA_RPC_URL` - RPC end point

`WALLET_ADDRESS` - Key of the wallet 

The above variables should be declared and initialized in 

`.env` file





## Deployment


For Deploying this project you need a Node.js Enviroment and
need some packages which are listed in package.json 



After setting up the `.env` file run these commands in the terminal and then open localhost which will be given after deployment

```bash
 npm init
```

```bash
    node index.js
```




## Transaction Response Sample

```
{
    "index": 1,
    "signature": "3ShMAXvJczacB1ALpBUdCAbx9FNdoMeAkurH2ePyLQ5t1HwYPi9iUdyn7rhoUogNzbsSdKkJWAZ16kbGSWWJfQTB",
    "date": "2024-07-23T09:29:14.000Z",
    "status": "finalized",
    "slot": 279183092,
    "fee": 5000,
    "accountKeys": [
      "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
      "ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
      "11111111111111111111111111111111"
    ],
    "instruction": "3Bxs4ffTu9T19DNF",
    "error": "None"
  },
```


## URL Structure 

```
http://localhost:3000/transactions?NoOfTransactions=10

```