import logo from "../img/logo-dark.png";

const Navbar = () => {
    return (
        <div>
            <div className="flex items-center h-32 bg-[#041d55]">
                <img
                    src={logo}
                    alt="ggsipu_logo"
                    className="mt-5 w-24 h-20 ml-7 md:ml-10 md:mb-5"
                />
                <div className="flex justify-center w-full flex-col gap-2">
                    <div className=" text-white font-light text-center text-xl mt-2 md:text-2xl lg:text-2xl">
                        Guru Gobind Singh Indraprastha University
                    </div>
                    <div className=" text-white font-light text-center text-sm md:text-xl lg:text-xl">
                        Attendance Management System
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
