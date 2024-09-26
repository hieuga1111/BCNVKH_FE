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
import list_departments from '../../department/department_list.json';
import list_personnels from '../../personnel/personnel_list.json';
import { detailHuman, updateHuman } from '@/services/apis/human.api';
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
	const [disabled, setDisabled] = useState(false);
	const [defaultPosition, setdefaultPosition] = useState<any>([]);
	const [startDate, setStartDate] = useState<any>();
	const [endDate, setEndDate] = useState<any>();
	//scroll
	const [queryDirect, setQueryDirect] = useState<any>();
	const [queryShift, setQueryShift] = useState<any>();
	const [queryDepartment, setQueryDepartment] = useState<any>();
	const [queryPosition, setQueryPosition] = useState<any>();
	const [dataDepartment, setDataDepartment] = useState<any>([]);
	const [pageDepartment, setSizeDepartment] = useState<any>(1);
	const [debouncedPage] = useDebounce(pageDepartment, 500);
	const [debouncedQuery] = useDebounce(queryDepartment, 500);
	const [dataPosition, setDataPosition] = useState<any>([]);
	const [pagePosition, setSizePosition] = useState<any>(1);
	const [debouncedPagePosition] = useDebounce(pagePosition, 500);
	const [debouncedQueryPosition] = useDebounce(queryPosition, 500);
	const [dataDirectSuperior, setDataDirectSuperior] = useState<any>([]);
	const [pageDirectSuperior, setSizeDirectSuperior] = useState<any>(1);
	const [debouncedPageDirectSuperior] = useDebounce(pageDirectSuperior, 500);
	const [debouncedQueryDirectSuperior] = useDebounce(queryDirect, 500);
	const [dataShift, setDataShift] = useState<any>([]);
	const [pageShift, setSizeShift] = useState<any>(1);
	const [debouncedPageShift] = useDebounce(pageShift, 500);
	const [debouncedQueryShift] = useDebounce(queryShift, 500);
	const { data: departmentparents, pagination: paginationDepartment, isLoading: DepartmentLoading } = Departments({ page: debouncedPage, search: debouncedQuery?.search });

	const { data: manages, pagination: paginationDirectSuperior } = Humans({
		sortBy: 'id.ASC',
		page: debouncedPageDirectSuperior,
		perPage: 10,
		search: debouncedQueryDirectSuperior?.search,
	});

	const { data: shifts, pagination: paginationShift } = Shifts({
		sortBy: 'id.ASC',
		page: debouncedPageShift,
		perPage: 10,
		search: debouncedQueryShift?.search,
	});
	/////////////
	const handleOnScrollBottom = () => {
		setTimeout(() => {
			setSizeDepartment(paginationDepartment?.page + 1);
		}, 1000);
	};
	const handleOnScrollBottomDirectSuperior = () => {
		setTimeout(() => {
			setSizeDirectSuperior(paginationDirectSuperior?.page + 1);
		}, 1000);
	};
	const handleOnScrollBottomShift = () => {
		setTimeout(() => {
			setSizeShift(paginationShift?.page + 1);
		}, 1000);
	};
	/////////////////
	useEffect(() => {
		loadMore(departmentparents, dataDepartment, paginationDepartment, setDataDepartment, 'id', 'name');
	}, [paginationDepartment, debouncedPage, debouncedQuery]);
	useEffect(() => {
		loadMore(manages, dataDirectSuperior, paginationDirectSuperior, setDataDirectSuperior, 'id', 'fullName');
	}, [paginationDirectSuperior, debouncedPageDirectSuperior, debouncedQueryDirectSuperior]);
	useEffect(() => {
		loadMore(shifts, dataShift, paginationShift, setDataShift, 'id', 'name');
	}, [paginationShift, debouncedPageShift, debouncedQueryShift]);
	/////////////////
	const handleSearchDepartment = (param: any) => {
		setQueryDepartment({ search: param });
	};
	const handleSearchPosition = (param: any) => {
		setQueryPosition({ search: param });
	};
	const handleSearchDirect = (param: any) => {
		setQueryDirect({ search: param });
	};
	const handleSearchShift = (param: any) => {
		setQueryShift({ search: param });
	};
	//--------------setData--------------------
	const { data: shifts1 } = Shifts({
		sortBy: 'id.ASC',
		page: 1,
		perPage: 100,
	});
	const shift2 = shifts1?.data.map((item: any) => ({
		value: item.id,
		label: item.name,
	}));
	const { data: department1 } = Departments({
		sortBy: 'id.ASC',
		page: 1,
		perPage: 100,
	});
	const department2 = department1?.data.map((item: any) => ({
		value: item.id,
		label: item.name,
	}));
	const { data: human1 } = Humans({
		sortBy: 'id.ASC',
		page: 1,
		perPage: 100,
	});
	const human2 = human1?.data.map((item: any) => ({
		value: item.id,
		label: item.fullName,
	}));
	///////////////////////////
	const SubmittedForm = Yup.object().shape({
	
		
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
	const handleCancel = () => {
		props.setOpenModal(false);
		props.setData(undefined);
	};
	const handleHuman = (value: any) => {
		removeNullProperties(value);
		console.log(value)
		updateHuman(detail?.id, {
			name: value.name,
			role_id: value.role_id.value
		})
			.then(() => {
				showMessage(`${t('update_staff_success')}`, 'success');
				// window.location.href = '/hrm/personnel';
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
					setStartDate(res?.data?.passportDate);
					setEndDate(res?.data?.passportExpired);
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
						<Link href="/hrm/role" className="text-primary hover:underline">
							<span>{t('staff')}</span>
						</Link>
					</li>
					<li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
						<span>{t('edit_staff')}</span>
					</li>
				</ul>
				<div className="header-page-bottom mb-4 flex justify-between pb-4">
					<h1 className="page-title">{t('edit_staff')}</h1>
					<Link href="/hrm/role">
						<button type="button" className="btn btn-primary btn-sm back-button m-1">
							<IconBack className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
							<span>{t('back')}</span>
						</button>
					</Link>
				</div>

				<Formik
					initialValues={{
						username: detail ? `${detail?.username}` : '',
						name: detail ? `${detail?.name}` : '',
						// password: detail?.password ? `${detail?.password}` : '',
						// password_: detail?.password ? `${detail?.password}` : '',
						role_id: detail?.role_id ? detail?.role_id : '',

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
															<label htmlFor="role_id" className="label">
																Loại tài khoản
															</label>
															{
															}
															<Select
																id="role_id"
																name="role_id"
																options={[
																	{
																		value: "A",
																		label: 'Quản trị viên',
																	},
																	{
																		value: "U",
																		label: 'Người dùng',
																	},
																	{
																		value: "As",
																		label: 'Trợ lý',
																	},
																]}
																value={values.role_id}
																placeholder={`Chọn loại tài khoản`}
																maxMenuHeight={160}
																onChange={(e) => {
																	setFieldValue('role_id', e);
																}}
															/>
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
