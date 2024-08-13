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

export const getOneIncVsRitmText = async (req: Request, res: Response) => {


    try {
        const { id } = req.params;

        let oneIncVsRitmTexts = await prisma.inc_vs_ritm_texts.findFirst({
            where: { id: parseInt(id) }
        })

        if (oneIncVsRitmTexts) {
            res.status(200).json(oneIncVsRitmTexts);
            return;
        } else {
            return res.status(400).json({error: "Text not found"})
        }
    }

    catch (error: any) {
        console.log("ERROR: ", error);
        res.status(500).json({ error: "Error finding text", msg: error });
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
    });


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
                created_at: new Date(),
                last_edited_at: new Date(),
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

export const updateIncVsRitmText = async (req: Request, res: Response) => {

    // Definindo o schema de validação com Zod
    const IncVsRitmTextSchema = z.object({
        platform: z.string().nullable(),     // Aceita string ou null
        casuistry: z.string().nullable(),    // Aceita string ou null
        type_spanish: z.string().nullable(), // Aceita string ou null
        type_english: z.string().nullable(), // Aceita string ou null
        shortcut: z.string().nullable(),     // Aceita string ou null
        kb_article: z.string().nullable(),   // Aceita string ou null
        last_edition_by: z.number(),         // Deve ser um número (ID do usuário)
    });


    try {

        // Primeiro, pegar o ID do texto a ser editado a partir dos parâmetros da URL
        const { id } = req.params;

        // Validando os dados recebidos com Zod
        const validatedData = IncVsRitmTextSchema.parse(req.body);

        const updatedIncVsRitmText = await prisma.inc_vs_ritm_texts.update({
            where: { id: parseInt(id) },
            data: {
                platform: validatedData.platform,
                casuistry: validatedData.casuistry,
                type_spanish: validatedData.type_spanish,
                type_english: validatedData.type_english,
                shortcut: validatedData.shortcut,
                kb_article: validatedData.kb_article,
                last_edition_by: {
                    connect: { id: validatedData.last_edition_by }
                },
                last_edited_at: new Date()
            }
        });

        res.status(200).json({ msg: 'IncVsRitmText updated successfully', updatedIncVsRitmText });

    }

    catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: "Validation error", details: error.errors })
            return
        } else if (error.code === 'P2025') { // Prisma error code for "Record to update not found."
            res.status(404).json({ error: "Text not found" });
        } else {
            console.log("ERROR: ", error);
            res.status(500).json({ error: "Error updating IncVsRitmText", msg: error });
        }

    }
}

export const deleteIncVsRitmText = async (req: Request, res: Response) => {

 
    try {

        // Primeiro, pegar o ID do texto a ser editado a partir dos parâmetros da URL
        const { id } = req.params;

        let deletedIncVsRitmTexts = await prisma.inc_vs_ritm_texts.delete({
            where: { id: parseInt(id) }
        })

        if (deletedIncVsRitmTexts) {
            res.status(200).json({msg: "Text deleted with success"});
            return;

        } else {
            return res.status(400).json({error: "Text does not exists"})
        }

    }

    catch (error: any) {
        console.log("ERROR: ", error);
        res.status(500).json({ error: "Error deleting text", msg: error });
    }
}