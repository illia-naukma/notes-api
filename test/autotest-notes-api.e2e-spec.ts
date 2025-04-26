import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppE2eModule } from './app.e2e-module';
import { INestApplication } from '@nestjs/common';

describe('External Notes API (e2e)', () => {
  const uniqueTestValue = `test-${Date.now()}`;
  let app: INestApplication;

  let createdNoteId: string;
  let secondNoteId: string;

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

  it('POST /notes - create note', async () => {
    const response = await request(app.getHttpServer())
      .post('/notes')
      .send({ title: `Note ${uniqueTestValue}`, content: `Content ${uniqueTestValue}` })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toContain(`Note ${uniqueTestValue}`);
    expect(response.body.content).toContain(`Content ${uniqueTestValue}`);

    createdNoteId = response.body.id;
  });

  it('POST /notes - create second note', async () => {
    const response = await request(app.getHttpServer())
      .post('/notes')
      .send({ title: `Second Note ${uniqueTestValue}`, content: `Second Content ${uniqueTestValue}` })
      .expect(201);

    secondNoteId = response.body.id;
    expect(response.body.title).toContain(`Second Note ${uniqueTestValue}`);
    expect(response.body.content).toContain(`Second Content ${uniqueTestValue}`);
  });

  it('GET /notes - retrieve list of notes (check count)', async () => {
    const response = await request(app.getHttpServer())
      .get('/notes')
      .expect(200);

    expect(Array.isArray(response.body.items)).toBeTruthy();
    expect(response.body.items.length).toBeGreaterThanOrEqual(2);
    expect(response.body.items[0]).toHaveProperty('title');
    const titles = response.body.items.map((note: { title: unknown }) => note.title);
    expect(titles).toEqual(
      expect.arrayContaining([expect.stringContaining(uniqueTestValue)])
    );
  });

  it('GET /notes/:id - retrieve specific note', async () => {
    const response = await request(app.getHttpServer())
      .get(`/notes/${createdNoteId}`)
      .expect(200);

    expect(response.body.id).toBe(createdNoteId);
    expect(response.body.title).toContain(`Note ${uniqueTestValue}`);
    expect(response.body.content).toContain(`Content ${uniqueTestValue}`);
  });

  it('PUT /notes/:id - update note', async () => {
    const response = await request(app.getHttpServer())
      .put(`/notes/${createdNoteId}`)
      .send({ title: `Updated ${uniqueTestValue}` })
      .expect(200);

    expect(response.body.id).toBe(createdNoteId);
    expect(response.body.title).toContain(`Updated ${uniqueTestValue}`);
    expect(response.body.content).toContain(`Content ${uniqueTestValue}`);
  });

  it('PUT /notes/:id - error 404 when updating nonexistent note', async () => {
    await request(app.getHttpServer())
      .put('/notes/nonexistent-id')
      .send({ title: 'Should fail' })
      .expect(404);
  });

  it('GET /notes/:id - error 404 when retrieving nonexistent note', async () => {
    await request(app.getHttpServer())
      .get('/notes/nonexistent-id')
      .expect(404);
  });

  it('DELETE /notes/:id - delete note', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/notes/${createdNoteId}`)
      .expect(200);

    expect(response.body.success).toBe(true);

    await request(app.getHttpServer()).get(`/notes/${createdNoteId}`).expect(404);
  });

  it('DELETE /notes/:id - error 404 when deleting nonexistent note', async () => {
    await request(app.getHttpServer())
      .delete('/notes/nonexistent-id')
      .expect(404);
  });
});