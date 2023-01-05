import HttpException from "./HttpException";

export class AlreadyExistsException extends HttpException {
    constructor(message: string) {
        super(500, message);
        this.message = message;
    }
}