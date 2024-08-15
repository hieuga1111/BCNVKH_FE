import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, Transition } from '@headlessui/react';

import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Select from 'react-select';
import Link from 'next/link';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import IconBack from '@/components/Icon/IconBack';
import dayjs from 'dayjs';
import { removeNullProperties } from '@/utils/commons';
import { createShift } from '@/services/apis/shift.api';
import { Departments } from '@/services/swr/department.swr';
import { loadMore } from '@/utils/commons';

import { useRouter } from 'next/router';
import moment from 'moment';
import { useDebounce } from 'use-debounce';
import { createReportType } from '@/services/apis/report-type.api';

interface Props {
    [key: string]: any;
}

const AddNewShift = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const [typeShift, setTypeShift] = useState(1); // 1: time, 0: total hours
    const router = useRouter();
    const baseSchema = {
        name: Yup.string().required(`Vui lòng nhập tên nhóm`),
    };
    const [pageDepartment, setSizeDepartment] = useState<any>(1);
    const [queryDepartment, setQueryDepartment] = useState<any>();
    const [file, setFile] = useState<any>([]);

    const [dataDepartment, setDataDepartment] = useState<any>([]);

    const [debouncedPage] = useDebounce(pageDepartment, 500);
    const [debouncedQuery] = useDebounce(queryDepartment, 500);
    const { data: departmentparents } = Departments({ page: 1, size: 200 });

    const [participants, setParticipants] = useState([{ information: '', unit_id: '', participant_role_id: '' }]);
    const extendedSchema = typeShift === 1 ? {
        ...baseSchema,
    } : baseSchema;
    const handleOnScrollBottom = () => {
        setTimeout(() => {
            setSizeDepartment(pageDepartment + 1);
        }, 1000);
    };
    const SubmittedForm = Yup.object().shape(extendedSchema);
    const handleAddShift = (value: any) => {
        removeNullProperties(value);

        createReportType(value).then(() => {
            showMessage(`Tạo nhóm NVKH thành công`, 'success');
            router.push('/hrm/reportype');
        }).catch((err) => {
            showMessage(`${err.response.data}`, 'error');
        })
    };

    const handleChangeTypeShift = (e: any, type: number) => {
        if (e) {
            setTypeShift(type)
        }
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
    };
    interface Participant {
        information: string;
        unit_id: string;
        participant_role_id: string;
    }
    const handleChange = (index: number, event: any) => {
        if (event.target) {
            const { name, value } = event.target;

            const values = [...participants];
            if (name in values[index]) {
                values[index][name as keyof Participant] = value;
            }
            setParticipants(values);
        } else {
            const values = [...participants];
            values[index].participant_role_id = event.value;
            setParticipants(values);
        }

    };
    const handleUnit = (index: any, event: any) => {

        const values = [...participants];
        values[index].unit_id = event.value;
        setParticipants(values);

    };
    const handleAddInput = () => {
        setParticipants([...participants, { information: '', unit_id: '', participant_role_id: '' }]);
    };

    const handleRemoveInput = (index: any) => {
        const values = [...participants];
        values.splice(index, 1);
        setParticipants(values);
    };
    return (

        <div className="p-5">
            <ul className="flex space-x-2 rtl:space-x-reverse mb-6">
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
                    <span>Tạo mới</span>
                </li>
            </ul>
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>Phân nhóm NVKH</h1>
                <Link href="/hrm/reportype">
                    <button type="button" className="btn btn-primary btn-sm m-1 back-button" >
                        <IconBack className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        <span>
                            {t('back')}
                        </span>
                    </button>
                </Link>
            </div>
            <Formik
                initialValues={{
                    name: '',
                }}
                validationSchema={SubmittedForm}
                onSubmit={(values) => {
                    handleAddShift(values);
                }}
                enableReinitialize
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
                                {submitCount ? errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null : ''}
                            </div>
                        </div>
                      
                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left gap-8">
                            <Link href="/hrm/scientific_reports_gorvement">
                                <button type="button" className="btn btn-outline-dark cancel-button" >
                                    {/* <IconBack className="w-5 h-5 ltr:mr-2 rtl:ml-2" /> */}
                                    <span>
                                        {t('cancel')}
                                    </span>
                                </button>
                            </Link>
                            {/* <button type="button" className="btn btn-outline-dark cancel-button" onClick={() => handleCancel()}>
                                {t('cancel')}
                            </button> */}
                            <button type="submit" className="btn :ml-4 rtl:mr-4 add-button">
                                {t('add')}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>

    );
};

export default AddNewShift;
