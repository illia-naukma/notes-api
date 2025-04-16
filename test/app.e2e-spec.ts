import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppE2eModule } from './app.e2e-module';
import { ICreateNoteDto } from '../src/notes/dto/note.dto';

describe('Notes API (e2e)', () => {
  let app: INestApplication;
  let noteId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppE2eModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/notes (GET) - should return empty array initially', () => {
    return request(app.getHttpServer())
      .get('/notes')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('items');
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items.length).toBe(0);
      });
  });

  it('/notes (POST) - should create a new note', () => {
    const createNoteDto: ICreateNoteDto = {
      title: 'Test Note',
      content: 'This is a test note',
    };

    return request(app.getHttpServer())
      .post('/notes')
      .send(createNoteDto)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test Note');
        expect(res.body.content).toBe('This is a test note');
        noteId = res.body.id;
      });
  });

  it('/notes (GET) - should return the created note', () => {
    return request(app.getHttpServer())
      .get('/notes')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('items');
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items.length).toBe(1);
        expect(res.body.items[0].id).toBe(noteId);
        expect(res.body.items[0].title).toBe('Test Note');
      });
  });

  it('/notes/:id (GET) - should return a note by id', () => {
    return request(app.getHttpServer())
      .get(`/notes/${noteId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.id).toBe(noteId);
        expect(res.body.title).toBe('Test Note');
        expect(res.body.content).toBe('This is a test note');
      });
  });

  it('/notes/:id (GET) - should return 404 for non-existent note', () => {
    return request(app.getHttpServer())
      .get('/notes/999')
      .expect(404);
  });

  it('/notes/:id (PUT) - should update a note', () => {
    return request(app.getHttpServer())
      .put(`/notes/${noteId}`)
      .send({
        title: 'Updated Note',
        content: 'This note has been updated',
      })
      .expect(200)
      .expect(res => {
        expect(res.body.id).toBe(noteId);
        expect(res.body.title).toBe('Updated Note');
        expect(res.body.content).toBe('This note has been updated');
      });
  });

  it('/notes/:id (PUT) - should return 404 for non-existent note', () => {
    return request(app.getHttpServer())
      .put('/notes/999')
      .send({
        title: 'Updated Note',
      })
      .expect(404);
  });

  it('/notes/:id (DELETE) - should delete a note', () => {
    return request(app.getHttpServer())
      .delete(`/notes/${noteId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.success).toBe(true);
      });
  });

  it('/notes/:id (DELETE) - should return 404 for non-existent note', () => {
    return request(app.getHttpServer())
      .delete('/notes/999')
      .expect(404);
  });

  it('/notes/:id (GET) - should return 404 after deletion', () => {
    return request(app.getHttpServer())
      .get(`/notes/${noteId}`)
      .expect(404);
  });

  it('/notes (GET) - should return empty array after deletion', () => {
    return request(app.getHttpServer())
      .get('/notes')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('items');
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items.length).toBe(0);
      });
  });
});
