import { LinkIcon, HeartIcon } from '@heroicons/react/20/solid'
import Link from "next/link";

export interface FMPlayer {
    id: number,
    name: string;
    link: string;
    caption: string;
    image: string;
    vote: string;
}

type Props = {
    players: FMPlayer[];
    category: string;
    like: (player: FMPlayer) => void;
};

export default function FMTable({ players, category, like }: Props) {

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full max-w-screen-md	">
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Index
                                    </th>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        {category}
                                    </th>
                                    {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Caption
                                    </th> */}
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Link
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Likes
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {players.map((person) => (
                                    <tr key={person.name}>
                                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                            <div className="text-gray-900">{person.id + 1}</div>
                                        </td>
                                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                            <div className="flex items-center">
                                                {/* <div className="h-11 w-11 flex-shrink-0 text-gray-500" >
                                                    <img className="h-11 w-11 rounded-full" src='/fm/avatar-white.jpeg' alt="" />
                                                </div> */}
                                                <div className="">
                                                    <div className="font-medium text-gray-900">{person.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                            <div className="text-gray-900">{person.caption}</div>
                                        </td> */}
                                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                            <Link href={person.link}>
                                                <LinkIcon className='h-5 w-5' ></LinkIcon>
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                            <HeartIcon className='h-5 w-5 cursor-pointer' onClick={() => { like(person) }}></HeartIcon>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
