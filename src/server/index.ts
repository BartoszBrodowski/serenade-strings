import { PrismaClient } from '@prisma/client';
import { publicProcedure, router } from './trpc';
import { z } from 'zod';

const prisma = new PrismaClient();

export const appRouter = router({
	findGuitarById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
		const result = await prisma.guitar.findUnique({ where: { id: input.id } });
		if (result === null) throw new Error('Guitar not found');
		return result;
	}),
	getAllGuitars: publicProcedure.query(async () => {
		const allGuitars = await prisma.guitar.findMany();
		return allGuitars;
	}),
	guitarCreate: publicProcedure
		.input(z.object({ name: z.string(), manufacturerName: z.string(), year: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;

			const guitar = await prisma.guitar.create({ data: input });
			return guitar;
		}),
});

export type AppRouter = typeof appRouter;