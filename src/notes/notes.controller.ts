import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { ICreateNoteDto, INoteDto, INoteListDto, IUpdateNoteDto } from './dto/note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(): INoteListDto {
    return { items: this.notesService.findAll() };
  }

  @Get(':id')
  findOne(@Param('id') id: string): INoteDto {
    return this.notesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNoteDto: ICreateNoteDto): INoteDto {
    return this.notesService.create(createNoteDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: IUpdateNoteDto): INoteDto {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string): { success: boolean } {
    const success = this.notesService.remove(id);
    return { success };
  }
}

