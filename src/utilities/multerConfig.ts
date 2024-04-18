import multer from 'multer'

const storageConfig = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, './uploads');
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-'  + '.xlxs')
        }
    }
)


//configurations upload
export const upload = multer({
    storage: storageConfig
})