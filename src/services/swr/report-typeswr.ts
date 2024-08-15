import swr from '@core/swr';
import callApi from '@core/call-api';
import { getEndpoint } from '@core/utils';

export const ReportTypes = (queries?: any) => swr(getEndpoint('/report_types', queries));
