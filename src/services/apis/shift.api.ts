import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const listAllShift = async (data: any) => {
	const endpoint = '/scientific_reports';
	return callApi(endpoint, 'GET', data);
};
export const reportScientificReports = async (data: any) => {
	const endpoint = `/reports/scientific_reports?management_level_id=${data}`;
	return callApi(endpoint, 'GET');
};
export const detailShift = async (id: any, ip: any) => {
	const endpoint = `/scientific_reports/${id}`;
	return callApi(endpoint, 'GET', id, {
		'client_ip': ip,
	});
};
export const detailParticalbyReport = async (id: any) => {
	const endpoint = `/participants/?report_id=${id}`;
	return callApi(endpoint, 'GET');
};
export const detailFilebyReport = async (id: any) => {
	const endpoint = `/files/report/${id}`;
	return callApi(endpoint, 'GET');
};
export const createShift = async (data: any) => {
	const endpoint = `/scientific_reports/`;
	return callApi(endpoint, 'POST', data, {
		'Content-Type': 'multipart/form-data',
	});
};
export const updateShift = async (id: any, data: any, ip: string) => {
	const endpoint = `/scientific_reports/${id}`;
	return callApi(endpoint, 'PUT', data, {
		'client_ip': ip,
	});
};

export const deleteShift = async (data: any) => {
	const endpoint = `/scientific_reports/${data}`;
	return callApi(endpoint, 'DELETE');
};

