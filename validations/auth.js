import { body } from 'express-validator';

export const registerValidation = [
    body('email').isEmail(),
    body('nickname').notEmpty(),
    body('name').notEmpty(),
    body('surname').notEmpty(),
    body('city').notEmpty(),
    body('education').notEmpty(),
    body('password').isLength({ min: 6 }),
    body('avatarURL').optional().isURL(),
]