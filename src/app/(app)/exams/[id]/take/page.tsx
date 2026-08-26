'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ExamTakeRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // Redirect to the exam-taking interface (outside the app shell)
    router.replace(`/exam/${params.id}`);
  }, [params.id, router]);

  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
