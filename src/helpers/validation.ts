export const isValidParam = (param: any): boolean => {
  return param && param !== 'undefined' && param !== '';
};

export const isValidNumber = (param: any): boolean => {
  return typeof param === 'number' && !isNaN(param);
};
