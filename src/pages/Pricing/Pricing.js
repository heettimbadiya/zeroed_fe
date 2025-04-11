import React from "react";

function Pricing() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[92vh] bg-white p-6">
            <div className="grid gap-8 w-full max-w-6xl sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {/* Standard Plan */}
                <div className="bg-gray-100 p-8 rounded-xl shadow-lg w-full sm:w-80 text-center border border-gray-200 flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-700 lato">STANDARD</h3>
                    <p className="text-gray-500 text-sm mt-1">Perfect for small business</p>
                    <h2 className="text-5xl font-bold mt-4">$0<span className="text-lg font-normal">/mo</span></h2>
                    <ul className="mt-6 space-y-3 text-gray-700">
                        <li className="flex items-center justify-center"><span className="text-blue-600 text-lg mr-2">✔</span> 5 Users</li>
                        <li className="flex items-center justify-center"><span className="text-blue-600 text-lg mr-2">✔</span> 20 Projects</li>
                        <li className="flex items-center justify-center"><span className="text-blue-600 text-lg mr-2">✔</span> Limited Support</li>
                    </ul>
                    <button className="mt-6 bg-[#1F2EB3] text-white px-6 py-3 rounded-lg w-full font-semibold hover:bg-blue-700">
                        GET NOW
                    </button>
                </div>

                {/* Premium Plan */}
                <div className="bg-blue-100 p-8 rounded-xl shadow-lg w-full sm:w-80 text-center border border-gray-200 flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-700 lato">PREMIUM</h3>
                    <p className="text-gray-500 text-sm mt-1">Designed for corporate clients</p>
                    <h2 className="text-5xl font-bold mt-4">$499<span className="text-lg font-normal">/mo</span></h2>
                    <ul className="mt-6 space-y-3 text-gray-700">
                        <li className="flex items-center justify-center"><span className="text-blue-600 text-lg mr-2">✔</span> 50 Users</li>
                        <li className="flex items-center justify-center"><span className="text-blue-600 text-lg mr-2">✔</span> Unlimited Projects</li>
                        <li className="flex items-center justify-center"><span className="text-blue-600 text-lg mr-2">✔</span> 24/7 Support</li>
                    </ul>
                    <button className="mt-6 bg-[#1F2EB3] text-white px-6 py-3 rounded-lg w-full font-semibold hover:bg-blue-700">
                        GET NOW
                    </button>
                </div>

                {/* Information Section */}
                <div className="flex flex-col justify-center text-left max-w-md">
                    <h3 className="text-gray-500 uppercase text-sm font-semibold">COOPERATION OPTIONS</h3>
                    <h2 className="text-4xl font-bold mt-3 leading-tight lato   ">Our flexible pricing plans</h2>
                    <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <div className="flex items-center mt-6 text-blue-600 font-semibold cursor-pointer">
                        <span className="mr-2 p-2">▶</span>
                        VIDEO PRESENTATION
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pricing;
