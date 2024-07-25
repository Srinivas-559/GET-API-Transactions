
# A GET API for Transactions Details 

# OUTPUT 

<img width="1470" alt="Screenshot 2024-07-25 at 10 25 33 AM" src="https://github.com/user-attachments/assets/be3d296b-ac75-483c-b668-55ebf338b081">




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
  "status": "success",
  "message": "Activity retrieved successfully",
  "data": [
    {
      "uuid": "7a8b8bce-e447-4f5e-94ec-7426a12209a0",
      "network": "Solana",
      "fee": 5000,
      "compute_units_consumed": 150,
      "timestamp": "2024-07-23T09:29:14.000Z",
      "type": "send_token",
      "wallet_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
      "transaction_hash": "3ShMAXvJczacB1ALpBUdCAbx9FNdoMeAkurH2ePyLQ5t1HwYPi9iUdyn7rhoUogNzbsSdKkJWAZ16kbGSWWJfQTB",
      "metadata": {},
      "token": {
        "uuid": "1d6b90e2-335a-4d8b-957b-fd004d3012e6",
        "network": "Solana",
        "contract_address": "4UYjrT5hmMTh9pLFg1Mxh49besnAeCc23qFoZc6WnQkK",
        "name": "Wrapped SOL",
        "symbol": "SOL",
        "decimals": 9,
        "display_decimals": 2,
        "logo_url": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
      },
      "explorer_url": "https://solscan.io/tx/3ShMAXvJczacB1ALpBUdCAbx9FNdoMeAkurH2ePyLQ5t1HwYPi9iUdyn7rhoUogNzbsSdKkJWAZ16kbGSWWJfQTB?cluster=mainnet-beta"
    },
}
```


## URL Structure 

```
http://localhost:3000/transactions?NoOfTransactions=10

```
