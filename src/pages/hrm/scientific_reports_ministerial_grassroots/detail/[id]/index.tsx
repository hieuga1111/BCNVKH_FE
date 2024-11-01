import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { convertTimeFormat, showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Select from 'react-select';
import Link from 'next/link';
import IconBack from '@/components/Icon/IconBack';
import dayjs from 'dayjs';
import { compareObjects, removeNullProperties } from '@/utils/commons';
import { detailFilebyReport, detailParticalbyReport, detailShift, updateShift } from '@/services/apis/shift.api';
import { Shifts } from '@/services/swr/shift.swr';
import { ReportTypes } from '@/services/swr/report-typeswr';

import moment from 'moment';
import IconNewPlus from '@/components/Icon/IconNewPlus';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import { deleteParticipants } from '@/services/apis/participants.api';
import IconEye from '@/components/Icon/IconEye';

interface Props {
    [key: string]: any;
}

const AddNewShift = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const router = useRouter();
    const [detail, setDetail] = useState<any>();
    const [file, setFile] = useState<any>();
    const [partical, setPatical] = useState<any>();
    const [openModal, setOpenModal] = useState<any>(false);
    const [openModalFile, setOpenModalFile] = useState<any>(false);
    const { data: reporttypes } = ReportTypes({ page: 1, size: 200 });

    const [typeShift, setTypeShift] = useState(1); // 0: time, 1: total hours
    const [ip, setIp] = useState<string>('IP Not Found');
    const [role_id, setUser] = useState()

    useEffect(() => {
        const findIP = async () => {
            try {
                const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                const peerConnection = new RTCPeerConnection();

                peerConnection.createDataChannel('');
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);

                peerConnection.onicecandidate = (event) => {
                    if (event && event.candidate && event.candidate.candidate) {
                        const ipMatch = event.candidate.candidate.match(ipRegex);
                        if (ipMatch) {
                            setIp(ipMatch[1]);
                            peerConnection.close();
                        }
                    }
                };
            } catch (err) {
                console.error('Error retrieving IP: ', err);
            }
        };

        findIP();
    }, []);
    useEffect(() => {
        const id = router.query.id;
        if (id) {

            detailShift(id, ip)
                .then((res) => {
                    setDetail(res);
                    setTypeShift(res?.status === true ? 1 : 0);
                })
                .catch((err: any) => {
                    console.log(err);
                });
            detailFilebyReport(id)
                .then((res) => {
                    setFile(res);
                })
                .catch((err: any) => {
                    console.log(err);
                });
            detailParticalbyReport(id)
                .then((res) => {
                    setPatical(res);
                })
                .catch((err: any) => {
                    console.log(err);
                });
        }
        const user = localStorage.getItem('profile') || ''
        setUser(JSON.parse(user).role_id)
    }, [router, ip]);

    const baseSchema = {
        code: Yup.string().required(`${t('please_fill_code_shift')}`),
        name: Yup.string().required(`${t('please_fill_name_shift')}`),
        status: Yup.string(),
    };
    const extendedSchema = typeShift === 1 ? {
        ...baseSchema,
    } : baseSchema;
    const SubmittedForm = Yup.object().shape(extendedSchema);
    const { data: shift, pagination, mutate } = Shifts({ sortBy: 'id.ASC', ...router.query });


    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
    };
    const columns = [
        {
            accessor: 'id',
            title: '#',
        },
        {
            accessor: 'url',
            title: `Tên file`,
            sortable: false,
            render: (records: any, index: any) => <span>{records?.name}</span>
        },


        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <a href={`/hrm/view-file?path=${records?.url.split('/')[1]}&id=${records?.id}&page=${records?.total_pages}`} target='_blank'>

                    <div className="flex items-center w-max mx-auto gap-2">
                        <div className="w-[auto]">

                            <button type="button" className='button-edit'>
                                <IconEye />
                                <span>
                                    Xem
                                </span>
                            </button>
                        </div>
                    </div>
                </a>

            ),
        },
    ]
    const columns1 = [
        {
            accessor: 'id',
            title: '#',
            render: (records: any, index: any) => <span></span>

        },
        {
            accessor: 'information',
            title: `Thông tin`,
            sortable: false,
            render: (records: any, index: any) => <span>{records?.information}</span>
        },
        {
            accessor: 'participant_role_id',
            title: `Vai trò`,
            sortable: false,
            render: (records: any, index: any) => (records.participant_role_id === 'Collaborating') ? 'Phối hợp' :
                (records.participant_role_id === 'Executing') ? 'Thực hiện' :
                    'Chủ trì',
        },
        {
            accessor: 'participant_role_id',
            title: `Đơn vị`,
            sortable: false,
            render: (records: any, index: any) => <span>{records?.unit.name}</span>
        }
    ]
    return (
        <div className="p-5">
            <ul className="mb-6 flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/hrm/dashboard" className="text-primary hover:underline">
                        Trang chủ
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link href="/hrm/scientific_reports_ministerial_grassroots" className="text-primary hover:underline">
                        <span>BCNVKH cấp Cơ sở</span>
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Chi tiết</span>
                </li>
            </ul>
            <div className="header-page-bottom mb-4 flex justify-between pb-4">
                <Link href="/hrm/scientific_reports_ministerial_grassroots">
                    <button type="button" className="btn btn-primary btn-sm back-button m-1">
                        <IconBack className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                        <span>{t('back')}</span>
                    </button>
                </Link>
            </div>
            <Formik
                initialValues={{
                    code: detail?.code,
                    name: detail?.name,
                    release_time: detail?.release_time,
                    acceptance_council: detail?.acceptance_council,
                    assitant_chair: detail?.assitant_chair,
                    assitant_oversee: detail?.assitant_oversee,
                    execution_time: detail?.execution_time,
                    end_time: detail?.end_time,
                    result: detail?.result,
                    summary: detail?.summary,
                    keyword: detail?.keyword,
                    storage: detail?.storage,
                    status: detail?.status,
                    management_level_id: detail?.management_level_id,
                    report_type_id: detail?.report_type_id,
                    confidentiality_level_id: detail?.confidentiality_level_id

                }}
                enableReinitialize
                validationSchema={SubmittedForm}
                onSubmit={(values) => {
                }}
            >
                {({ errors, touched, submitCount, setFieldValue, values }) => (
                    <Form className="space-y-5">
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">

                                <label htmlFor="type" className='label'>
                                    {' '}
                                    Tình trạng
                                </label>
                                <div className="flex" style={{ alignItems: 'center', marginTop: '13px' }}>
                                    <label style={{ marginBottom: 0, marginRight: '10px' }}>
                                        <Field autoComplete="off" type="radio" name="type" value={1}
                                            checked={typeShift === 1} disabled
                                            className="form-checkbox rounded-full" />
                                        Hoàn thành
                                    </label>
                                    <label style={{ marginBottom: 0 }}>
                                        <Field autoComplete="off" type="radio" name="type" value={0}
                                            checked={typeShift === 0} disabled
                                            className="form-checkbox rounded-full" />
                                        Chưa hoàn thành
                                    </label>
                                </div>
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="code" className='label'>
                                    {' '}
                                    Mã
                                </label>
                                <Field disabled autoComplete="off" name="code" type="text" id="code_shift" className="form-input" />
                            </div>

                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="name" className='label'>
                                    {' '}
                                    Tên
                                </label>
                                <Field disabled autoComplete="off" name="name" type="text" id="name" className="form-input" />
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="release_time" className='label'>
                                    {' '}
                                    Lần ban hành
                                </label>
                                <Field disabled autoComplete="off" name="release_time" type="number" id="release_time" className="form-input"

                                />
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="acceptance_council" className='label'>
                                    {' '}
                                    Hội đồng nghiệm thu
                                </label>
                                <Field disabled autoComplete="off" name="acceptance_council" type="text" id="acceptance_council" className="form-input" />
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="assitant_chair" className='label'>
                                    {' '}
                                    Trợ lý hội đồng
                                </label>
                                <Field disabled autoComplete="off" name="assitant_chair" type="text" id="assitant_chair" className="form-input"

                                />
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="assitant_oversee" className='label'>
                                    {' '}
                                    Trợ lý giám sát
                                </label>
                                <Field disabled autoComplete="off" name="assitant_oversee" type="text" id="assitant_oversee" className="form-input" />
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="execution_time" className='label'>
                                    {' '}
                                    Thời gian thực hiện
                                </label>
                                <Field disabled autoComplete="off" name="execution_time" type="text" id="execution_time" className="form-input"

                                />
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>

                            <div className="mb-5 w-1/2">
                                <label htmlFor="result" className='label'>
                                    Kết quả
                                </label>
                                <Select
                                    isDisabled={true}
                                    id="result"
                                    name="result"
                                    
                                    placeholder={`${values.result}`}
                                    maxMenuHeight={160}
                                />
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="end_time" className='label'>
                                    {' '}
                                    Thời gian kết thúc
                                </label>
                                <Flatpickr
                                    disabled={true}

                                    options={{
                                        enableTime: true,
                                    }}
                                    onChange={e => {
                                        if (e.length > 0) {
                                            setFieldValue('end_time', dayjs(e[0]).format('YYYY-MM-DD'));
                                        }
                                    }}
                                    className="form-input calender-input"
                                    placeholder={`${values.end_time}`}

                                />
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="keyword" className='label'>
                                    {' '}
                                    Từ khóa
                                </label>
                                <Field disabled autoComplete="off" name="keyword" type="text" id="keyword" className="form-input" />
                            </div>

                            <div className="mb-5 w-1/2">
                                <label htmlFor="storage" className='label'>
                                    {' '}
                                    Nơi lưu trữ
                                </label>
                                <Field disabled autoComplete="off" name="storage" type="text" id="storage" className="form-input" />
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="summary" className='label'>
                                    {' '}
                                    Tóm tắt
                                </label>
                                <Field disabled autoComplete="off" name="summary" as="textarea" rows="4" id="description" className="form-input" />
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="summary" className='label'>
                                    {' '}
                                    Phân nhóm NVKH
                                </label>
                                <Select
                                    name="unit_id"
                                    options={reporttypes?.data.map((item: any) => {
                                        return {
                                            value: item.id,
                                            label: item.name
                                        }
                                    })}
                                    isDisabled={true}
                                    maxMenuHeight={160}
                                    onChange={(e: any) => {
                                        setFieldValue("report_type_id", e.value);
                                    }}

                                />
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            
                            <div className="mb-5 w-1/2">
                                <label htmlFor="summary" className='label'>
                                    {' '}
                                    Độ mật
                                </label>
                                <Select
                                    isDisabled={true}
                                    id="confidentiality_level_id"
                                    name="confidentiality_level_id"

                                    placeholder={`${values.confidentiality_level_id}`}
                                    maxMenuHeight={160}
                                />
                            </div>
                        </div>
                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left gap-8">

                            {
                                role_id === 'U' ? <></> : <Link href={`/hrm/scientific_reports_ministerial_grassroots/${router.query.id}`}>
                                    <button type="submit" className="btn :ml-4 rtl:mr-4 add-button">
                                        {t('edit')}
                                    </button>
                                </Link>
                            }


                        </div>
                    </Form>
                )}
            </Formik>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Tài liệu đính kèm</span>
            </li>
            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        {/* <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
                            Nhập file
                        </button>
                        <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconDownload className="ltr:mr-2 rtl:ml-2" />
                            Xuất file excel
                        </button> */}
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover custom_table"
                        records={file?.data}
                        columns={columns}
                        minHeight={200}
                    />
                </div>
            </div>
            <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Người tham gia</span>
            </li>
            <div className="panel mt-6">
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">

                        {/* <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
                            Nhập file
                        </button>
                        <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconDownload className="ltr:mr-2 rtl:ml-2" />
                            Xuất file excel
                        </button> */}
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover custom_table"
                        records={partical?.data}
                        columns={columns1}
                        minHeight={200}
                    />
                </div>
            </div>

        </div>

    );
};

export default AddNewShift;
