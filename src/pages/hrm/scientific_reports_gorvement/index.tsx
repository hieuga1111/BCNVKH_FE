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
import IconNewEye from '@/components/Icon/IconNewEye';

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

    const [openModal, setOpenModal] = useState(false);

    // get data
    const { data: shift, pagination, mutate } = Shifts({ management_level_id: 'NN', ...router.query });

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
                    search_text: param,
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
            accessor: 'code',
            title: `Mã`,
            sortable: false,
            render: (records: any, index: any) => <span>{records?.code}</span>
        },
        {
            accessor: 'name',
            title: `Tên`,
            sortable: false,
            render: (records: any, index: any) => <span>{records?.name}</span>
        },
        {
            accessor: 'release_time',
            title: `Thời gian phát hành`,
            sortable: false,
            render: (records: any, index: any) => <span>{records?.release_time}</span>

        },
        {
            accessor: 'acceptance_council',
            title: `Hội đồng nghiệm thu`,
            sortable: false,
            render: (records: any, index: any) => <span>{records?.acceptance_council}</span>

        },

        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    <div className="w-[auto]">

                        <button type="button" className='button-edit' onClick={() => handleEdit(records)}>
                            <IconNewEdit /><span>
                                {t('edit')}
                            </span>
                        </button>
                    </div>
                    <div className="w-[auto]">

                        <button type="button" className='button-delete' onClick={() => handleDelete(records)}>
                            <IconNewTrash />
                            <span>
                                {t('delete')}
                            </span>
                        </button>
                    </div>
                </div>
            ),
        },
    ]
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
                    <span>BCNVKH cấp Nhà nước</span>

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
                        <Link href="/hrm/scientific_reports_gorvement/create">
                            <button type="button" className=" m-1 button-table button-create" >
                                <IconNewPlus />
                                <span className="uppercase">{t('add')}</span>
                            </button>
                        </Link>
                        <button type="button" className=" m-1 button-table button-create" onClick={() => handleBackup()}>
                            <span className="uppercase">Xuất báo cáo</span>
                        </button>
                        {/* <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
                            Nhập file
                        </button>
                        <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconDownload className="ltr:mr-2 rtl:ml-2" />
                            Xuất file excel
                        </button> */}
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
                        onRecordsPerPageChange={e => handleChangePage(pagination?.page, e)}
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

export default Duty;
