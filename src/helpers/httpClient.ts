import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

declare module 'axios' {
    interface AxiosResponse<T = any> extends Promise<T> { }
}

export abstract class HttpClient {
    protected readonly instance: AxiosInstance;

    public constructor(baseURL: string, headers: any) {

        this.instance = axios.create({
            baseURL,
        });

        if (headers) {
            Object.keys(headers)?.forEach((key) => {
                this.instance.defaults.headers.common[key] = headers[key];
            })
        }

        this._initializeRequestInterceptor();
        this._initializeResponseInterceptor();
    }
    private _initializeRequestInterceptor = () => {
        this.instance.interceptors.request.use(
            this._handleRequest,
            this._handleError,
        );
    };

    private _handleRequest = (config: AxiosRequestConfig) => {

        return config;
    };


    private _initializeResponseInterceptor = () => {
        this.instance.interceptors.response.use(
            this._handleResponse,
            this._handleError,
        );
    };

    private _handleResponse = ({ data }: AxiosResponse) => data;

    protected _handleError = (error: any) => {

        return Promise.reject(error);

    }
}
