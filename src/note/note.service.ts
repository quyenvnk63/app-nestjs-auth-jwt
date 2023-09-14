import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateNoteDTO, InsertNoteDTO } from './dto';
import { Note } from '@prisma/client';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  async insertNote(userId: number, insertNoteDTO: InsertNoteDTO) {
    const note = await this.prismaService.note.create({
      data: {
        ...insertNoteDTO,
        userID: userId,
      },
    });
    return note;
  }
  async getNotes(userId: number): Promise<Note[] | null> {
    return this.prismaService.note.findMany({
      where: { userID: userId },
    });
  }

  async getNoteById(noteId: number): Promise<Note | null> {
    const note = await this.prismaService.note.findUnique({
      where: { id: noteId },
    });
    if (!note) {
      throw new NotFoundException('note not found');
    }
    return note;
  }

  async updateNoteById(
    noteId: number,
    updateNoteDTO: UpdateNoteDTO,
  ): Promise<Note> {
    const note = this.prismaService.note.findUnique({
      where: { id: noteId },
    });
    if (!note) {
      throw new NotFoundException('update note error');
    }
    return this.prismaService.note.update({
      where: { id: noteId },
      data: { ...updateNoteDTO },
    });
  }

  async deleteNoteById(noteId: number) {
    try {
      const note = await this.prismaService.note.findUnique({
        where: { id: noteId },
      });
      if (!note) {
        throw new NotFoundException('note not found');
      }
      return this.prismaService.note.delete({
        where: { id: noteId },
      });
    } catch (err) {
      throw new InternalServerErrorException('Fails to delete note');
    }
  }
}
