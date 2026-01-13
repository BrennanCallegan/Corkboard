// src/app/corkboard/corkboard.component.ts
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CorkboardService } from '../services/corkboard.service';
import { Note } from '../models/note.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-corkboard',
  templateUrl: './corkboard.html',
  styleUrl: './corkboard.css',
  imports: [CommonModule, FormsModule, DragDropModule]
})
export class CorkboardComponent implements OnInit {
  notes: Note[] = [];
  newNoteTitle: string = '';
  newNoteBody: string = '';
  showAddNoteSection: boolean = false;
  isDragging: boolean = false;

  @ViewChild('notesBoard') notesBoardElementRef!: ElementRef;

  constructor(private corkboardService: CorkboardService){}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.corkboardService.getNotes().subscribe({
      next: (data: Note[]) => {
        this.notes = data.map(note => {
          if (note.positionX === null || note.positionX === undefined) note.positionX = Math.random() * 50;
          if (note.positionY === null || note.positionY === undefined) note.positionY = Math.random() * 50;
          note.isEditing = false;
          return note;
        });
        console.log('Notes loaded: ', this.notes);
      },
      error: (error) => {
        console.error('Error loading notes: ', error);
      }
    });
  }

  addNote(): void {
    this.notes.forEach(n => {
      if (n.isEditing) {
        n.isEditing = false;
        this.saveEditedNote(n);
      }
    });

    const noteToCreate: Partial<Note> = {
      title: "Tile",
      body: "Body",
      positionX: 50 + Math.random() * 400,
      positionY: 50 + Math.random() * 200,
      isEditing: true
    };

    this.corkboardService.createNote(noteToCreate as {title: string; body: string}).subscribe({
      next: (createdNote) => {
        if (createdNote.positionX === null || createdNote.positionX === undefined) createdNote.positionX = noteToCreate.positionX;
        if (createdNote.positionY === null || createdNote.positionY === undefined) createdNote.positionY = noteToCreate.positionY;
        createdNote.isEditing = true;

        this.notes.unshift(createdNote);

        setTimeout(() => {
          const newNoteElement = document.getElementById('note-' + createdNote.id);
          if (newNoteElement) {
            const titleInput = newNoteElement.querySelector('.note-edit-title') as HTMLInputElement;
            if (titleInput) {
              titleInput.focus();
              titleInput.select();
            }
          }
        }, 0);
      },
      error: (err) => {
        console.error('Error creating note: ', err);
      }
    });
  }

  deleteNote(id: number | undefined): void {
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

  dragStarted(event: CdkDragStart): void {
    this.isDragging = true;
    console.log('Drag started. isDragging:', this.isDragging);
  }

  dragEnded(event: CdkDragEnd, note: Note): void {
    const draggedElement = event.source.getRootElement();
    const transform = draggedElement.style.transform;
    let newX = 0;
    let newY = 0;

    const match = transform.match(/translate3d\(([^px]+)px, ([^px]+)px, ([^px]+)px\)/);
    if (match && match.length >= 3) {
        newX = parseFloat(match[1]);
        newY = parseFloat(match[2]);
    }

    note.positionX = newX;
    note.positionY = newY;

    event.source._dragRef.reset();
    event.source._dragRef.setFreeDragPosition({ x: newX, y: newY });

    console.log(`Note "${note.title}" dropped at: X=${note.positionX}, Y=${note.positionY}`);

    setTimeout(() => {
      this.isDragging = false;
      console.log('isDragging reset to false after delay.');
    }, 50);
  }

  editNote(note: Note): void {
    if (this.isDragging) {
      this.isDragging = false;
      console.log('Ignored click to prevent edit after drag because isDragging is true.');
      return;
    }

    if (note.isEditing) {
      this.saveEditedNote(note);
      return;
    }

    this.notes.forEach(n => {
      if (n.id !== note.id && n.isEditing) {
        n.isEditing = false;
        this.saveEditedNote(n);
      }
    });

    note.isEditing = true;
    setTimeout(() => {
      const noteElement = document.getElementById('note-' + note.id);
      if (noteElement) {
        const titleInput = noteElement.querySelector('.note-edit-title') as HTMLInputElement;
        if (titleInput) {
          titleInput.focus();
          titleInput.select();
        }
      }
    }, 0);
  }

  saveEditedNote(note: Note): void {
    if (note.id === undefined) {
      console.error("Cannot save note: ID is undefined.");
      return;
    }

    if (!note.title.trim() && !note.body.trim()) {
        if (confirm('This note is empty. Do you want to delete it?')) {
            this.deleteNote(note.id);
            return;
        } else {
            note.title = 'New Note';
            note.body = 'Add your content here...';
        }
    }


    note.isEditing = false;

    const updatedNoteData = {
        title: note.title,
        body: note.body
    };

    this.corkboardService.updateNote(note.id, updatedNoteData).subscribe({
      next: (response) => {
        console.log('Note content updated successfully:', response);
      },
      error: (err) => {
        console.error('Error updating note content:', err);
        note.isEditing = true;
      }
    });
  }
}