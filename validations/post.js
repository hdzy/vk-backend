import { body } from 'express-validator';

export const postCreateValidation = [
    body('title', 'Title is required').isLength({min: 3}).isString(),
    body('content', 'Content').isLength({min: 10}).isString(),
    body('tags', 'Bad format').optional().isArray({min: 1}),
    body('imageUrl', 'Title is required').optional().isString(),
];