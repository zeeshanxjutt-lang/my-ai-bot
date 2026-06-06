'use client';

interface QuickCategoriesProps {
  onSelect: (text: string) => void;
}

export function QuickCategories({ onSelect }: QuickCategoriesProps) {
  const categories = [
    { label: 'Account Help', emoji: '👤' },
    { label: 'Password Reset', emoji: '🔐' },
    { label: 'Billing', emoji: '💳' },
    { label: 'Technical Issue', emoji: '🔧' },
    { label: 'Subscription', emoji: '📱' },
    { label: 'Features', emoji: '⚙️' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {categories.map((cat) => (
        <button
          key={cat.label}
          onClick={() => onSelect(cat.label)}
          className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-3 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
        >
          <span>{cat.emoji}</span>
          <span className="truncate">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
