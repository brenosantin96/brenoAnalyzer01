import { RequestHandler } from "express";
import path from 'path'
import xlsx from 'xlsx'
import { upload } from '../utilities/multerConfig'

export const postFile: RequestHandler = async (req, res, next) => {

    let format = ".xlsx"
    console.log(req.file)

    if (!req.file) {
        return res.json({ error: "File needs to be uploaded" })
    }

    if (!req.file.originalname.includes(format)) {
        return res.json({ error: "File needs to have format .xlsx" })
    }

    req.file.originalname = "excel.xlxs"
    console.log(req.file)
    next({ file: req.file })


    console.log("Diretorio atual:", __dirname)

    // Para obter o caminho absoluto do diretório onde o arquivo está sendo executado:
    const currentDirectory = path.resolve(__dirname);
    console.log('Caminho absoluto do diretório atual:', currentDirectory);

    if(req.file){
        next();
    }
    else {
        return res.json({ error: "Finish" })
    }
}

export const readFile: RequestHandler = async (req, res, next) => {

    console.log("Cheguei aqui!")

    if (!req.file) {
        return res.json({ error: "File needs to be uploaded" })
    }

    const workbook = xlsx.readFile(`./uploads/${req.file.filename}`)
    let workbook_sheet = workbook.SheetNames;

    let workbook_response = xlsx.utils.sheet_to_json(        
        workbook.Sheets[workbook_sheet[0]]
    );

    return res.status(200).json({message: workbook_response})

}




/* 

import { z } from 'zod'
import * as events from '../services/events'

export const getAll: RequestHandler = async (req, res, next) => {

    const items = await events.getAll();

    if (items) return res.json({ items })

    res.json({ error: "An error has occurred" });

}

export const getEvent: RequestHandler = async (req, res) => {

    const { id } = req.params;

    const eventItem = await events.getOne(parseInt(id));
    console.log(eventItem)

    if (eventItem) return res.json({ event: eventItem });

    res.json({ error: "An error has occurred" });

}

export const addEvent: RequestHandler = async (req, res) => {

    const addEventSchema = z.object({
        title: z.string(),
        description: z.string(),
        grouped: z.boolean()
    });

    const body = addEventSchema.safeParse(req.body)
    if (!body.success) return res.status(400).json({ error: "No valid data" })

    const newEvent = await events.add(body.data);
    if (newEvent) return res.status(201).json({ event: newEvent })

    res.status(400).json({ error: "An error has occurred" })

}

export const updateEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const updateEventSchema = z.object({
        status: z.boolean().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        grouped: z.boolean().optional()
    })

    const body = updateEventSchema.safeParse(req.body);

    if (!body.success) return res.json({ error: "Invalid Data" })

    const updatedEvent = await events.update(parseInt(id), body.data);

    if(updatedEvent) {

        if(updatedEvent.status){
            //TODO: Fazer o sorteio
        } else {
            //TODO: Limpar o sorteio.
        }
        return res.json({event: updatedEvent})
    }
    

    res.status(403).json({error: 'An error has occurred'});



}

export const deleteEvent: RequestHandler = async (req, res) => {

    const { id } = req.params;

       const deletedEvent = await events.remove(parseInt(id));

    if(deletedEvent) return res.json({event: deletedEvent})
    
    
    res.status(403).json({error: 'An error has occurred'});


} */