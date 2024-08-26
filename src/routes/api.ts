import { Router } from 'express';

import { Auth } from '../middlewares/Auth'
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
router.get("/api/inc_vs_ritm_texts", Auth.private, IncVsRitmController.getIncVsRitmTexts);
router.get("/api/inc_vs_ritm_texts/:id", IncVsRitmController.getOneIncVsRitmText);
router.post("/api/inc_vs_ritm_texts", Auth.private, IncVsRitmController.createIncVsRitmText);
router.put("/api/inc_vs_ritm_texts/:id", Auth.private, IncVsRitmController.updateIncVsRitmText);
router.delete("/api/inc_vs_ritm_texts/:id", Auth.private, IncVsRitmController.deleteIncVsRitmText);




export default router;








