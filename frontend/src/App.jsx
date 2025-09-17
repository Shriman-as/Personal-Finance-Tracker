import React, { useEffect, useState } from "react";
import "./App.css";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import SummaryView from "./components/SummaryView";
import { listTransactions, getSummary } from "./api";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);

  const refresh = async () => {
    const tx = await listTransactions();
    const formattedTx = tx.data.map((t) => {
      const date = new Date(t.timestamp);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return {
        ...t,
        timestamp: `${day}-${month}-${year}`,
      };
    });

    setTransactions(formattedTx);
    console.log("Fetched transactions:", formattedTx);
    const s = await getSummary();
    setSummary(s.data);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="App">
      <h1>PERSONAL FINANCE TRACKER</h1>

      <div className="main-layout">
        <div className="left-section">
          <div className="form-section">
            <TransactionForm onAdded={refresh} />
          </div>
          <div className="list-section">
            <TransactionList transactions={transactions} onChange={refresh} />
          </div>
        </div>

        <div className="right-section">
          <SummaryView summary={summary} />
        </div>
      </div>
    </div>
  );
}