import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NotFoundException } from '@nestjs/common';
import { ICreateNoteDto, IUpdateNoteDto } from './dto/note.dto';

describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;

  const mockNotesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of notes', async () => {
      const result = [
        { id: '1', title: 'Test note 1', content: 'Content 1' },
        { id: '2', title: 'Test note 2', content: 'Content 2' },
      ];
      mockNotesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual({ items: result });
    });
  });

  describe('findOne', () => {
    it('should return a note by id', async () => {
      const result = { id: '1', title: 'Test note', content: 'Content' };
      mockNotesService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockNotesService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when note does not exist', async () => {
      mockNotesService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new note', async () => {
      const createDto: ICreateNoteDto = { title: 'New Note', content: 'New Content' };
      const result = { id: '1', ...createDto };

      mockNotesService.create.mockResolvedValue(result);

      expect(await controller.create(createDto)).toBe(result);
      expect(mockNotesService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const updateDto: IUpdateNoteDto = { title: 'Updated Note' };
      const result = { id: '1', title: 'Updated Note', content: 'Content' };

      mockNotesService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateDto)).toBe(result);
      expect(mockNotesService.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('should throw NotFoundException when note does not exist', async () => {
      mockNotesService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('1', { title: 'Updated Note' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a note and return success true', async () => {
      mockNotesService.remove.mockResolvedValue(true);

      expect(await controller.remove('1')).toEqual({ success: true });
      expect(mockNotesService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when note does not exist', async () => {
      mockNotesService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
