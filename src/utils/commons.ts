import { object } from 'yup';
import moment from 'moment';
interface Department {
    createdAt: string;
    id: number;
    name: string;
    code: string | null;
    abbreviation: string | null;
    description: string | null;
    headOfDepartmentId: number | null;
    avatarId: number | null;
    parentId: number | null;
    users: any[];
    children?: Department[];
    level?: number;
    value?: number;
    label?: string | null;
}


export function formatDate(date: Date): string {
    const weekDays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const weekDayName = weekDays[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}`;
}

export function getDaysOfMonth(year: number, month: number): string[] {
    const daysArray: string[] = [];

    const startDate = new Date(year, month - 1, 1);

    const endDate = new Date(year, month, 0);

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        const formattedDate = formatDate(date);
        daysArray.push(formattedDate);
    }

    return daysArray;
}


export function toDateString(date: string | number | Date): string {
    const today = new Date(date);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

export function toDateStringMonth(date: string | number | Date): string {
    const today = new Date(date);
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${mm}-${yyyy}`;
}
export function formatDate2(isoString: any) {
    const date = new Date(isoString);

    // Lấy các thành phần của ngày và giờ
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
}


export function getCurrentFormattedTime() {
    const now = new Date();

    const year = now.getFullYear();

    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const hour = now.getHours().toString().padStart(2, '0');

    const minute = now.getMinutes().toString().padStart(2, '0');

    const formattedTime = `${year}-${month}-${day}`;

    return formattedTime;
}

export function makeRamdomText(length: any) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export function removeNullProperties(obj: any) {
    Object.keys(obj).forEach((key) => {
        if (obj[key] === null) {
            delete obj[key];
        }
    });
}

export function flattenDepartments(departments: Department[], level = 0, flatArray: Department[] = []): Department[] {
    departments.forEach((department) => {
        const departmentCopy: Department = { ...department, level: level, value: department.id, label: department.name };
        delete departmentCopy.children;
        flatArray.push(departmentCopy);

        if (department.children && department.children.length > 0) {
            flattenDepartments(department.children, level + 1, flatArray);
        }
    });

    return flatArray;
}

export function formatTime(time: string): string {
    if (!time) return '';
    const time_arr = time.split(':');
    return `${time_arr[0]}:${time_arr[1]}`;
}

export function removeVietnameseTones(str: any) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
    return str;
}

export const isObjEmpty = (obj: any) => Object.keys(obj).length === 0;

export const kFormatter = (num: any) => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num);

export const htmlToString = (html: any) => html.replace(/<\/?[^>]+(>|$)/g, '');

export function formatMoneyUnit(money: string) {
    return money && money + ' VNĐ';
}

export function formatNumber(num = '', split = ',') {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, split) : '';
}

export function formatNumberFloat(num = '', df = '', split = ',') {
    try {
        let [inter = 0, float = 0] = `${num}`.split('.');
        return inter.toString().replace(/\B(?=(\d{3})+(?!\d))/g, split) + '.' + float;
    } catch (error) {
        return df;
    }
}

export function moneyToNumber(num: string, split = ',') {
    return num ? num?.split(split).join('') : '';
}

export function moneyToText(so: any, type: string = 'vnd') {
    var mangso = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const dochangchuc = (so: any, daydu: any) => {
        var chuoi = '';
        var chuc = Math.floor(so / 10);
        var donvi = so % 10;
        if (chuc > 1) {
            chuoi = ' ' + mangso[chuc] + ' mươi';
            if (donvi == 1) {
                chuoi += ' mốt';
            }
        } else if (chuc == 1) {
            chuoi = ' mười';
            if (donvi == 1) {
                chuoi += ' một';
            }
        } else if (daydu && donvi > 0) {
            chuoi = ' lẻ';
        }
        if (donvi == 5 && chuc > 1) {
            chuoi += ' lăm';
        } else if (donvi > 1 || (donvi == 1 && chuc == 0)) {
            chuoi += ' ' + mangso[donvi];
        }
        return chuoi;
    };
    const docblock = (so: any, daydu: any) => {
        var chuoi = '';
        var tram = Math.floor(so / 100);
        so = so % 100;
        if (daydu || tram > 0) {
            chuoi = ' ' + mangso[tram] + ' trăm';
            chuoi += dochangchuc(so, true);
        } else {
            chuoi = dochangchuc(so, false);
        }
        return chuoi;
    };
    const dochangtrieu = (so: any, daydu: any) => {
        var chuoi = '';
        var trieu = Math.floor(so / 1000000);
        so = so % 1000000;
        if (trieu > 0) {
            chuoi = docblock(trieu, daydu) + ' triệu';
            daydu = true;
        }
        var nghin = Math.floor(so / 1000);
        so = so % 1000;
        if (nghin > 0) {
            chuoi += docblock(nghin, daydu) + ' nghìn';
            daydu = true;
        }
        if (so > 0) {
            chuoi += docblock(so, daydu);
        }
        return chuoi;
    };
    if (so == 0) return mangso[0];
    var chuoi = '',
        hauto = '';
    do {
        var ty = so % 1000000000;
        so = Math.floor(so / 1000000000);
        if (so > 0) {
            chuoi = dochangtrieu(ty, true) + hauto + chuoi;
        } else {
            chuoi = dochangtrieu(ty, false) + hauto + chuoi;
        }
        hauto = ' tỷ';
    } while (so > 0);
    chuoi = chuoi.trim();
    if (chuoi.length > 0) chuoi = chuoi[0].toUpperCase() + chuoi.substr(1);
    chuoi = type === 'vnd' ? (chuoi.trim().length > 0 ? chuoi.trim() + ' đồng' : '') : chuoi.trim().length > 0 ? chuoi.trim() + ' kíp' : '';
    return chuoi;
}
export function loadMore(datas: any, data: any, pagination: any, setData: any, id: any, name: any) {
    if (pagination === undefined) return;
    if (pagination === 1) {
        setData(
            datas?.data.map((item: any) => ({
                value: item[id],
                label: item[name],
            })),
        );
    } else {
        setData([
            ...data,
            ...datas?.data.map((item: any) => ({
                value: item[id],
                label: item[name],
            })),
        ]);
    }
}

export function isDayCanBlockTimekeeping() {
    const today = moment();
    const day = today.date();
    const month = today.month() + 1; // moment months are 0-based

    if (month === 2) {
        const lastDayOfFebruary = today.endOf('month').date();
        return day === lastDayOfFebruary;
    } else {
        return day === 30;
    }
};
