'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Menu, X, LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const { 
        data: session, 
        isPending,
    } = authClient.useSession();

    const user = session?.user;

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/login');
                },
            },
        });
    };

    const navLinks = user
        ? [
            { name: 'Home', href: '/' },
            { name: 'All Books', href: '/all-books' },
            { name: 'Add Book', href: '/add-book' },
            { name: 'My Books', href: `/my-books/${user.email}` },
            { name: 'My Borrows', href: '/my-borrows' },
        ]
        : [
            { name: 'Home', href: '/' },
            { name: 'All Books', href: '/all-books' },
        ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="bg-indigo-600 text-white p-2 rounded-lg group-hover:bg-indigo-700 transition">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 tracking-wide">
                                BookNook
                            </span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm font-medium transition ${
                                        active
                                            ? 'text-indigo-600 font-semibold'
                                            : 'text-gray-600 hover:text-indigo-600'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {isPending ? (
                            <div className="h-9 w-20 bg-gray-100 animate-pulse rounded-lg" />
                        ) : user ? (
                            <div className="flex items-center space-x-4">
                                {user.name && (
                                    <span className="text-sm font-medium text-gray-700">
                                        {user.name}
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="inline-flex items-center space-x-1.5 text-gray-600 hover:text-red-600 text-sm font-medium px-3 py-2 rounded-md hover:bg-red-50 transition"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                                        isActive('/login')
                                            ? 'text-indigo-600 font-semibold'
                                            : 'text-gray-700 hover:text-indigo-600'
                                    }`}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

   
                    <div className="flex md:hidden items-center">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition"
                            aria-label="Toggle menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-2 shadow-lg transition-all">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition ${
                                    active
                                        ? 'bg-indigo-50 text-indigo-600 font-semibold'
                                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}

                    <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
                        {isPending ? (
                            <div className="h-10 bg-gray-100 animate-pulse rounded-lg" />
                        ) : user ? (
                            <>
                                {user.name && (
                                    <div className="px-3 py-1 text-sm text-gray-500">
                                        Signed in as <span className="font-medium text-gray-800">{user.name}</span>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false);
                                        handleSignOut();
                                    }}
                                    className="flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-base font-medium transition w-full text-center"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className={`block text-center px-3 py-2 rounded-md text-base font-medium transition ${
                                        isActive('/login')
                                            ? 'bg-indigo-50 text-indigo-600 font-semibold'
                                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-base font-medium shadow-sm transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;