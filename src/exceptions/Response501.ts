import HttpException from "./HttpException";

export class Response501 extends HttpException {
    constructor(message: string) {
        super(501, message);
        this.message = message;
    }
}