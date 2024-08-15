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
import { ReportTypes } from '@/services/swr/report-typeswr';

interface Props {
    [key: string]: any;
}

const AddNewShift = ({ ...props }: Props) => {
    const { t } = useTranslation();
    const [disabled, setDisabled] = useState(false);
    const [typeShift, setTypeShift] = useState(1); // 1: time, 0: total hours
    const router = useRouter();
    const baseSchema = {
        code: Yup.string().required(`${t('please_fill_code_shift')}`),
        name: Yup.string().required(`${t('please_fill_name_shift')}`),
        status: Yup.string(),
    };
    const [pageDepartment, setSizeDepartment] = useState<any>(1);
    const [queryDepartment, setQueryDepartment] = useState<any>();
    const [file, setFile] = useState<any>([]);

    const [dataDepartment, setDataDepartment] = useState<any>([]);

    const [debouncedPage] = useDebounce(pageDepartment, 500);
    const [debouncedQuery] = useDebounce(queryDepartment, 500);
        const { data: departmentparents } = Departments({ page: 1, size: 200 });
        const { data: reporttypes } = ReportTypes({ page: 1, size: 200 });

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
        const data = new FormData();
        data.append('name', value.name);
        data.append('code', value.code);
        data.append('release_time', value.release_time);
        data.append('acceptance_council', value.acceptance_council);
        data.append('assitant_chair', value.assitant_chair);
        data.append('assitant_oversee', value.assitant_oversee);
        data.append('execution_time', value.execution_time);
        data.append('end_time', value.end_time);
        data.append('result', value.result);
        data.append('summary', value.summary);
        data.append('status', typeShift.toString());
        data.append('keyword', value.keyword);
        data.append('storage', value.storage);
        data.append('management_level_id', 'CS');
        data.append('report_type_id', value.report_type_id);

        participants.map((item, index) => {
            data.append(`participants[${index}][information]`, item.information);
            data.append(`participants[${index}][unit_id]`, item.unit_id);
            data.append(`participants[${index}][participant_role_id]`, item.participant_role_id);
        }
        )
        Array.from(file).map((item: any) => data.append('files', item))

        createShift(data).then(() => {
            showMessage(`Tạo báo cáo cấp cơ sở thành công`, 'success');
            router.push('/hrm/scientific_reports_ministerial_grassroots');
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
                    <Link href="/hrm/scientific_reports_ministerial_grassroots" className="text-primary hover:underline">
                        <span>BCNVKH cấp cơ sở</span>
                    </Link>

                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Tạo mới</span>
                </li>
            </ul>
            <div className='flex justify-between header-page-bottom pb-4 mb-4'>
                <h1 className='page-title'>BCNVKH cấp cơ sở</h1>
                <Link href="/hrm/scientific_reports_ministerial_grassroots">
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
                    code: '',
                    name: '',
                    release_time: "",
                    acceptance_council: "",
                    assitant_chair: "",
                    assitant_oversee: "",
                    execution_time: "",
                    end_time: null,
                    result: "",
                    summary: "",
                    keyword: "",
                    storage: "",
                    status: 1,
                    description: "",
                    report_type_id: null,
                    management_level_id: 'CS',
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
                                {submitCount ? errors.status ? <div className="mt-1 text-danger"> {errors.status} </div> : null : ''}
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="code" className='label'>
                                    {' '}
                                    Mã <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" name="code" type="text" id="code_shift" placeholder={`Vui lòng nhập mã}`} className="form-input" />
                                {submitCount ? errors.code ? <div className="mt-1 text-danger"> {errors.code} </div> : null : ''}
                            </div>

                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="name" className='label'>
                                    {' '}
                                    Tên <span style={{ color: 'red' }}>* </span>
                                </label>
                                <Field autoComplete="off" name="name" type="text" id="name" placeholder={`Vui lòng nhập tên`} className="form-input" />
                                {submitCount ? errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null : ''}
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
                                            value: 'Giỏi',
                                            label: 'Giỏi',
                                        },
                                        {
                                            value: 'Khá',
                                            label: 'Khá',
                                        },
                                        {
                                            value: 'Trung bình',
                                            label: 'Trung bình',
                                        },
                                    ]}
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
                                    placeholder={`Chọn nhóm NVKH`}
                                    maxMenuHeight={160}
                                    onChange={(e: any) => {
                                        setFieldValue("report_type_id", e.value);
                                    }}

                                />
                            </div>
                            <div className="mb-5 w-1/2">
                                <label htmlFor="summary" className='label'>
                                    {' '}
                                    Tệp đính kèm
                                </label>
                                <input name="summary" type="file" onChange={e => setFile(e.target.files)} id="description" className="form-input" multiple />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="summary" className='label'>
                                {' '}
                                Tóm tắt
                            </label>
                            <Field autoComplete="off" name="summary" as="textarea" rows="4" id="description" placeholder={'Nhập tóm tắt'} className="form-input" />
                        </div>
                        {participants.map((input, index) => (

                            <div key={index}>
                                <div className='flex justify-between gap-5'>
                                    <div className="mb-5 w-1/2">
                                        <label className='label'>
                                            {' '}
                                            Thông tin người tham gia
                                        </label>
                                        <Field
                                            type="text"
                                            value={input.information}
                                            name="information" className="form-input"
                                            onChange={(event: any) => handleChange(index, event)}
                                        />
                                    </div>
                                    <div className="mb-5 w-1/2">
                                        <label className='label'>
                                            {' '}
                                            Vai trò
                                        </label>
                                        <Select
                                            name="participant_role_id"
                                            options={[
                                                {
                                                    value: "Collaborating",
                                                    label: "Cơ quan, đơn vị phối hợp"
                                                },
                                                {
                                                    value: "Executing",
                                                    label: "Cơ quan, đơn vị thực hiện"
                                                },
                                                {
                                                    value: "Lead",
                                                    label: "Cơ quan, đơn vị chủ trì"
                                                }
                                            ]}
                                            placeholder={`Chọn vai trò`}
                                            maxMenuHeight={160}
                                            onChange={(event: any) => handleChange(index, event)}

                                        />
                                    </div>
                                    <div className="mb-5 w-1/2">
                                        <label htmlFor="storage" className='label'>
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
                                            onChange={(event: any) => handleUnit(index, event)}

                                        />
                                    </div>
                                    <div className="mb-5 w-1/2">
                                        <label htmlFor="storage" className='label'>
                                            {' '}
                                        </label>

                                        <button type="button" className="btn btn-outline-dark cancel-button" onClick={() => handleRemoveInput(index)}>
                                            Xóa bản ghi
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}
                        <button type="button" className="btn :ml-4 rtl:mr-4 add-button" onClick={handleAddInput}>
                            Thêm bản ghi
                        </button>
                        <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left gap-8">
                            <Link href="/hrm/scientific_reports_ministerial_grassroots">
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
