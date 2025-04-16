import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesModule } from '../src/notes/notes.module';
import { Note } from '../src/notes/entities/note.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Note],
      synchronize: true,
    }),
    NotesModule,
  ],
})
export class AppE2eModule {}
