import React, { useState } from "react";
import { addTransaction } from "../api";
import "./TransactionForm.css";

export default function TransactionForm({ onAdded }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [tags, setTags] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTransaction({
        description,
        amount: parseFloat(amount),
        transaction_type: type,
        tags,
      });
      window.alert("New Transaction Added Successfully");
      setDescription("");
      setAmount("");
      setTags([]);
      onAdded();
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("Duplicate transaction detected: " + err.response.data.detail);
      } else {
        alert("Error: " + (err.response?.data?.detail || err.message));
      }
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3 className="transaction-title">ADD TRANSACTION</h3>
      <div className="form-row">
        <input
          className="form-input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          className="form-input"
          placeholder="Amount"
          value={amount}
          type="number"
          step="0.01"
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select
          className="form-input"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button className="form-button" type="submit">
          Add
        </button>
      </div>
    </form>
  );
}
