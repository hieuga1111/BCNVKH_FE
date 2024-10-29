import { PropsWithChildren, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from './store';
import { toggleRTL, toggleTheme, toggleLocale, toggleMenu, toggleLayout, toggleAnimation, toggleNavbar, toggleSemidark } from './store/themeConfigSlice';

function App({ children }: PropsWithChildren) {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();
    const { i18n } = useTranslation();
    useEffect(() => {
        // const handleKeyDown = (event: any) => {
        //     // Chặn phím F12
        //     if (event.key === 'F12') {
        //         event.preventDefault(); // Ngăn chặn hành động mặc định
        //     }
        // };

        // const handleContextMenu = (event : any) => {
        //     event.preventDefault(); // Ngăn chặn menu ngữ cảnh
        // };

        // // Thêm event listeners
        // document.addEventListener('keydown', handleKeyDown);
        // document.addEventListener('contextmenu', handleContextMenu);

        // // Cleanup function để loại bỏ event listeners khi component unmount
        // return () => {
        //     document.removeEventListener('keydown', handleKeyDown);
        //     document.removeEventListener('contextmenu', handleContextMenu);
        // };
    }, []); // Chỉ chạy 1 lần khi component mount
    useEffect(() => {
        dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
        dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
        dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
        dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
        dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
        dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
        dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
        // locale
        const locale = localStorage.getItem('i18nextLng') || themeConfig.locale;
        dispatch(toggleLocale(locale));
        i18n.changeLanguage(locale);
    }, [dispatch, themeConfig.theme, themeConfig.menu, themeConfig.layout, themeConfig.rtlClass, themeConfig.animation, themeConfig.navbar, themeConfig.locale, themeConfig.semidark]);

    return (
        <div
            className={`${(themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${themeConfig.rtlClass
                } main-section relative font-mulish text-sm font-normal antialiased`}
        >
            {children}
        </div>
    );
}

export default App;
