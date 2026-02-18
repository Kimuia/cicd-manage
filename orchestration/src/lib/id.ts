import { v4 as uuidv4 } from 'uuid';

function prefixedId(prefix: string): string {
  return `${prefix}_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
}

export const generateId = {
  project: () => prefixedId('proj'),
  build: () => prefixedId('build'),
  deployment: () => prefixedId('deploy'),
  container: () => prefixedId('ctr'),
  user: () => prefixedId('user'),
};
