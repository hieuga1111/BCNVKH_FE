import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect, useState } from 'react';
import { setPageTitle, toggleRTL, toggleLocale } from '../../store/themeConfigSlice';
import Dropdown from '@/components/Dropdown';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import IconInstagram from '@/components/Icon/IconInstagram';
import IconFacebookCircle from '@/components/Icon/IconFacebookCircle';
import IconTwitter from '@/components/Icon/IconTwitter';
import IconGoogle from '@/components/Icon/IconGoogle';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { Profile, signIn } from '@/services/apis/auth.api';
import Config from '@/@core/configs';
import Cookies from 'js-cookie';
import { showMessage } from '@/@core/utils';

const LoginBoxed = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle(`${t('login')}`));
    });
    const [ip, setIp] = useState<string>('IP Not Found');

    useEffect(() => {
        const findIP = async () => {
          try {
            const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
            const peerConnection = new RTCPeerConnection();
    
            peerConnection.createDataChannel('');
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
    
            peerConnection.onicecandidate = (event) => {
              if (event && event.candidate && event.candidate.candidate) {
                const ipMatch = event.candidate.candidate.match(ipRegex);
                if (ipMatch) {
                    console.log(ipMatch[1])
                  setIp(ipMatch[1]);
                  peerConnection.close();
                }
              }
            };
          } catch (err) {
            console.error('Error retrieving IP: ', err);
          }
        };
    
        findIP();
      }, []);
    const router = useRouter();

    const submitForm = ({ userName, passWord }: any) => {
        signIn(userName, passWord, ip)
            .then((res: any) => {
                const token = res.token;
                const accessTokenKey = Config.Env.NEXT_PUBLIC_X_ACCESS_TOKEN as string;
                Cookies.set(accessTokenKey, token);
                localStorage.setItem('profile', JSON.stringify(res.user))

                return true;
            })
            .then(() => {
                // Profile().then((res) => localStorage.setItem('profile', JSON.stringify(res.user)))
                const returnUrl = (router.query.returnUrl as string) ?? '/hrm/dashboard';
                const defaultUrl = '/hrm/dashboard'
                router.push(defaultUrl).finally(() => {
                    setTimeout(() => {
                        showMessage(`${t('sign_in_success')}`, 'success');
                    }, 300);
                });
            })
            .catch((err: any) => {
                showMessage(`${t('sign_in_error')}`, 'error');
            });
    };
    const SubmittedForm = Yup.object().shape({
        userName: Yup.string().required('Vui lòng nhập tên đăng nhập'),
        passWord: Yup.string().required('Vui lòng nhập mật khẩu'),
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState('');
    useEffect(() => {
        setLocale(localStorage.getItem('i18nextLng') || themeConfig.locale);
    }, []);

    const { t, i18n } = useTranslation();
    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/login_bg.png" alt="image" className="w-full h-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-28 gap-20 ml-8 mr-8" style={{ margin: "auto" }}>
                <div className='flex-1 items-center' style={{ display: "flex", flexDirection: 'column' }}>
                    <img src='/assets/images/logo_login.png' style={{ width: "50%" }} className='' />
                    {/* <h1 className='company-name mb-2'>vangtat mining</h1> */}
                    <span className='welcome-member uppercase'>Báo cáo tổng kết</span>
                    <span className='welcome-member uppercase'>nhiệm vụ KH&CN</span>
                </div>
                <div className="relative w-full rounded-md p-2 flex-1 form-login-container">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg dark:bg-black/50 lg:min-h-[70vh]">
                            
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="uppercase !leading-snug sign-in-text !text-center">{t('sign_in')}</h1>
                            </div>
                            <Formik
                                initialValues={{
                                    userName: '',
                                    passWord: '',
                                }}
                                validationSchema={SubmittedForm}
                                onSubmit={(value) => submitForm(value)}
                            >
                                {({ errors, submitCount, touched }) => (
                                    <Form className="space-y-5 dark:text-white">
                                        <div className={submitCount ? (errors.userName ? 'has-error' : 'has-success') : ''}>
                                            <label htmlFor="userName" className='label-login'>
                                                {t('username')}
                                            </label>
                                            <div className="relative text-white-dark">
                                                <Field autoComplete="off"
                                                    name="userName"
                                                    data-testid="username"
                                                    id="userName"
                                                    type="text"
                                                    placeholder={t('enter_user_name')}
                                                    className="form-input placeholder:text-white-dark"
                                                />
                                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span> */}
                                                {submitCount ? errors.userName && <div className="mt-1 text-danger">{errors.userName}</div> : ''}
                                            </div>
                                        </div>
                                        <div>
                                            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <label htmlFor="passWord" className='label-login'>
                                                    {t('password')}
                                                </label>

                                            </p>
                                            <div className="relative text-white-dark">
                                                <Field autoComplete="off"
                                                    name="passWord"
                                                    data-testid="password"
                                                    id="passWord"
                                                    type="password"
                                                    placeholder={t('enter_pass_word')}
                                                    className="form-input placeholder:text-white-dark"
                                                />
                                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span> */}
                                                {submitCount ? errors.passWord && <div className="mt-1 text-danger">{errors.passWord}</div> : ''}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            data-testid="submit"
                                            className="sign-in-btn"
                                        >
                                            {t('sign_in')}
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
LoginBoxed.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default LoginBoxed;
