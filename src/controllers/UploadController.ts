import { RequestHandler } from "express";
import * as accents from 'remove-accents';
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


    if (!req.file) {
        return res.json({ error: "File needs to be uploaded" })
    }

    const workbook = xlsx.readFile(`./uploads/${req.file.filename}`)
    let workbook_sheet = workbook.SheetNames;

    let workbook_response = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook_sheet[0]]
    );


    // Verificando se workbook_response[0] é um objeto
    if (typeof workbook_response[0] !== 'object' || workbook_response[0] === null) {
        return res.json({ error: "Invalid data format" });
    }

    // Obtendo o cabeçalho
    const header = Object.keys(workbook_response[0]);


    // Função para formatar a data no formato desejado (ano-mês-dia hora:minuto:segundo)
    const formatDate = (dateNumber: number) => {
        const date = new Date((dateNumber - 25569) * 86400 * 1000); // Convertendo o número de dias para milissegundos
        return date.toISOString().replace(/T/, ' ').replace(/\..+/, ''); // Formatando para o formato desejado
    };


    let teste = workbook_response.find((row: any) => typeof row.Abierto === 'number')
    console.log(teste)

 
    let tableWithAllColumns = workbook_response.find((row: any) =>
        row.Abierto &&
        row.Actualizado &&
        row["Asignado a"] &&
        row["Número"] &&
        row.Etiquetas &&
        row["Motivo para poner en espera"] ||
        row["Razón Pendiente"]
        )

    if (!tableWithAllColumns) {
        console.log("if !tableWithAllColumns ", tableWithAllColumns)
        return res.json({ err: "You should import a .xls file that has the columns: 'asignado a', 'abierto', 'actualizado', 'etiquetas', 'numero', 'motivo para poner en espera' " })
    }

    if (tableWithAllColumns) {
        console.log("if tableWithAllColumns ", tableWithAllColumns)
        console.log(tableWithAllColumns)
    }


    // Iterando sobre os dados e formatando as datas
    workbook_response = workbook_response.map((row: any) => {
        // Verificando se as chaves "Abierto" e "Actualizado" existem e são números
        if (typeof row.Abierto === 'number') {
            row.Abierto = formatDate(row.Abierto);
        }
        if (typeof row.Actualizado === 'number') {
            row.Actualizado = formatDate(row.Actualizado);
        }
        return row;
    });


    // Removendo espaços em branco dos nomes das colunas
    const formattedData = workbook_response.map((row: any) => {
        const newRow: any = {};
        header.forEach(column => {
            const formattedKey = accents.remove(column.replace(/\s/g, '').toLowerCase());
            newRow[formattedKey] = row[column];
        });
        return newRow;
    });

    return res.status(200).json({ message: formattedData });



    //return res.status(200).json({message: workbook_response})

}
