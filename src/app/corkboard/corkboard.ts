import { Component, OnInit } from '@angular/core';
import { CorkboardService } from '../services/corkboard.service';
import { Corkboard } from '../models/corkboard.model';

@Component({
  selector: 'app-corkboard',
  imports: [],
  templateUrl: './corkboard.html',
  styleUrl: './corkboard.css'
})
export class CorkboardComponent implements OnInit {
  notes: Corkboard[] = [];
  newNoteTitle: string = '';
  newNoteBody: string = '';

  constructor(private corkboardService: CorkboardService){}
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
