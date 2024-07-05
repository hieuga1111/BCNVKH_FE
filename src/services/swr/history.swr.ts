import swr from '@core/swr';
import callApi from '@core/call-api';
import { getEndpoint } from '@core/utils';

export const History = (queries?: any) => swr(getEndpoint('/user_histories', queries));
