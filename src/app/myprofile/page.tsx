'use client';

import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import React from 'react';

const ProfilePage = () => {
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-950">
                <div className="w-full max-w-md animate-pulse rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center space-x-4">
                        <div className="h-20 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                            <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-950">
                <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        You must be signed in to view this profile.
                    </p>
                </div>
            </div>
        );
    }


    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-950">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
           
                <div className="h-24" />

                <div className="relative px-6 pb-6">
                  
                    <div className="-mt-12 mb-4">
                        {user.image ? (
                            <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-sm dark:border-zinc-900">
                                <Image
                                    src={user.image}
                                    alt={user.name || 'User avatar'}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-zinc-200 text-xl font-semibold uppercase text-zinc-700 dark:border-zinc-900 dark:bg-zinc-800 dark:text-zinc-200">
                                {user.name?.[0] || user.email?.[0] || 'U'}
                            </div>
                        )}
                    </div>

                
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            {user.name || 'Anonymous User'}
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {user.email}
                        </p>
                    </div>

       
                    <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-zinc-500 dark:text-zinc-400">Display Name</dt>
                                <dd className="font-medium text-zinc-900 dark:text-zinc-200">
                                    {user.name || '—'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-zinc-500 dark:text-zinc-400">Email Address</dt>
                                <dd className="font-medium text-zinc-900 dark:text-zinc-200">
                                    {user.email || '—'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;