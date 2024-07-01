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
import { Humans } from '@/services/swr/human.swr';
import { Departments } from '@/services/swr/department.swr';

import IconBack from '@/components/Icon/IconBack';
import { createDepartment } from '@/services/apis/department.api';
import { useRouter } from 'next/router';
import { useDebounce } from 'use-debounce';
import { loadMore } from '@/utils/commons';

interface Props {
    [key: string]: any;
}

const AddNewDepartment = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const [query, setQuery] = useState<any>();
    const router = useRouter();
    const [typeShift, setTypeShift] = useState('0'); // 0: time, 1: total hours/
    //scroll

    const [dataDepartment, setDataDepartment] = useState<any>([]);
    const [pageDepartment, setSizeDepartment] = useState<any>(1);
    const [debouncedPage] = useDebounce(pageDepartment, 500);
    const [debouncedQuery] = useDebounce(query, 500);

    const { data: departmentparents, pagination: paginationDepartment, isLoading: DepartmentLoading } = Departments({ page: debouncedPage, search: debouncedQuery?.search });

    const { data: manages } = Humans({
        page: 1,
        perPage: 100,
    });

    const manage = manages?.data.filter((item: any) => {
        if (!item.departmentId) return (item.value = item.id), (item.label = item.fullName);
    });
    const directManagers = [{ value: 0, label: 'No options' }]
    const departmentparent = departmentparents?.data.filter((item: any) => {
        return (item.value = item.id), (item.label = item.name);
    });
    const SubmittedForm = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Too Short!')
            .required(`${t('please_fill_name_department')}`),
        name_E: Yup.string()
            .min(2, 'Too Short!')
            .required(`${t('please_fill_departmentname_E')}`),

    });
    useEffect(() => {
        const addNoOptions = (data: any) => {
            const noOptions = { value: 0, label: 'No options' };
            if (!data.some((item: any) => item.value === noOptions.value)) {
                return [noOptions, ...data];
            }
            return data;
        };

        const bonusDataDepartments = addNoOptions(dataDepartment);
        loadMore(departmentparents, bonusDataDepartments, paginationDepartment, setDataDepartment, 'id', 'name')
    }, [paginationDepartment, debouncedPage, debouncedQuery])

    const handleOnScrollBottom = () => {
        if (paginationDepartment?.page < paginationDepartment?.totalPages) {
            setSizeDepartment(paginationDepartment?.page + 1);
        }
    };
    const handleSearch = (param: any) => {
        setQuery({ search: param });
    };
    const handleDepartment = (value: any) => {
        createDepartment({
            name_E: value?.name_E,
            name: value?.name,
        })
            .then(() => {
                showMessage(`${t('add_department_success')}`, 'success');
                router.push('/hrm/department');
            })
            .catch((err) => {
                showMessage(err?.response?.data?.message ? err?.response?.data?.message : `${t('add_department_error')}`, 'error');
            });
    };

    const handleChangeTypeShift = (e: any) => {
        setTypeShift(e);
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
                    <Link href="/hrm/department" className="text-primary hover:underline">
                        <span>{t('department')}</span>
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{t('add_department')}</span>
                </li>
            </ul>
            <div className="header-page-bottom mb-4 flex justify-between pb-4">
                <h1 className="page-title">{t('add_department')}</h1>
                <Link href="/hrm/department">
                    <button type="button" className="btn btn-primary btn-sm back-button m-1">
                        <IconBack className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                        <span>{t('back')}</span>
                    </button>
                </Link>
            </div>
            <Formik
                initialValues={{
                    name: props?.data ? `${props?.data?.name}` : '',
                    name_E: props?.data ? `${props?.data?.name_E}` : '',
                }}
                validationSchema={SubmittedForm}
                onSubmit={(values) => {
                    handleDepartment(values);
                }}
            >
                {({ errors, values, setFieldValue, submitCount }) => (
                    <Form className="space-y-5">
                        <div className="mb-5">
                            <label htmlFor="name" className="label">
                                {' '}
                                {t('name_department')} <span style={{ color: 'red' }}>* </span>
                            </label>
                            <Field autoComplete="off" name="name" type="text" id="name" placeholder={`${t('enter_name_department')}`} className="form-input" />
                            {submitCount ? errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null : ''}
                        </div>
                        <div className="mb-5">
                            <label htmlFor="name_E" className="label">
                                {' '}
                                Tên tiếng Anh <span style={{ color: 'red' }}>* </span>
                            </label>
                            <Field autoComplete="off" name="name_E" type="text" id="name_E" placeholder={`Nhập tên tiếng anh`} className="form-input" />
                            {submitCount ? errors.name_E ? <div className="mt-1 text-danger"> {errors.name_E} </div> : null : ''}
                        </div>


                        <div className="mt-8 flex items-center justify-end gap-8 ltr:text-right rtl:text-left">
                            <Link href="/hrm/department">
                                <button type="button" className="btn btn-outline-dark cancel-button">
                                    {t('cancel')}
                                </button>
                            </Link>
                            <button type="submit" className="btn :ml-4 add-button rtl:mr-4" disabled={disabled}>
                                {props.data !== undefined ? t('update') : t('add')}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddNewDepartment;
