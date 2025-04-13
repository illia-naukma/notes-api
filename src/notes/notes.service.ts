import { Injectable, NotFoundException } from '@nestjs/common';
import { INoteDto, ICreateNoteDto, IUpdateNoteDto } from './dto/note.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotesService {
  private notes: INoteDto[] = [];

  findAll(): INoteDto[] {
    return this.notes;
  }

  findOne(id: string): INoteDto {
    const note = this.notes.find(note => note.id === id);
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  create(createNoteDto: ICreateNoteDto): INoteDto {
    const newNote: INoteDto = {
      id: uuidv4(),
      title: createNoteDto.title,
      content: createNoteDto.content || '',
    };
    this.notes.push(newNote);
    return newNote;
  }

  update(id: string, updateNoteDto: IUpdateNoteDto): INoteDto {
    const noteIndex = this.notes.findIndex(note => note.id === id);
    if (noteIndex === -1) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    const updatedNote = {
      ...this.notes[noteIndex],
      ...updateNoteDto,
    };

    this.notes[noteIndex] = updatedNote;
    return updatedNote;
  }

  remove(id: string): boolean {
    const noteIndex = this.notes.findIndex(note => note.id === id);
    if (noteIndex === -1) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    this.notes.splice(noteIndex, 1);
    return true;
  }
}

