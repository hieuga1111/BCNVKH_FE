import { useEffect, Fragment, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { lazy } from 'react';
import Link from 'next/link';
// Third party libs
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
// API
// constants
import { PAGE_SIZES, PAGE_SIZES_DEFAULT, PAGE_NUMBER_DEFAULT } from '@/utils/constants';
// helper
import { capitalize, formatDate, showMessage } from '@/@core/utils';
// icons
import { IconLoading } from '@/components/Icon/IconLoading';

import { useRouter } from 'next/router';
// json
import IconNewEdit from '@/components/Icon/IconNewEdit';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import IconNewPlus from '@/components/Icon/IconNewPlus';
import { Shifts } from '@/services/swr/shift.swr';
import { deleteShift, reportScientificReports } from '@/services/apis/shift.api';
import IconEye from '@/components/Icon/IconEye';
import { Search } from '@/services/swr/search.swr';
import { Departments } from '@/services/swr/department.swr';
import { ReportTypes } from '@/services/swr/report-typeswr';
import Select from 'react-select';
import dayjs from 'dayjs';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconX from '@/components/Icon/IconX';
interface Props {
    [key: string]: any;
}

const Duty = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(`BCNVKH cấp Nhà nước`));
    });

    const router = useRouter();

    const [showLoader, setShowLoader] = useState(true);
    const [page, setPage] = useState<any>(PAGE_NUMBER_DEFAULT);
    const [pageSize, setPageSize] = useState(PAGE_SIZES_DEFAULT);
    const [recordsData, setRecordsData] = useState<any>();
    const [total, setTotal] = useState(0);
    const [getStorge, setGetStorge] = useState<any>();
    const [data, setData] = useState<any>();
    const [filter, setFilter] = useState<any>({
        search: '',
        type: ''
    });
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });
    const [role_id, setUser] = useState()

    const [openModal, setOpenModal] = useState(false);
    const [selectUnit, SetSelectUnit] = useState();
    const [selectType, SetSelectType] = useState();
    const [selectLevel, SetSelectLevel] = useState();
    const [statDate, SetStatDate] = useState<string>();
    const [endDate, SetEndDate] = useState<string>();

    // get data
    const { data: shift, pagination, mutate } = Search({ ...router.query, size: pageSize });
    const { data: departmentparents } = Departments({ page: 1, size: 200 });
    const { data: reporttypes } = ReportTypes({ page: 1, size: 200 });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem('shiftList');
            if (data) {
                setGetStorge(JSON.parse(data));
            } else {
            }
        }
        const user = localStorage.getItem('profile') || ''
        setUser(JSON.parse(user).role_id)
    }, [])

    useEffect(() => {
        setShowLoader(false);
    }, [recordsData])

    const handleEdit = (data: any) => {
        router.push(`/hrm/scientific_reports_gorvement/${data.id}`)
    };

    const handleDelete = (data: any) => {
        const swalDeletes = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-secondary',
                cancelButton: 'btn btn-danger ltr:mr-3 rtl:ml-3',
                popup: 'confirm-popup confirm-delete',
            },
            imageUrl: '/assets/images/delete_popup.png',
            buttonsStyling: false,
        });
        swalDeletes
            .fire({
                title: `Xóa BCNVKH cấp Nhà nước`,
                html: `<span class='confirm-span'>${t('confirm_delete')}</span> ${data.name}?`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    deleteShift(data?.id).then(() => {
                        mutate();
                        showMessage(`Xóa thành công`, 'success');
                    }).catch((err) => {
                        showMessage(`${err.response.data}`, 'error');

                    });
                }
            });
    };

    const handleSearch = (param: any) => {
        setFilter({
            ...filter,
            search: param
        })
        router.replace(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    search_text: param,
                },
            }
        );
    }
    useEffect(() => {
        router.replace(
            {
                pathname: router.pathname,
                query: {

                    ...(statDate !== undefined ? { start_time: statDate } : {}),
                    ...(endDate !== undefined ? { end_time: endDate } : {}),
                    ...(selectLevel !== undefined ? { management_level_id: selectLevel } : {}),
                    ...(selectUnit !== undefined ? { unit_id: selectUnit } : {}),
                    ...(selectType !== undefined ? { report_type_id: selectType } : {})
                },
            }
        );
    }, [statDate, endDate, selectLevel, selectUnit, selectType])
    const handleChangePage = (page: number, pageSize: number) => {
        router.replace(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    page: page,
                    perPage: pageSize,
                },
            },
            undefined,
            { shallow: true },
        );
        return pageSize;
    };

    const handleDetail = (data: any) => {
        router.push(`/hrm/scientific_reports_gorvement/detail/${data.scientific_report.id}`)
    };
    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(page - 1) * pageSize + index + 1}</span>,
        },
        {
            accessor: 'code',
            title: `Mã`,
            sortable: false,
            render: (records: any, index: any) => <span>{records?.scientific_report.code}</span>
        },
        {
            accessor: 'name',
            title: `Tên`,
            sortable: false,
            render: (records: any, index: any) => <span>{records?.scientific_report.name}</span>
        },
        {
            accessor: 'release_time',
            title: `Thời gian kết thúc`,
            sortable: false,
            render: (records: any, index: any) => <span>{records?.scientific_report.end_time}</span>

        },

        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    <div className="w-[auto]">

                        <button type="button" className='button-detail' onClick={() => handleDetail(records)}>
                            <IconEye /><span>
                                {t('detail')}
                            </span>
                        </button>
                    </div>
                </div>
            ),
        },
    ]
    const handlePrint = () => {
        window.print();
    }
    const handleBackup = () => {
        const swalDeletes = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-secondary',
                cancelButton: 'btn btn-danger ltr:mr-3 rtl:ml-3',
                popup: 'confirm-popup confirm-delete',
            },
            imageUrl: '/assets/images/delete_popup.png',
            buttonsStyling: false,
        });
        swalDeletes
            .fire({
                title: `Bạn muốn tải báo cáo?`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    reportScientificReports('NN').then((res) => {
                        console.log(res)
                        window.location.href = res;
                        showMessage(`Tải thành công`, 'success');
                    }).catch((err) => {
                        showMessage(`${err.response.data}`, 'error');

                    });
                }
            });
    }
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse mb-6">
                <li>
                    <Link href="/hrm/dashboard" className="text-primary hover:underline">
                        Trang chủ
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Tìm kiếm</span>

                </li>
            </ul>
            {showLoader && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <div className="panel mt-6" style={{ overflowX: 'auto' }}>
                <div className="mb-4.5 flex flex-col " style={{}}>
                    <div className='display-style' style={{ zIndex: '9999999', justifyContent: 'space-between' }}>

                        <input style={{ width: '15%' }} autoComplete="off" type="text" className="form-input w-auto" placeholder={`${t('search')}`} value={filter?.search} onChange={(e) => handleSearch(e.target.value)} />
                        <div style={{ width: '15%' }}>

                            <Select
                                options={departmentparents?.data.map((item: any) => {
                                    return {
                                        value: item.id,
                                        label: item.name
                                    }
                                })}
                                placeholder={`Chọn đơn vị`}
                                onChange={(e: any) => {
                                    if (e) {
                                        SetSelectUnit(e.value);

                                    } else {
                                        SetSelectUnit(undefined);
                                    }
                                }}
                                isClearable={true}

                            />
                        </div>
                        <div style={{ width: '13%' }}>

                            <Select
                                options={[{
                                    value: "B",
                                    label: "Bộ"
                                },
                                {
                                    value: "CS",
                                    label: "Cơ sở"
                                },
                                {
                                    value: "HV",
                                    label: "Học viện"
                                },
                                {
                                    value: "NN",
                                    label: "Nhà nước"
                                }]}
                                placeholder={`Chọn cấp`}
                                onChange={(e: any) => {
                                    if (e) {
                                        SetSelectLevel(e.value);

                                    } else {
                                        SetSelectLevel(undefined);
                                    }
                                }}
                                isClearable={true}

                            />
                        </div>
                        <div style={{ width: '13%' }}>

                            <Select
                                options={reporttypes?.data.map((item: any) => {
                                    return {
                                        value: item.id,
                                        label: item.name
                                    }
                                })}
                                placeholder={`Chọn nhóm`}
                                onChange={(e: any) => {
                                    if (e) {
                                        SetSelectType(e.value);

                                    } else {
                                        SetSelectType(undefined);
                                    }
                                }}
                                isClearable={true}

                            />
                        </div>

                        <div style={{ width: '20%', display: 'flex', alignItems: 'center' }}>

                            <Flatpickr
                                options={{
                                    enableTime: false,

                                }}
                                value={statDate}
                                onChange={e => {
                                    if (e.length > 0) {
                                        SetStatDate(dayjs(e[0]).format('YYYY-MM-DD'));
                                    }
                                }}
                                className="form-input calender-input"
                                placeholder={`Chọn thời gian bắt đầu`}


                            />
                            <a style={{ borderColor: '#e0e6ed', borderWidth: 'thin', padding: '6px' }} onClick={e => SetStatDate(undefined)}><IconX></IconX></a>
                        </div>
                        <div style={{ width: '20%', display: 'flex', alignItems: 'center' }}>

                            <Flatpickr
                                options={{
                                    enableTime: false,

                                }}
                                value={endDate}
                                onChange={e => {
                                    if (e.length > 0) {
                                        SetEndDate(dayjs(e[0]).format('YYYY-MM-DD'));
                                    }
                                }}
                                className="form-input calender-input"
                                placeholder={`Chọn thời gian bắt đầu`}


                            />
                            <a style={{ borderColor: '#e0e6ed', borderWidth: 'thin', padding: '6px' }} onClick={e => SetEndDate(undefined)}><IconX></IconX></a>
                        </div>
                    </div>
                </div>
                <div className="mb-5">
                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="whitespace-nowrap table-hover custom_table"
                            records={shift?.data}
                            columns={columns}
                            totalRecords={shift?.total}
                            recordsPerPage={10}
                            page={page}
                            onPageChange={(p) => {
                                setPage(p)
                                router.replace({
                                    pathname: router.pathname,
                                    query: {
                                        ...router.query,
                                        page: p,
                                    },
                                });
                            }}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={(p) => {
                                setPageSize(p)
                                router.replace({
                                    pathname: router.pathname,
                                    query: {
                                        ...router.query,
                                        size: p,
                                    },
                                });
                            }}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `${t('Showing_from_to_of_totalRecords_entries', { from: from, to: to, totalRecords: totalRecords })}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Duty;
