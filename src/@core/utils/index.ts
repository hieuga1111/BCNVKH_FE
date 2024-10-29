import moment from 'moment';
import Swal from 'sweetalert2';
import callApi from '../call-api';

export const isEmpty = (value: any) => {
	if (typeof value === 'object' && Object?.keys(value || {}).length === 0) return true;
	return [null, undefined, '', NaN].includes(value);
};

export const isNaNOr = (value: any, fallbackValue = 0) => (isNaN(value) ? fallbackValue : value);
export const deleteNullInObject = (obj: any) => {
	const newObj = { ...obj };
	Object.keys(newObj).forEach((key) => {
		if (isEmpty(newObj[key])) {
			delete newObj[key];
		}
	});
	return newObj;
};

export const getEndpoint = (endpoint: string, queries?: any) => {
	queries = deleteNullInObject(queries);
	const queriesStr = new URLSearchParams(queries).toString();
	return endpoint + '?' + decodeURIComponent(queriesStr);
};

export const mergeClassName = (...classNames: (string | any)[]) => classNames.filter(notNull).join(' ');

export const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

export const displayDate = (date?: any) => {
	if (!date) return null;
	return moment(date).format('HH:mm:ss DD/MM/YYYY');
};

export const unique = (value: any, index: number, self: any[]) => {
	return self.indexOf(value) === index;
};

export const notNull = (value: any, index: number, self: any[]) => {
	return !isEmpty(value);
};

/**
 *
 * @param time in minutes
 * @returns xxh yym zzs
 */
export const displayTime = (time: number) => {
	time = time * 60;

	const hours = Math.floor(time / 3600);
	const minutes = Math.floor((time % 3600) / 60);
	const seconds = Math.floor(time % 60);
	//check isNan
	if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return '';
	if (hours === 0 && minutes === 0 && seconds === 0) return '0s';
	if (hours === 0 && minutes === 0) return `${seconds}s`;
	if (hours === 0) return `${minutes}m ${seconds}s`;
	return `${hours}h ${minutes}m ${seconds}s`;
};

export const getAvatar = (name: string) => {
	return `https://ui-avatars.com/api/?name=${name}&background=random&length=1&rounded=true&size=128`;
};

export const randomArrayIndex = (random: number, length: number) => {
	const arr = Array.from({ length }, (_, i) => i);
	let randomNumber: any;
	if (length < 2) return arr;
	if (length === 2) randomNumber = random % length;
	if (length > 2) randomNumber = Math.max(random % length, 1);

	let loop = 0;
	while (loop < randomNumber) {
		const mid = Math.floor(length / 2);
		let loop1 = 0;
		while (loop1 < Math.max(randomNumber, 2)) {
			for (let i = 0; i < length; i++) {
				const tmp = arr[mid];
				arr[mid] = arr[i];
				arr[i] = arr[length - 1];
				arr[length - 1] = tmp;
			}
			loop1++;
		}

		for (let i = 0; i < length; i++) {
			const tmpi = Math.abs(randomNumber - length + 1);
			const tmp = Number(arr[i]);
			arr[i] = arr[tmpi];
			arr[tmpi] = tmp;
		}

		loop++;
	}
	return arr;
};

export const sortArray = (id: any, arr: any[]) => {
	if (!id) return arr;
	if (!arr) return [];
	const randomArrIndex = randomArrayIndex(id, arr.length);
	const newArr = randomArrIndex.map((index) => arr[index]);
	return newArr;
};

export const capitalize = (text: any) => {
	return text
		.replace('_', ' ')
		.replace('-', ' ')
		.toLowerCase()
		.split(' ')
		.map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
		.join(' ');
};

export const formatDate = (date: any) => {
	if (date) {
		const dt = new Date(date);
		const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
		const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
		return day + '/' + month + '/' + dt.getFullYear();
	}
	return '';
};
export const convertTimeFormat = (time: any) => {
	const [hours, minutes] = time.split(':');
	return `${hours}:${minutes}`;
};

export const showMessage = (msg = '', type = 'success') => {
	const toast: any = Swal.mixin({
		toast: true,
		position: 'top',
		showConfirmButton: false,
		timer: 3000,
		customClass: {
			container: 'toast',
			title: 'space-icon-title',
		},
	});
	toast.fire({
		icon: type,
		title: msg,
		width: '850px',
		padding: '10px 20px',
	});
};

export const formatdata = (data: any) => {
	function formatCounts(counts: any) {
		return categories
			.map(cat => `${cat}: ${counts[cat]}`)
			.join(", ");
	}
	type CountType = {
		[key: string]: { [category: string]: number; total: number }
	};
	const categories = ["Xuất sắc", "Giỏi", "Khá", "Trung Bình"];
	const list = [];

	for (const unit in data) {
		if (unit === "TOTAL") continue;
		const row = { unit, chutri: "", thuchien: "", phoiHop: "", tong: "" };
		const counts: CountType = {
			chutri: { total: 0 },
			thuchien: { total: 0 },
			phoiHop: { total: 0 },
			tong: { total: 0 }
		};

		// Initialize counts for each category and role
		categories.forEach(category => {
			counts.chutri[category] = 0;
			counts.thuchien[category] = 0;
			counts.phoiHop[category] = 0;
			counts.tong[category] = 0;
		});

		// Fill counts based on the roles
		for (const role in data[unit]) {
			const roleData = data[unit][role];
			const isChuTri = role === "Cơ quan, đơn vị chủ trì";
			const isThucHien = role === "Cơ quan, đơn vị thực hiện";
			const isPhoiHop = role === "Cơ quan, đơn vị phối hợp";

			for (const grade in roleData.results) {
				if (isChuTri) counts.chutri[grade] += roleData.results[grade];
				if (isThucHien) counts.thuchien[grade] += roleData.results[grade];
				if (isPhoiHop) counts.phoiHop[grade] += roleData.results[grade];
				counts.tong[grade] += roleData.results[grade];
			}

			// Add totals for each role
			if (isChuTri) counts.chutri.total = roleData.total;
			if (isThucHien) counts.thuchien.total = roleData.total;
			if (isPhoiHop) counts.phoiHop.total = roleData.total;
			counts.tong.total += roleData.total;
		}

		// Format counts as strings with "Tổng" included
		row.chutri = categories.map(cat => `${cat}: ${counts.chutri[cat]}`).join(", ");
		if (counts.chutri.total > 0) row.chutri += `, Tổng: ${counts.chutri.total}`;

		row.thuchien = categories.map(cat => `${cat}: ${counts.thuchien[cat]}`).join(", ");
		if (counts.thuchien.total > 0) row.thuchien += `, Tổng: ${counts.thuchien.total}`;

		row.phoiHop = categories.map(cat => `${cat}: ${counts.phoiHop[cat]}`).join(", ");
		if (counts.phoiHop.total > 0) row.phoiHop += `, Tổng: ${counts.phoiHop.total}`;

		row.tong = categories.map(cat => `${cat}: ${counts.tong[cat]}`).join(", ");
		if (counts.tong.total > 0) row.tong += `, Tổng: ${counts.tong.total}`;

		list.push(row);
	}
	const totalRow = { unit: "Tổng", chutri: "", thuchien: "", phoiHop: "", tong: "" };
	type CountType1 = {
		[key: string]: { total: number }
	};
	const totalCounts: CountType1 = {};

	// Initialize totalCounts for each category

	for (const grade in data?.TOTAL?.results) {
		console.log(data?.TOTAL?.results[grade])
		totalCounts[grade] = data?.TOTAL?.results[grade] === undefined ? 0 : data?.TOTAL?.results[grade];
	}

	totalRow.tong = formatCounts(totalCounts) + `, Tổng: ${data?.TOTAL?.total === undefined ? 0 : data?.TOTAL?.total}`;
	list.push(totalRow);

	return (list)
}
export async function downloadFile(fileName: any, api: any) {
	return callApi(api, 'GET', null, null, true).then((response: any) => {
		const url = window.URL.createObjectURL(new Blob([response]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', fileName);
		document.body.appendChild(link);
		link.click();
		if (!response.error) {
			showMessage('Tải file thành công', 'success')
		}
	}).catch(() => {
		showMessage('Tải file thất bại', 'error')
	});
}

export function downloadFile2(nodeJSBuffer: any) {
	const buffer = Buffer.from(nodeJSBuffer);
	const blob = new Blob([buffer]);

	const url = window.URL.createObjectURL(blob);
	const a = document.createElement('a');
	document.body.appendChild(a);
	a.href = url;
	a.download = 'position.xlsx';
	a.click();
	window.URL.revokeObjectURL(url);
}
export function dateFormat(dt: any) {
	dt = new Date(dt);
	const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
	const date = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
	const hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
	const mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
	dt = dt.getFullYear() + '-' + month + '-' + date + 'T' + hours + ':' + mins;
	return dt;
}
export function dateFormatDay(dt: any) {
	const parts = dt.split('-');

	const formattedDate = parts.reverse().join('-');

	return formattedDate;
}
