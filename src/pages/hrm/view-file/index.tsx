import { useEffect, Fragment, useState, useCallback, useRef } from 'react';
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
import { deleteShift, downloadFile, reportScientificReports } from '@/services/apis/shift.api';
import { saveAs } from 'file-saver'
import PdfViewer from './PdfViewer';
// Cấu hình worker cho pdf.js

interface Props {
    [key: string]: any;
}

// default layout plugin
// Import styles of default layout plugin
const ViewFile = ({ ...props }: Props) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(`Xem tài liệu đính kèm`));
    });
    const iframeRef = useRef(null);


    const router = useRouter();

    const [showLoader, setShowLoader] = useState(false);
    const [page, setPage] = useState<any>(PAGE_NUMBER_DEFAULT);
    const [total, setTotal] = useState<any>();
    const [getStorge, setGetStorge] = useState<any>();
    const [data, setData] = useState<any>();
    const [filter, setFilter] = useState<any>({
        search: '',
        type: ''
    });
    const [numPages, setNumPages] = useState<number | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem('shiftList');
            if (data) {
                setGetStorge(JSON.parse(data));
            } else {
            }
        }
        setTotal(router.query.page || '')
    }, [])
    const countPdfPages = async (pdfUrl: string) => {
        // const loadingTask = pdfjs.getDocument(pdfUrl);
        // const pdf = await loadingTask.promise;
        // setNumPages(pdf.numPages);
    };

    useEffect(() => {
    }, [router.query.path]);
    const handleRightClick = (event: any) => {
        event.preventDefault(); // Ngăn chặn menu chuột phải mặc định
    };
   
    const disableContextMenu = () => {
        var myFrame = document.getElementById('pdfframe');
        console.log(myFrame)
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
            <div className="panel mt-6" id="container"
            >
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        

                    </div>
                </div>
                    
                    <PdfViewer pdfUrl={`http://103.57.223.140:3001/files/${router.query.path}`} total={(router.query.page || 1).toString()} id={router.query.id}></PdfViewer>
                
            </div>

        </div >
    );
};

export default ViewFile;
