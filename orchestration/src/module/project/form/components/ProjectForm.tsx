'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createProjectAction, updateProjectAction } from '../project-form.action';
import type { ProjectFormView } from '../project-form.type';

interface ProjectFormProps {
  mode: 'create' | 'edit';
  projectId?: string;
  defaultValues?: ProjectFormView;
}

export function ProjectForm({ mode, projectId, defaultValues }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get('name') as string,
      description: form.get('description') as string,
      gitUrl: form.get('gitUrl') as string,
      gitBranch: form.get('gitBranch') as string,
      dockerfilePath: form.get('dockerfilePath') as string,
      buildArgs: form.get('buildArgs') as string,
      envVars: form.get('envVars') as string,
      portMappings: form.get('portMappings') as string,
    };

    startTransition(async () => {
      const result = mode === 'create'
        ? await createProjectAction(data)
        : await updateProjectAction(projectId!, data);

      if (result.success) {
        router.push(result.data?.id ? `/projects/${result.data.id}` : '/projects');
      } else if (result.fieldErrors) {
        setErrors(result.fieldErrors);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? '새 프로젝트' : '프로젝트 수정'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">프로젝트명 *</Label>
            <Input id="name" name="name" defaultValue={defaultValues?.name} required />
            {errors.name && <p className="text-sm text-destructive">{errors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea id="description" name="description" defaultValue={defaultValues?.description} rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gitUrl">Git URL *</Label>
              <Input id="gitUrl" name="gitUrl" defaultValue={defaultValues?.gitUrl} placeholder="https://github.com/..." required />
              {errors.gitUrl && <p className="text-sm text-destructive">{errors.gitUrl[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gitBranch">Branch</Label>
              <Input id="gitBranch" name="gitBranch" defaultValue={defaultValues?.gitBranch ?? 'main'} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dockerfilePath">Dockerfile 경로</Label>
            <Input id="dockerfilePath" name="dockerfilePath" defaultValue={defaultValues?.dockerfilePath ?? 'Dockerfile'} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buildArgs">Build Args (JSON)</Label>
            <Textarea id="buildArgs" name="buildArgs" defaultValue={defaultValues?.buildArgs} rows={2} placeholder='{"KEY": "VALUE"}' className="font-mono text-sm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="envVars">환경 변수 (JSON)</Label>
            <Textarea id="envVars" name="envVars" defaultValue={defaultValues?.envVars} rows={2} placeholder='{"KEY": "VALUE"}' className="font-mono text-sm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portMappings">포트 매핑 (JSON)</Label>
            <Textarea id="portMappings" name="portMappings" defaultValue={defaultValues?.portMappings} rows={2} placeholder='[{"host": 8080, "container": 80}]' className="font-mono text-sm" />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? '저장 중...' : (mode === 'create' ? '생성' : '저장')}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              취소
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
