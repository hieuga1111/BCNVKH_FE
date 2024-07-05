import swr from '@core/swr';
import callApi from '@core/call-api';
import { getEndpoint } from '@core/utils';

export const Participants = (queries?: any) => swr(getEndpoint('/participants', queries));
