import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import https from 'https'
import http from 'http'
import multer from 'multer'
import fs from 'fs'
import adminRoutes from './routes/api'
import { requestIntercepter } from './utilities/requestIntercepter';


const app = express();

//configurations upload
const upload = multer({
    dest: './uploads'
})

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.all('*', requestIntercepter)
app.use('/', adminRoutes)


const runServer = (port: number, server: http.Server) => {

    server.listen(port, () => {
        console.log(`Running at PORT ${port}`);
    });

}

const regularServer = http.createServer(app);

if (process.env.NODE_ENV === 'production') {

    //TODO: configurar SSL
    //TODO: rodar server na 80 e na 443

    const options = {
        key: fs.readFileSync(process.env.SSL_KEY as string),
        cert: fs.readFileSync(process.env.SSL_CERT as string),
    }

    const secServer = https.createServer(options, app);
    runServer(80, regularServer);
    runServer(443, secServer)
} else {
    const serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 9000
    runServer(serverPort, regularServer)
}

