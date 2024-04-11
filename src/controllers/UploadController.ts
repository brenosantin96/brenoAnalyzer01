import { RequestHandler } from "express";
import path from 'path'
import xlsx from 'xlsx'
import { upload } from '../utilities/multerConfig'

export const postFile: RequestHandler = async (req, res, next) => {

    let format = ".xlsx"

    if (!req.file) {
        return res.json({ error: "File needs to be uploaded" })
    }

    if (!req.file.originalname.includes(format)) {
        return res.json({ error: "File needs to have format .xlsx" })
    }

    req.file.originalname = "excel.xlxs"

    next();

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

    // Função para formatar a data no formato desejado (ano-mês-dia hora:minuto:segundo)
    const formatDate = (dateNumber: number) => {
        const date = new Date((dateNumber - 25569) * 86400 * 1000); // Convertendo o número de dias para milissegundos
        return date.toISOString().replace(/T/, ' ').replace(/\..+/, ''); // Formatando para o formato desejado
    };

    // Iterando sobre os dados e formatando as datas
    const formattedData = workbook_response.map((row: any) => {
        // Verificando se as chaves "Abierto" e "Actualizado" existem e são números
        if (typeof row.Abierto === 'number') {
            row.Abierto = formatDate(row.Abierto);
        }
        if (typeof row.Actualizado === 'number') {
            row.Actualizado = formatDate(row.Actualizado);
        }
        return row;
    });

    return res.status(200).json({ message: formattedData });



    //return res.status(200).json({message: workbook_response})

}

//console.log("Diretorio atual:", __dirname)
// Para obter o caminho absoluto do diretório onde o arquivo está sendo executado:
//const currentDirectory = path.resolve(__dirname);
//console.log('Caminho absoluto do diretório atual:', currentDirectory);


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