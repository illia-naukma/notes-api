import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { ICreateNoteDto, INoteDto, INoteListDto, IUpdateNoteDto } from './dto/note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async findAll(): Promise<INoteListDto> {
    const notes = await this.notesService.findAll();
    return { items: notes };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<INoteDto> {
    return this.notesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNoteDto: ICreateNoteDto): Promise<INoteDto> {
    return this.notesService.create(createNoteDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: IUpdateNoteDto,
  ): Promise<INoteDto> {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.notesService.remove(id);
    return { success };
  }
}
