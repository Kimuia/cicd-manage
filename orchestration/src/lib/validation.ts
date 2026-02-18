import { z } from 'zod';

export const agentRegisterSchema = z.object({
  agentId: z.string().min(1),
  agentType: z.enum(['build', 'deploy']),
  hostname: z.string().min(1),
  ipAddress: z.string().min(1),
  capabilities: z.object({
    dockerVersion: z.string(),
    gitVersion: z.string().optional(),
    diskSpace: z.number(),
    memory: z.number(),
  }),
  publicKey: z.string().optional(),
});

export const heartbeatSchema = z.object({
  timestamp: z.number(),
  status: z.enum(['online', 'busy']),
  currentJobs: z.array(z.string()),
  metrics: z.object({
    cpuUsage: z.number(),
    memoryUsage: z.number(),
    diskUsage: z.number(),
  }),
});

export const projectCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional().default(''),
  gitUrl: z.string().url(),
  gitBranch: z.string().optional().default('main'),
  dockerfilePath: z.string().optional().default('Dockerfile'),
  buildArgs: z.record(z.string()).optional().default({}),
  envVars: z.record(z.string()).optional().default({}),
  portMappings: z
    .array(z.object({ host: z.number(), container: z.number() }))
    .optional()
    .default([]),
});

export const projectUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  gitUrl: z.string().url().optional(),
  gitBranch: z.string().optional(),
  dockerfilePath: z.string().optional(),
  buildArgs: z.record(z.string()).optional(),
  envVars: z.record(z.string()).optional(),
  portMappings: z
    .array(z.object({ host: z.number(), container: z.number() }))
    .optional(),
});

export const buildTriggerSchema = z.object({
  gitBranch: z.string().optional(),
  gitCommit: z.string().optional(),
});

export const deploymentCreateSchema = z.object({
  projectId: z.string().min(1),
  buildId: z.string().min(1),
  envVars: z.record(z.string()).optional().default({}),
});

export const listQuerySchema = z.object({
  status: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0),
});
