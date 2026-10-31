"use client"

import { useCustomAuth } from "@/app/context/CustomAuthProvider"
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

function isAdmin(email: string | null | undefined) {
    if (!email) return false;
    const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",");
    return admins.includes(email);
}

export default function AuthButton() {
    const { user, isLoading, login, logout } = useCustomAuth()

    if (isLoading) {
        // Loading state
        return (
            <div className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300">
                Loading...
            </div>
        )
    }

    if (!user) {
        // Not logged in - show Sign In button
        return (
            <button
                onClick={() => login()}
                className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
                Sign In
            </button>
        )
    }

    // Logged in - show email with dropdown for Sign Out
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <span className="max-w-[200px] truncate">{user.email}</span>
                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => logout()}
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block w-full text-left px-4 py-2 text-sm'
                                    )}
                                >
                                    Sign Out
                                </button>
                            )}
                        </Menu.Item>
                        {isAdmin(user.email) && (
                            <>
                                <div className="border-t border-gray-100 my-1" />
                                <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    管理员工作台
                                </div>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="/products/manage"
                                            className={classNames(
                                                active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700',
                                                'block w-full text-left px-4 py-2 text-sm'
                                            )}
                                        >
                                            🛠️ 产品库管理
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="/products/create"
                                            className={classNames(
                                                active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700',
                                                'block w-full text-left px-4 py-2 text-sm'
                                            )}
                                        >
                                            ➕ 添加新产品
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="/articles/create"
                                            className={classNames(
                                                active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700',
                                                'block w-full text-left px-4 py-2 text-sm'
                                            )}
                                        >
                                            📝 撰写评测/文章
                                        </a>
                                    )}
                                </Menu.Item>
                            </>
                        )}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
