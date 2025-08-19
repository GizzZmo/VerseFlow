import React from 'react';
const SDGs = [ 'No Poverty', 'Quality Education', ... ];
export function UNDashboard({ stats }) {
  return <div>
    <h2>UN2030 Impact Dashboard</h2>
    <ul>{SDGs.map((sdg, i) => (
      <li key={sdg}>{sdg}: {stats[sdg] || 0} collaborations</li>
    ))}</ul>
  </div>;
}