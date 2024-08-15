import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const listAllReportType = async (data: any) => {
	const endpoint = '/report_types';
	return callApi(endpoint, 'GET', data);
};
export const detailReportType = async (id: any) => {
	const endpoint = `/report_types/${id}`;
	return callApi(endpoint, 'GET');
};

export const createReportType = async (data: any) => {
	const endpoint = `/report_types/`;
	return callApi(endpoint, 'POST', data);
};
export const updateReportType = async (id: any, data: any) => {
	const endpoint = `/report_types/${id}`;
	return callApi(endpoint, 'PUT', data);
};

export const deleteReportType = async (data: any) => {
	const endpoint = `/report_types/${data}`;
	return callApi(endpoint, 'DELETE');
};

