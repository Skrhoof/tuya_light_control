import { convertRadix } from '../../../utils';
/**
 * 解析自定义场景
 * @param {*} raw
 * 0001010000000000000000000000010100
 */
export const parseScene = (raw = '') => {
    const arr = [];
    const len = raw.length;
    for (let i = 0; i < len; i += 34) {
        const item = raw.slice(i, i + 34);
        if (item === 'ffffffffffffffffffffffffffffffffffff') {
            arr.push(null);
        } else {
            const itemLen = item.length;
            const itemArr = [];
            for (let j = 0; j < itemLen; j += 2) {
                const item2 = item.slice(j, j + 2);
                if (item2 === 'ff') {
                    itemArr.push(null);
                } else {
                    itemArr.push(item2);
                }
            }
            // 为 '' 或 null 表示 不应该显示此项
            const CustomScene = itemArr[0] ? convertRadix(itemArr[0], 16, 10, 2) : null;
            const State = itemArr[1] ? convertRadix(itemArr[1], 16, 10, 2) : null;
            const LightSwitch = itemArr[2] ? convertRadix(itemArr[2], 16, 10, 2) === '00' : null;
            const pattern = itemArr[3] ? convertRadix(itemArr[3], 16, 10, 2) : '';
            const H = `${itemArr[4]}${itemArr[5]}` ? convertRadix(`${itemArr[4]}${itemArr[5]}`, 16, 10, 4) : '';
            const S = `${itemArr[6]}${itemArr[7]}` ? convertRadix(`${itemArr[6]}${itemArr[7]}`, 16, 10, 4) : '';
            const V = `${itemArr[8]}${itemArr[9]}` ? convertRadix(`${itemArr[8]}${itemArr[9]}`, 16, 10, 4) : '';
            const temp_value = `${itemArr[10]}${itemArr[11]}` ? convertRadix(`${itemArr[10]}${itemArr[11]}`, 16, 10, 4) : '';
            const bright_value = `${itemArr[12]}${itemArr[13]}` ? convertRadix(`${itemArr[12]}${itemArr[13]}`, 16, 10, 4) : '';
            const musicSwitch = itemArr[14] ? convertRadix(itemArr[14], 16, 10, 2) === '00' : null;
            const music = itemArr[15] ? convertRadix(itemArr[15], 16, 10, 2) : '';
            const volume = itemArr[16] ? convertRadix(itemArr[16], 16, 10, 2) : '';
            const text = null;
            const obj = {
                CustomScene, // 自定义场景 array || null
                State,//状态
                LightSwitch, // 灯光开光 bool || null
                pattern, // 灯光模式 string
                H, // 
                S, // 
                V, //
                temp_value,//白光色温
                bright_value,//白光亮度
                musicSwitch,
                music,
                volume,
                text,
            };
            arr.push(obj);
        }
    }
    return arr;
};

/**
 * 组合自定义场景为raw型
 * @param {*} arr
 */
export const combineScene = (arr = []) => {
    let raw = '';
    arr.forEach(item => {
        if (item) {
            const {
                CustomScene, // 自定义场景 array || null
                State,//状态
                LightSwitch, // 灯光开光 bool || null
                pattern, // 灯光模式 string
                H, // 
                S, // 
                V, //
                temp_value,//白光色温
                bright_value,//白光亮度
                musicSwitch,
                music,
                volume,
            } = item || {};
            raw = CustomScene ? `${raw}${convertRadix(CustomScene, 10, 16).padStart(2, '0')}` : `${raw}ff`;
            raw = State ? `${raw}${convertRadix(State, 10, 16).padStart(2, '0')}` : `${raw}ff`;
            raw = typeof LightSwitch === 'boolean' ? (LightSwitch ? `${raw}00` : `${raw}01`) : `${raw}ff`;
            raw = pattern ? `${raw}${convertRadix(pattern, 10, 16).padStart(2, '0')}` : `${raw}ff`;
            raw = H ? `${raw}${convertRadix(H, 10, 16).padStart(4, '0')}` : `${raw}ffff`;
            raw = S ? `${raw}${convertRadix(S, 10, 16).padStart(4, '0')}` : `${raw}ffff`;
            raw = V ? `${raw}${convertRadix(V, 10, 16).padStart(4, '0')}` : `${raw}ffff`;
            raw = temp_value ? `${raw}${convertRadix(temp_value, 10, 16).padStart(4, '0')}` : `${raw}ffff`;
            raw = bright_value ? `${raw}${convertRadix(bright_value, 10, 16).padStart(4, '0')}` : `${raw}ffff`;
            raw = typeof musicSwitch === 'boolean' ? (musicSwitch ? `${raw}00` : `${raw}01`) : `${raw}ff`;
            raw = music ? `${raw}${convertRadix(music, 10, 16).padStart(2, '0')}` : `${raw}ff`;
            raw = volume ? `${raw}${convertRadix(volume, 10, 16).padStart(2, '0')}` : `${raw}ff`;
        } else {
            raw = `${raw}ffffffffffffffffffffffffffffffff`;
        }
    });
    return raw;
};