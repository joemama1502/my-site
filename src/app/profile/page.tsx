'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfileRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated' && session?.user?.email) {
      const sanitizedEmail = session.user.email.replace(/[^a-zA-Z0-9]/g, '_');
      router.replace(`/profile/${sanitizedEmail}`);
    } else {
      router.replace('/');
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
    </div>
  );
}

