import { Hammer } from 'lucide-react';
import Link from 'next/link';

export function SidebarLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 px-4 py-5">
      <Hammer className="h-6 w-6" />
      <span className="text-lg font-bold">Mini Jenkins</span>
    </Link>
  );
}
