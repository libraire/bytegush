"use client"
import React, { useState, Fragment } from "react";
import { Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { useSession } from "next-auth/react"

const ProductsPage = () => {

    const { data: session } = useSession({
        required: false,
    })

    const [message, setMessage] = useState('');
    const [show, setShow] = useState(false)
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    const handleSending = async () => {
        if (!message) {
            alert('The content is empty');
            return;
        }

        const url = '/api/v1/health';
        const data = {
            app: 'bytegush',
            body: message,
        };

        setButtonDisabled(true)

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const json = await response.json();
                setShow(true)
            } else {
                console.log('Post request failed');
            }
        } catch (error) {
            // TODO login first
        } finally {
            setButtonDisabled(false)
        }
    };


    if (!session?.user) return (
        <>
            <label htmlFor="email" className="container mx-auto pt-20 mb-2 block text-sm font-medium leading-6 text-gray-900">
                Please login first
            </label>
        </>
    )

    return (
        <>
            <div className="container mx-auto pt-2">
                <div className='max-w-screen-sm mx-auto p-4'>
                    <label htmlFor="email" className="mb-2 block text-m font-medium leading-6 text-gray-900">
                        Help us improve! We welcome any feedback you have. 欢迎反馈。
                        <br />
                        Or contact us with email  <a className='text-sky-900' href="mailto:bytegush@hotmail.com">bytegush@hotmail.com</a>
                    </label>

                    <div className="flex items-start space-x-4">
                        <div className="min-w-0 flex-1">
                            <div className="relative">
                                <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                                    <label htmlFor="comment" className="sr-only">
                                        Your feedback...
                                    </label>
                                    <textarea
                                        rows={10}
                                        name="comment"
                                        id="comment"
                                        className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 p-2"
                                        placeholder="Your feedback..."
                                        defaultValue={''}
                                        onChange={(e) => setMessage(e.target.value)}
                                        value={message}
                                    />

                                    <div className="py-2" aria-hidden="true">
                                        <div className="py-px">
                                            <div className="h-9" />
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                                    <div className="flex items-center space-x-5">
                                        <div className="flex items-center">
                                            <button
                                                type="button"
                                                className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                                            >
                                                <span className="sr-only">Attach a file</span>
                                            </button>
                                        </div>

                                    </div>
                                    <div className="flex-shrink-0">
                                        <button
                                            type="button"
                                            id='send'
                                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={handleSending}
                                            disabled={isButtonDisabled}
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div
                aria-live="assertive"
                className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
            >
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                    <Transition
                        show={show}
                        as={Fragment}
                        enter="transform ease-out duration-300 transition"
                        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-gray-900">Successfully sent!</p>
                                        <p className="mt-1 text-sm text-gray-500">Thanks for your feedback.</p>
                                    </div>
                                    <div className="ml-4 flex flex-shrink-0">
                                        <button
                                            type="button"
                                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={() => {
                                                setShow(false)
                                            }}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>


        </>
    )
    return
};

export default ProductsPage;