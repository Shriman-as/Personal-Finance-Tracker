import React from "react";
import landingImage from "./logoo.png";
import logoImage from "./logo.png";
import newImage from "./landingimage.png";
import "./LandingPage.css";

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="landing-container">
      <div className="landing-left">
        <img src={logoImage} alt="Personal Finance Tracker Logo" className="landing-logo" />
        <h4 className="landing-title">WELCOME TO THE PERSONAL FINANCE TRACKER</h4>
        <p className="landing-summary">
          Take control of your finances with ease! Track your income, expenses,
          and monthly savings in one place. Get detailed summaries, interactive charts,
          and insights that help you manage money smarter.
        </p>

        <button className="get-started-btn" onClick={onGetStarted}>
          Get Started
        </button>
      </div>

      <div className="landing-right">
        <img
          src={newImage}
          alt="Descriptive text for the new image"
          className="landing-image-right"
        />
      </div>
    </div>
  );
}