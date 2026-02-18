export const PROJECT_TAGS = {
  list: 'projects',
  detail: (id: string) => `project-${id}`,
  all: (id?: string) => (id ? ['projects', `project-${id}`] : ['projects']),
} as const;
