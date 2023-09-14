import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { GetUser } from '../auth/decorator/user.decorator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UpdateNoteDTO, InsertNoteDTO } from './dto';
import { MyJwtGuard } from '../auth/gaurd';
import { Note } from '@prisma/client';

@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @UseGuards(new MyJwtGuard())
  @Get()
  getNotes(@GetUser('id') userId: number): Promise<Note[] | null> {
    return this.noteService.getNotes(userId);
  }

  @Get(':id')
  getNoteById(@Param('id', ParseIntPipe) noteId: number): Promise<Note | null> {
    return this.noteService.getNoteById(noteId);
  }

  @UseGuards(new MyJwtGuard())
  @Post()
  insertNote(
    @GetUser('id') userId: number,
    @Body() insertNoteDTO: InsertNoteDTO,
  ) {
    return this.noteService.insertNote(userId, insertNoteDTO);
  }

  @Patch(':id')
  updateNoteById(
    @Param('id', ParseIntPipe) noteId: number,
    @Body() updateNoteDTO: UpdateNoteDTO,
  ): Promise<Note> {
    return this.noteService.updateNoteById(noteId, updateNoteDTO);
  }

  @Delete(':id')
  deleteNoteById(@Param('id', ParseIntPipe) noteId: number) {
    return this.noteService.deleteNoteById(noteId);
  }
}
