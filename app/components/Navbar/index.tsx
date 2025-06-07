"use client";
import Link from 'next/link';
import React, { useState } from 'react';

const navigation = [
    {name: 'Countries', href: '/countries', current: true, disabled: false},
    {name: 'States', href: '/countries', current: false, disabled: true},
    {name: 'Cities', href: '/countries', current: false, disabled: true},
];

function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    

    return (
        <nav className="bg-gray-800">
            <div className="px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            type="button"
                            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
                            aria-controls="mobile-menu"
                            aria-expanded={mobileMenuOpen}
                            onClick={() => setMobileMenuOpen((open) => !open)}
                        >
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>
                            {/* Hamburger icon */}
                            <svg
                                className={classNames(mobileMenuOpen ? 'hidden' : 'block', 'size-6')}
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            {/* Close icon */}
                            <svg
                                className={classNames(mobileMenuOpen ? 'block' : 'hidden', 'size-6')}
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <div className='font-medium text-2xl -rotate-3'>3D Visualization</div>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={classNames(
                                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            item.disabled ? 'opacity-50 cursor-not-allowed' : '', 'rounded-md px-3 py-2 text-base font-medium',
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile menu, show/hide based on state */}
            {mobileMenuOpen && (
                <div className="sm:hidden" id="mobile-menu">
                    <div className="space-y-1 px-2 pt-2 pb-3">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    item.disabled ? 'opacity-50 cursor-not-allowed' : '', 'block rounded-md px-3 py-2 text-base font-medium',
                                )}
                                aria-current={item.current ? 'page' : undefined}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
