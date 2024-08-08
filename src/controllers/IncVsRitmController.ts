import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../libs/prismaClient';
import { connect } from 'http2';



export const getIncVsRitmTexts = async (req: Request, res: Response) => {

    let allIncVsRitmTexts = await prisma.inc_vs_ritm_texts.findMany();

    if (allIncVsRitmTexts) {
        res.status(200).json(allIncVsRitmTexts);
        return;
    }

    else {
        res.status(404).json({ error: "Texts not found." })
        return;
    }

}

export const createIncVsRitmText = async (req: Request, res: Response) => {

    // Definindo o schema de validação com Zod
    const IncVsRitmTextSchema = z.object({
        platform: z.string().nullable(),     // Aceita string ou null
        casuistry: z.string().nullable(),    // Aceita string ou null
        type_spanish: z.string().nullable(), // Aceita string ou null
        type_english: z.string().nullable(), // Aceita string ou null
        shortcut: z.string().nullable(),     // Aceita string ou null
        kb_article: z.string().nullable(),   // Aceita string ou null
        created_by: z.number(),              // Deve ser um número (ID do usuário)
        last_edition_by: z.number(),         // Deve ser um número (ID do usuário)
        created_at: z.string().datetime(),   // Deve ser uma string de data (ISO 8601)
        last_edited_at: z.string().datetime() // Deve ser uma string de data (ISO 8601)
    });

    const { platform, casuistry, type_spanish, type_english, shortcut, kb_article, created_by, last_edition_by, created_at, last_edited_at } = req.body;


    try {


        // Validando os dados recebidos com Zod
        const validatedData = IncVsRitmTextSchema.parse(req.body);

        // Criando o novo registro com os dados validados
        const newIncVsRitmText = await prisma.inc_vs_ritm_texts.create({
            data: {
                platform: validatedData.platform,
                casuistry: validatedData.casuistry,
                type_spanish: validatedData.type_spanish,
                type_english: validatedData.type_english,
                shortcut: validatedData.shortcut,
                kb_article: validatedData.kb_article,
                created_at: validatedData.created_at,
                last_edited_at: validatedData.last_edited_at,
                created_by: {
                    connect: { id: validatedData.created_by }
                },
                last_edition_by: {
                    connect: { id: validatedData.last_edition_by }
                }
            }
        });

        res.status(201).json({ msg: 'IncVsRitmText created with success', newIncVsRitmText });

    }

    catch (error) {
        if (error instanceof z.ZodError) {
            // Lida com erros de validação
            res.status(400).json({ error: "Validation error", details: error.errors });
        } else {
            console.log("ERROR: ", error);
            res.status(500).json({ error: "Error creating IncVsRitmText", msg: error });
        }
    }

}