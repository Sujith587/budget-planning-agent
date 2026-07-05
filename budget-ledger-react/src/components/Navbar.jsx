import React from 'react';

/**
 * Top navigation bar. Lets the user switch between the budget planner
 * and their saved budget history.
 */
export default function Navbar({ activeTab, onTabChange }) {
  return (
    <div className="navbar">
      <h1>Budget Ledger</h1>
      <div className="tabs">
        <button
          className={activeTab === 'planner' ? 'active' : ''}
          onClick={() => onTabChange('planner')}
        >
          Planner
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => onTabChange('history')}
        >
          History
        </button>
      </div>
    </div>
  );
}
