import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="flex h-14 items-center border-b px-6">
      <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
        <Activity className="h-4 w-4" />
        <span>CI/CD System</span>
      </div>
    </header>
  );
}
