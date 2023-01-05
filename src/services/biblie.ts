import { HttpClient } from '../helpers/httpClient';

export class biblieServices extends HttpClient {
    public constructor(headers: any) {
        super('https://www.bibliatotal.com/api', headers);
    }

    public getBooks = () => this.instance.get<any>(`/books/14`);
    public getChapters = (book: number) => this.instance.get<any>(`/chapters/${book}/14`);
    /*public enrollment3d = (body: any) => this.instance.post<any>('/enrollment-3d', body);
    public match3d2didscan = (body: any) => this.instance.post<any>('/match-3d-2d-idscan', body);
    public match3d2dfaceportrait = (body: any) => this.instance.post<any>('/match-3d-2d-face-portrait', body);
    public match3d2d3rdpartyidphoto = (body: any) => this.instance.post<any>('/match-3d-2d-3rdparty-idphoto', body); */

}

