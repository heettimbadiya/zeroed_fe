import React from 'react';
import {True, Warning} from "../../common/Icons";

function Dashboard(props) {
    const data = [
        {
            image: 'https://w7.pngwing.com/pngs/300/286/png-transparent-business-service-person-labor-business-woman-people-apartment-recruiter.png',
            description: "A passionate businesswoman with years of experience in recruitment and human resources, helping organizations find the right talent."
        },
        {
            image: 'https://static.vecteezy.com/system/resources/previews/041/642/170/non_2x/ai-generated-portrait-of-handsome-smiling-young-man-with-folded-arms-isolated-free-png.png',
            description: "A confident entrepreneur with a knack for innovation, specializing in tech startups and digital solutions."
        },
        {
            image: 'https://thumbs.dreamstime.com/b/beautiful-smiling-businesswoman-arms-folded-standing-black-suit-brown-jacket-isolated-white-background-also-105189427.jpg',
            description: "A dedicated marketing specialist with expertise in brand strategy, product launches, and market analysis."
        },
        {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3lAsaRkY1bio7NHqRCtay8n-WZSMXHGBpcA&s',
            description: "A financial consultant offering personalized investment solutions and strategic financial planning."
        },
        {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3XouC31H0lEVaeehRuYems52J-xl2EZ6ZSA&s',
            description: "An IT professional with expertise in software development, AI, and data analytics, driving digital transformation."
        },
        {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9EQ5P0ILzsQXfeJW36kSVE9yebE4Hwdg0oA&s',
            description: "A creative graphic designer with a passion for visual storytelling, branding, and digital art."
        },
        {
            image: 'https://img.freepik.com/free-photo/businessman-with-his-arms-crossed-white-background_1368-6001.jpg',
            description: "A seasoned sales manager with a track record of driving revenue growth and building strong client relationships."
        },
        {
            image: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTA4L21vdGFybzdfcGhvdG9fb2ZfaGFuZHNvbWVfc21pbGluZ195b3VuZ19tYW5faW5fYmx1ZV9zaGlydF9hbmRfZ19kOTM2ZTNiZS1iOGVhLTRkZjEtYTBiOS1hNWYzMjE5M2Y0ZjAucG5n.png',
            description: "An innovative product manager with a background in agile methodologies, product design, and user experience."
        },
        {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPGdrwSMxlAx_TZ9fEua6Rdykf0kfANNx8mA&s',
            description: "A cybersecurity expert focused on protecting businesses from digital threats through advanced security solutions."
        }
    ];
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
                                        {/* Ensure image is perfectly rounded and aligned */}
                                        <div >
                                            <img
                                                src={feed.image}
                                                className='w-14 h-14 object-cover rounded-full'
                                                alt={`image_${index}`}
                                            />
                                        </div>

                                        {/* Description Section */}
                                        <div className='text-[14px] ml-3 flex-1'>{feed.description}</div>
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