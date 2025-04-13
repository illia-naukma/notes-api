export interface INoteDto {
  id: string;
  title: string;
  content: string;
}

export interface INoteListDto {
  items: INoteDto[];
}

export interface ICreateNoteDto {
  title: string;
  content?: string;
}

export interface IUpdateNoteDto {
  title?: string;
  content?: string;
}

