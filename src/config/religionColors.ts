import { Religion } from '@/contexts/AppContext';

export interface ReligionColorConfig {
  bg: string;
  bgHover: string;
  text: string;
  marker: string;
  shadow: string;
}

export const religionColors: Record<Religion, ReligionColorConfig> = {
  christianity: {
    bg: 'bg-blue-500',
    bgHover: 'hover:bg-blue-600',
    text: 'text-white',
    marker: '#3b82f6',
    shadow: '0 0 20px rgba(59, 130, 246, 0.6)',
  },
  islam: {
    bg: 'bg-green-500',
    bgHover: 'hover:bg-green-600',
    text: 'text-white',
    marker: '#10b981',
    shadow: '0 0 20px rgba(16, 185, 129, 0.6)',
  },
  judaism: {
    bg: 'bg-yellow-500',
    bgHover: 'hover:bg-yellow-600',
    text: 'text-white',
    marker: '#eab308',
    shadow: '0 0 20px rgba(234, 179, 8, 0.6)',
  },
  buddhism: {
    bg: 'bg-orange-500',
    bgHover: 'hover:bg-orange-600',
    text: 'text-white',
    marker: '#f97316',
    shadow: '0 0 20px rgba(249, 115, 22, 0.6)',
  },
  hinduism: {
    bg: 'bg-red-500',
    bgHover: 'hover:bg-red-600',
    text: 'text-white',
    marker: '#ef4444',
    shadow: '0 0 20px rgba(239, 68, 68, 0.6)',
  },
  astronomy: {
    bg: 'bg-purple-500',
    bgHover: 'hover:bg-purple-600',
    text: 'text-white',
    marker: '#a855f7',
    shadow: '0 0 20px rgba(168, 85, 247, 0.6)',
  },
  traditional: {
    bg: 'bg-amber-600',
    bgHover: 'hover:bg-amber-700',
    text: 'text-white',
    marker: '#d97706',
    shadow: '0 0 20px rgba(217, 119, 6, 0.6)',
  },
  atheism: {
    bg: 'bg-gray-500',
    bgHover: 'hover:bg-gray-600',
    text: 'text-white',
    marker: '#6b7280',
    shadow: '0 0 20px rgba(107, 114, 128, 0.6)',
  },
};
