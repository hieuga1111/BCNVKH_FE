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
import { CreateFile } from '@/services/apis/file.api';

interface Props {
    [key: string]: any;
}

const FilelModal = ({ ...props }: Props) => {
    const { t } = useTranslation();
        const { data: departmentparents } = Departments({ page: 1, size: 200 });

    const [disabled, setDisabled] = useState(false);
    const [typeShift, setTypeShift] = useState("0"); // 0: time, 1: total hours
    const SubmittedForm = Yup.object().shape({
        file: Yup.object().typeError(`Vui lòng chọn file`),
    });
    const [file, setFile] = useState<any>([]);

    const handlePartical = (value: any) => {
        const data = new FormData();
        data.append('scientific_report_id', props?.scientific_report_id);
        Array.from(file).map((item: any) => data.append('files', item))

        CreateFile(data).then(() => {
            props.setFile;
            props.setOpenModal(false);
            props.setData(undefined);
            showMessage(`Thêm tệp định kèm thành công`, 'success');
        }).catch((err) => {
            showMessage(`${err}`, 'error');
        })
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

                                        }}
                                        onSubmit={(values) => {
                                            handlePartical(values);
                                        }}
                                    >
                                        {({ errors, touched, submitCount, setFieldValue, values }) => (
                                            <Form className="space-y-5">
                                                <div className='flex justify-between gap-5'>
                                                    <div className="mb-5">
                                                        <label htmlFor="summary" className='label'>
                                                            {' '}
                                                            Tệp đính kèm
                                                        </label>
                                                        <input name="summary" type="file" onChange={e => setFile(e.target.files)} id="description" className="form-input" multiple />
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

export default FilelModal;
