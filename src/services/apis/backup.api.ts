import callApi from '@core/call-api';
import Config from '@core/configs';
import Cookies from 'js-cookie';

export const CreateBackup = () => {
    const endpoint = '/backup';
    return callApi(endpoint, 'POST');
};
