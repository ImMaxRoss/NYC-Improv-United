import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './ui/Card';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-100 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-opacity-20 ${color}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </Card>
  );
};