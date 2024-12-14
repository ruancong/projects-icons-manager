export class MyError extends Error {
  code = '-1';

  constructor(code: string, message = '发生错误了哦') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}
