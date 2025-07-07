import { Routes } from '@angular/router';
import { Note } from './models/note.model';
import { CorkboardComponent } from './corkboard/corkboard';

export const routes: Routes = [
    {path: '', component: CorkboardComponent}
];
