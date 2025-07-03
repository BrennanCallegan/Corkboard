import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Corkboard } from "../models/corkboard.model";

@Injectable({
    providedIn: 'root'
})
export class CorkboardService {
    private apiUrl = 'http://localhost:8080/api/notes';

    constructor(private http: HttpClient){}

    createNote(note: {title: string; body: string}): Observable<Corkboard>{
        return this.http.post<Corkboard>(this.apiUrl, note);
    }
    
    getNotes(): Observable<Corkboard[]>{
        return this.http.get<Corkboard[]>(this.apiUrl);
    }

    updateNote(id: number, note: {title: string; body: string}): Observable<Corkboard> {
        return this.http.put<Corkboard>(`${this.apiUrl}/${id}`, note);
    }

    deleteNote(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
    }
}