import React from 'react';

export interface ActionTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface ActionTabsProps {
  tabs: ActionTab[];
  className?: string;
}

const ActionTabs: React.FC<ActionTabsProps> = ({ tabs, className = '' }) => {
  return (
    <div className={`flex justify-around pt-6 border-t border-gray-200 ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={tab.onClick}
          className="flex flex-col items-center gap-2 text-gray-600 hover:text-red-500 pb-4 transition"
        >
          <div className="w-6 h-6">{tab.icon}</div>
          <span className="text-xs">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ActionTabs;
