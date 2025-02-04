import { RequestHandler } from "express";
import * as accents from 'remove-accents';
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
        return res.json({ error: "File needs to be uploaded" });
    }

    const workbook = xlsx.readFile(`./uploads/${req.file.filename}`);
    let workbook_sheet = workbook.SheetNames;

    let workbook_response = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook_sheet[0]]
    );

    // Verificando se workbook_response[0] é um objeto
    if (typeof workbook_response[0] !== 'object' || workbook_response[0] === null) {
        return res.json({ error: "Invalid data format" });
    }

    // Função para formatar a data no formato desejado (ano-mês-dia hora:minuto:segundo)
    const formatDate = (dateNumber: number) => {
        const date = new Date((dateNumber - 25569) * 86400 * 1000); // Convertendo o número de dias para milissegundos
        return date.toISOString().replace(/T/, ' ').replace(/\..+/, ''); // Formatando para o formato desejado
    };


    // Obtendo o cabeçalho
    const header = Object.keys(workbook_response[0]);

    // Normalizando o cabeçalho: substituindo "actualizados" por "actualizado"
    const normalizedHeader = header.map(column =>
        column.toLowerCase() === "actualizados" ? "actualizado" : column
    );

    // Atualizando os dados com o cabeçalho normalizado
const normalizedData = workbook_response.map((row: any) => {
    const newRow: any = {};
    header.forEach((column, index) => {
        const normalizedColumn = normalizedHeader[index];
        newRow[normalizedColumn] = row[column];
    });

    // Aplicando a função formatDate aos campos de data
    if (typeof newRow.abierto === 'number') {
        newRow.abierto = formatDate(newRow.abierto);
    }
    if (typeof newRow.actualizado === 'number') {
        newRow.actualizado = formatDate(newRow.actualizado);
    }

    return newRow;
});
    

    
    // Iterando sobre os dados e formatando as datas
    const formattedData = normalizedData.map((row: any) => {
        if (typeof row.Abierto === 'number') {
            row.Abierto = formatDate(row.Abierto);
        }
        if (typeof row.Actualizado === 'number') {
            row.Actualizado = formatDate(row.Actualizado);
        }
        return row;
    });

    // Removendo espaços em branco dos nomes das colunas
    const finalData = formattedData.map((row: any) => {
        const newRow: any = {};
        normalizedHeader.forEach(column => {
            const formattedKey = accents.remove(column.replace(/\s/g, '').toLowerCase());
            newRow[formattedKey] = row[column];
        });
        return newRow;
    });

    return res.status(200).json({ message: finalData });
};


//const removeBlankSpaces = ()
