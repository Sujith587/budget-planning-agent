import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = {
  Fixed: '#1B2430',
  Variable: '#6E8F6B',
  Goals: '#C7862B',
  Unallocated: '#DDDCD6',
};

/**
 * Visual allocation of income: the horizontal "ledger tape" bar
 * (kept from the original design) plus a pie chart breakdown.
 */
export default function AllocationChart({ fixed, variable, goals, remaining, income }) {
  const denom = income > 0 ? income : fixed + variable + goals || 1;

  const segments = [
    { label: 'Fixed', val: fixed },
    { label: 'Variable', val: variable },
    { label: 'Goals', val: goals },
  ].filter((s) => s.val > 0);

  if (remaining > 0 && income > 0) {
    segments.push({ label: 'Unallocated', val: remaining });
  }

  const fmt = (n) => {
    const sign = n < 0 ? '-' : '';
    return sign + '₹' + Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const pieData = segments.map((s) => ({ name: s.label, value: s.val }));

  return (
    <div>
      <div className="bar">
        {segments.map((seg) => (
          <div
            key={seg.label}
            style={{
              width: `${Math.max(0, (seg.val / denom) * 100)}%`,
              background: COLORS[seg.label],
            }}
          />
        ))}
      </div>
      <div className="legend">
        {segments.map((seg) => (
          <span key={seg.label}>
            <span className="swatch" style={{ background: COLORS[seg.label] }} />
            {seg.label}: {fmt(seg.val)}
          </span>
        ))}
      </div>

      {income > 0 && (
        <div className="chart-card" style={{ marginTop: 20, height: 220 }}>
          <h3>Allocation breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => fmt(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
