"use client"
import Navbar from '@/app/components/navbar';
import React, { useState, useEffect, Fragment } from "react";
import { AtSymbolIcon, ArrowDownOnSquareIcon } from '@heroicons/react/20/solid'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'

const ProductsPage = () => {

    const [receptionCode, setReceptionCode] = useState('');
    const [message, setMessage] = useState('');
    const [toastVisibility, setToastVisibility] = useState('hidden');
    const [toastMessage, setToastMessage] = useState('Loading...');
    const [toastType, setToastType] = useState('success');
    const [show, setShow] = useState(false)
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [receiptCode, setReceiptCode] = useState('');



    const handleShowToast = (message: string, timeout = 0, showLoader = false) => {
        setToastMessage(message);
        setToastType(showLoader ? 'success' : 'error');
        setToastVisibility('visible');

        if (timeout > 0) {
            setTimeout(() => setToastVisibility('hidden'), timeout);
        }
    };

    const handleSending = async () => {
        if (!message) {
            alert('The content is empty');
            return;
        }

        const url = 'https://api.bytegush.com/api/v1/send';
        const data = {
            code: receptionCode,
            body: message,
        };

        setButtonDisabled(true)
        handleShowToast('Sending...', 0, true);

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
                setReceiptCode(json.code)
                setShow(true)
                handleShowToast(`Code for receiving: ${json.code}`, 0, false);
            } else {
                console.log('Post request failed');
            }
        } catch (error) {
            handleShowToast(`Error: ${error}`);
        } finally {
            setButtonDisabled(false)
        }
    };

    const handleReceiving = async () => {
        if (!receptionCode || receptionCode.length < 4) {
            alert('The secret code must be longer than 3 characters');
            return;
        }

        const url = `https://api.bytegush.com/api/v1/receive?code=${receptionCode}`;

        // handleDisableBtn();
        handleShowToast('Receiving...', 0, true);

        try {
            const response = await fetch(url);

            if (response.status === 200) {
                const data = await response.json();
                setMessage(data.content);
                setToastVisibility('hidden');
            } else {
                throw new Error('No content found');
            }
        } catch (error) {
            // handleShowToast(error.message);
        }
    };

    return (
        <>
            <div className="container mx-auto mt-2">
                <div className='max-w-screen-sm mx-auto p-4'>
                    <label htmlFor="email" className="block text-m font-medium leading-6 text-gray-900">
                        Send text and read once at anywhere with reception code.
                        <br />
                        通过接收码，在任何地方发送和读取文本，阅后即焚。
                    </label>
                    <div className="mt-2 flex rounded-md shadow-sm mb-2">


                        <div className="relative flex flex-grow items-stretch focus-within:z-10">

                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <AtSymbolIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Reception Code"
                                onChange={(e) => setReceptionCode(e.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={handleReceiving}
                            id='receive'
                            disabled={isButtonDisabled}
                        >
                            <ArrowDownOnSquareIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            Receive
                        </button>
                    </div>

                    <div
                        className={`toast-container fixed bottom-0 left-0 right-0 p-4 text-center text-white ${toastVisibility}`}
                    >
                        <i className={`fa fa-check text-${toastType === 'success' ? 'green' : 'red'}`}></i>
                        <div id="toast-msg">{toastMessage}</div>
                    </div>


                    <div className="flex items-start space-x-4">
                        <div className="min-w-0 flex-1">
                            <div className="relative">
                                <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                                    <label htmlFor="comment" className="sr-only">
                                        Text to send. 需要发送的文本。
                                    </label>
                                    <textarea
                                        rows={10}
                                        name="comment"
                                        id="comment"
                                        className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 p-2"
                                        placeholder="Text to send. 需要发送的文本。"
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
                                        <p className="mt-1 text-sm text-gray-500">Here is the receipt code: {receiptCode}</p>
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