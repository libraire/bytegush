export interface IntroductionProps {
    icon?: string;
    name?: string;
    description?: string;
    download_url: string;
    stars?: number;
    code_snippet?: string;
    downloads?: number;
    features?: string[];
    info: AppInfoProps[];
    download_number: number
}

export interface AppInfoProps {
    info: string;
    name: string;
}

const Introduction: React.FC<IntroductionProps> = ({ icon, name, description, features, code_snippet = "" }) => {

    return (
        <div className="px-10 py-10">
            <div className='flex justify-between p-2 mb-4 border-b pb-4'>
                <div className='flex space-x-1 items-center'>
                    <img className="h-12 w-12 flex-none bg-gray-50" src={icon} alt="" />
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900"> {name}</h1>
                </div>

                <div className="flex min-w-0 gap-x-4">
                    <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={'/basic/avatar.jpg'} alt="" />
                    <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">{'Drinking'}</p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{'drinkingpan@gmail.com'}</p>
                    </div>
                </div>

            </div>
            <div className="text-base italic text-gray-600">
                {description}

                {code_snippet && (
                    <pre className='bg-black text-white rounded-md p-4 my-4'><code >
                        {code_snippet}
                    </code>
                    </pre>
                )}

                <div className="text-2xl font-bold text-gray-900 py-4">Key features</div>
                <ul className='list-disc'>
                    {features?.map((feature) => (
                        <li key={feature}>{feature}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Introduction;
