import express from 'express';
import { Connection, PublicKey } from '@solana/web3.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';


dotenv.config();

const solana_rpc_url = process.env.SOLANA_RPC_URL;
const wallet_address = process.env.WALLET_ADDRESS;

const app = express();
const port = 3000;
const walletAddress = wallet_address; 
const connection = new Connection(solana_rpc_url, 'confirmed'); 

// Helper function to add a delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


const fetchTransactionWithRetry = async (signature, retries = 3, delayMs = 500) => {
  try {
    const transaction = await connection.getTransaction(signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0
    });
    return transaction;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying transaction ${signature} after ${delayMs}ms due to: ${error.message}`);
      await delay(delayMs);
      return fetchTransactionWithRetry(signature, retries - 1, delayMs + 500); // Increase delay between retries
    }
    throw error;
  }
};

// Function to get detailed transaction information
const getTransactions = async (address, numTx) => {
  const pubKey = new PublicKey(address);
  const transactionList = await connection.getSignaturesForAddress(pubKey, { limit: numTx });

  const detailedTransactions = await Promise.all(transactionList.map(async (transaction, index) => {
    try {
      const detailedTransaction = await fetchTransactionWithRetry(transaction.signature);
      const date = new Date(transaction.blockTime * 1000);
      const accountKeys = detailedTransaction?.transaction?.message?.accountKeys;
      const instructions = detailedTransaction?.transaction?.message?.instructions;

      return {
        uuid: uuidv4(),
        network: "Solana",
        fee: detailedTransaction?.meta?.fee || 'N/A',
        compute_units_consumed: detailedTransaction?.meta?.computeUnitsConsumed || 'N/A',
        timestamp: date.toISOString(),
        type: instructions ? "send_token" : "receive_token",
        wallet_address: address,
        transaction_hash: transaction.signature,
        metadata: {
          amount: instructions ? instructions[0]?.parsed?.info?.amount : 'N/A'
        },
        token: {
          uuid: uuidv4(),
          network: "Solana",
          contract_address: accountKeys ? accountKeys[0]?.toBase58() : 'N/A',
          name: "Wrapped SOL",
          symbol: "SOL",
          decimals: 9,
          display_decimals: 2,
          logo_url: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
        },
        explorer_url: `https://solscan.io/tx/${transaction.signature}?cluster=mainnet-beta`
      };
    } catch (error) {
      console.error(`Failed to process transaction ${transaction.signature}: ${error.message}`);
      return null;
    }
  }));

  return detailedTransactions.filter(tx => tx !== null);
};

app.get('/transactions', async (req, res) => {
  try {
    const numTx = parseInt(req.query.NoOfTransactions, 10);
    const transactions = await getTransactions(walletAddress, isNaN(numTx) || numTx <= 0 ? 10 : numTx);
    res.json({
      status: "success",
      message: "Activity retrieved successfully",
      data: transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve transactions' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
