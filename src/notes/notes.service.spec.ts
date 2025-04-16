import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('NotesService', () => {
  let service: NotesService;
  let repository: Repository<Note>;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    repository = module.get<Repository<Note>>(getRepositoryToken(Note));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of notes', async () => {
      const result = [
        { id: '1', title: 'Test note 1', content: 'Content 1' },
        { id: '2', title: 'Test note 2', content: 'Content 2' },
      ];
      mockRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a note object when note exists', async () => {
      const result = { id: '1', title: 'Test note', content: 'Content' };
      mockRepository.findOneBy.mockResolvedValue(result);

      expect(await service.findOne('1')).toBe(result);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw NotFoundException when note does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('create', () => {
    it('should create and return a new note', async () => {
      const createDto = { title: 'New Note', content: 'New Content' };
      const note = { id: '1', ...createDto };

      mockRepository.create.mockReturnValue(note);
      mockRepository.save.mockResolvedValue(note);

      expect(await service.create(createDto)).toBe(note);
      expect(mockRepository.create).toHaveBeenCalledWith({
        title: createDto.title,
        content: createDto.content,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(note);
    });
  });

  describe('update', () => {
    it('should update and return a note', async () => {
      const existingNote = { id: '1', title: 'Old title', content: 'Old content' };
      const updateDto = { title: 'New title' };
      const updatedNote = { ...existingNote, ...updateDto };

      mockRepository.findOneBy.mockResolvedValue(existingNote);
      mockRepository.save.mockResolvedValue(updatedNote);

      expect(await service.update('1', updateDto)).toBe(updatedNote);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...existingNote,
        ...updateDto,
      });
    });

    it('should throw NotFoundException when note to update does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update('1', { title: 'New title' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should return true when note is removed', async () => {
      const note = { id: '1', title: 'Test note', content: 'Content' };
      mockRepository.findOneBy.mockResolvedValue(note);
      mockRepository.remove.mockResolvedValue(note);

      expect(await service.remove('1')).toBe(true);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(mockRepository.remove).toHaveBeenCalledWith(note);
    });

    it('should throw NotFoundException when note to remove does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
