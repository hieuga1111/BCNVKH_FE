import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const CreateFile = (body: any) => {
    const endpoint = '/files/create';
    return callApi(endpoint, 'POST', body , {
		'Content-Type': 'multipart/form-data',
	});
};
export const deleteFile = async (data: any) => {
	const endpoint = `/units/${data}`;
	return callApi(endpoint, 'DELETE', data);
};
export const listAllFiles = async (data: any) => {
	const endpoint = '/files/';
	return callApi(endpoint, 'GET', data);
};
export const numberOfReport = async () => {
	const endpoint = '/statistical/get_num_of_report/';
	return callApi(endpoint, 'GET');
};
export const numberOfReportByLevel = async () => {
	const endpoint = '/statistical/get_num_of_repor_by_level/';
	return callApi(endpoint, 'GET');
};
export const numberOfReportByType = async () => {
	const endpoint = '/statistical/get_num_of_repor_by_type/';
	return callApi(endpoint, 'GET');
};