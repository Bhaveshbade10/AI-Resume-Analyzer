'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

type Props = {
  skills: string[];
  missingSkills: string[];
};

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export function SkillsChart({ skills, missingSkills }: Props) {
  const total = skills.length + missingSkills.length;
  const data = [
    ...skills.slice(0, 5).map((s, i) => ({ name: s, value: 1, fill: COLORS[i % COLORS.length] })),
    ...(missingSkills.length ? [{ name: 'Missing', value: missingSkills.length, fill: '#94a3b8' }] : []),
  ].filter((d) => d.value > 0);

  if (data.length === 0) return <p className="text-slate-500 text-sm">No skill data yet.</p>;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={data[i].fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
