import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const statistcReport = async (data: any) => {
	const endpoint = '/scientific_reports/statiscal';
	return callApi(endpoint, 'GET', data);
};
