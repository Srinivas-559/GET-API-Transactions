import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedInstructions, setExpandedInstructions] = useState({});

    useEffect(() => {
        axios.get('http://localhost:3000/transactions')
            .then(response => {
                setTransactions(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleToggleExpand = (signature) => {
        setExpandedRows(prevState => ({
            ...prevState,
            [signature]: !prevState[signature]
        }));
    };

    const handleToggleExpandInstruction = (signature) => {
        setExpandedInstructions(prevState => ({
            ...prevState,
            [signature]: !prevState[signature]
        }));
    };

    if (loading) return <div className="d-flex justify-content-center"><div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div></div>;
    if (error) return <p className="text-danger">Error: {error.message}</p>;

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Transactions</h1>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>Index</th>
                            <th>Signature</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Slot</th>
                            <th>Fee</th>
                            <th>Account Keys</th>
                            <th>Instruction</th>
                            <th>Error</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.signature} className={expandedRows[transaction.signature] ? 'expanded' : ''}>
                                <td>{transaction.index}</td>
                                <td>{transaction.signature}</td>
                                <td>{transaction.date}</td>
                                <td>{transaction.status}</td>
                                <td>{transaction.slot}</td>
                                <td>{transaction.fee}</td>
                                <td>
                                    {expandedRows[transaction.signature] ? transaction.accountKeys.join(', ') : `${transaction.accountKeys.slice(0, 2).join(', ')}...`}
                                    <button 
                                        className="btn btn-link p-0" 
                                        onClick={() => handleToggleExpand(transaction.signature)}>
                                        {expandedRows[transaction.signature] ? 'See Less' : 'See More'}
                                    </button>
                                </td>
                                <td>
                                    {expandedInstructions[transaction.signature] ? transaction.instruction : `${transaction.instruction.slice(0, 20)}...`}
                                    <button 
                                        className="btn btn-link p-0" 
                                        onClick={() => handleToggleExpandInstruction(transaction.signature)}>
                                        {expandedInstructions[transaction.signature] ? 'See Less' : 'See More'}
                                    </button>
                                </td>
                                <td>{transaction.error || 'N/A'}</td>
                                <td>{transaction.metadata?.amount || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
