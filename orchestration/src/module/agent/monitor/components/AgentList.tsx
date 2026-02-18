import { AgentCard } from './AgentCard';
import type { AgentMonitorView } from '../agent-monitor.type';

interface AgentListProps {
  agents: AgentMonitorView[];
}

export function AgentList({ agents }: AgentListProps) {
  const buildAgents = agents.filter((a) => a.type === 'build');
  const deployAgents = agents.filter((a) => a.type === 'deploy');

  return (
    <div className="space-y-6">
      {buildAgents.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">빌드 에이전트</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {buildAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      )}
      {deployAgents.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">배포 에이전트</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deployAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
