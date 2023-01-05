import HttpException from "./HttpException";

export class Response403 extends HttpException {
    constructor(message: string) {
        super(403, message);
        this.message = message;
    }
}