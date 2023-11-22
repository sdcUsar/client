import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

interface DropdownProps {
    name: string;
    listItems: string[];
    onChange: (selectedValue: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ name, listItems, onChange }) => {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <>
                <div>
                    <Menu.Button className="flex justify-center items-center gap-4 font-bold lg:text-lg text-sm bg-[#041d55] text-white p-2 rounded-lg w-60 lg:w-96 xl:w-96">
                        {name}
                        <HiChevronUpDown />
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items
                        className="absolute right-0 z-10 mt-2 text-center origin-top-right rounded-md bg-[#e2f6fe] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none w-60 lg:w-96 xl:w-96"
                        static>
                        <div className="py-1">
                            {listItems.map((item: string, index: number) => (
                                <Menu.Item key={index}>
                                    {({ active, close }) => (
                                        <>
                                            <div
                                                onClick={close}
                                                className="px-1 py-1">
                                                <div
                                                    className={classNames(
                                                        active
                                                            ? "text-blue-900"
                                                            : "text-gray-700",
                                                        "font-bold block text-sm cursor-pointer"
                                                    )}
                                                    onClick={() => {
                                                        onChange(item);
                                                    }}>
                                                    <div
                                                        className={`${
                                                            item === name
                                                                ? "bg-[#004678] text-white"
                                                                : "text-gray-700 hover:bg-[#004678] hover:text-white"
                                                        } px-4 py-2 `}>
                                                        {item}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </>
        </Menu>
    );
};
export default Dropdown;
