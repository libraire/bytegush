"use client";
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import NavDropDown from './dropdown';
import AuthButton from "./AuthButton"
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from './logo';


function classNames(path: string, tabs: string[], ...classes: string[]): string {

  var clzes = classes.filter(Boolean).join(' ')
  if (tabs.some((tab) => tab == path)) {
    clzes += " border-indigo-500 text-gray-900 "
  } else {
    clzes += " border-transparent text-gray-500 "
  }
  return clzes
}

export default function Navbar() {

  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="bg-white shadow fixed w-full z-50	">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-start sm:items-stretch sm:justify-start">
                <Link href="/" className="flex flex-shrink-0 items-center gap-2">
                  <Logo className="h-8 w-auto" />
                  <span className="text-xl font-bold tracking-tight text-gray-900">Bytegush</span>
                </Link>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <div
                    className={classNames(pathname, ["/product/lens", "/product/bona", "/product/tailor", "/product/imail"], "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700")}
                  >
                    <NavDropDown name="Tools" active={['/product/lens', '/product/bona', '/product/tailor', '/product/imail'].some(v => pathname.startsWith(v))}
                      items={
                        [
                          { name: 'How To Say', href: 'https://say.bytegush.com' },
                          { name: 'Woop', href: 'https://woop.bytegush.com' },
                          { name: 'Lens', href: '/product/lens' },
                          { name: 'Bona', href: '/product/bona' },
                          { name: 'Tailor', href: '/product/tailor' },
                          { name: 'iMail', href: '/product/imail' },
                          { name: 'Web Slide', href: '/static/ttemplate.html' },
                          { name: 'Cheatsheet', href: '/static/cheatsheet.html' },
                        ]
                      } />
                  </div>

                  <a
                    href="/archive"
                    className={classNames(pathname, ["/archive"], "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium hover:border-gray-300 hover:text-gray-700")}
                  >
                    Archive
                  </a>

                  <div
                    className={classNames(pathname, ['/about', '/about/feedback'], "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700")}
                  >
                    <NavDropDown name="About" active={['/about', '/about/feedback'].some(v => v == pathname)}
                      items={
                        [
                          {
                            name: 'Donation',
                            href: 'https://bytegush.lemonsqueezy.com/buy/229d1aed-9c23-426f-9c34-c584381ba777?embed=1',
                          },
                          {
                            name: 'About',
                            href: '/about',
                          },
                          {
                            name: 'Feedback',
                            href: '/about/feedback',
                          }
                        ]
                      } />
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                <AuthButton />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-4 pt-2 px-4 flex flex-col gap-2">
              <div
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                <NavDropDown name="Tools" items={
                  [
                    { name: 'How To Say', href: 'https://say.bytegush.com' },
                    { name: 'Woop', href: 'https://woop.bytegush.com' },
                    { name: 'Lens', href: '/product/lens' },
                    { name: 'Bona', href: '/product/bona' },
                    { name: 'Tailor', href: '/product/tailor' },
                    { name: 'iMail', href: '/product/imail' },
                    { name: 'Web Slide', href: '/static/ttemplate.html' },
                    { name: 'Cheatsheet', href: '/static/cheatsheet.html' },
                  ]
                } />
              </div>

              <a
                href="/archive"
                className={classNames(pathname, ["/archive"], "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700")}
              >
                Archive
              </a>

              <div
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                <NavDropDown name="About" items={
                  [
                    {
                      name: 'Donation',
                      href: 'https://bytegush.lemonsqueezy.com/buy/229d1aed-9c23-426f-9c34-c584381ba777?embed=1',
                    },
                    {
                      name: 'About',
                      href: '/about',
                    },
                    {
                      name: 'Feedback',
                      href: '/about/feedback',
                    }
                  ]
                } />
              </div>

            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
