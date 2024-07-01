import swr from '@core/swr';
import callApi from '@core/call-api';
import { getEndpoint } from '@core/utils';

export const Humans = (queries?: any) => swr(getEndpoint('/users', queries));
export const HumansByDepartment = (queries?: any) => swr(getEndpoint('/human/by-department', queries));
