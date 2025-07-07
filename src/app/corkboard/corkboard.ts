import { Component, OnInit } from '@angular/core';
import { CorkboardService } from '../services/corkboard.service';
import { Note } from '../models/note.model';
import { CommonModule, formatNumber } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-corkboard',
  templateUrl: './corkboard.html',
  styleUrl: './corkboard.css',
  imports: [CommonModule, FormsModule]
})
export class CorkboardComponent implements OnInit {
  notes: Note[] = [];
  newNoteTitle: string = '';
  newNoteBody: string = '';

  constructor(private corkboardService: CorkboardService){}
  
  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void{
    this.corkboardService.getNotes().subscribe({
      next: (data: Note[]) => {
        this.notes = data;
        console.log('Notes loaded: ', this.notes); //DEBUG STATEMENT
      },
      error: (error) => {
        console.error('Error loading notes: ', error)
      }
    })
  }

  addNote(): void{
    if(this.newNoteTitle.trim() && this.newNoteBody.trim()){
      const noteToCreate = {title: this.newNoteTitle, body: this.newNoteBody};
      this.corkboardService.createNote(noteToCreate).subscribe({
        next: (createdNote) => {
          this.notes.unshift(createdNote);
          this.newNoteTitle = '';
          this.newNoteBody = '';
        },
        error: (err) => {
          console.error('Error creating note: ', err);
        }
      });
    }
  }

  deleteNote(id: number | undefined): void{
    if(id === undefined){
      console.warn('Cannot delete note: ID is undefined');
      return;
    }
    if(confirm('Are you sure you want to delete this note?')){
      this.corkboardService.deleteNote(id).subscribe({
        next: () => {
          this.notes = this.notes.filter(item => item.id !== id);
        },
        error: (err) => {
          console.error('Error deleting note: ', err);
        }
      });
    }
  }
}
