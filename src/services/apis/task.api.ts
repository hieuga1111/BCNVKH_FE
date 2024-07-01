import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';
export const listAllTask = async (data: any) => {
	const endpoint = '/task';
	return callApi(endpoint, 'GET', data);
};
export const detailTask = async (data: any) => {
	const endpoint = `/task/${data}`;
	return callApi(endpoint, 'GET');
};
export const createTask = async (data: any) => {
	const endpoint = `/task`;
	return callApi(endpoint, 'POST', data, {
		'Content-Type': 'multipart/form-data',
	});
};
export const updateTask = async (id: any, data: any) => {
	const endpoint = `/task/${id}`;
	return callApi(endpoint, 'PATCH', data, {
		'Content-Type': 'multipart/form-data',
	});
};
export const deleteTask = async (data: any) => {
	const endpoint = `/task/${data}`;
	return callApi(endpoint, 'DELETE', data);
};

