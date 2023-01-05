import HttpException from "./HttpException";

export class Response400 extends HttpException {
    constructor(message: string) {
        super(400, message);
        this.message = message;
    }
}