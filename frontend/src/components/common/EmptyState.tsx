import type { LucideIcon } from 'lucide-react';

export default function EmptyState({ title, description, icon: Icon }: { title: string; description?: string; icon?: LucideIcon }) {
  return (
    <div className="text-center py-16">
      {Icon && <Icon className="mx-auto text-gray-300 mb-4" size={48} />}
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {description && <p className="text-gray-500 mt-1">{description}</p>}
    </div>
  );
}
