import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";



export const imageRouter = createTRPCRouter({


    saveNewImage: privateProcedure
        .input(z.object({
            uri: z.string(),
            name: z.string(),
            key: z.string(),
            type: z.string(),
            size: z.number(),
            userId: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {


            const user = ctx.currentUser;

            if (user === undefined) {
                throw new Error("User not logged in")
            }

            if (input.userId !== user) {
                throw new Error("User not authorized")
            }

            await ctx.db.uploadedFile.create({
                data: {
                    url: input.uri,
                    name: input.name,
                    key: input.key,
                    type: input.type,
                    size: input.size,
                    authorId: user,
                }
            })
        }),

    findImageWithKeys: privateProcedure
        .input(z.object({ keys: z.string().array() }))
        .query(async ({ input, ctx }) => {

            if (ctx.currentUser === undefined) {
                throw new Error("User not logged in")
            }

            const keysResult = await ctx.db.uploadedFile.findMany({
                where: {
                    AND: {
                        key: {
                            in: input.keys
                        },
                        authorId: ctx.currentUser
                    },
                }
            })

            return keysResult;

        }),
})