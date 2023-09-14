/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class InsertNoteDTO {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsNotEmpty()
  url: string   
}

// model Note {
//     id Int @id @default(autoincrement())
//     title String
//     description String?
//     url String
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt

//     userID Int  // like foreign key
//     user User @relation(fields: [userID], references: [id])
//     @@map("notes")
//   }
