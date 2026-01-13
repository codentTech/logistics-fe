// eslint-disable-next-line import/prefer-default-export
export function delay(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
