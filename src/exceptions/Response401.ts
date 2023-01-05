import HttpException from "./HttpException";

export class Response401 extends HttpException {
    constructor(message: string) {
        super(401, message);
        this.message = message;
    }
}