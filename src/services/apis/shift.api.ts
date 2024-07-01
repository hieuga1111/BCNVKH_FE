import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const listAllShift = async (data: any) => {
	const endpoint = '/scientific_reports';
	return callApi(endpoint, 'GET', data);
};
export const detailShift = async (id: any) => {
	const endpoint = `/scientific_reports/${id}`;
	return callApi(endpoint, 'GET');
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
export const updateShift = async (id: any, data: any) => {
	const endpoint = `/scientific_reports/${id}`;
	return callApi(endpoint, 'PUT', data);
};

export const deleteShift = async (data: any) => {
	const endpoint = `/scientific_reports/${data}`;
	return callApi(endpoint, 'DELETE');
};

