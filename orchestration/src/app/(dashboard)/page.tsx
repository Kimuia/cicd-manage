import { FolderGit2, Hammer, Container, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/shared/components/PageHeader';
import { projectService } from '@/entity/project';
import { buildService } from '@/entity/build';
import { containerService } from '@/entity/container';
import { agentService } from '@/entity/agent';

async function getDashboardStats() {
  const [projectsRes, buildsRes, containersRes, agentsRes] = await Promise.all([
    projectService.getList({ limit: 100 }),
    buildService.getList({ limit: 100 }),
    containerService.getList({ limit: 100 }),
    agentService.getList(),
  ]);

  const activeBuilds = buildsRes.builds.filter((b) => b.status === 'running' || b.status === 'queued').length;
  const runningContainers = containersRes.containers.filter((c) => c.status === 'running').length;
  const onlineAgents = agentsRes.agents.filter((a) => a.status === 'online' || a.status === 'busy').length;

  return {
    projects: projectsRes.projects.length,
    activeBuilds,
    runningContainers,
    onlineAgents,
    totalAgents: agentsRes.agents.length,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: '프로젝트', value: stats.projects, icon: FolderGit2, href: '/projects' },
    { label: '활성 빌드', value: stats.activeBuilds, icon: Hammer, href: '/builds' },
    { label: '실행 중 컨테이너', value: stats.runningContainers, icon: Container, href: '/containers' },
    { label: '온라인 에이전트', value: `${stats.onlineAgents}/${stats.totalAgents}`, icon: Server, href: '/agents' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="대시보드" description="CI/CD 시스템 현황" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <a key={card.label} href={card.href}>
            <Card className="transition-colors hover:border-foreground/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
