const removeEmptyKeys = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') {
      removeEmptyKeys(obj[key]); // Recursively call removeEmptyKeys for nested objects
    }

    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key];
    }
    if (obj[key] && typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0) {
      delete obj[key];
    }
  });

  return obj;
};
export default removeEmptyKeys;
