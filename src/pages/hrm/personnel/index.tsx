import { useEffect, Fragment, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { lazy } from 'react';
// Third party libs
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
// API
import { deleteDepartment, detailDepartment, listAllDepartment } from '../../../services/apis/department.api';
// constants
import { PAGE_SIZES, PAGE_SIZES_DEFAULT, PAGE_NUMBER_DEFAULT } from '@/utils/constants';
import { downloadFile } from '@/@core/utils';
// helper
import { capitalize, formatDate, showMessage } from '@/@core/utils';
// icons
import { useRouter } from 'next/router';

// json
import PersonnelList from './personnel_list.json';
import Link from 'next/link';


import IconNewEdit from '@/components/Icon/IconNewEdit';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import IconNewPlus from '@/components/Icon/IconNewPlus';
import { Humans, HumansByDepartment } from '@/services/swr/human.swr';
import { deleteHuman, downloadUsers, exportHuman } from '@/services/apis/human.api';
import IconSearch from '@/components/Icon/IconSearch';
import { MultiSelect, Select } from '@mantine/core';
interface Props {
    [key: string]: any;
}

const Department = ({ ...props }: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(`${t('staff')}`));
    });
    const router = useRouter();
    const [display, setDisplay] = useState('tree')
    const [showLoader, setShowLoader] = useState(false);
    const [page, setPage] = useState<any>(PAGE_NUMBER_DEFAULT);
    const [pageSize, setPageSize] = useState(PAGE_SIZES_DEFAULT);
    const [total, setTotal] = useState(0);
    const [getStorge, setGetStorge] = useState<any>();
    const { data: recordsData, pagination, mutate } = Humans({ ...router.query, size: pageSize });
    const [selectedDepartments, setSelectedDepartments] = useState<string>('');

    const [codeArr, setCodeArr] = useState<string[]>([]);
    const [search, setSearch] = useState<any>("");
    const canvasRef = useRef(null);
    const url = "http://103.57.223.140:3001/files/Sinh hoat CB-T5, 6, 7.pdf"

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem('staffList');
            if (data) {
                setGetStorge(JSON.parse(data));
            } else {
                localStorage.setItem('staffList', JSON.stringify(PersonnelList));
            }
        }
    }, []);
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }
    useEffect(() => {
        setTotal(getStorge?.length);
        setPageSize(PAGE_SIZES_DEFAULT);

        // setShowLoader(false);
    }, [getStorge, getStorge?.length, page]);

    // useEffect(() => {
    // 	setShowLoader(false);
    // }, [recordsData]);

    const handleEdit = (data: any) => {
        router.push(`/hrm/personnel/${data}`)
    };
    const handleDetail = (data: any) => {
        router.push(`/hrm/personnel/detail/${data}`)
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
        console.log(data)
        swalDeletes
            .fire({
                title: `${t('delete_staff')}`,
                html: `<span class='confirm-span'>${t('confirm_delete')}</span> ${data.username}?`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    deleteHuman(data?.id).then(() => {
                        mutate();
                        showMessage(`${t('delete_staff_success')}`, 'success');
                    }).catch((err) => {
                        showMessage(`${err?.response?.data?.message}`, 'error');
                    });
                }
            });
    };

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
    const handleSearch = (param: any) => {
        setSearch(param);
        router.replace({
            pathname: router.pathname,
            query: {
                ...router.query,
                username: param,
            },
        });
    };
    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            // Xử lý sự kiện khi nhấn phím Enter ở đây
            console.log('Enter key pressed');
            handleSearch(search)
        }
    };

    const columns = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span>{(page - 1) * pageSize + index + 1}</span>,
        },

        {
            accessor: 'name', title: 'Tên người dùng', sortable: false,

        },
        {
            accessor: 'username', title: 'Tên đăng nhập', sortable: false,

        },
        {
            accessor: 'role_id', title: 'Loại tài khoản',
            render: (records: any) => records.role_id === "A" ? 'Quản trị hệ thống' : 'Người dùng',
        },
        {
            accessor: 'action',
            title: 'Thao tác',
            // width: "150px",
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="mx-auto flex w-max items-center gap-2">
                    <div className="w-[auto]">
                        <button type="button" className="button-edit" onClick={() => handleEdit(records.id)}>
                            <IconNewEdit />
                            <span>{t('edit')}</span>
                        </button>
                    </div>
                    <div className="w-[auto]">
                        <button type="button" className="button-delete" onClick={() => handleDelete( records )}>
                            <IconNewTrash />
                            <span>{t('delete')}</span>
                        </button>
                    </div>
                </div>
            ),
        },
    ];
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
                    downloadUsers().then((res) => {
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
        <div >
            {/* {showLoader && (
				<div className="screen_loader animate__animated fixed inset-0 z-[60] grid place-content-center bg-[#fafafa] dark:bg-[#060818]">
					<IconLoading />
				</div>
			)} */}
            <ul className="flex space-x-2 rtl:space-x-reverse mb-6">
                <li>
                    <Link href="/hrm/dashboard" className="text-primary hover:underline">
                        Trang chủ
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{t('staff')}</span>

                </li>
            </ul>
            <title>{t('staff')}</title>
            <div className="panel mt-6" style={{ overflowX: 'auto' }}>
                <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div className="flex flex-wrap items-center">
                        <Link href="/hrm/personnel/AddNewPersonel">
                            <button type="button" className=" m-1 button-table button-create" >
                                <IconNewPlus />
                                <span className="uppercase">{t('add')}</span>
                            </button>
                        </Link>
                        <button type="button" className=" m-1 button-table button-create" onClick={() => handleBackup()}>
                            <span className="uppercase">Xuất báo cáo</span>
                        </button>
                    </div>
                    <div className='display-style'>
                        <input
                            autoComplete="off"
                            type="text"
                            className="form-input w-auto"
                            placeholder={`${t('search')}`}
                            onKeyDown={(e) => handleKeyPress(e)}
                            onChange={(e) => e.target.value === "" ? handleSearch("") : setSearch(e.target.value)}
                            style={{ marginRight: '10px' }}
                        />
                        <Select
                            data={['Quản trị hệ thống', 'Người dùng']}
                            value={selectedDepartments}
                            placeholder="Tìm theo loại tài khoản"
                            onChange={(p: any) => {
                                setSelectedDepartments(p)
                                router.replace({
                                    pathname: router.pathname,
                                    query: {
                                        ...router.query,
                                        role_id: p === 'Quản trị hệ thống' ? 'A' : 'U',
                                    },
                                });
                            }}
                            clearable
                            searchable
                        />
                    </div>
                </div>
                <div className="mb-5">
                    <div className="datatables">
                        <DataTable
                            highlightOnHover
                            className="table-hover whitespace-nowrap custom_table"
                            records={recordsData?.data}
                            columns={columns}
                            totalRecords={recordsData?.total}
                            recordsPerPage={pageSize}
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
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `${t('Showing_from_to_of_totalRecords_entries', { from: from, to: to, totalRecords: totalRecords })}`}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Department;
