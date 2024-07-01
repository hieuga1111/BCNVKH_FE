import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';
export const listAllDepartment = async (data: any) => {
	const endpoint = '/units/';
	return callApi(endpoint, 'GET', data);
};
export const listAllDepartmentTree = async (data: any) => {
	const endpoint = '/units/list-tree';
	return callApi(endpoint, 'GET', data);
};
export const detailDepartment = async (data: any) => {
	const endpoint = `/units/${data}`;
	return callApi(endpoint, 'GET');
};
export const createDepartment = async (data: any) => {
	const endpoint = `/units`;
	return callApi(endpoint, 'POST', data);
};
export const updateDepartment = async (id: any, data: any) => {
	const endpoint = `/units/${id}`;
	return callApi(endpoint, 'PUT', data);
};

export const deleteDepartment = async (data: any) => {
	const endpoint = `/units/${data}`;
	return callApi(endpoint, 'DELETE', data);
};

