'use client';

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const sessionsData = [
  { month: 'Jan', sessions: 12 }, { month: 'Feb', sessions: 19 }, { month: 'Mar', sessions: 28 },
  { month: 'Apr', sessions: 35 }, { month: 'May', sessions: 41 }, { month: 'Jun', sessions: 58 },
  { month: 'Jul', sessions: 72 },
];

const categoryData = [
  { category: 'Engineering', experts: 180, sessions: 420 },
  { category: 'Product', experts: 95, sessions: 210 },
  { category: 'Design', experts: 72, sessions: 185 },
  { category: 'Startup', experts: 88, sessions: 310 },
  { category: 'Data/AI', experts: 65, sessions: 240 },
  { category: 'Finance', experts: 45, sessions: 130 },
];

const CHART_COLORS = { brand: '#6366f1', purple: '#a855f7', pink: '#f472b6', green: '#10b981' };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'rgba(18,18,22,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.75rem 1rem', backdropFilter: 'blur(12px)' }}>
        <p style={{ color: '#a1a1aa', fontSize: '0.75rem', marginBottom: '0.4rem' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color, fontSize: '0.875rem', fontWeight: 600 }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function DashboardCharts() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {/* Sessions over time */}
      <div className="glass-panel" style={{ borderRadius: '1.25rem', padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem', color: '#fafafa' }}>Sessions Over Time</h3>
        <p style={{ fontSize: '0.78rem', color: '#71717a', marginBottom: '1.5rem' }}>Monthly platform activity</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={sessionsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.brand} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.brand} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="sessions" stroke={CHART_COLORS.brand} strokeWidth={2} fill="url(#sessionsGrad)" dot={{ fill: CHART_COLORS.brand, strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: CHART_COLORS.brand }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Expert categories */}
      <div className="glass-panel" style={{ borderRadius: '1.25rem', padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem', color: '#fafafa' }}>Experts by Category</h3>
        <p style={{ fontSize: '0.78rem', color: '#71717a', marginBottom: '1.5rem' }}>Distribution across domains</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={categoryData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="category" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#71717a' }} />
            <Bar dataKey="experts" name="Experts" fill={CHART_COLORS.brand} radius={[4, 4, 0, 0]} />
            <Bar dataKey="sessions" name="Sessions" fill={CHART_COLORS.purple} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
