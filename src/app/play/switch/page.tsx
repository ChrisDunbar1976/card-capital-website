import type { Metadata } from 'next';
import { SwitchGame } from '@/components/play/SwitchGame';

export const metadata: Metadata = {
  title: 'Play Switch',
  description:
    'Play Switch in your browser against the saloon’s AI — the classic shedding game. Empty your hand first.',
};

export default function SwitchPage() {
  return <SwitchGame />;
}
