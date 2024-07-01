import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const GetTimekeeping = (body: any) => {
    const endpoint = `/time-keeping/${body.id}`;
    return callApi(endpoint, 'GET', body);
};

export const GetTimekeepingDetails = (body: any) => {
    const endpoint = `/time-keeping/${body.id}/get-details`;
    return callApi(endpoint, 'GET', body);
};

export const LockTimekeeping = (body: any) => {
    const endpoint = `/time-keeping/lock`;
    return callApi(endpoint, 'PATCH', body);
};
