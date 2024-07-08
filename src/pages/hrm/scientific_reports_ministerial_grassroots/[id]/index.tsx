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
import { removeNullProperties } from '@/utils/commons';
import { detailFilebyReport, detailParticalbyReport, detailShift, updateShift } from '@/services/apis/shift.api';
import { Shifts } from '@/services/swr/shift.swr';
import moment from 'moment';
import IconNewPlus from '@/components/Icon/IconNewPlus';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import { deleteParticipants } from '@/services/apis/participants.api';
import ParticalModal from './particalModal';
import FilelModal from './fileModal';

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

    const [typeShift, setTypeShift] = useState(1); // 0: time, 1: total hours
    useEffect(() => {
        const id = router.query.id;
        if (id) {
            detailShift(id)
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
                    console.log(res)
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
    }, [router]);

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

    const handleUpdateShift = (value: any) => {
        removeNullProperties(value);
        let dataSubmit;

        updateShift(detail?.id, value)
            .then(() => {
                showMessage(`Sửa báo cáo cấp Cơ sở thành công`, 'success');
                mutate();
                router.push('/hrm/scientific_reports_ministerial_grassroots')
            })
            .catch((err) => {
                showMessage(`${err.response.data}`, 'error');
            });
    };

    const handleChangeTypeShift = (e: any, type: number) => {
        if (e) {
            setTypeShift(type);
        }
    };
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
            render: (records: any, index: any) => <span>{records?.url}</span>
        },


        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (
                <div className="flex items-center w-max mx-auto gap-2">
                    <div className="w-[auto]">

                        <button type="button" className='button-delete'>
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
    const handleDeletePartical = (data: any) => {
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
                title: `Xóa người tham gia`,
                html: `<span class='confirm-span'>${t('confirm_delete')}</span> ${data.information}?`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    deleteParticipants(data?.id).then(() => {
                        const id = router.query.id;
                        if (id) {
                            detailParticalbyReport(id)
                                .then((res) => {
                                    setPatical(res);
                                })
                                .catch((err: any) => {
                                    console.log(err);
                                });
                        }
                        showMessage(`Xóa thành công`, 'success');
                    }).catch((err) => {
                        showMessage(`${err.response.data}`, 'error');

                    });
                }
            });
    };
    const updatePar = () => {
        const id = router.query.id;

        detailParticalbyReport(id)
            .then((res) => {
                setPatical(res);
            })
            .catch((err: any) => {
                console.log(err);
            });
    }
    const updateFile = () => {
        const id = router.query.id;

        detailFilebyReport(id)
            .then((res) => {
                setFile(res);
            })
            .catch((err: any) => {
                console.log(err);
            });
    }
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
            render: (records: any, index: any) => <span>{records?.participant_role_id}</span>
        },
        {
            accessor: 'participant_role_id',
            title: `Vai trò`,
            sortable: false,
            render: (records: any, index: any) => <span>{records?.unit.name}</span>
        },
        {
            accessor: 'action',
            title: 'Thao tác',
            titleClassName: '!text-center',
            render: (records: any) => (

                <div className="flex items-center w-max mx-auto gap-2">
                    <div className="w-[auto]">

                        <button type="button" className='button-delete' onClick={() => handleDeletePartical(records)}>
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
    return (
        <div className="p-5">
            <ul className="mb-6 flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/hrm/dashboard" className="text-primary hover:underline">
                        Trang chủ
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link href="/hrm/scientific_reports_gorvement" className="text-primary hover:underline">
                        <span>BCNVKH cấp Cơ sở</span>
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Sửa</span>
                </li>
            </ul>
            <div className="header-page-bottom mb-4 flex justify-between pb-4">
                <h1 className="page-title">Sửa</h1>
                <Link href="/hrm/scientific_reports_gorvement">
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
                }}
                enableReinitialize
                validationSchema={SubmittedForm}
                onSubmit={(values) => {
                    handleUpdateShift(values);
                }}
            >
                {({ errors, touched, submitCount, setFieldValue, values }) => (
                    <Form className="space-y-5">
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="type" className='label'>
                                    {' '}
                                    {t('type_shift')} <span style={{ color: 'red' }}>* </span>
                                </label>
                                <label htmlFor="type" className='label'>
                                    {' '}
                                    Tình trạng <span style={{ color: 'red' }}>* </span>
                                </label>
                                <div className="flex" style={{ alignItems: 'center', marginTop: '13px' }}>
                                    <label style={{ marginBottom: 0, marginRight: '10px' }}>
                                        <Field autoComplete="off" type="radio" name="type" value={1}
                                            checked={typeShift === 1}
                                            onChange={(e: any) => handleChangeTypeShift(e, 1)}
                                            className="form-checkbox rounded-full" />
                                        Hoàn thành
                                    </label>
                                    <label style={{ marginBottom: 0 }}>
                                        <Field autoComplete="off" type="radio" name="type" value={0}
                                            checked={typeShift === 0}
                                            onChange={(e: any) => handleChangeTypeShift(e, 0)}
                                            className="form-checkbox rounded-full" />
                                        Chưa hoàn thành
                                    </label>
                                </div>
                                {submitCount ? errors.status ? <div className="mt-1 text-danger"> {`${errors.status}`} </div> : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="code" className='label'>
                                    {' '}
                                    Mã <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" name="code" type="text" id="code_shift" placeholder={`Vui lòng nhập mã}`} className="form-input" />
                                {submitCount ? errors.code ? <div className="mt-1 text-danger"> {`${errors.code}`} </div> : null : ''}
                            </div>

                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="name" className='label'>
                                    {' '}
                                    Tên <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" name="name" type="text" id="name" placeholder={`Vui lòng nhập tên`} className="form-input" />
                                {submitCount ? errors.name ? <div className="mt-1 text-danger">  {`${errors.name}`} </div> : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="release_time" className='label'>
                                    {' '}
                                    Lần ban hành
                                </label>
                                <Field autoComplete="off" name="release_time" type="number" id="release_time" placeholder={'Nhập lần ban hành'} className="form-input"

                                />
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="acceptance_council" className='label'>
                                    {' '}
                                    Hội đồng nghiệm thu
                                </label>
                                <Field autoComplete="off" name="acceptance_council" type="text" id="acceptance_council" placeholder={`Nhập hội đồng`} className="form-input" />
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="assitant_chair" className='label'>
                                    {' '}
                                    Trợ lý hội đồng
                                </label>
                                <Field autoComplete="off" name="assitant_chair" type="text" id="assitant_chair" placeholder={'Nhập trợ lý'} className="form-input"

                                />
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="assitant_oversee" className='label'>
                                    {' '}
                                    Trợ lý giám sát
                                </label>
                                <Field autoComplete="off" name="assitant_oversee" type="text" id="assitant_oversee" placeholder={`Nhập trợ lý giám sát`} className="form-input" />
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="execution_time" className='label'>
                                    {' '}
                                    Thời gian thực hiện
                                </label>
                                <Field autoComplete="off" name="execution_time" type="text" id="execution_time" placeholder={'Nhập thời gian'} className="form-input"

                                />
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>

                            <div className="mb-5 w-1/2">
                                <label htmlFor="result" className='label'>
                                    Kết quả
                                </label>
                                <Select
                                    id="result"
                                    name="result"
                                    options={[
                                        {
                                            value: "Xuất sắc",
                                            label: "Xuất sắc",
                                        },
                                        {
                                            value: "Giỏi",
                                            label: 'Giỏi',
                                        },
                                        {
                                            value: "Khá",
                                            label: 'Khá',
                                        },
                                        {
                                            value: "Trung bình",
                                            label: 'Trung bình',
                                        },
                                    ]}
                                    defaultValue={values.result}
                                    placeholder={`Chọn kết quả`}
                                    maxMenuHeight={160}
                                    onChange={(e: any) => {
                                        setFieldValue("result", e.value);
                                    }}
                                />
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="end_time" className='label'>
                                    {' '}
                                    Thời gian kết thúc
                                </label>
                                <Flatpickr
                                    options={{
                                        enableTime: true,
                                    }}
                                    onChange={e => {
                                        if (e.length > 0) {
                                            setFieldValue('end_time', dayjs(e[0]).format('YYYY-MM-DD'));
                                        }
                                    }}
                                    className="form-input calender-input"
                                    placeholder={`Chọn thời gian kết thúc`}

                                />
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="keyword" className='label'>
                                    {' '}
                                    Từ khóa
                                </label>
                                <Field autoComplete="off" name="keyword" type="text" id="keyword" placeholder={'Nhập từ khóa'} className="form-input" />
                            </div>

                            <div className="mb-5 w-1/2">
                                <label htmlFor="storage" className='label'>
                                    {' '}
                                    Nơi lưu trữ
                                </label>
                                <Field autoComplete="off" name="storage" type="text" id="storage" placeholder={'Nhập nơi lưu trữ'} className="form-input" />
                            </div>
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="summary" className='label'>
                                    {' '}
                                    Tóm tắt
                                </label>
                                <Field autoComplete="off" name="summary" as="textarea" id="description" placeholder={'Nhập tóm tắt'} className="form-input" />
                            </div>

                        </div>
                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left gap-8">
                            <Link href="/hrm/shift">
                                <button type="button" className="btn btn-outline-dark cancel-button" >
                                    {/* <IconBack className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> */}
                                    <span>
                                        {t('cancel')}
                                    </span>
                                </button>
                            </Link>
                            <button type="submit" className="btn :ml-4 rtl:mr-4 add-button" disabled={disabled}>
                                {t('update')}
                            </button>
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
                        <button type="button" className=" m-1 button-table button-create" onClick={() => setOpenModalFile(true)}>
                            <IconNewPlus />
                            <span className="uppercase">{t('add')}</span>
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
                        <button type="button" className=" m-1 button-table button-create" onClick={() => setOpenModal(true)}>
                            <IconNewPlus />
                            <span className="uppercase">{t('add')}</span>
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
            <ParticalModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                scientific_report_id={router.query.id}
                setData={updatePar}
            />
             <FilelModal
                openModal={openModalFile}
                setOpenModal={setOpenModalFile}
                scientific_report_id={router.query.id}
                setData={updateFile}
            />
        </div>

    );
};

export default AddNewShift;
