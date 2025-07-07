import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Note } from "../models/note.model";

@Injectable({
    providedIn: 'root'
})
export class CorkboardService {
    private apiUrl = 'http://localhost:8080/api/notes';

    constructor(private http: HttpClient){}

    createNote(note: {title: string; body: string}): Observable<Note>{
        return this.http.post<Note>(this.apiUrl, note);
    }
    
    getNotes(): Observable<Note[]>{
        return this.http.get<Note[]>(this.apiUrl);
    }

    updateNote(id: number, note: {title: string; body: string}): Observable<Note> {
        return this.http.put<Note>(`${this.apiUrl}/${id}`, note);
    }

    deleteNote(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
    }
}