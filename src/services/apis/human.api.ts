import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const listAllHuman = async (data: any) => {
	const endpoint = '/users';
	return callApi(endpoint, 'GET', data);
};
export const listAllHumanByDepartment = async (data: any) => {
	const endpoint = '/users/by-department';
	return callApi(endpoint, 'GET', data);
};
export const listManager = async (data: any) => {
	const endpoint = `/users/by-is-manager?page=${data?.page}&perPage=${data?.perPage}&isManager=${data?.isManager}`;
	return callApi(endpoint, 'GET', data);
};
export const detailHuman = async (data: any) => {
	const endpoint = `/users/${data}`;
	return callApi(endpoint, 'GET');
};
export const exportHuman = async () => {
	const endpoint = `/users/export`;
	return callApi(endpoint, 'GET', null, null, true);
};
export const createHuman = async (data: any) => {
	const endpoint = `/users/`;
	return callApi(endpoint, 'POST', data);
};
export const updateHuman = async (id: any, data: any) => {
	const endpoint = `/users/${id}`;
	return callApi(endpoint, 'PUT', data);
};

export const deleteHuman = async (data: any) => {
	const endpoint = `/users/${data}`;
	return callApi(endpoint, 'DELETE', data);
};
export const downloadUsers = async () => {
	const endpoint = `/reports/users`;
	return callApi(endpoint, 'GET');
};
