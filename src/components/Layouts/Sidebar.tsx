import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconMenuHome from '../Icon/Menu/IconMenuHome';
import IconMenuDepartment from '../Icon/Menu/IconMenuDepartment';
import IconMenuOrg from '../Icon/Menu/IconMenuOrg';
import IconMenuUser from '../Icon/Menu/IconMenuUser';
import IconMenuWareHouse from '../Icon/Menu/IconMenuWareHouse';
import IconMenuForm from '../Icon/Menu/IconMenuForm';
import IconMenuPersonel from '../Icon/Menu/IconMenuPersonel';
import IconMenuShift from '../Icon/Menu/IconMenuShift';
import IconMenuDuty from '../Icon/Menu/IconMenuDuty';
import IconMenuSchedule from '../Icon/Menu/IconMenuSchedule';
import IconMenuDayOff from '../Icon/Menu/IconMenuDayOff';
import IconMenuPermission from '../Icon/Menu/IconMenuPermission';
import IconMenuTask from '../Icon/Menu/IconMenuTask';
import IconMenuFormLateEarly from '../Icon/Menu/IconMenuFormLateEarly';
import IconMenuFormOT from '../Icon/Menu/IconMenuFormOT';
import IconMenuFormExempt from '../Icon/Menu/IconMenuFormExempt';
import IconMenuTimeKeeping from '../Icon/Menu/IconMenuTimeKeeping';
import IconMenuTimeKeepingAll from '../Icon/Menu/IconMenuTimeKeepingAll';
import IconMenuTimeKeepingStaff from '../Icon/Menu/IconMenuTimeKeepingStaff';
import IconMenuListExempt from '../Icon/Menu/IconMenuListExempt';
import IconProducts from '../Icon/IconProducts';
import IconProductCategory from '../Icon/IconProductCategory';
import IconProductUnit from '../Icon/IconProductUnit';
import IconListWareHouse from '../Icon/IconListWareHouse';
import IconMenuRepair from '../Icon/Menu/IconMenuRepair';
import IconMenuProposal from '../Icon/Menu/IconMenuProposal';
import IconNewArrowLeft from '../Icon/IconNewArrowLeft';
import { IconMenuStocktake } from '../Icon/IconMenuStocktake';
import { IconMenuWarehousingBill } from '../Icon/IconMenuWarehousingBill';
import IconNewExpand from '../Icon/IconNewExpand';
import RBACWrapper from '@/@core/rbac/RBACWrapper';
import Swal from 'sweetalert2';
import { showMessage } from '@/@core/utils';
import { CreateBackup } from '@/services/apis/backup.api';

const Sidebar = () => {
    const router = useRouter();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [currentSubMenu, setCurrentSubMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    // console.log(themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    const toggleSubMenu = (value: string) => {
        setCurrentSubMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [router.pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        let selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');

        if (router.pathname.search('[id]') !== -1) {
            selector = document.querySelector('.sidebar ul a[href="' + `${router.pathname.replaceAll('/[id]', '')}` + '"]');
        }

        selector?.classList.add('active');
    };

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const handleBackup = () => {
        const swalDeletes = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-secondary',
                cancelButton: 'btn btn-danger ltr:mr-3 rtl:ml-3',
                popup: 'confirm-popup confirm-delete',
            },
            imageUrl: '/assets/images/delete_popup.png',
            buttonsStyling: false,
        });
        swalDeletes
            .fire({
                title: `Bạn muốn tải tệp backup?`,
                padding: '2em',
                showCancelButton: true,
                cancelButtonText: `${t('cancel')}`,
                confirmButtonText: `${t('confirm')}`,
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    CreateBackup().then((res) => {
                        console.log(res)
                        window.location.href = res;
                        showMessage(`Tải thành công`, 'success');
                    }).catch((err) => {
                        showMessage(`${err.response.data}`, 'error');

                    });
                }
            });
    }
    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/hrm/dashboard" className="main-logo flex shrink-0 items-center">
                            <img id="logo" className="ml-[5px] w-8 flex-none" src="/assets/images/logo_login.png" alt="logo" />
                        </Link>

                        {!themeConfig.sidebar ? (
                            <button
                                id="expandButton"
                                type="button"
                                className="collapse-icon flex items-center rounded-full transition duration-300 hover:bg-gray-500/10 dark:text-white-light dark:hover:bg-dark-light/10 rtl:rotate-180"
                                onClick={() => dispatch(toggleSidebar())}
                            >
                                <IconNewArrowLeft className="rotate-90" />
                                <span className="uppercase">{t('collapse')}</span>
                            </button>
                        ) : (
                            <button
                                id="collapsebtn"
                                type="button"
                                className="collapse-icon flex items-center rounded-full transition duration-300 hover:bg-gray-500/10 dark:text-white-light dark:hover:bg-dark-light/10 rtl:rotate-180"
                                onClick={() => dispatch(toggleSidebar())}
                            >
                                <IconNewExpand className="rotate-90" />
                                <span className="uppercase">{t('expand')}</span>
                            </button>
                        )}
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                                    <Link href="/hrm/dashboard" className="group" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
                                        <div className="flex items-center">
                                            <IconMenuHome className="icon-menu icon-menu-1 shrink-0 group-hover:!text-primary" />
                                            <span className="menu1-text dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('dashboard')}</span>
                                        </div>
                                    </Link>
                                </button>
                            </li>
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'hrm' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('hrm')}>
                                    <div className="flex items-center">
                                        <IconMenuUser className="icon-menu icon-menu-1 shrink-0 group-hover:!text-primary" />
                                        <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('hrmanagement')}</span>
                                    </div>

                                    <div className={currentMenu !== 'hrm' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <AnimateHeight duration={300} height={currentMenu === 'hrm' ? 'auto' : 0}>
                                    <ul className="text-gray-500">
                                        <li className="nav-item">
                                            <ul>
                                                <li className="menu menu1 nav-item">
                                                    <div className="group-menu-name flex items-start">
                                                        <span className="header-menu-color uppercase text-black dark:text-[#506690] dark:group-hover:text-white-dark rtl:pr-3">
                                                            {t('general_info_menu')}
                                                        </span>
                                                    </div>
                                                    <ul className="text-gray-500">
                                                        {/* <RBACWrapper permissionKey={['department:findAll']} type={'AND'}> */}
                                                        <li className="nav-item">
                                                            <Link href="/hrm/department" className="final-level-menu group">
                                                                <div className="flex items-center">
                                                                    <IconMenuDepartment className="shrink-0 group-hover:!text-primary" />

                                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                                                                        {t('department_list')}
                                                                    </span>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                        {/* </RBACWrapper> */}

                                                        {/* <RBACWrapper permissionKey={['human:findAll']} type={'AND'}> */}
                                                        <li className="nav-item">
                                                            <Link href="/hrm/personnel" className="final-level-menu group">
                                                                <div className="flex it             ems-center">
                                                                    <IconMenuPersonel className="shrink-0 group-hover:!text-primary" />
                                                                    <span className="dark:group-hover:text-white-dar text-black dark:text-[#506690] ltr:pl-3 rtl:pr-3">{t('staff_list')}</span>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                        {/* </RBACWrapper> */}

                                                    </ul>
                                                </li>
                                                <div className="divide"></div>
                                                <li className="menu menu1 nav-item">
                                                    <div className="group-menu-name flex items-center">
                                                        <span className="header-menu-color uppercase text-black dark:text-[#506690] dark:group-hover:text-white-dark rtl:pr-3">{t('other_task')}</span>
                                                    </div>
                                                    <ul className="text-gray-500">
                                                        {/* <RBACWrapper permissionKey={['role:findAll']} type={'AND'}> */}
                                                        <li className="nav-item">
                                                            <Link href="/hrm/role" className="final-level-menu group">
                                                                <div className="flex items-center">
                                                                    <IconMenuPermission className="shrink-0 group-hover:!text-primary" />
                                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">{t('role_list')}</span>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                        <li className="nav-item">
                                                            <Link href="/hrm/role" className="final-level-menu group">
                                                                <div className="flex items-center">
                                                                    <IconMenuPermission className="shrink-0 group-hover:!text-primary" />
                                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">Lịch sử truy cập</span>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                        <li className="nav-item">
                                                            <button onClick={() => handleBackup()}>
                                                                <div className="flex items-center">
                                                                    <IconMenuPermission className="shrink-0 group-hover:!text-primary" />
                                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">Backup CSDL</span>
                                                                </div>
                                                            </button>

                                                        </li>
                                                        {/* </RBACWrapper> */}

                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                            <li className="menu nav-item">
                                {/* === QUẢN LÝ ĐƠN */}
                                <button type="button" className={`${currentMenu === 'form' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('form')}>
                                    <div className="flex items-center">
                                        <IconMenuForm className="icon-menu icon-menu-1 shrink-0 group-hover:!text-primary" />
                                        <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">QUẢN LÝ BCNVKH</span>
                                    </div>
                                    <div className={currentMenu !== 'form' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <AnimateHeight duration={300} height={currentMenu === 'form' ? 'auto' : 0}>
                                    <ul className="text-gray-500">
                                        <li className="nav-item">
                                            <Link href="/hrm/scientific_reports_gorvement" className="final-level-menu group">
                                                <div className="flex items-center">
                                                    <IconMenuFormLateEarly className="shrink-0 group-hover:!text-primary" />
                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">BCNVKH cấp Nhà nước</span>
                                                </div>
                                            </Link>
                                        </li>
                                        {/* <RBACWrapper permissionKey={['overTime:findAll']} type={'AND'}>
                                            <li className="nav-item">
                                                <Link href="/hrm/overtime-form" className="group final-level-menu">
                                                    <div className="flex items-center">
                                                        <IconMenuFormOT className="shrink-0 group-hover:!text-primary" />
                                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('ot_form')}</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        </RBACWrapper> */}
                                        <li className="nav-item">
                                            <Link href="/hrm/scientific_reports_ministerial" className="final-level-menu group">
                                                <div className="flex items-center">
                                                    <IconMenuFormExempt className="shrink-0 group-hover:!text-primary" />
                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">BCNVKH cấp Bộ</span>
                                                </div>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link href="/hrm/scientific_reports_ministerial_grassroots" className="final-level-menu group">
                                                <div className="flex items-center">
                                                    <IconMenuFormOT className="shrink-0 group-hover:!text-primary" />
                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">BCNVKH cấp Cơ sở</span>
                                                </div>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link href="/hrm/scientific_reports_ministerial_academy" className="final-level-menu group">
                                                <div className="flex items-center">
                                                    <IconMenuFormOT className="shrink-0 group-hover:!text-primary" />
                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">BCNVKH cấp Học viện</span>
                                                </div>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link href="/hrm/payment-order" className="final-level-menu group">
                                                <div className="flex items-center">
                                                    <IconMenuFormOT className="shrink-0 group-hover:!text-primary" />
                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">Sáng kiến cải tiến Kỹ thuật tại Học viện</span>
                                                </div>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link href="/hrm/driving-order" className="final-level-menu group">
                                                <div className="flex items-center">
                                                    <IconMenuFormOT className="shrink-0 group-hover:!text-primary" />
                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">Tệp đính kèm báo cáo</span>
                                                </div>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link href="/hrm/travel-paper" className="final-level-menu group">
                                                <div className="flex items-center">
                                                    <IconMenuFormOT className="shrink-0 group-hover:!text-primary" />
                                                    <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">Phân nhóm NVKH</span>
                                                </div>
                                            </Link>
                                        </li>

                                        {/* <li className="nav-item">
                                            <Link href="/hrm/exempt-form" className="group final-level-menu">
                                                <div className="flex items-center">
                                                    <IconMenuFormForget className="shrink-0 group-hover:!text-primary" />
                                                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('exempt_form')}</span>
                                                </div>
                                            </Link>
                                        </li> */}
                                    </ul>
                                </AnimateHeight>
                            </li>
                            {/* === KẾT THÚC MENU QUẢN LÝ ĐƠN */}

                            {/* </RBACWrapper> */}
                            {/*
                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('user_interface')}</span>
                            </h2>

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'component' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('component')}>
                                    <div className="flex items-center">
                                        <IconMenuComponents className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('components')}</span>
                                    </div>

                                    <div className={currentMenu !== 'component' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'component' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/components/tabs">{t('tabs')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/accordions">{t('accordions')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/modals">{t('modals')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/cards">{t('cards')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/carousel">{t('carousel')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/countdown">{t('countdown')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/counter">{t('counter')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/sweetalert">{t('sweet_alerts')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/timeline">{t('timeline')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/notifications">{t('notifications')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/media-object">{t('media_object')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/list-group">{t('list_group')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/pricing-table">{t('pricing_tables')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/components/lightbox">{t('lightbox')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'element' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('element')}>
                                    <div className="flex items-center">
                                        <IconMenuElements className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('elements')}</span>
                                    </div>

                                    <div className={currentMenu !== 'element' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'element' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/elements/alerts">{t('alerts')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/avatar">{t('avatar')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/badges">{t('badges')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/breadcrumbs">{t('breadcrumbs')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/buttons">{t('buttons')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/buttons-group">{t('button_groups')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/color-library">{t('color_library')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/dropdown">{t('dropdown')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/infobox">{t('infobox')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/jumbotron">{t('jumbotron')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/loader">{t('loader')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/pagination">{t('pagination')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/popovers">{t('popovers')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/progress-bar">{t('progress_bar')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/search">{t('search')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/tooltips">{t('tooltips')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/treeview">{t('treeview')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/elements/typography">{t('typography')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className="menu nav-item">
                                <Link href="/charts" className="group final-level-menu">
                                    <div className="flex items-center">
                                        <IconMenuCharts className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('charts')}</span>
                                    </div>
                                </Link>
                            </li>

                            <li className="menu nav-item">
                                <Link href="/widgets" className="group final-level-menu">
                                    <div className="flex items-center">
                                        <IconMenuWidgets className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('widgets')}</span>
                                    </div>
                                </Link>
                            </li>

                            <li className="menu nav-item">
                                <Link href="/font-icons" className="group final-level-menu">
                                    <div className="flex items-center">
                                        <IconMenuFontIcons className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('font_icons')}</span>
                                    </div>
                                </Link>
                            </li>

                            <li className="menu nav-item">
                                <Link href="/dragndrop" className="group final-level-menu">
                                    <div className="flex items-center">
                                        <IconMenuDragAndDrop className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('drag_and_drop')}</span>
                                    </div>
                                </Link>
                            </li>

                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('tables_and_forms')}</span>
                            </h2>

                            <li className="menu nav-item">
                                <Link href="/tables" className="group final-level-menu">
                                    <div className="flex items-center">
                                        <IconMenuTables className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('tables')}</span>
                                    </div>
                                </Link>
                            </li>

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'datalabel' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('datalabel')}>
                                    <div className="flex items-center">
                                        <IconMenuDatatables className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('datatables')}</span>
                                    </div>

                                    <div className={currentMenu !== 'datalabel' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'datalabel' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/datatables/basic">{t('basic')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/advanced">{t('advanced')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/skin">{t('skin')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/order-sorting">{t('order_sorting')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/multi-column">{t('multi_column')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/multiple-tables">{t('multiple_tables')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/alt-pagination">{t('alt_pagination')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/checkbox">{t('checkbox')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/range-search">{t('range_search')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/export">{t('export')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/datatables/column-chooser">{t('column_chooser')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'forms' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('forms')}>
                                    <div className="flex items-center">
                                        <IconMenuForms className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('forms')}</span>
                                    </div>

                                    <div className={currentMenu !== 'forms' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'forms' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/forms/basic">{t('basic')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/input-group">{t('input_group')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/layouts">{t('layouts')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/validation">{t('validation')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/input-mask">{t('input_mask')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/select2">{t('select2')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/touchspin">{t('touchspin')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/checkbox-radio">{t('checkbox_and_radio')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/switches">{t('switches')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/wizards">{t('wizards')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/file-upload">{t('file_upload')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/quill-editor">{t('quill_editor')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/markdown-editor">{t('markdown_editor')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/date-picker">{t('date_and_range_picker')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/forms/clipboard">{t('clipboard')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('user_and_pages')}</span>
                            </h2>

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'users' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('users')}>
                                    <div className="flex items-center">
                                        <IconMenuUsers className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('users')}</span>
                                    </div>

                                    <div className={currentMenu !== 'users' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'users' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/users/profile">{t('profile')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/users/user-account-settings">{t('account_settings')}</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'page' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('page')}>
                                    <div className="flex items-center">
                                        <IconMenuPages className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('pages')}</span>
                                    </div>

                                    <div className={currentMenu !== 'page' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'page' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/pages/knowledge-base">{t('knowledge_base')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/contact-us-boxed" target="_blank">
                                                {t('contact_us_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/contact-us-cover" target="_blank">
                                                {t('contact_us_cover')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/faq">{t('faq')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/coming-soon-boxed" target="_blank">
                                                {t('coming_soon_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/pages/coming-soon-cover" target="_blank">
                                                {t('coming_soon_cover')}
                                            </Link>
                                        </li>
                                        <li className="menu nav-item">
                                            <button
                                                type="button"
                                                className={`${errorSubMenu ? 'open' : ''
                                                    } w-full before:h-[5px] before:w-[5px] before:rounded before:bg-gray-300 hover:bg-gray-100 ltr:before:mr-2 rtl:before:ml-2 dark:text-[#888ea8] dark:hover:bg-gray-900`}
                                                onClick={() => setErrorSubMenu(!errorSubMenu)}
                                            >
                                                {t('error')}
                                                <div className={`${errorSubMenu ? '-rotate-90 rtl:rotate-90' : ''} ltr:ml-auto rtl:mr-auto`}>
                                                    <IconCaretsDown fill={true} className="h-4 w-4" />
                                                </div>
                                            </button>
                                            <AnimateHeight duration={300} height={errorSubMenu ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    <li>
                                                        <a href="/pages/error404" target="_blank">
                                                            {t('404')}
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="/pages/error500" target="_blank">
                                                            {t('500')}
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="/pages/error503" target="_blank">
                                                            {t('503')}
                                                        </a>
                                                    </li>
                                                </ul>
                                            </AnimateHeight>
                                        </li>

                                        <li>
                                            <Link href="/pages/maintenence" target="_blank">
                                                {t('maintenence')}
                                            </Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'auth' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('auth')}>
                                    <div className="flex items-center">
                                        <IconMenuAuthentication className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('authentication')}</span>
                                    </div>

                                    <div className={currentMenu !== 'auth' ? '-rotate-90 rtl:rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'auth' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/auth/boxed-signin" target="_blank">
                                                {t('login_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/boxed-signup" target="_blank">
                                                {t('register_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/boxed-lockscreen" target="_blank">
                                                {t('unlock_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/boxed-password-reset" target="_blank">
                                                {t('recover_id_boxed')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/cover-login" target="_blank">
                                                {t('login_cover')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/cover-register" target="_blank">
                                                {t('register_cover')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/cover-lockscreen" target="_blank">
                                                {t('unlock_cover')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/auth/cover-password-reset" target="_blank">
                                                {t('recover_id_cover')}
                                            </Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('supports')}</span>
                            </h2>

                            <li className="menu nav-item">
                                <Link href="https://vristo.sbthemes.com" target="_blank" className="nav-link group">
                                    <div className="flex items-center">
                                        <IconMenuDocumentation className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{t('documentation')}</span>
                                    </div>
                                </Link>
                            </li> */}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
