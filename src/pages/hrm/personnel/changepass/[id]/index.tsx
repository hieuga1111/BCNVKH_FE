import { useEffect, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import { Dialog, Transition } from '@headlessui/react';

import { IconLoading } from '@/components/Icon/IconLoading';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import Swal from 'sweetalert2';
import { dateFormatDay, showMessage } from '@/@core/utils';
import IconX from '@/components/Icon/IconX';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Select from 'react-select';
import Link from 'next/link';
import IconArrowBackward from '@/components/Icon/IconArrowBackward';
import { Departments } from '@/services/swr/department.swr';
import { Humans } from '@/services/swr/human.swr';
import AnimateHeight from 'react-animate-height';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconBack from '@/components/Icon/IconBack';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { changePass, detailHuman, updateHuman } from '@/services/apis/human.api';
import { loadMore, removeNullProperties } from '@/utils/commons';
import { useDebounce } from 'use-debounce';

// import provinces from '../provinces';
import dayjs from 'dayjs';
import { start } from 'nprogress';
import { Label } from '@headlessui/react/dist/components/label/label';
import { Shifts } from '@/services/swr/shift.swr';
interface Props {
	[key: string]: any;
}
interface list {
	value: string;
	label: string;
}
const EditPersonel = ({ ...props }: Props) => {
	const router = useRouter();
	const [query, setQuery] = useState<any>('');
	const [detail, setDetail] = useState<any>();

	const [images, setImages] = useState<any>([]);
	const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
		setImages(imageList as never[]);
	};
	const [passportDate, setPassportDate] = useState<any>();
	const maxNumber = 69;
	const { t } = useTranslation();
	
	//--------------setData--------------------
	const { data: shifts1 } = Shifts({
		sortBy: 'id.ASC',
		page: 1,
		perPage: 100,
	});
	///////////////////////////
	const SubmittedForm = Yup.object().shape({
		password: Yup.string().required(`${t('please_enter_password')}`),
		password_: Yup.string()
			.required('Vui lòng nhập lại mật khẩu')
			.oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
	});
	const handleSearch = (param: any) => {
		setQuery(param);
	};

	const [active, setActive] = useState<any>([1, 2, 3]);
	const handleActive = (value: any) => {
		if (active.includes(value)) {
			setActive(active.filter((item: any) => item !== value));
		} else {
			setActive([value, ...active]);
		}
	};
	const handleHuman = (value: any) => {
		removeNullProperties(value);
		changePass(detail?.id, {
			new_password: value.password,
		})
			.then(() => {
				showMessage(`Cập nhật mật khẩu cho tài khoản ${detail.username} thành công`, 'success');
				window.location.href = '/hrm/personnel';
			})
			.catch((err) => {
				showMessage(`${err.response.data}`, 'error');
			});
	};
	useEffect(() => {
		const id = router.query.id;
		if (id) {
			detailHuman(id)
				.then((res) => {
					setDetail(res);
				})
				.catch((err: any) => {
					console.log(err);
				});
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
						<Link href="/hrm/personnel" className="text-primary hover:underline">
							<span>{t('staff')}</span>
						</Link>
					</li>
					<li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
						Đổi mật khẩu tài khoản: {detail?.username}
					</li>
				</ul>
				<div className="header-page-bottom mb-4 flex justify-between pb-4">
					<h1 className="page-title">{t('edit_staff')}</h1>
					<Link href="/hrm/personnel">
						<button type="button" className="btn btn-primary btn-sm back-button m-1">
							<IconBack className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
							<span>{t('back')}</span>
						</button>
					</Link>
				</div>

				<Formik
					initialValues={{
						password: detail?.password ? `${detail?.password}` : '',
						password_: detail?.password ? `${detail?.password}` : '',

					}}
					validationSchema={SubmittedForm}
					onSubmit={(values) => {
						handleHuman(values);
					}}
					enableReinitialize
				>
					
					{({ errors, touched, values, setFieldValue, submitCount }) => (
						<Form className="space-y-5">
							<div className="mb-5">
								<div className="space-y-2 font-semibold">
									<div className="rounded">
										<div className={`custom-content-accordion`}>
											<AnimateHeight duration={300} height={active.includes(1) ? 'auto' : 0}>
												<div className="space-y-2 border-[#d3d3d3] p-4 text-[13px] dark:border-[#1b2e4b]">
													<div className="flex justify-between gap-5">
														<div className="mb-5 w-1/2">
															<label htmlFor="password" className="label">
																{t('password')} <span style={{ color: 'red' }}>* </span>
															</label>
															<Field
																autoComplete="off"
																name="password"
																type="password"
																id="password"
																placeholder={`${t('enter_password')}`}
																className="password-input form-control rounded-0 form-input"
															/>
															{submitCount ? errors.password ? <div className="mt-1 text-danger"> {`${errors.password}`} </div> : null : ''}
														</div>
														<div className="mb-5 w-1/2">
															<label htmlFor="password_" className="label">
																{t('password_')}
																<span style={{ color: 'red' }}>* </span>
															</label>
															<Field autoComplete="off" name="password_" type="password" id="password_" placeholder={t('enter_password_')} className="form-input" />
															{errors.password_ ? <div className="mt-1 text-danger"> {`${errors.password_}`} </div> : null}
														</div>
													</div>
													
												</div>
											</AnimateHeight>
										</div>
									</div>

								</div>
							</div>
							<div className="mt-8 flex items-center justify-end gap-8 ltr:text-right rtl:text-left">
								<Link href="/hrm/personnel">
									<button type="button" className="btn btn-outline-dark cancel-button">
										{t('cancel')}
									</button>
								</Link>
								<button type="submit" className="btn :ml-4 add-button rtl:mr-4">
									{t('update')}
								</button>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default EditPersonel;
