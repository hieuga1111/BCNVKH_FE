import swr from '@core/swr';
import callApi from '@core/call-api';
import { getEndpoint } from '@core/utils';

export const Search = (queries?: any) => swr(getEndpoint('/scientific_reports/search', queries));
