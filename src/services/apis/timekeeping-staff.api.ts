import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const GetTimekeepingStaff = (body: any) => {
    const endpoint = `/timekeeping-staff/${body.id}`;
    return callApi(endpoint, 'GET', body);
};

export const EditTimekeepingStaff = (body: any) => {
    const endpoint = `/timekeeping-staff/${body.id}`;
    return callApi(endpoint, 'PATCH', body);
};
