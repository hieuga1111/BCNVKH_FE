import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';
export const listAllParticipants = async (data: any) => {
	const endpoint = '/participants/';
	return callApi(endpoint, 'GET', data);
};
export const detailParticipants = async (data: any) => {
	const endpoint = `/participants/${data}`;
	return callApi(endpoint, 'GET');
};
export const downloadParticipants = async () => {
	const endpoint = `/reports/participants`;
	return callApi(endpoint, 'GET');
};
export const createParticipants = async (data: any) => {
	const endpoint = `/participants`;
	return callApi(endpoint, 'POST', data);
};
export const updateParticipants = async (id: any, data: any) => {
	const endpoint = `/participants/${id}`;
	return callApi(endpoint, 'PATCH', data);
};

export const deleteParticipants = async (id: any) => {
	const endpoint = `/participants/${id}`;
	return callApi(endpoint, 'DELETE');
};

