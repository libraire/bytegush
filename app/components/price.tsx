
"use client";
import { IntroductionProps } from './introduction'
import { useRouter } from 'next/navigation'

const Price: React.FC<IntroductionProps> = ({ download_url, info, name, download_number }) => {

    const router = useRouter()

    return (
        <div className="min-w-[350px] bg-white px-8 py-8">

            <div>
                <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                    Name a fair price:
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                        type="text"
                        name="price"
                        id="price"
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <label htmlFor="currency" className="sr-only">
                            Currency
                        </label>
                        <select
                            id="currency"
                            name="currency"
                            className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                        >
                            <option>USD</option>
                            <option>CAD</option>
                            <option>EUR</option>
                        </select>
                    </div>
                </div>
            </div>

            <button
                type="button"
                className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 w-full mt-5"
                onClick={() => {
                    router.push('https://bytegush.lemonsqueezy.com/buy/229d1aed-9c23-426f-9c34-c584381ba777?embed=1')
                }}
            >
                I want to pay!
            </button>

            <div className="w-full justify-center flex text-base text-gray-900">or</div>
            <div className="w-full justify-center flex mb-5"><a className="text-base text-gray-500 underline" onClick={() => {
                const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
                fetch(API_HOST + '/api/v1/app/download/' + name, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
            }} href={download_url}>directly download</a></div>

            <ul role="list" className="divide-y divide-gray-100 border rounded-lg">
                {info.map((item) => (
                    <li key={item.name} className="flex justify-between gap-x-6 py-5 px-4">
                        <div className="flex min-w-0 gap-x-4">
                            <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">{item.name}</p>
                            </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">{item.info}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Price;