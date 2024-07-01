import swr from '@core/swr';
import callApi from '@core/call-api';
import { getEndpoint } from '@core/utils';

export const Departments = (queries?: any) => swr(getEndpoint('/units/', queries));
export const DepartmentsTree = (queries?: any) => swr(getEndpoint('/units/', queries));
