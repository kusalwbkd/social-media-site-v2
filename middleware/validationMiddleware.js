import { body, param, validationResult } from 'express-validator';
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from '../errors/customErrors.js';
import User from '../models/UserModel.js';
import { comparePassword } from '../utils/passwordUtils.js';
import Post from '../models/PostModel.js';
import mongoose from 'mongoose';


const withValidationErrors = (validateValues) => {
    return [
      validateValues,
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const errorMessages = errors.array().map((error) => error.msg);
  
          const firstMessage = errorMessages[0];
          console.log(Object.getPrototypeOf(firstMessage));
          if (errorMessages[0].startsWith('no any')) {
            throw new NotFoundError(errorMessages);
          }
          if (errorMessages[0].startsWith('no user')) {
            throw new NotFoundError(errorMessages);
          }
          if (errorMessages[0].startsWith('not authorized')) {
            throw new UnauthorizedError('not authorized to access this route');
          }
          throw new BadRequestError(errorMessages);
        }
        next();
      },
    ];
  };

  //user validation

  export const validateRegisterInput=withValidationErrors([
    body('fullName').notEmpty().withMessage('fullName is required'),
    body('password').notEmpty().withMessage('password is required').isLength({min:6}).withMessage('password must be at least 6 characters long'),
    body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError('email already exists');
      }
    }),
    body('username').notEmpty().withMessage('username is required')
    .custom(async(username)=>{
        const user=await User.findOne({username})
        if (user) {
            throw new BadRequestError('username already exists');
          }
    })
  ])

  export const validateLoginInput = withValidationErrors([
    body('username')
      .notEmpty()
      .withMessage('username is required'),
    
    body('password').notEmpty().withMessage('password is required'),
  ]);
  

  export const validateUpdateInput = withValidationErrors([
    body('fullName').optional(),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email format')
      .custom(async (email,{req}) => {
        const user = await User.findOne({ email });
        
        if (user && user._id.toString() !== req.user.userId) {
          throw new BadRequestError('Username already exists');
        }
      }),
    body('username')
      .optional()
      .custom(async (username,{req}) => {
        const user = await User.findOne({ username });

     // const isSameUser=user._id.toString() !== req.user.userId
        if (user && user._id.toString() !== req.user.userId) {
          throw new BadRequestError('Username already exists');
        }
      }),
  ]);

  export const validatUserParams=withValidationErrors([

    param('id').custom(async (value, { req }) => {
      const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
      if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');
      const user = await User.findById(value);
      if (!user) throw new NotFoundError(`no user with id ${value}`);
  
     
    }),
   

     
  ]);

  export const validatUserNameParams=withValidationErrors([

    param('username').custom(async (value, { req }) => {
      
      const user = await User.findOne({username:value});
      if (!user) throw new NotFoundError(`no user with username ${value}`);
  
     
    }),
   

     
  ])



  //post validation
  export const validatePostInput=withValidationErrors([
    body('text').optional(),
    body('img').optional(),

    body()
        .custom((value, { req }) => {
           
            if (!req.body.text && !req.body.img) {
                throw new BadRequestError('at least one field should presents');
            }
            return ;
        }),
  ])

  export const validatePostParams=withValidationErrors([
     param('id').custom(async (value, { req }) => {
      const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
      if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');
      const post = await Post.findById(value);
      if (!post) throw new NotFoundError(`no any post with id ${value}`);

      
     
    }) 
  ])

export const validateCommentInput=withValidationErrors([
 
  body('text').notEmpty().withMessage('text field must present'),

])






