//import router from '../utils/route';
//import { functionName } from '../controllers/parentName/moduleName.controller';
//import { validate } from '../middlewares/validateMiddleware';
//import { moduleSchema } from '../validations/module_name';

/**
 * @swagger
 * tags:
 *   name: ModelName
 *   description: ModelName endpoints
 */

/**
 * @swagger
 * /module_name/path:
 *   post:
 *     summary: description
 *     tags: [module_name]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - field
 *               - field2
 *             properties:
 *               field:
 *                 type: string
 *               field2:
 *                 type: string
 *     responses:
 *       201:
 *         description: msg error
 *       400:
 *         description: msg error
 */
//router.post('/path', validate(moduleSchema), functionName);

//export default router;
