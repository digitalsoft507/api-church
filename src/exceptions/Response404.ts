import HttpException from "./HttpException";

export class Response404 extends HttpException {
    constructor(message: string) {
        super(404, message);
        this.message = message;
    }
}