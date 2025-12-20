/** @deprecated Use `Utils.getHello` instead */
const utils = {
  getHello: () => {
    return Utils.getHello();
  },
};

export class Utils {
  static getHello() {
    return 'Hello Pawpal API!';
  }

  static getExtension(key: string) {
    return key.split('.').pop();
  }
}

export default utils;
