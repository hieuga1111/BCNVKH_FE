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