import { Server, HardDrive, MemoryStick } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { TimeAgo } from '@/shared/components/TimeAgo';
import { formatBytes } from '@/shared/utils/format-bytes';
import { AGENT_STATUS_LABEL, AGENT_STATUS_VARIANT, AGENT_TYPE_LABEL } from '@/entity/agent';
import type { AgentMonitorView } from '../agent-monitor.type';

interface AgentCardProps {
  agent: AgentMonitorView;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Server className="h-4 w-4" />
            {agent.hostname}
          </CardTitle>
          <StatusBadge
            label={AGENT_STATUS_LABEL[agent.status]}
            variant={AGENT_STATUS_VARIANT[agent.status]}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">타입</span>
            <span>{AGENT_TYPE_LABEL[agent.type]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">IP</span>
            <span className="font-mono text-xs">{agent.ipAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Docker</span>
            <span className="text-xs">{agent.capabilities.dockerVersion}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-muted-foreground">
              <HardDrive className="h-3 w-3" />
              디스크
            </span>
            <span>{formatBytes(agent.capabilities.diskSpace)}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1 text-muted-foreground">
              <MemoryStick className="h-3 w-3" />
              메모리
            </span>
            <span>{formatBytes(agent.capabilities.memory)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">마지막 하트비트</span>
            <TimeAgo date={agent.lastHeartbeatAt} className="text-xs" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
