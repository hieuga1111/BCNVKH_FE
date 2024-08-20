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
import { History } from '@/services/swr/history.swr';
import { deleteShift } from '@/services/apis/shift.api';
import IconNewEye from '@/components/Icon/IconNewEye';
import IconDownload from '@/components/Icon/IconDownload';

interface Props {
    [key: string]: any;
}

const File = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(`Lịch sử truy cập báo cáo theo người dùng`));
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

    const [openModal, setOpenModal] = useState(false);

    // get data
    const { data: shift, pagination, mutate } = History({ path: '/api/scientific_reports/', method: 'get', ...router.query, size: pageSize });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem('shiftList');
            if (data) {
                setGetStorge(JSON.parse(data));
            } else {
            }
        }
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
                    username: param
                },
            }
        );
    }
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
        setData(data);
    };
    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(page - 1) * pageSize + index + 1}</span>,
        },
        {
            accessor: 'username',
            title: `Người dùng`,
            sortable: false,
            render: (records: any, index: any) => <span>{records?.username}</span>
        },
        {
            accessor: 'time',
            title: `Thời gian`,
            sortable: false,
            render: (records: any, index: any) => <span>{records?.time}</span>
        },
        {
            accessor: 'ip',
            title: `IP`,
            sortable: false,
            render: (records: any, index: any) => <span>{records?.ip}</span>
        },
    ]

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse mb-6">
                <li>
                    <Link href="/hrm/dashboard" className="text-primary hover:underline">
                        Trang chủ
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Lịch sử truy cập báo cáo theo người dùng</span>

                </li>
            </ul>
            {showLoader && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <IconLoading />
                </div>
            )}
            <title>{t('shift')}</title>
            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                    </div>
                    <div className='flex gap-2'>
                        <div className='flex gap-1'>
                            <div className="flex-1">
                                <input autoComplete="off" type="text" className="form-input w-auto" placeholder={`${t('search')}`} value={filter?.search} onChange={(e) => handleSearch(e.target.value)} />

                            </div>
                        </div>
                    </div>
                </div>
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
                        } }
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `${t('Showing_from_to_of_totalRecords_entries', { from: from, to: to, totalRecords: totalRecords })}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default File;
