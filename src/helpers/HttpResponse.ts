class HttpResponse {
    code: String;
    data: any;
    constructor(code: String, data: any) {
        this.code = code;
        this.data = data;
    }
}

export default HttpResponse;