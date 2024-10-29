import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const searchReport = async (data: any) => {
	const endpoint = '/scientific_reports/search';
	return callApi(endpoint, 'GET', data);
};
