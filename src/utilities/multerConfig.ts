import multer from 'multer'

const storageConfig = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, './uploads');
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname+'-'+Date.now()+'.xlxs')
        }
    }
)


//configurations upload
export const upload = multer({
    storage: storageConfig
})