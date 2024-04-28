import { Router } from 'express';

import * as UploadController from '../controllers/UploadController'
import * as TestController from '../controllers/UserController';

import { upload } from '../utilities/multerConfig';

const router = Router();

router.get('/ping', TestController.ping);
router.post('/upload', upload.single('excel'), UploadController.postFile, UploadController.readFile)
router.get('/readupload', UploadController.readFile)

export default router;


