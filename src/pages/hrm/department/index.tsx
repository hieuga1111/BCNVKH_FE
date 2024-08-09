import { useEffect, Fragment, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { setPageTitle } from '../../../store/themeConfigSlice';
import { lazy } from 'react';
// Third party libs
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from 'react-i18next';
// API
// constants
import { PAGE_SIZES, PAGE_SIZES_DEFAULT, PAGE_NUMBER_DEFAULT } from '@/utils/constants';
// helper
import { capitalize, formatDate, showMessage } from '@/@core/utils';
// icons
import IconPencil from '../../../components/Icon/IconPencil';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import { IconLoading } from '@/components/Icon/IconLoading';
import IconPlus from '@/components/Icon/IconPlus';
import { Departments, DepartmentsTree } from '@/services/swr/department.swr';

// json
import DepartmentList from './department_list.json';
import IconFolderMinus from '@/components/Icon/IconFolderMinus';
import IconDownload from '@/components/Icon/IconDownload';

import Link from 'next/link';
import { Box } from '@atlaskit/primitives';
import TableTree, { Cell, Header, Headers, Row, Rows } from '@atlaskit/table-tree';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconNewEdit from '@/components/Icon/IconNewEdit';
import IconNewTrash from '@/components/Icon/IconNewTrash';
import IconDisplaylist from '@/components/Icon/IconDisplaylist';
import IconDisplayTree from '@/components/Icon/IconDisplayTree';
import IconNewPlus from '@/components/Icon/IconNewPlus';
import { deleteDepartment } from '@/services/apis/department.api';
import IconNewEye from '@/components/Icon/IconNewEye';
interface Props {
	[key: string]: any;
}

const Department = ({ ...props }: Props) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	useEffect(() => {
		dispatch(setPageTitle(`${t('department')}`));
	});

	const router = useRouter();

	const [display, setDisplay] = useState('tree');
	const [showLoader, setShowLoader] = useState(true);
	const [page, setPage] = useState<any>(PAGE_NUMBER_DEFAULT);
    const [pageSize, setPageSize] = useState(PAGE_SIZES_DEFAULT);
    const [total, setTotal] = useState(0);
	const [search, setSearch] = useState('');
	const [getStorge, setGetStorge] = useState<any>();
	const [data, setData] = useState<any>();

	const [openModal, setOpenModal] = useState(false);

	const { data: recordsData, pagination, mutate } = Departments({ ...router.query, size: pageSize });
	useEffect(() => {
		if (typeof window !== 'undefined') {
			setGetStorge(DepartmentList);
			localStorage.setItem('departmentList', JSON.stringify(DepartmentList));
		}
	}, []);

	useEffect(() => {
		setShowLoader(false);
	}, [recordsData]);

	const handleEdit = (data: any) => {
		// setOpenModal(true);
		// setData(data);
		router.push(`/hrm/department/${data}`);
	};
	const handleDetail = (data: any) => {
		// setOpenModal(true);
		// setData(data);
		router.push(`/hrm/department/detail/${data}`);
	};
	const handleDelete = (data: any) => {
		const swalDeletes = Swal.mixin({
			customClass: {
				confirmButton: 'btn btn-secondary',
				cancelButton: 'btn btn-danger ltr:mr-3 rtl:ml-3',
				popup: 'confirm-delete',
			},
			imageUrl: '/assets/images/delete_popup.png',
			buttonsStyling: false,
		});
		swalDeletes
			.fire({
				title: `${t('delete_department')}`,
				text: `${t('delete')} ${data.records.name}`,
				padding: '2em',
				showCancelButton: true,
				cancelButtonText: `${t('cancel')}`,
				confirmButtonText: `${t('confirm')}`,
				reverseButtons: true,
			})
			.then((result) => {
				if (result.value) {
					deleteDepartment(data?.records.id)
						.then(() => {
							mutate();
							showMessage(`${t('delete_department')}`, 'success');
						})
						.catch((err) => {
							showMessage(`${err?.response?.data}`, 'error');
						});
				}
			});
	};

	const handleSearch = (param: any) => {
		if (display === 'tree') setDisplay('flat')
		setSearch(param);
		router.replace({
			pathname: router.pathname,
			query: {
				...router.query,
				search_text: param,
			},
		});
	};
	const handleKeyPress = (event: any) => {
		if (event.key === 'Enter') {
			handleSearch(search);
		}
	};
	const handleChangePage = (page: number, pageSize: number) => {
		router.replace(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					page: page,
					perPage: pageSize,
				},
			},
			undefined,
			{ shallow: true },
		);
		return pageSize;
	};

	
	
	const columns = [
		{
			accessor: 'id',
			title: '#',
			render: (records: any, index: any) => <span>{(page - 1) * pageSize + index + 1}</span>,
		},
		
		{
			accessor: 'name', title: 'Tên đơn vị', sortable: false,
			
		},
		{
			accessor: 'name_E', title: 'Tên tiếng anh', sortable: false,
		},
		{
			accessor: 'action',
			title: 'Thao tác',
			// width: "150px",
			titleClassName: '!text-center',
			render: (records: any) => (
				<div className="mx-auto flex w-max items-center gap-2">
					<div className="w-[auto]">
						<button type="button" className="button-edit" onClick={() => handleEdit(records.id)}>
							<IconNewEdit />
							<span>{t('edit')}</span>
						</button>
					</div>
					<div className="w-[auto]">
						<button type="button" className="button-delete" onClick={() => handleDelete({ records })}>
							<IconNewTrash />
							<span>{t('delete')}</span>
						</button>
					</div>
				</div>
			),
		},
	];
	return (
		<div>
			{showLoader && (
				<div className="screen_loader animate__animated fixed inset-0 z-[60] grid place-content-center bg-[#fafafa] dark:bg-[#060818]">
					<IconLoading />
				</div>
			)}
			<ul className="mb-6 flex space-x-2 rtl:space-x-reverse">
				<li>
					<Link href="/hrm/dashboard" className="text-primary hover:underline">
						Trang chủ
					</Link>
				</li>
				<li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
					<span>{t('department')}</span>
				</li>
			</ul>

			<title>{t('department')}</title>
			<div className="panel mt-6">
				<div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
					<div className="flex flex-wrap items-center">
						<Link href="/hrm/department/AddNewDepartment">
							<button type="button" className="button-table button-create m-1">
								<IconNewPlus />
								<span className="uppercase">{t('add')}</span>
							</button>
						</Link>
						{/* <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconFolderMinus className="ltr:mr-2 rtl:ml-2" />
                            Nhập file
                        </button>
                        <button type="button" className="btn btn-primary btn-sm m-1 custom-button" >
                            <IconDownload className="ltr:mr-2 rtl:ml-2" />
                            Xuất file excel
                        </button> */}
					</div>
					<div className="display-style">
						<input
							autoComplete="off"
							type="text"
							className="form-input w-auto"
							placeholder={`${t('search')}`}
							onKeyDown={(e) => handleKeyPress(e)}
							onChange={(e) => (e.target.value === '' ? handleSearch('') : setSearch(e.target.value))}
						/>
					</div>
				</div>
				<div className="mb-5">
					<div className="datatables">
						<DataTable
							highlightOnHover
							className="table-hover whitespace-nowrap custom_table"
							records={recordsData?.data}
							columns={columns}
							totalRecords={recordsData?.total}
							recordsPerPage={pageSize}
							page={page}
							onPageChange={(p) => {
                                setPage(p)
                                router.replace({
                                    pathname: router.pathname,
                                    query: {
                                        ...router.query,
                                        page: p,
                                    },
                                });
                            } }
							recordsPerPageOptions={PAGE_SIZES}
							onRecordsPerPageChange={(p) => {
                                setPageSize(p)
                                router.replace({
                                    pathname: router.pathname,
                                    query: {
                                        ...router.query,
                                        size: p,
                                    },
                                });
                            } }
							minHeight={200}
							paginationText={({ from, to, totalRecords }) => `${t('Showing_from_to_of_totalRecords_entries', { from: from, to: to, totalRecords: totalRecords })}`}
						/>
					</div>

				</div>
			</div>
		</div>
	);
};

export default Department;
