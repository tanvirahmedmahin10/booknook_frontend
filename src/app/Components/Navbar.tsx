'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Menu, X, User, LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsPopoverOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        setIsPopoverOpen(false);
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
            { name: 'My Borrows', href: `/my-borrows/${user.email}` },
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
                                    className={`text-sm font-medium transition ${active
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
                            <div className="h-10 w-10 bg-gray-100 animate-pulse rounded-full" />
                        ) : user ? (
                            <div className="relative" ref={popoverRef}>

                                <button
                                    type="button"
                                    onClick={() => setIsPopoverOpen((prev) => !prev)}
                                    className="relative flex items-center justify-center rounded-full p-0.5 ring-2 ring-transparent hover:ring-[#374151] transition cursor-pointer"
                                    aria-expanded={isPopoverOpen}
                                >
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt={user.name || 'User Avatar'}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-[#8c3b16] border-2 border-[#2b2b2b] flex items-center justify-center text-white font-semibold text-sm">
                                            {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                                        </div>
                                    )}
                                </button>


                                {isPopoverOpen && (
                                    <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white text-gray-800 shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">

                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
                                                {user.name || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500 leading-tight mt-1 truncate">
                                                {user.email}
                                            </p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href={`/my-books/${user.email}`}
                                                onClick={() => setIsPopoverOpen(false)}
                                                className="flex items-center space-x-2.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition"
                                            >
                                                <User className="h-4 w-4 text-gray-400" />
                                                <span>My Profile</span>
                                            </Link>
                                        </div>


                                        <div className="border-t border-gray-100 pt-1">
                                            <button
                                                type="button"
                                                onClick={handleSignOut}
                                                className="flex items-center space-x-2.5 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/login')
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
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                                className={`block px-3 py-2 rounded-md text-base font-medium transition ${active
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
                                <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt={user.name || 'User Avatar'}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="h-9 w-9 rounded-full bg-[#8c3b16] flex items-center justify-center text-white text-xs font-semibold">
                                            {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                                        </div>
                                    )}
                                    <div className="truncate">
                                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 leading-tight">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

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
                                    className={`block text-center px-3 py-2 rounded-md text-base font-medium transition ${isActive('/login')
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