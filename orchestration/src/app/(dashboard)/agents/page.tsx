import { Server } from 'lucide-react';
import { PageHeader } from '@/shared/components/PageHeader';
import { EmptyState } from '@/shared/components/EmptyState';
import { getAgentList, AgentList } from '@/module/agent/monitor';

export default async function AgentsPage() {
  const agents = await getAgentList();

  return (
    <div className="space-y-6">
      <PageHeader title="에이전트" description="빌드/배포 에이전트 모니터링" />

      {agents.length === 0 ? (
        <EmptyState
          icon={Server}
          title="등록된 에이전트가 없습니다"
          description="build-server 또는 deploy-server를 실행하면 자동으로 등록됩니다."
        />
      ) : (
        <AgentList agents={agents} />
      )}
    </div>
  );
}
