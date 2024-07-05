import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';
export const listHistory = async (data: any) => {
	const endpoint = '/user_histories';
	return callApi(endpoint, 'GET', data);
};
