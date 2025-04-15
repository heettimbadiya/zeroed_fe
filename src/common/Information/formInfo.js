function FormInfo({ children, title, icon, renderRight, renderRightContent }) {
    return (
        <div className="pt-10">
            <div className=" px-2 py-5 rounded-tl-lg rounded-tr-lg">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-2 text-black">
                        <div className="text-black">{icon}</div>
                        <div className="text-2xl font-bold lato text-black">{title}</div>
                    </div>
                    <div>{renderRight && renderRightContent}</div>
                </div>
            </div>
            <div className="bg-white rounded-bl-lg rounded-br-lg">{children}</div>
        </div>
    )
}

export default FormInfo