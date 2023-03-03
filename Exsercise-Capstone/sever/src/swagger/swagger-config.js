/**
 * @swagger
 * /api/user/signIn:
 *  post:
 *      #summary: Login to get token
 *      description: responses
 *      tags: [SignIn]
 *      parameters:
 *      - in: body
 *        name: user
 *        schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             mat_khau:
 *               type: string
 *      responses:
 *          200: 
 *              description: success  
 *          401:
 *              description: Sai tên đăng nhập hoặc mật khẩu 
 */

/**
 * @swagger
 * /api/user/signUp:
 *  post:
 *      #summary: Login to get token
 *      description: responses
 *      tags: [SignUp]
 *      parameters:
 *      - in: body
 *        name: user
 *        schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             mat_khau:
 *               type: string
 *             ho_ten:
 *               type: string
 *             tuoi:
 *               type: number
 *      responses:
 *          200: 
 *              description: success  
 *          401:
 *              description: Wrong email or password
 */

/**
 * @swagger
 * /api/user/{id}:
 *  get:
 *      summary: Get user by ID
 *      description: Returns a user by ID
 *      tags: [User]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: ID of the user to retrieve
 *          required: true
 *          schema:
 *            type: integer
 *            minimum: 1
 *      responses:
 *          200: 
 *              description: Success response
 *              schema:
 *                type: object
 *                properties:
 *                  nguoi_dung_id:
 *                    type: integer
 *                  email:
 *                    type: string
 *                  ho_ten:
 *                    type: string
 *                  anh_dai_dien:
 *                    type: string
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal Server Error
 */

/**
 * @swagger
 * /api/user/getImageByUserId/{id}:
 *   get:
 *     summary: Get user's image by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User's image found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hinh_anh:
 *                   type: string
 *                   description: Image's URL
 *       404:
 *         description: User not found or no image found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: No photos have been added yet
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Server error
 */



/**
 * @swagger
* /api/user/getImageSaved/{id}:
*   get:
*     summary: Get a list of saved images of a user
*     tags: [User]
*     parameters:
*       - in: path
*         name: id
*         description: ID of the user
*         required: true
*         schema:
*           type: integer
*           example: 123
*       - in: header
*         name: Authorization
*         description: Access token
*         required: true
*         schema:
*           type: string
*           example: Bearer <access_token>
*     responses:
*       200:
*         description: List of saved images of the user
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: true
*                 data:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       hinh_id:
*                         type: integer
*                         example: 456
*                       nguoi_dung:
*                         type: object
*                         properties:
*                           nguoi_dung_id:
*                             type: integer
*                             example: 123
*                           ten_nguoi_dung:
*                             type: string
*                             example: John Doe
*                           email:
*                             type: string
*                             example: john.doe@example.com
*     404:
*       description: User not found
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               success:
*                 type: boolean
*                 example: false
*               message:
*                 type: string
*                 example: User not found
*     500:
*       description: Internal server error
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               success:
*                 type: boolean
*                 example: false
*               message:
*                 type: string
*                 example: Internal server error
*/


/**
 * @swagger
* /api/user/getImageSaved/{id}:
*   get:
*     summary: Get a list of saved images of a user
*     tags: [User]
*     parameters:
*       - in: path
*         name: id
*         description: ID of the user
*         required: true
*         schema:
*           type: integer
*           example: 123
*     responses:
*       200:
*         description: List of saved images of the user
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: true
*                 data:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       hinh_id:
*                         type: integer
*                         example: 456
*                       nguoi_dung:
*                         type: object
*                         properties:
*                           nguoi_dung_id:
*                             type: integer
*                             example: 123
*                           ten_nguoi_dung:
*                             type: string
*                             example: John Doe
*                           email:
*                             type: string
*                             example: john.doe@example.com
*     404:
*       description: User not found
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               success:
*                 type: boolean
*                 example: false
*               message:
*                 type: string
*                 example: User not found
*     500:
*       description: Internal server error
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               success:
*                 type: boolean
*                 example: false
*               message:
*                 type: string
*                 example: Internal server error
*/

/**
 * @swagger
* /api/user/getImageSaved/{id}:
*   get:
*     summary: Get a list of saved images of a user
*     tags: [User]
*     parameters:
*       - in: path
*         name: id
*         description: ID of the user
*         required: true
*         schema:
*           type: integer
*           example: 123
*       - in: header
*         name: tokencapstone
*         description: Access token
*         required: true
*         schema:
*           type: string
*           example: <access_token>
*     responses:
*       200:
*         description: List of saved images of the user
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                   example: true
*                 data:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       hinh_id:
*                         type: integer
*                         example: 456
*                       nguoi_dung:
*                         type: object
*                         properties:
*                           nguoi_dung_id:
*                             type: integer
*                             example: 123
*                           ten_nguoi_dung:
*                             type: string
*                             example: John Doe
*                           email:
*                             type: string
*                             example: john.doe@example.com
*     404:
*       description: User not found
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               success:
*                 type: boolean
*                 example: false
*               message:
*                 type: string
*                 example: User not found
*     500:
*       description: Internal server error
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               success:
*                 type: boolean
*                 example: false
*               message:
*                 type: string
*                 example: Internal server error
*/


/**
 * @swagger
 * /api/user/uploadImagesUser/{id}:
 *  post:
 *      summary: Upload image for user
 *      description: Upload an image for a user by user id
 *      tags: [User]
 *      consumes:
 *          - multipart/form-data
 *      parameters:
 *          - in: path
 *            name: id
 *            description: User id
 *            required: true
 *            schema:
 *              type: integer
 *              format: int64
 *          - in: formData
 *            name: file
 *            type: file
 *            description: The file to upload
 *      responses:
 *          '200':
 *              description: Upload image for user success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              user:
 *                                  $ref: '#/components/schemas/User'
 *                              image:
 *                                  type: string
 *                                  format: uri
 *                              message:
 *                                  type: string
 *                                  example: Upload image for user success
 *          '400':
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          '404':
 *              description: User not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          '500':
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */



/**
 * @swagger
 * /api/user/updateUser/{id}:
 *  put:
 *      description: responses
 *      tags: [User]
 *      parameters:
 *      - in: path
 *        name: id
 *      - in: body
 *        name: user
 *        schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             mat_khau:
 *               type: string
 *             ho_ten:
 *               type: string
 *             tuoi:
 *               type: number
 *      responses:
 *          200: 
 *              description: Success code
 *          400:
 *              description: Bad Request  
 *          500:
 *              description: Internal Server Error
 */


/**
 * @swagger
 * /api/user/deleteImageSaved:
 *   delete:
 *     summary: Xóa một ảnh đã lưu
 *     tags: [User]
 *     parameters:
 *       - in: body
 *         name: hinh_id
 *         description: ID của ảnh
 *         schema:
 *           type: object
 *           properties:
 *             hinh_id:
 *               type: integer
 *         required:
 *           - hinh_id
 *       - in: header
 *         name: tokencapstone
 *         description: Access token
 *         required: true
 *         schema:
 *           type: string
 *           example: <access_token> 
 *     responses:
 *       200:
 *         description: Xóa ảnh thành công
 *       401:
 *         description: Không có quyền xóa ảnh
 *       404:
 *         description: Không tìm thấy ảnh
 *       500:
 *         description: Lỗi server
 */


