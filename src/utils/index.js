import { TYSdk, Utils } from 'tuya-panel-kit';
import Strings from '../i18n';

const TYNative = TYSdk.native;
const TYDevice = TYSdk.device;
const { convertX: ctx, convertY: cty } = Utils.RatioUtils;

/**
 * 进制转换
 * @param {String} str 需要转换的值
 * @param {Number} prevRadix 转换前的进制
 * @param {Number} nowRadix 转换后的进制
 * @param {Number} len 前面补0的长度
 * 例子1：16转10进制
 * convertRadix('12', 16, 10) => 返回 '18'
 * 例子2：前面补0
 * convertRadix('12', 16, 10, 4) => 返回 '0018';
 */
export const convertRadix = (str = '', prevRadix = 10, nowRadix = 10, len) => {
  if (len) {
    return parseInt(`${str}`, prevRadix)
      .toString(nowRadix)
      .padStart(len, '0');
  }
  return parseInt(`${str}`, prevRadix).toString(nowRadix);
};

// 防抖函数
export const debounce = (fn, waitTime) => {
  let timer;
  function func(...args) {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(async function () {
      try {
        await fn(...args);
        clearTimeout(timer);
        timer = null;
      } catch (error) {
        clearTimeout(timer);
        timer = null;
      }
    }, waitTime);
  }
  func.cancel = function () {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };
  return func;
};

// 点击返回按钮
export const goBack = () => {
  const { Navigator } = TYSdk;
  if (Navigator && Navigator.getCurrentRoutes().length > 1) {
    Navigator.pop();
  } else {
    TYNative.back();
  }
};

// 跳转到公版设置入口 设备信息页面
export const showDeviceMenu = () => TYNative.showDeviceMenu();

// 宽高适配，做了取整处理
export const convertX = num => Math.round(ctx(num));
export const convertY = num => Math.round(cty(num));

/**
 * i18N国际化
 * @param {str}
 */
export const getLang = (str = '') => {
  return Strings.getLang(str);
};

/**
 * 解析fault转换成数组
 * @param {*} fault fault DP值
 * @param {*} schemaFault schema.fault
 * @returns {Array} ['告警1', '告警2']
 */
export const parseFault = (fault = 0, schemaFault = {}) => {
  if (Object.keys(schemaFault).length === 0) {
    return [];
  }
  const numFault = Number(fault);
  if (numFault && !Number.isNaN(numFault)) {
    const { label } = schemaFault;
    const falutArr = [];
    // 解析fault为二进制
    const binary = numFault.toString(2);
    for (let i = binary.length - 1; i >= 0; i--) {
      if (binary[i] === '1') {
        const j = binary.length - 1 - i;
        falutArr.push(getLang(`dp_fault_${label[j]}`));
        // falutArr.push(label[j]);
      }
    }
    return falutArr;
  }
  return [];
};

// 从云端读取数据
export const getDeviceCloudData = key => {
  return new Promise((resolve, reject) => {
    TYNative.getDevProperty(
      d => {
        if (typeof d !== 'undefined') {
          let data = d;
          if (key) {
            data = typeof d[key] !== 'undefined' ? d[key] : {};
          }
          if (typeof data === 'string') data = JSON.parse(data);
          // console.log('===getDevProperty===', key, data);
          resolve(data);
        } else reject();
      },
      () => reject()
    );
  });
};

// 将数据保存到云端
export const saveDeviceCloudData = (key, data) => {
  return new Promise((resolve, reject) => {
    try {
      const jsonString = typeof data === 'object' ? JSON.stringify(data) : data;
      TYNative.setDevProperty(
        key,
        jsonString,
        d => {
          // console.log('===setDevProperty===', key, data);
          resolve(d);
        },
        reject
      );
    } catch (e) {
      reject(e);
    }
  });
};


//分割（2）
export const electricity = (raw = '') => {
  const arr = [];
  const len = raw.length;
  for (let i = 0; i < len; i += 2) {
    const item = raw.slice(i, i + 2);
    arr.push(item);
  }
  return arr;
};
//分割（4）
export const electricityTo = (raw = '') => {
  const arr = [];
  const len = raw.length;
  for (let i = 0; i < len; i += 4) {
    const item = raw.slice(i, i + 4);
    arr.push(item);
  }
  return arr;
};
/**
 * 请求sdk接口
 * @param {Object}
 * {
    a: apiName,
    v: apiVersion,
    postData: params,
 * }
 * @return {Promise}
 */
export const apiRequest = (params = {}) => {
  return TYSdk.apiRequest({
    ...params,
  })
    .then(res => {
      // console.log(
      //   'success params: ',
      //   params,
      //   'success res: ',
      //   res
      // );
      return Utils.JsonUtils.parseJSON(res);
    })
    .catch(err => {
      // console.log('error params: ', params, 'error  msg: ', err);
      return Promise.reject(parseJson(err));
    });
};

/**
 * 修改dp值，可以同时下发多个
 * @param {Object} data
 * {
 *  code1: value1
 *  code2: value2
 * }
 */
export const putDeviceData = async (data = {}) => {
  return TYDevice.putDeviceData(data);
};

/** -------------------------------------- */

const parseJson = str => {
  let result;
  if (str && typeof str === 'string') {
    // as jsonstring
    try {
      result = JSON.parse(str);
    } catch (parseError) {
      // error! use eval
      try {
        // eslint-disable-next-line
        result = eval(`(${str})`);
      } catch (evalError) {
        // normal string
        result = str;
      }
    }
  } else {
    result = str || {};
  }
  return result;
};

export const camelize = str => {
  if (typeof str === 'number') {
    return `${str}`;
  }
  const ret = str.replace(/[-_\s]+(.)?/g, (match, chr) => (chr ? chr.toUpperCase() : ''));
  // Ensure 1st char is always lowercase
  return ret.substr(0, 1).toLowerCase() + ret.substr(1);
};

export const formatUiConfig = devInfo => {
  const uiConfig = devInfo.uiConfig ? { ...devInfo.uiConfig } : {};

  Object.keys(devInfo.schema).forEach(itKey => {
    const dps = devInfo.schema[itKey];
    const strKey = `dp_${dps.code}`;
    const key = camelize(strKey);
    uiConfig[key] = {
      key,
      strKey: strKey.toLowerCase(),
      code: dps.code,
      attr: {},
      attri: {},
    };

    switch (dps.type) {
      case 'enum':
        dps.range.forEach(it => {
          const k = `${strKey}_${it}`.toLowerCase();
          uiConfig[key].attr[it] = k;
          uiConfig[key].attri[k] = it;
        });
        break;
      case 'bool':
        {
          const on = `${strKey}_on`.toLowerCase();
          const off = `${strKey}_off`.toLowerCase();
          uiConfig[key].attr = {
            false: off,
            true: on,
          };
          uiConfig[key].attri = {
            [`${strKey}_off`.toLowerCase()]: false,
            [`${strKey}_on`.toLowerCase()]: true,
          };
        }
        break;
      case 'bitmap':
        for (const v of dps.label) {
          const k = `${strKey}_${v}`.toLowerCase();
          uiConfig[key].attr[v] = k;
          uiConfig[key].attri[k] = v;
        }
        break;

      default:
        break;
    }
  });

  if (!devInfo.panelConfig || !devInfo.panelConfig.bic) return uiConfig;

  const { bic } = devInfo.panelConfig;

  for (const i in bic) {
    if (Object.prototype.hasOwnProperty.call(bic, i)) {
      const key = camelize(`panel_${bic[i].code}`);
      if (bic[i].selected === true) {
        uiConfig[key] = bic[i].value ? parseJson(bic[i].value) : true;
      } else {
        uiConfig[key] = false;
      }
    }
  }
  return uiConfig;
};
