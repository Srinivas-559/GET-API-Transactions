import express from 'express';
import { Connection, PublicKey } from '@solana/web3.js';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env.local
dotenv.config();

const solana_rpc_url = process.env.SOLANA_RPC_URL;
const wallet_address = process.env.WALLET_ADDRESS;
const app = express();
const port = 3000;
const walletAddress = wallet_address;
const connection = new Connection(solana_rpc_url, 'confirmed');

// Enable CORS for all routes
app.use(cors());

// Helper function to add a delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Retry logic for fetching transaction details with rate limiting
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
            return fetchTransactionWithRetry(signature, retries - 1, delayMs + 500);
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
            return {
                index: index + 1,
                signature: transaction.signature,
                date: date.toISOString(),
                status: transaction.confirmationStatus,
                slot: detailedTransaction?.slot || 'N/A',
                fee: detailedTransaction?.meta?.fee || 'N/A',
                accountKeys: detailedTransaction?.transaction?.message?.accountKeys || 'N/A',
                instruction: detailedTransaction?.transaction?.message?.instructions[0]?.data || 'N/A',
                error: detailedTransaction?.meta?.err ? JSON.stringify(detailedTransaction.meta.err) : 'None'
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
