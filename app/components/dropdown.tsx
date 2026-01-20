
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

type Props = {
    items: MenuItem[];
    name: string;
    active?: boolean
};

type MenuItem = {
    name: string;
    href: string;
};

const style = "inline-flex items-center text-sm font-medium hover:text-gray-700"

export default function NavDropDown({ name, items, active }: Props) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className={classNames(active ? style + 'text-gray-700' : style + 'text-gray-500')} >
                    {name}
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
                <Menu.Items className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">

                        {
                            items.map((item) => (
                                <Menu.Item key={item.name}>
                                    {({ active }) => (
                                        <a
                                            href={item.href}
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            {item.name}
                                        </a>
                                    )}
                                </Menu.Item>
                            ))

                        }
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
