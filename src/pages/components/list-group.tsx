import Link from 'next/link';
import { useEffect, useState } from 'react';
import CodeHighlight from '../../components/Highlight';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconCode from '@/components/Icon/IconCode';
import IconMail from '@/components/Icon/IconMail';
import IconMapPin from '@/components/Icon/IconMapPin';
import IconDroplet from '@/components/Icon/IconDroplet';

const ListGroup = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('List Group'));
    });
    const [codeArr, setCodeArr] = useState<string[]>([]);

    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Components
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>List Group</span>
                </li>
            </ul>
            <div className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-2">
                {/* Basic */}
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Basic</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code1')}>
                            <span className="flex items-center">
                                <IconCode className="me-2" />{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">
                            <div className="border-b border-white-light px-4 py-2.5 dark:border-[#1b2e4b]">Cras justo odio</div>
                            <div className="border-b border-white-light px-4 py-2.5 dark:border-[#1b2e4b]">Dapibus ac facilisis in</div>
                            <div className="border-b border-white-light bg-primary px-4 py-2.5 text-white shadow-[0_1px_15px_1px_rgba(67,97,238,0.15)] dark:border-[#1b2e4b]">Morbi leo risus</div>
                            <div className="border-b border-white-light px-4 py-2.5 dark:border-[#1b2e4b]">Porta ac consectetur ac</div>
                            <div className="px-4 py-2.5">Vestibulum at eros</div>
                        </div>
                    </div>
                    {codeArr.includes('code1') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`<div className="mb-5">
    <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">
        <div className="border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5">Cras justo odio</div>
        <div className="border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5">Dapibus ac facilisis in</div>
        <div className="border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5 bg-primary text-white shadow-[0_1px_15px_1px_rgba(67,97,238,0.15)]">Morbi leo risus</div>
        <div className="border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5">Porta ac consectetur ac</div>
        <div className="px-4 py-2.5">Vestibulum at eros</div>
    </div>
</div>`}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>

                {/* Links */}
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Links</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code2')}>
                            <span className="flex items-center">
                                <IconCode className="me-2" />{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">
                            <Link href="#" className="border-b border-white-light px-4 py-2.5 hover:bg-[#eee] dark:border-[#1b2e4b] dark:hover:bg-[#eee]/10">
                                Cras justo odio
                            </Link>
                            <Link href="#" className="border-b border-white-light px-4 py-2.5 hover:bg-[#eee] dark:border-[#1b2e4b] dark:hover:bg-[#eee]/10">
                                Dapibus ac facilisis in
                            </Link>
                            <Link
                                href="#"
                                className="border-b border-white-light bg-primary px-4 py-2.5 text-white shadow-[0_1px_15px_1px_rgba(67,97,238,0.15)] hover:bg-[#eee] hover:text-black dark:border-[#1b2e4b] dark:hover:bg-[#eee]/10 dark:hover:text-white"
                            >
                                Morbi leo risus
                            </Link>
                            <Link href="#" className="border-b border-white-light px-4 py-2.5 hover:bg-[#eee] dark:border-[#1b2e4b] dark:hover:bg-[#eee]/10">
                                Porta ac consectetur ac
                            </Link>
                            <Link href="#" className="px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10">
                                Vestibulum at eros
                            </Link>
                        </div>
                    </div>
                    {codeArr.includes('code2') && (
                        <CodeHighlight>
                            <pre className="language-typescript">
                                {`import Link from 'next/link';

<div className="mb-5">
    <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">
        <Link href="#" className="border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10">
            Cras justo odio
        </Link>
        <Link href="#" className="border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10">
            Dapibus ac facilisis in
        </Link>
        <Link href="#"
            className="border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5 bg-primary text-white shadow-[0_1px_15px_1px_rgba(67,97,238,0.15)] hover:bg-[#eee] dark:hover:bg-[#eee]/10 hover:text-black dark:hover:text-white"
        >
            Morbi leo risus
        </Link>
        <Link href="#" className="border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10">
            Porta ac consectetur ac
        </Link>
        <Link href="#" className="px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10">
            Vestibulum at eros
        </Link>
    </div>
</div>`}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>

                {/* Icons */}
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Icons</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code3')}>
                            <span className="flex items-center">
                                <IconCode className="me-2" />{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">
                            <div className="flex border-b border-white-light px-4 py-2.5 hover:bg-[#eee] dark:border-[#1b2e4b] dark:hover:bg-[#eee]/10">
                                <div className="mt-0.5 text-primary ltr:mr-2 rtl:ml-2.5">
                                    <IconMail className="w-5 h-5" />
                                </div>
                                <div className="flex-1 font-semibold">
                                    <h6 className="mb-1 text-base">Messages</h6>
                                    <p className="text-xs">4 New Messages</p>
                                </div>
                            </div>
                            <div className="group flex border-b border-white-light bg-primary px-4 py-2.5 text-white shadow-[0_1px_15px_1px_rgba(67,97,238,0.15)] hover:bg-[#eee] hover:text-black dark:border-[#1b2e4b] dark:hover:bg-[#eee]/10 dark:hover:text-white">
                                <div className="mt-0.5 text-white group-hover:text-primary ltr:mr-2 rtl:ml-2.5">
                                    <IconMapPin />
                                </div>
                                <div className="flex-1 font-semibold">
                                    <h6 className="mb-1 text-base">Locations</h6>
                                    <p className="text-xs">25 New Travel Locations</p>
                                </div>
                            </div>
                            <div className="flex px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10">
                                <div className="mt-0.5 text-primary ltr:mr-2 rtl:ml-2.5">
                                    <IconDroplet />
                                </div>
                                <div className="flex-1 font-semibold">
                                    <h6 className="mb-1 text-base">Flexible</h6>
                                    <p className="text-xs">Customization Flexibility</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {codeArr.includes('code3') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`<div className="mb-5">
    <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">
        <div className="flex border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10">
            <div className="ltr:mr-2 rtl:ml-2.5 mt-0.5 text-primary">
                <svg>...</svg>
            </div>
            <div className="flex-1 font-semibold">
                <h6 className="mb-1 text-base">Messages</h6>
                <p className="text-xs">4 New Messages</p>
            </div>
        </div>
        <div className="flex border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5 bg-primary text-white shadow-[0_1px_15px_1px_rgba(67,97,238,0.15)] hover:bg-[#eee] dark:hover:bg-[#eee]/10 hover:text-black dark:hover:text-white group">
            <div className="ltr:mr-2 rtl:ml-2.5 mt-0.5 text-white group-hover:text-primary">
                <svg>...</svg>
            </div>
            <div className="flex-1 font-semibold">
                <h6 className="mb-1 text-base">Locations</h6>
                <p className="text-xs">25 New Travel Locations</p>
            </div>
        </div>
        <div className="flex px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10">
            <div className="ltr:mr-2 rtl:ml-2.5 mt-0.5 text-primary">
                <svg>...</svg>
            </div>
            <div className="flex-1 font-semibold">
                <h6 className="mb-1 text-base">Flexible</h6>
                <p className="text-xs">Customization Flexibility</p>
            </div>
        </div>
    </div>
</div>`}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>

                {/* Images */}
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Images</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code4')}>
                            <span className="flex items-center">
                                <IconCode className="me-2" />{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">
                            <div className="flex border-b border-white-light px-4 py-2.5 hover:bg-[#eee] dark:border-[#1b2e4b] dark:hover:bg-[#eee]/10">
                                <div className="ltr:mr-3 rtl:ml-3">
                                    <img src="/assets/images/profile-1.jpeg" alt="img" className="h-12 w-12 rounded-full object-cover" />
                                </div>
                                <div className="flex-1 font-semibold">
                                    <h6 className="mb-1 text-base">Luke Ivory</h6>
                                    <p className="text-xs">Project Lead</p>
                                </div>
                            </div>
                            <div className="group flex border-b border-white-light bg-primary px-4 py-2.5 text-white shadow-[0_1px_15px_1px_rgba(67,97,238,0.15)] hover:bg-[#eee] hover:text-black dark:border-[#1b2e4b] dark:hover:bg-[#eee]/10 dark:hover:text-white">
                                <div className="ltr:mr-3 rtl:ml-3">
                                    <img src="/assets/images/profile-2.jpeg" alt="img" className="h-12 w-12 rounded-full object-cover" />
                                </div>
                                <div className="flex-1 font-semibold">
                                    <h6 className="mb-1 text-base">Sonia Shaw</h6>
                                    <p className="text-xs">Web Designer</p>
                                </div>
                            </div>
                            <div className="flex px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10">
                                <div className="ltr:mr-3 rtl:ml-3">
                                    <img src="/assets/images/profile-3.jpeg" alt="img" className="h-12 w-12 rounded-full object-cover" />
                                </div>
                                <div className="flex-1 font-semibold">
                                    <h6 className="mb-1 text-base">Dale Butler</h6>
                                    <p className="text-xs">Developer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {codeArr.includes('code4') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`<div className="mb-5">
    <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">
        <div className="flex border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10">
            <div className="ltr:mr-3 rtl:ml-3">
                <img src="/assets/images/profile-1.jpeg" alt="img" className="rounded-full w-12 h-12 object-cover" />
            </div>
            <div className="flex-1 font-semibold">
                <h6 className="mb-1 text-base">Luke Ivory</h6>
                <p className="text-xs">Project Lead</p>
            </div>
        </div>
        <div className="flex border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5 bg-primary text-white shadow-[0_1px_15px_1px_rgba(67,97,238,0.15)] hover:bg-[#eee] dark:hover:bg-[#eee]/10 hover:text-black dark:hover:text-white group">
            <div className="ltr:mr-3 rtl:ml-3">
                <img src="/assets/images/profile-2.jpeg" alt="img" className="rounded-full w-12 h-12 object-cover" />
            </div>
            <div className="flex-1 font-semibold">
                <h6 className="mb-1 text-base">Sonia Shaw</h6>
                <p className="text-xs">Web Designer</p>
            </div>
        </div>
        <div className="flex px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10">
            <div className="ltr:mr-3 rtl:ml-3">
                <img src="/assets/images/profile-3.jpeg" alt="img" className="rounded-full w-12 h-12 object-cover" />
            </div>
            <div className="flex-1 font-semibold">
                <h6 className="mb-1 text-base">Dale Butler</h6>
                <p className="text-xs">Developer</p>
            </div>
        </div>
    </div>
</div>`}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>

                {/*  Task */}
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Task</h5>
                        <button type="button" className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600" onClick={() => toggleCode('code5')}>
                            <span className="flex items-center">
                                <IconCode className="me-2" />{' '}
                                Code
                            </span>
                        </button>
                    </div>
                    <div className="mb-5">
                        <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">
                            <div className="flex space-x-4 border-b border-white-light px-4 py-2.5 hover:bg-[#eee] rtl:space-x-reverse dark:border-[#1b2e4b] dark:hover:bg-[#eee]/10">
                                <input autoComplete="off" id="tack_checkbox1" type="checkbox" className="form-checkbox" />
                                <label htmlFor="tack_checkbox1" className="mb-0 cursor-pointer">
                                    List groups are a flexible and powerful component for displaying simple.
                                    <span className="badge my-auto bg-secondary hover:top-0 ltr:ml-3 rtl:mr-3">Project</span>
                                </label>
                            </div>
                            <div className="group flex space-x-4 border-b border-white-light bg-primary px-4 py-2.5 text-white shadow-[0_1px_15px_1px_rgba(67,97,238,0.15)] hover:bg-[#eee] hover:text-black rtl:space-x-reverse dark:border-[#1b2e4b] dark:hover:bg-[#eee]/10 dark:hover:text-white">
                                <input autoComplete="off" id="tack_checkbox2" type="checkbox" className="form-checkbox checked:border-white-light dark:checked:border-[#253B5C]" />
                                <label htmlFor="tack_checkbox2" className="mb-0 cursor-pointer">
                                    List groups are a flexible and powerful component for displaying simple.
                                    <span className="badge my-auto bg-info hover:top-0 ltr:ml-3 rtl:mr-3">Urgent</span>
                                </label>
                            </div>
                            <div className="flex space-x-4 px-4 py-2.5 hover:bg-[#eee] rtl:space-x-reverse dark:hover:bg-[#eee]/10">
                                <input autoComplete="off" id="tack_checkbox3" type="checkbox" className="form-checkbox" />
                                <label htmlFor="tack_checkbox3" className="mb-0 cursor-pointer">
                                    List groups are a flexible and powerful component for displaying simple.
                                    <span className="badge my-auto bg-success hover:top-0 ltr:ml-3 rtl:mr-3">Success</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {codeArr.includes('code5') && (
                        <CodeHighlight>
                            <pre className="language-xml">
                                {`<div className="mb-5">
    <div className="flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]">
        <div className="flex space-x-4 rtl:space-x-reverse border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10">
            <input autoComplete="off" id="tack_checkbox1" type="checkbox" className="form-checkbox" />
            <label htmlFor="tack_checkbox1" className="mb-0 cursor-pointer">
                List groups are a flexible and powerful component for displaying simple.
                <span className="badge bg-secondary my-auto ltr:ml-3 rtl:mr-3 hover:top-0">Project</span>
            </label>
        </div>
        <div className="flex space-x-4 rtl:space-x-reverse border-b border-white-light dark:border-[#1b2e4b] px-4 py-2.5 bg-primary text-white shadow-[0_1px_15px_1px_rgba(67,97,238,0.15)] hover:bg-[#eee] dark:hover:bg-[#eee]/10 hover:text-black dark:hover:text-white group">
            <input autoComplete="off" id="tack_checkbox2" type="checkbox" className="form-checkbox dark:checked:border-[#253B5C] checked:border-white-light" />
            <label htmlFor="tack_checkbox2" className="mb-0 cursor-pointer">
                List groups are a flexible and powerful component for displaying simple.
                <span className="badge bg-info my-auto ltr:ml-3 rtl:mr-3 hover:top-0">Urgent</span>
            </label>
        </div>
        <div className="flex space-x-4 rtl:space-x-reverse px-4 py-2.5 hover:bg-[#eee] dark:hover:bg-[#eee]/10">
            <input autoComplete="off" id="tack_checkbox3" type="checkbox" className="form-checkbox" />
            <label htmlFor="tack_checkbox3" className="mb-0 cursor-pointer">
                List groups are a flexible and powerful component for displaying simple.
                <span className="badge bg-success my-auto ltr:ml-3 rtl:mr-3 hover:top-0">Success</span>
            </label>
        </div>
    </div>
</div>`}
                            </pre>
                        </CodeHighlight>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListGroup;
