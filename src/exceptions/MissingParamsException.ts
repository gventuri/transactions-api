import HttpException from './HttpException';

class MissingParamsException extends HttpException {
  constructor() {
    super(422, `Some required params are missing`);
  }
}

export default MissingParamsException;
