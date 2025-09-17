import React, { useState } from "react";
import { deleteTransaction, reclassifyTransaction } from "../api";
import "./TransactionList.css";

export default function TransactionList({ transactions, onChange }) {
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleDelete = async (id) => {
    if (!window.confirm("Delete transaction?")) return;
    await deleteTransaction(id);
    onChange();
  };

  const startEdit = (id, currentCategory) => {
    setEditingId(id);
    setNewCategory(currentCategory || "");
  };

  const saveCategory = async (id) => {
    await reclassifyTransaction(id, newCategory);
    setEditingId(null);
    setNewCategory("");
    onChange();
  };

  const exportCSV = () => {
    const csv = [
      ["ID", "Description", "Amount", "Type", "Category", "Time"],
      ...transactions.map((t) => [
        t.id,
        t.description,
        t.amount,
        t.transaction_type,
        t.category || "Uncategorized",
        new Date(t.timestamp).toLocaleString(),
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const totalPages = Math.ceil(safeTransactions.length / pageSize);
  const paginatedTransactions = safeTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="transaction-container fade-in">
      <h3 className="transaction-title">TRANSACTIONS</h3>

      <table className="transactions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.length ? (
            paginatedTransactions.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.description}</td>
                <td>{Math.abs(t.amount).toFixed(2)}</td>
                <td>{t.transaction_type}</td>
                <td className="category-column">
                  {editingId === t.id ? (
                    <div className="input-wrapper">
                      <input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                    </div>
                  ) : (
                    t.category || "Uncategorized"
                  )}
                </td>
                <td>{(t.timestamp).toLocaleString()}</td>
                <td className="action-buttons-cell">
                  {editingId === t.id ? (
                    <>
                      <button
                        onClick={() => saveCategory(t.id)}
                        className="action-button update-button"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="action-button update-button"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(t.id, t.category)}
                        className="action-button update-button"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="action-button update-button"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">
                No Transactions Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <span className="page-info">
            {currentPage} / {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}

      <p className="export-info">
        Click below button to download all your transactions as a CSV file for
        easy sharing or backup.
      </p>
      <div className="export-btn-container">
        <button onClick={exportCSV} className="form-button export-btn">
          Export Transaction Data
        </button>
      </div>
    </div>
  );
}
