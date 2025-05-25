import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SongRepository {
  async getAll() {
    return prisma.song.findMany({
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async getAllByUserId(userId: string) {
    return prisma.song.findMany({
      where: { userId },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async findByNameAndArtist(name: string, artist: string, userId: string) {
    return prisma.song.findFirst({
      where: {
        name: { equals: name.trim(), mode: "insensitive" },
        artist: { equals: artist.trim(), mode: "insensitive" },
        userId,
      },
    });
  }

  async create(name: string, artist: string, imageUrl: string, userId: string) {
    return prisma.song.create({
      data: {
        name,
        artist,
        imageUrl, // ✅ CORRECTO: es la variable, no el tipo
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async update(id: string, name?: string, artist?: string, imageUrl?: string) {
    return prisma.song.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(artist !== undefined && { artist }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });
  }

  async delete(id: string) {
    return prisma.song.delete({ where: { id } });
  }

  async findById(id: string) {
    return prisma.song.findUnique({ where: { id } });
  }
}

export const songRepository = new SongRepository();
