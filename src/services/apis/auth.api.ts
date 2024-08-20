import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const signIn = (username: string, password: string, ip: string) => {
	const endpoint = '/auth/login';
	return callApi(endpoint, 'POST', { username, password }, {
		'client_ip': ip,
	});
};

export const signUp = (email: string, password: string) => {
	const endpoint = '/auth/signup';
	return callApi(endpoint, 'POST', { email, password });
};

export const Profile = () => {
	const endpoint = '/profile';
	return callApi(endpoint, 'GET', null);
};
