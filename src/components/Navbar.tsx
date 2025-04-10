'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const { data: session } = useSession();
  const sanitizedEmail = session?.user?.email?.replace(/[^a-zA-Z0-9]/g, '_');

  return (
    <nav className="w-full bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-black dark:text-white">🌱 Seedling</span>
            </Link>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href={`/profile/${sanitizedEmail}`} className="flex items-center space-x-2">
                  <Image
                    src={session.user?.image || '/images/default-pfp.jpg'}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-black dark:text-white">{session.user?.name}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-black dark:text-white hover:text-neutral-600 dark:hover:text-neutral-400"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="text-black dark:text-white hover:text-neutral-600 dark:hover:text-neutral-400"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 