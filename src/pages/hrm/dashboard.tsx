import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../../components/Dropdown';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import dynamic from 'next/dynamic';
import { DataTable } from 'mantine-datatable';

import IconClock from '@/components/Icon/IconClock';
import IconMail from '@/components/Icon/IconMail';

import IconUser from "../../components/Icon/IconUser";
import IconMessage2 from "../../components/Icon/IconMessage2";
import IconUsers from "../../components/Icon/IconUsers";
import IconTag from "../../components/Icon/IconTag";
import IconCalendar from "../../components/Icon/IconCalendar";
import moment from 'moment';
import { PAGE_SIZES } from '@/utils/constants';
import { useRouter } from 'next/router';
import { numberOfReport, numberOfReportByLevel, numberOfReportByType } from '@/services/apis/file.api';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const DashBoard = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Analytics Admin'));
    });

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [isMounted, setIsMounted] = useState(false);
    const [inventoryPage, setInventoryPage] = useState<any>();
    const [numreport, setNumReport] = useState(0)
    //get data
    // const { data: warehouseStatistic } = WarehouseStatistic({ sortBy: "id.DESC" });
    // const { data: inventoryExpired, pagination: inventoryPagination, mutate } = InventoryExpired({ sortBy: "id.DESC", page: inventoryPage });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
       
    });
    
    const [columnChart, setColumnChart] = useState<any>()
    const [donutChart, setDonutChart] = useState<any>()
    
    useEffect(() => {
        numberOfReport().then(res => {
           setNumReport(res.data)
        })
        numberOfReportByType().then(res => {
            console.log(res)
            const label = res.data.map((item:any) => {return item?.type} )
            setDonutChart({
                series: res.data.map((item:any) => {return item.report_count} ),
                options: {
                    chart: {
                        height: 300,
                        type: 'donut',
                        zoom: {
                            enabled: false,
                        },
                        toolbar: {
                            show: false,
                        },
                    },
                    stroke: {
                        show: false,
                    },
                    grid: {
                        padding: {
                            top: 10,
                        }
                    },
                    plotOptions: {
                        pie: {
                            donut: {
                                labels: {
                                    show: true,
        
                                    total: {
                                        showAlways: true,
                                        show: true,
        
                                    }
                                }
                            }
                        }
                    },
                    labels: label,
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 300,
                                },
                            },
                        },
                    ],
                    legend: {
                        position: 'top',
                    },
                },
            })
        })
        numberOfReportByLevel().then(res => {
            const label = res.data.map((item:any) => {return item?.level} )

            setColumnChart({
                series: [
                    {
                        name: 'Số lượng',
                        data: res.data.map((item:any) => {return item.report_count} ),
                    },
                ],
                options: {
                    chart: {
                        height: 300,
                        type: 'bar',
                        zoom: {
                            enabled: false,
                        },
                        toolbar: {
                            show: false,
                        },
                    },
                    colors: ['#002868', '#002868'],
                    dataLabels: {
                        enabled: false,
                    },
                    stroke: {
                        show: true,
                        width: 2,
                        colors: ['transparent'],
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '55%',
                            endingShape: 'rounded',
                        },
                    },
                    grid: {
                        borderColor: isDark ? '#191e3a' : '#e0e6ed',
                        xaxis: {
                            lines: {
                                show: false,
                            },
                        },
                    },
                    legend: {
                        show: false
                    },
                    xaxis: {
                        categories: label,
                        axisBorder: {
                            color: isDark ? '#191e3a' : '#e0e6ed',
                        },
                    },
                    yaxis: {
                        opposite: isRtl ? true : false,
                        labels: {
                            offsetX: isRtl ? -10 : 0,
                        },
                    },
                    tooltip: {
                        theme: isDark ? 'dark' : 'light',
                        y: {
                            formatter: function (val: any) {
                                return val;
                            },
                        },
                    },
                },
            }
        )
        })
        setIsMounted(true);
       }, []);
    const router = useRouter();

    const handleChangePage = (page: number, pageSize: number) => {
        setInventoryPage(page);
        return pageSize;
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse mb-6">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Trang chủ
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Thống kê báo cáo NVKH</span>
                </li>
            </ul>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                <div className="panel  h-full xl:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Số lượng báo cáo</h5>
                    </div>
                    <div className="w-full sm:w-auto grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">

                        <div className="flex border-r justify-around">
                            <div className="flex shrink-0 items-center justify-center" style={{ width: '128px' }}>
                                <img className="object-cover" src="/assets/images/vietnam.gif" alt="flag"></img>
                            </div>
                            <div className="font-semibold ltr:ml-3 rtl:mr-3">
                                <h5 className="text-[#082819]" style={{ fontSize: '14px', fontWeight: '700' }}>Tổng số</h5>
                                <p className="text-[#C8102E]" style={{ fontSize: '40px', fontWeight: '700', lineHeight: '50px' }}>{numreport}</p>
                                <h5 className="text-[#082819]" style={{ fontSize: '14px', fontWeight: '400' }}>Báo cáo</h5>

                            </div>
                        </div>
                      
                    </div>
                </div>
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Số lượng báo cáo theo từng cấp</h5>
                    </div>
                    <div className="mb-5">
                        {columnChart && <ReactApexChart series={columnChart?.series} options={columnChart?.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="bar" height={300} width={"100%"} />}
                    </div>
                </div>
                <div className="panel">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white">Số lượng báo cáo theo nhóm</h5>
                    </div>

                    <div className="mb-5" style={{ zIndex: '9999999', position: "relative" }}>
                        {donutChart && <ReactApexChart series={donutChart?.series} options={donutChart?.options} className="rounded-lg bg-white dark:bg-black overflow-hidden" type="donut" height={300} width={"100%"} />}
                    </div>
                </div>
               
               

            </div>
        </div>
    );
};

export default DashBoard;
