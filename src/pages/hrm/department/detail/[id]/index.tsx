import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import { Dialog, Transition } from '@headlessui/react';

import { IconLoading } from '@/components/Icon/IconLoading';
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

import { removeNullProperties } from '@/utils/commons';
import { Humans } from '@/services/swr/human.swr';
import { Departments } from '@/services/swr/department.swr';
import { detailDepartment, updateDepartment } from '@/services/apis/department.api';
interface Props {
	[key: string]: any;
}

const EditDepartment = ({ ...props }: Props) => {
	const router = useRouter();

	const { t } = useTranslation();
	const [disabled, setDisabled] = useState(false);
	const [query, setQuery] = useState<any>();
	const [detail, setDetail] = useState<any>();


	// const { data: manages } = Humans(query);

	// const manage = manages?.data.filter((item: any) => {
	//     return (
	//         item.value = item.id,
	//         item.label = item.fullName
	//     )
	// })


	const SubmittedForm = Yup.object().shape({
		name: Yup.string()
			.min(2, 'Too Short!')
			.required(`${t('please_fill_name_department')}`),
		name_E: Yup.string().required(`${t('please_fill_departmentname_E')}`),
		abbreviation: Yup.string().required(`${t('please_fill_departmentName')}`),
		description: Yup.string(),
		headOfDepartmentId: Yup.number().typeError(`${t('please_fill_manager')}`),
		// parentId: Yup.number().typeError(`${t('please_fill_parent_department')}`),
	});
	const handleSearch = (param: any) => {
		setQuery({ search: param });
	};
	const handleDepartment = (value: any) => {
		removeNullProperties(value);
		console.log('name', value);
		let dataSubmit;
		dataSubmit = {
			name: value.name,
			name_E: value.name_E,
		};
		updateDepartment(detail?.id, dataSubmit)
			.then(() => {
				showMessage(`${t('edit_department_success')}`, 'success');
			})
			.catch((err) => {
				showMessage(`${err?.response?.data?.message[0].error ? err?.response?.data?.message[0].error : err?.response?.data?.message}`, 'error');
			});
	};

	useEffect(() => {
		const id = router.query.id;
		if (router.query.id) {
			detailDepartment(router.query.id)
				.then((res) => {
					setDetail(res);
				})
				.catch((err) => console.log(err));
		}
	}, [router]);
	return (
		<div>

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
						<span>{t('detail_department')}</span>
					</li>
				</ul>
				<div className="header-page-bottom mb-4 flex justify-between pb-4">
					<h1 className="page-title">{t('detail_department')}</h1>
					<Link href="/hrm/department">
						<button type="button" className="btn btn-primary btn-sm back-button m-1">
							<IconBack className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
							<span>{t('back')}</span>
						</button>
					</Link>
				</div>
				{detail?.id !== undefined && (
					<Formik
						initialValues={{
							name: detail ? `${detail?.name}` : '',
							name_E: detail ? `${detail?.name_E}` : '',
						}}
						validationSchema={SubmittedForm}
						onSubmit={(values) => {
							handleDepartment(values);
						}}
						enableReinitialize
					>
						{({ errors, touched, submitCount, values, setFieldValue }) => (
							<Form className="space-y-5">
								<div className="mb-5">
									<label htmlFor="name" className="label">
										{' '}
										{t('name_department')} <span style={{ color: 'red' }}>* </span>
									</label>
									<Field autoComplete="off" disabled name="name" type="text" id="name" placeholder={`${t('enter_name_department')}`} className="form-input" />
									{submitCount ? errors.name ? <div className="mt-1 text-danger"> {errors.name} </div> : null : ''}
								</div>
								<div className="mb-5">
									<label htmlFor="name_E" className="label">
										{' '}
										{t('name_E_department')} <span style={{ color: 'red' }}>* </span>
									</label>
									<Field autoComplete="off" disabled name="name_E" type="text" id="name_E" placeholder={`${t('enter_name_E_department')}`} className="form-input" />
									{submitCount ? errors.name_E ? <div className="mt-1 text-danger"> {errors.name_E} </div> : null : ''}
								</div>

								<div className="mt-8 flex items-center justify-end gap-8 ltr:text-right rtl:text-left">
									<Link href="/hrm/department">
										<button type="button" className="btn btn-outline-dark cancel-button">
											{t('cancel')}
										</button>
									</Link>
									<button type="submit" className="btn :ml-4 add-button rtl:mr-4" disabled={disabled}>
										{t('update')}
									</button>
								</div>
							</Form>
						)}
					</Formik>
				)}
			</div>
		</div>
	);
};

export default EditDepartment;
