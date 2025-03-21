import React from 'react';
import {True, Warning} from "../../common/Icons";

function Dashboard(props) {
    const data = [
        {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWaLmZv1-4kxBlI3FqOf25N0V2H7ok_FoZ2Y-q_P5058voU8as-N833jG90N6GpBMdtk&usqp=CAU',
            description: "LinkedIn is a professional networking platform designed to connect individuals, companies, and organizations across various industries. Launched in 2003, it has grown to become one of the most popular platforms for career development, job searching, and business"
        }, {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWaLmZv1-4kxBlI3FqOf25N0V2H7ok_FoZ2Y-q_P5058voU8as-N833jG90N6GpBMdtk&usqp=CAU',
            description: "LinkedIn is a professional networking platform designed to connect individuals, companies, and organizations across various industries. Launched in 2003, it has grown to become one of the most popular platforms for career development, job searching, and business"
        }, {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWaLmZv1-4kxBlI3FqOf25N0V2H7ok_FoZ2Y-q_P5058voU8as-N833jG90N6GpBMdtk&usqp=CAU',
            description: "LinkedIn is a professional networking platform designed to connect individuals, companies, and organizations across various industries. Launched in 2003, it has grown to become one of the most popular platforms for career development, job searching, and business"
        }, {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWaLmZv1-4kxBlI3FqOf25N0V2H7ok_FoZ2Y-q_P5058voU8as-N833jG90N6GpBMdtk&usqp=CAU',
            description: "LinkedIn is a professional networking platform designed to connect individuals, companies, and organizations across various industries. Launched in 2003, it has grown to become one of the most popular platforms for career development, job searching, and business"
        }, {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWaLmZv1-4kxBlI3FqOf25N0V2H7ok_FoZ2Y-q_P5058voU8as-N833jG90N6GpBMdtk&usqp=CAU',
            description: "LinkedIn is a professional networking platform designed to connect individuals, companies, and organizations across various industries. Launched in 2003, it has grown to become one of the most popular platforms for career development, job searching, and business"
        }, {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWaLmZv1-4kxBlI3FqOf25N0V2H7ok_FoZ2Y-q_P5058voU8as-N833jG90N6GpBMdtk&usqp=CAU',
            description: "LinkedIn is a professional networking platform designed to connect individuals, companies, and organizations across various industries. Launched in 2003, it has grown to become one of the most popular platforms for career development, job searching, and business"
        }, {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWaLmZv1-4kxBlI3FqOf25N0V2H7ok_FoZ2Y-q_P5058voU8as-N833jG90N6GpBMdtk&usqp=CAU',
            description: "LinkedIn is a professional networking platform designed to connect individuals, companies, and organizations across various industries. Launched in 2003, it has grown to become one of the most popular platforms for career development, job searching, and business"
        }, {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWaLmZv1-4kxBlI3FqOf25N0V2H7ok_FoZ2Y-q_P5058voU8as-N833jG90N6GpBMdtk&usqp=CAU',
            description: "LinkedIn is a professional networking platform designed to connect individuals, companies, and organizations across various industries. Launched in 2003, it has grown to become one of the most popular platforms for career development, job searching, and business"
        }, {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREWaLmZv1-4kxBlI3FqOf25N0V2H7ok_FoZ2Y-q_P5058voU8as-N833jG90N6GpBMdtk&usqp=CAU',
            description: "LinkedIn is a professional networking platform designed to connect individuals, companies, and organizations across various industries. Launched in 2003, it has grown to become one of the most popular platforms for career development, job searching, and business"
        },
    ]
    return (
        <>
            <div className="bg-grayLight md:px-10 px-2 py-4 flex justify-center items-center">
                <div className={'container'}>
                    <div className="flex lg:flex-row flex-col justify-center gap-x-6 ">
                        <div className="lg:w-[40%] w-full lg:h-[calc(100vh-120px)] bg-white overflow-y-auto">
                            <div className='font-semibold text-[18px] mb-5 p-3'>Feeds</div>
                            {data.map((feed, index) => (
                                <div>
                                    <div key={index} className='flex p-3 cursor-pointer hover:bg-[#EBEBEB]'>
                                        <div className='rounded w-[160px]'><img src={feed.image}
                                                                                className='h-[50px] w-[50px] rounded-[50%]'
                                                                                alt={`image_${index}`}/></div>
                                        <div className={'text-[14px] ml-3'}>{feed.description}</div>
                                    </div>
                                    <div className='border'></div>
                                </div>

                            ))}

                        </div>
                        <div
                            className="lg:w-[30%] w-full lg:max-h-[calc(100vh-120px)] category2 h-auto bg-white lg:mt-0 mt-4 p-3">
                            <div className='font-semibold text-[18px]'>Overviews</div>
                            <div className="my-10 flex justify-center">
                                <div className="relative w-40 h-40">
                                    <div
                                        className="w-full h-full rounded-full"
                                        style={{
                                            background: `conic-gradient(#F3F2F1 50%, #059669 50%)`,
                                            mask: "radial-gradient(circle, transparent 55%, black 56%)",
                                            WebkitMask: "radial-gradient(circle, transparent 55%, black 56%)"
                                        }}
                                    ></div>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xl font-bold text-gray-800">50%</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className={'flex justify-between items-center'}>
                                    <div>Hiring Process</div>
                                    <div><True/></div>
                                </div>
                                <div className={'flex justify-between items-center my-1'}>
                                    <div>Quickly email responding</div>
                                    <div><Warning/></div>
                                </div>
                                <div className={'flex justify-between items-center'}>
                                    <div>Long delays</div>
                                    <div><True/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;