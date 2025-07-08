export interface Note {
    id?: number;
    title: string;
    body: string;
    createdAt?: string;
    updatedAt?: string;
    positionX?: number;
    positionY?: number;
    isEditing?: boolean;
}