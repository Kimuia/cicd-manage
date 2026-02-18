import { agentService } from '@/entity/agent';
import { agentMonitorAdapter } from './agent-monitor.adapter';
import type { AgentMonitorView } from './agent-monitor.type';

export async function getAgentList(): Promise<AgentMonitorView[]> {
  const { agents } = await agentService.getList();
  return agentMonitorAdapter.toUIList(agents);
}
