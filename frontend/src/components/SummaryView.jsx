import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "./SummaryView.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function SummaryView({ summary }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState(""); // table | pie | bar
  const recordsPerPage = 5;

  const safeSummary = Array.isArray(summary) ? summary : [];
  const totalPages = Math.ceil(safeSummary.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = safeSummary.slice(startIndex, startIndex + recordsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Monthly savings prediction
  const predictNextMonthSavings = () => {
    if (!summary.length) return 0;
    const savings = summary.map((s) => (s.income || 0) - (s.expense || 0));
    return (savings.reduce((a, b) => a + b, 0) / savings.length).toFixed(2);
  };

  // Chart data
  const safestSummary = Array.isArray(summary) ? summary : [];
  const categories = [...new Set(safestSummary.map((s) => s.category))];
  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Expense",
        data: categories.map((cat) =>
          summary
            .filter((s) => s.category === cat)
            .reduce((acc, s) => acc + (s.expense || 0), 0)
        ),
        backgroundColor: "rgba(255, 159, 64, 0.8)",
      },
      {
        label: "Income",
        data: categories.map((cat) =>
          summary
            .filter((s) => s.category === cat)
            .reduce((acc, s) => acc + (s.income || 0), 0)
        ),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
    ],
  };

  return (
    <div className="summary-container">
      <h3 className="summary-title">MONTHLY SUMMARY</h3>
      {/* Conditional Rendering with Fade-In */}
      {view === "" && <p className="placeholder-text">Select a view to display data</p>}
      {/* View Selection Buttons */}
      <div className="view-buttons">
        <button
          className={`view-btn ${view === "table" ? "active" : ""}`}
          onClick={() => setView("table")}
        >
          Table View
        </button>
        <button
          className={`view-btn ${view === "pie" ? "active" : ""}`}
          onClick={() => setView("pie")}
        >
          Pie Chart
        </button>
        <button
          className={`view-btn ${view === "bar" ? "active" : ""}`}
          onClick={() => setView("bar")}
        >
          Bar Chart
        </button>
      </div>

      {view === "table" && (
        <div className="fade-in">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Category</th>
                <th>Income</th>
                <th>Expense</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.month}</td>
                    <td>{s.category}</td>
                    <td>{s.income?.toFixed(2) ?? "0.00"}</td>
                    <td>{s.expense?.toFixed(2) ?? "0.00"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    No Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              <span className="page-info">
                {currentPage} / {totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          )}

          <div className="forecast">
            Predicted Savings Next Month: {predictNextMonthSavings()}
          </div>
        </div>
      )}

      {view === "pie" && (
        <div className="fade-in">
          <div className="pie-charts">
            {/* Expense Pie */}
            <div className="single-pie">
              <h4>Expense Breakdown</h4>
              <Pie
                data={{
                  labels: categories,
                  datasets: [
                    {
                      label: "Expense",
                      data: categories.map((cat) =>
                        summary
                          .filter((s) => s.category === cat)
                          .reduce((acc, s) => acc + (s.expense || 0), 0)
                      ),
                      backgroundColor: [
                        "rgba(255, 179, 71, 0.8)",
                        "rgba(102, 204, 255, 0.8)",
                        "rgba(255, 102, 102, 0.8)",
                        "rgba(153, 255, 153, 0.8)",
                        "rgba(255, 215, 0, 0.8)",
                        "rgba(221, 160, 221, 0.8)",
                      ],
                    },
                  ],
                }}
              />
            </div>

            {/* Income Pie */}
            <div className="single-pie">
              <h4>Income Breakdown</h4>
              <Pie
                data={{
                  labels: categories,
                  datasets: [
                    {
                      label: "Income",
                      data: categories.map((cat) =>
                        summary
                          .filter((s) => s.category === cat)
                          .reduce((acc, s) => acc + (s.income || 0), 0)
                      ),
                      backgroundColor: [
                        "rgba(255, 179, 71, 0.8)",
                        "rgba(102, 204, 255, 0.8)",
                        "rgba(255, 102, 102, 0.8)",
                        "rgba(153, 255, 153, 0.8)",
                        "rgba(255, 215, 0, 0.8)",
                        "rgba(221, 160, 221, 0.8)",
                      ],
                    },
                  ],
                }}
              />
            </div>
          </div>
          <div className="forecast">
            Predicted Savings Next Month: {predictNextMonthSavings()}
          </div>
        </div>
      )}

      {view === "bar" && (
        <div>
          <div className="fade-in chart-container">
            <Bar data={chartData} />
          </div>
          <div className="forecast">
            Predicted Savings Next Month: {predictNextMonthSavings()}
          </div>
        </div>
      )}
    </div>
  );
}