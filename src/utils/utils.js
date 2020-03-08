import uuid from 'uuid';

export const UUID = () => {
  return String(uuid()).replace(/-/g, '');
};

export const getLoginUser = (prop) => {
  const user = JSON.parse(sessionStorage.getItem('loginUser') || '{}');
  if(prop) {
    return user[prop];
  }
  return user;
};

export const getCode = (i = 0) => {
  return String.fromCharCode(i + 65);
};

// 倒计时
export const countdown = (date) => {
  const end = Date.parse(date);
  const now = Date.parse(new Date());
  const msec = end - now - 60*1000;
  let day = parseInt(msec / 1000 / 60 / 60 / 24);
  let hr = parseInt(msec / 1000 / 60 / 60 % 24);
  let min = parseInt(msec / 1000 / 60 % 60);
  let sec = parseInt(msec / 1000 % 60);
  hr = hr > 9 ? hr : '0' + hr;
  min = min > 9 ? min : '0' + min;
  sec = sec > 9 ? sec : '0' + sec;
  return { str: `${day}天 ${hr}小时 ${min}分钟 ${sec}秒`, second: msec };
};

export const getRole = (data) => {
  switch (data) {
    case 1: return '系统管理员';
    case 101:return '学科负责人';
    case 201:return '讲师';
    case 301:return '技术老师';
    case 401:return '学生';
  }
};

export const isPhone = (phone) => {
  // 手机号的正则
  const phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
  return phoneReg.test(phone);
};

