import Docker from 'dockerode';

/** Unix 소켓을 통한 로컬 Docker 데몬 클라이언트 */
export const docker = new Docker({ socketPath: '/var/run/docker.sock' });
