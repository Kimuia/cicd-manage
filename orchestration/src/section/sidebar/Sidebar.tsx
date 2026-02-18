import { Separator } from '@/components/ui/separator';
import { SidebarLogo } from './components/SidebarLogo';
import { SidebarNav } from './components/SidebarNav';

export function Sidebar() {
  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-sidebar">
      <SidebarLogo />
      <Separator />
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav />
      </div>
    </aside>
  );
}
