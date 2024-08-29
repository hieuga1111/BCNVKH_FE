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
import { deleteShift, downloadFile, reportScientificReports } from '@/services/apis/shift.api';
interface Props {
    [key: string]: any;
}

const ViewFile = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(`Xem tài liệu đính kèm`));
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
    const { data: shift, pagination, mutate } = Shifts({ management_level_id: 'NN', ...router.query, size: pageSize });

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



    const handlePrint = () => {
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
                title: `Bạn muốn tải tài liệu?`,
                padding: '2em',
                html: `
                    <input id="swal-input1" placeholder="Từ trang"  class="swal2-input">
                    <input id="swal-input2" placeholder="Đến trang" class="swal2-input">
                `,
                focusConfirm: false,
                preConfirm: () => {
                    return [
                        (document.getElementById("swal-input1") as HTMLInputElement).value,
                        (document.getElementById("swal-input2") as HTMLInputElement).value,
                    ];
                },
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    const data = {
                        startPage: (document.getElementById("swal-input1") as HTMLInputElement).value,
                        endPage: (document.getElementById("swal-input2") as HTMLInputElement).value
                    }
                    downloadFile(
                        data, router.query.id,
                    ).then((res) => {
                        const link = document.createElement('a');
                        link.href = `http://103.57.223.140:3001/${res.path}`;
                        link.setAttribute('download', res.path); // Đặt tên cho file PDF tải xuống
                        document.body.appendChild(link);
                        link.click();
                        showMessage(`${res.mess}`, 'success');
                    }).catch((err) => {
                        showMessage(`${err.response.data.mess}`, 'error');
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
                    <span>Xem tài liệu đính kèm</span>

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
                        <button type="button" className=" m-1 button-table button-create" onClick={() => handlePrint()}>
                            <span className="uppercase">Tải tài liệu</span>
                        </button>

                    </div>
                </div>
                <iframe src={`http://103.57.223.140:3001/files/${router.query.path}#toolbar=0`} width="100%" height="800px">
                </iframe>
            </div>
        </div>
    );
};

export default ViewFile;