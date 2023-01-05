export class Response200 {
    //code: number;
    message: string;
    data: any;
    constructor(message: string, data: any) {
        //this.code = 0;
        this.message = message;
        this.data = data;
    }
}