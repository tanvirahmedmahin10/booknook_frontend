
'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Menu, X, User, LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

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

  const closeMenu = () => {
    setIsOpen(false);
    setIsPopoverOpen(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

 const handleSignOut = async () => {
  closeMenu();

  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        toast.error('You Logged Out');
        router.push('/login');
      },
    },
  });
};

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-16 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-indigo-600" />

            <span className="text-xl font-bold text-gray-900">
              BookNook
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition ${
                  isActive(link.href)
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">

            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
            ) : user ? (
              <div className="relative" ref={popoverRef}>

                <button
                  onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  className="flex items-center justify-center rounded-full"
                  aria-label="Open profile menu"
                  aria-expanded={isPopoverOpen}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">
                      {user.name?.slice(0, 2).toUpperCase() || 'U'}
                    </div>
                  )}
                </button>
                {isPopoverOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2">

                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href={`/myprofile`}
                      onClick={closeMenu}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User size={16} />
                      My Profile
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>

                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={23} /> : <Menu size={23} />}
            </button>

          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3">

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.href)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {!user && !isPending && (
            <div className="flex gap-3 border-t border-gray-100 mt-3 pt-3">

              <Link
                href="/login"
                onClick={closeMenu}
                className="flex-1 text-center py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={closeMenu}
                className="flex-1 text-center py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
              >
                Register
              </Link>

            </div>
          )}

        </div>
      )}
    </nav>
  );
};

export default Navbar;
