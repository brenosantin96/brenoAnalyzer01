// @types/express/index.d.ts (ou no início do arquivo)
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload | string;  // Extende a interface para incluir a propriedade 'user'
    }
}

//test