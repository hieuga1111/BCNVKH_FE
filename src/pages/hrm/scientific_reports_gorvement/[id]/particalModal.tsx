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
import { Departments } from '@/services/swr/department.swr';
import { createParticipants } from '@/services/apis/participants.api';
import { detailParticalbyReport } from '@/services/apis/shift.api';

interface Props {
    [key: string]: any;
}

const ParticalModal = ({ ...props }: Props) => {
    const { t } = useTranslation();
        const { data: departmentparents } = Departments({ page: 1, size: 200 });

    const [disabled, setDisabled] = useState(false);
    const [typeShift, setTypeShift] = useState("0"); // 0: time, 1: total hours
    const SubmittedForm = Yup.object().shape({
        information: Yup.string()
            .typeError(`Vui lòng nhập thông tin`),
        role: Yup.object()
            .typeError(`Vui lòng chọn vai trò`),
        unit_id: Yup.object().typeError(`Vui lòng chọn đơn vị`),
    });

    const handlePartical = (value: any) => {
        console.log(value)
        if (props?.data) {
            createParticipants(value).then(() => {
                showMessage(`Tạo báo cáo cấp nhà nước thành công`, 'success');
            }).catch((err) => {
                showMessage(`${err.response.data}`, 'error');
            })
        } else {
            createParticipants({
                ...value,
                participant_role_id : value.role.value,
                unit_id: value.unit_id.value,
                scientific_report_id: props?.scientific_report_id
            }).then(() => {
                props.setPatical;
                props.setOpenModal(false);
                props.setData(undefined);
                showMessage(`Thêm mới người tham gia thành công`, 'success');
            }).catch((err) => {
                showMessage(`${err}`, 'error');
            })
        }
    };

    const handleChangeTypeShift = (e: any) => {
        setTypeShift(e);
    }

    const handleCancel = () => {
        props.setOpenModal(false);
        props.setData(undefined);
    };
    return (
        <Transition appear show={props.openModal ?? false} as={Fragment}>
            <Dialog as="div" open={props.openModal} onClose={() => props.setOpenModal(false)} className="relative z-50 w-1/2">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="panel w-full overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark" style={{ maxWidth: "45rem" }}>
                                <button
                                    type="button"
                                    onClick={() => handleCancel()}
                                    className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                >
                                    <IconX />
                                </button>
                                <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                    {props.data !== undefined ? `Sửa người tham gia` : `Thêm người tham gia`}
                                </div>
                                <div className="p-5">
                                    <Formik
                                        initialValues={{
                                            information: props?.data ? `${props?.data?.information}` : '',
                                            role: props?.data ? `${props?.data?.role}` : null,
                                            unit_id: props?.data ? `${props?.data?.unit_id}` : null,
                                        }}
                                        validationSchema={SubmittedForm}
                                        onSubmit={(values) => {
                                            handlePartical(values);
                                        }}
                                    >
                                        {({ errors, touched, submitCount, setFieldValue, values }) => (
                                            <Form className="space-y-5">
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="information" className='label'>
                                                            {' '}
                                                            Thông tin <span style={{ color: 'red' }}>* </span>
                                                        </label>
                                                        <Field autoComplete="off" name="information" type="text" id="information" placeholder={`Nhập thông tin`} className="form-input" />
                                                        {submitCount ? errors.information ? <div className="mt-1 text-danger"> {errors.information} </div> : null : ''}
                                                    </div>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="role" className='label'>
                                                            {' '}
                                                            Vai trò
                                                        </label>
                                                        <Select
                                                            name="role"
                                                            options={[
                                                                {
                                                                    value: "Collaborating",
                                                                    label: "Phối hợp"
                                                                },
                                                                {
                                                                    value: "Executing",
                                                                    label: "Thực hiện"
                                                                },
                                                                {
                                                                    value: "Lead",
                                                                    label: "Chủ trì"
                                                                }
                                                            ]}
                                                            placeholder={`Chọn vai trò`}
                                                            maxMenuHeight={160}
                                                            onChange={(e: any) => {
                                                                setFieldValue("role", e);
                                                            }}

                                                        />
                                                        {submitCount ? errors.role ? <div className="mt-1 text-danger"> {errors.role} </div> : null : ''}

                                                    </div>
                                                </div>
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5 w-1/2">
                                                        <label htmlFor="unit_id" className='label'>
                                                            {' '}
                                                            Đơn vị
                                                        </label>
                                                        <Select
                                                            name="unit_id"
                                                            options={departmentparents?.data.map((item: any) => {
                                                                return {
                                                                    value: item.id,
                                                                    label: item.name
                                                                }
                                                            })}
                                                            placeholder={`Chọn đơn vị`}
                                                            maxMenuHeight={160}
                                                            onChange={(e: any) => {
                                                                setFieldValue("unit_id", e);
                                                            }}

                                                        />
                                                        {submitCount ? errors.unit_id ? <div className="mt-1 text-danger"> {errors.unit_id} </div> : null : ''}

                                                    </div>

                                                </div>

                                                <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => handleCancel()}>
                                                        {t('cancel')}
                                                    </button>
                                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                        {props.data !== undefined ? `${t('update')}` : `${t('add')}`}
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ParticalModal;
