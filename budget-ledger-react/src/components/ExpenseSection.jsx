import React from 'react';

/**
 * Reusable section for a list of expense line items.
 * Used for both "Fixed Expenses" and "Variable Expenses" so the
 * add / edit / delete logic only lives in one place.
 *
 * props:
 *  - title: section heading, e.g. "Fixed Expenses"
 *  - items: [{ id, name, amount }]
 *  - onChange(items): called whenever items change
 */
export default function ExpenseSection({ title, items, onChange }) {
  const updateItem = (id, field, value) => {
    onChange(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const addItem = () => {
    const newId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    onChange([...items, { id: newId, name: '', amount: '' }]);
  };

  const removeItem = (id) => {
    onChange(items.filter((it) => it.id !== id));
  };

  return (
    <div className="section">
      <div className="section-head">
        <h2>{title}</h2>
        <button className="add-btn" onClick={addItem}>
          + add line
        </button>
      </div>
      {items.map((item) => (
        <div className="row" key={item.id}>
          <input
            type="text"
            placeholder="Category name"
            value={item.name}
            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
          />
          <div className="amt-wrap">
            <input
              type="number"
              placeholder="0"
              value={item.amount}
              onChange={(e) =>
                updateItem(item.id, 'amount', e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          </div>
          <button className="del" onClick={() => removeItem(item.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
