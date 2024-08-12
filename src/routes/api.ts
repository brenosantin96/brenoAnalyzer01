import { Router } from 'express';

import * as UploadController from '../controllers/UploadController'
import * as TestController from '../controllers/UserController';
import * as LoginAndRegister from '../controllers/UserController';
import * as LoginController from '../controllers/LoginAndRegisterController';
import * as IncVsRitmController from '../controllers/IncVsRitmController';

import { upload } from '../utilities/multerConfig';

const router = Router();

router.get('/api/ping', TestController.ping);
router.post('/api/register', LoginAndRegister.createUser);
router.post('/api/login', LoginController.login);
router.post('/api/upload', upload.single('excel'), UploadController.postFile, UploadController.readFile)
router.get('/api/readupload', UploadController.readFile)

//IncVsRitmText routes
router.get("/api/inc_vs_ritm_texts", IncVsRitmController.getIncVsRitmTexts);
router.post("/api/inc_vs_ritm_texts", IncVsRitmController.createIncVsRitmText);




export default router;








