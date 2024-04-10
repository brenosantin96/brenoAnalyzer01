import { Router } from 'express';

import * as UserController from '../controllers/UserController';
import * as LoginAndRegisterController from '../controllers/LoginAndRegisterController';
import * as UploadController from '../controllers/UploadController'
import { Auth } from '../middlewares/Auth';
import { upload } from '../utilities/multerConfig';

const router = Router();

router.get('/ping', UserController.ping);
router.get('/users', UserController.getUsers);


router.post('/users', UserController.createUser);

//router.post('/upload', upload.single('excel'), UploadController.postFile)

router.post('/upload', upload.single('excel'), UploadController.postFile, UploadController.readFile)
router.get('/readupload', UploadController.readFile)

export default router;


