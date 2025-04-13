import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { ICreateNoteDto, INoteDto, IUpdateNoteDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async findAll(): Promise<Note[]> {
    return this.notesRepository.find();
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.notesRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async create(createNoteDto: ICreateNoteDto): Promise<Note> {
    const note = this.notesRepository.create({
      title: createNoteDto.title,
      content: createNoteDto.content || '',
    });
    return this.notesRepository.save(note);
  }

  async update(id: string, updateNoteDto: IUpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);

    if (updateNoteDto.title !== undefined) {
      note.title = updateNoteDto.title;
    }

    if (updateNoteDto.content !== undefined) {
      note.content = updateNoteDto.content;
    }

    return this.notesRepository.save(note);
  }

  async remove(id: string): Promise<boolean> {
    const note = await this.findOne(id);
    await this.notesRepository.remove(note);
    return true;
  }
}
