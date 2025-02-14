import { addCSS } from '@sugar/sugar-shared';

export function makeMap (
  str: string,
  expectsLowerCase?: boolean
): (key: string) => true | undefined {
  const map = Object.create(null);
  const list: string[] = str.split(',');
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val];
}

// 生成不重复11位序列号
export function serial_num_11 () {
  const d = new Date();
  let year: any = d.getFullYear();
  let month: any = d.getMonth() + 1;
  let date: any = d.getDate();
  const day = d.getDay();
  year = (year + '').substring(2);
  if (month <= 9) {
    month = '0' + month;
  } else if (date <= 9) {
    date = '0' + date;
  }
  // 获取当日凌晨0:00:00（零时整）
  const startTime: any = parseInt(String(new Date(new Date().toLocaleDateString()).getTime()));
  // 获取当日23:59:59
  const endTime = startTime + (24 * 60 * 60 * 1000 - 1);
  // 获取当前时间戳
  const currentTime = parseInt(String(new Date().getTime()));
  const remainTime = parseInt(String((parseInt(endTime) - parseInt(String(currentTime))) / 1000));
  let time;
  if (parseInt(String(currentTime)) > parseInt(startTime)) {
    if (remainTime < 10) {
      time = '0000' + remainTime.toString();
    }
    if (remainTime < 100 && remainTime >= 10) {
      time = '000' + remainTime.toString();
    }
    if (remainTime < 1000 && remainTime >= 100) {
      time = '00' + remainTime.toString();
    }
    if (remainTime < 10000 && remainTime >= 1000) {
      time = '0' + remainTime.toString();
    }
    if (remainTime >= 10000) {
      time = remainTime.toString();
    }
    const id = year + month + date + time;
    return id;
  }
}

export function StartsWith (name: any, key) {
  return name.startsWith(key);
}

export function initCSS () {
  addCSS(`
      .s-loading{
        position: absolute;
        background: rgba(255,255,255,0.8);
        z-index: 99999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .s-loading svg{
        animation: sLoading 1s linear infinite;
      }
  
      @keyframes sLoading {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
  
  `);
}
