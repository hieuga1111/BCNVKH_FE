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
import { detailReportType, updateReportType } from '@/services/apis/report-type.api';
import { ReportTypes } from '@/services/swr/report-typeswr';

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
            detailReportType(id)
                .then((res) => {
                    setDetail(res);
                })
                .catch((err: any) => {
                    console.log(err);
                });
        }
    }, [router]);

    const baseSchema = {
        name: Yup.string().required(`Vui lòng nhập tên nhóm`),
    };
    const extendedSchema = typeShift === 1 ? {
        ...baseSchema,
    } : baseSchema;
    const SubmittedForm = Yup.object().shape(extendedSchema);
    const { data: shift, pagination, mutate } = ReportTypes({ ...router.query });

    const handleUpdateShift = (value: any) => {
        removeNullProperties(value);
        let dataSubmit;

        updateReportType(detail?.id, value)
            .then(() => {
                showMessage(`Sửa phân nhóm NVKH thành công`, 'success');
                mutate();
                router.push('/hrm/reportype')
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
   
    return (
        <div className="p-5">
            <ul className="mb-6 flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="/hrm/dashboard" className="text-primary hover:underline">
                        Trang chủ
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link href="/hrm/reportype" className="text-primary hover:underline">
                        <span>Phân nhóm NVKH</span>
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Sửa</span>
                </li>
            </ul>
            <div className="header-page-bottom mb-4 flex justify-between pb-4">
                <h1 className="page-title">Sửa</h1>
                <Link href="/hrm/reportype">
                    <button type="button" className="btn btn-primary btn-sm back-button m-1">
                        <IconBack className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                        <span>{t('back')}</span>
                    </button>
                </Link>
            </div>
            <Formik
                initialValues={{
                    name: detail?.name,
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
                                <label htmlFor="name" className='label'>
                                    {' '}
                                    Tên <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" name="name" type="text" id="name" placeholder={`Vui lòng nhập tên`} className="form-input" />
                                {submitCount ? errors.name ? <div className="mt-1 text-danger">  {`${errors.name}`} </div> : null : ''}
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
          
        </div>

    );
};

export default AddNewShift;
