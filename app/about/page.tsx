"use client"
import React, { useState, Fragment } from "react";
import { Transition, Dialog } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { useCustomAuth } from "@/app/context/CustomAuthProvider"

const AboutPage = () => {

    const { user, login } = useCustomAuth()

    const [message, setMessage] = useState('');
    const [show, setShow] = useState(false)
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const handleSending = async () => {
        if (!message) {
            alert('The content is empty');
            return;
        }

        const url = '/api/v1/feedback';
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
                setMessage('')
                setShowFeedbackModal(false)
            } else {
                console.log('Post request failed');
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
        } finally {
            setButtonDisabled(false)
        }
    };

    const handleDonation = () => {
        window.open('https://bytegush.lemonsqueezy.com/buy/229d1aed-9c23-426f-9c34-c584381ba777?embed=1', '_blank');
    };

    const handleFeedback = () => {
        if (!user) {
            login();
            return;
        }
        setShowFeedbackModal(true);
    };

    return (
        <>
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* About Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">About Bytegush</h1>
                    <div className="prose prose-lg text-gray-700">
                        <p className="mb-4">
                            Bytegush is an indie developer platform dedicated to creating innovative tools and applications
                            that enhance productivity and creativity.
                        </p>
                        <p className="mb-4">
                            We believe in building simple, elegant solutions that solve real problems. Our mission is to
                            empower individuals and teams with the tools they need to succeed.
                        </p>
                        <p>
                            Still thinking about more amazing features to bring to you...
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <button
                        onClick={handleDonation}
                        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Support Us (Donation)
                    </button>
                    <button
                        onClick={handleFeedback}
                        className="inline-flex items-center justify-center rounded-md bg-gray-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Send Feedback
                    </button>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
                    <p className="text-gray-700">
                        Have questions or want to reach out? Contact us at{' '}
                        <a className='text-indigo-600 hover:text-indigo-500 font-medium' href="mailto:bytegush@hotmail.com">
                            bytegush@hotmail.com
                        </a>
                    </p>
                </div>
            </div>

            {/* Feedback Modal */}
            <Transition appear show={showFeedbackModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setShowFeedbackModal(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 mb-4"
                                    >
                                        Send Us Your Feedback
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 mb-4">
                                            Help us improve! We welcome any feedback you have. 欢迎反馈。
                                        </p>
                                        <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                                            <textarea
                                                rows={10}
                                                name="comment"
                                                id="comment"
                                                className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 p-3"
                                                placeholder="Your feedback..."
                                                onChange={(e) => setMessage(e.target.value)}
                                                value={message}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                            onClick={() => setShowFeedbackModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={handleSending}
                                            disabled={isButtonDisabled}
                                        >
                                            Send Feedback
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Success Toast */}
            <div
                aria-live="assertive"
                className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
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
};

export default AboutPage;