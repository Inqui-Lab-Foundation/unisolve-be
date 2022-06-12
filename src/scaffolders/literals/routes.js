const string_ = require('../helpers/string');

function literal(resource) {
const resourceSingular = string_.singularizer(resource);
const resourceDenormalized = string_.denormalizer(resource);

  return `
/// ${resourceDenormalized} ROUTES ///
import { Router } from 'express';

import ${resourceDenormalized}Controller from '../controllers/${resourceSingular}Controller' ;
import { find${resourceDenormalized}, ${resourceSingular}Validator } from '../validators/${resourceSingular}Validator';
import jwtMiddleware from '../middlewares/jwtMiddleware';

const router = Router();

const ${resourceSingular}Controller = new ${resourceDenormalized}Controller();
/**
 * GET /api/${resource}
 */
router.get('/', jwtMiddleware ,(req,res,next)=>${resourceSingular}Controller.fetchAll(req,res,next));

/**
 * GET /api/${resource}/:id
 */
router.get('/:id',jwtMiddleware,(req,res,next)=>${resourceSingular}Controller.fetchById(req,res,next));

/**
 * POST /api/${resource}
 * public api ( register)
 */
router.post('/', ${resourceSingular}Validator, (req,res,next)=>${resourceSingular}Controller.create(req,res,next));

/**
 * POST /api/${resource}/signin
 * public api ( register)
 */
router.post('/signin', ${resourceSingular}Validator,(req,res,next)=> ${resourceSingular}Controller.signin(req,res,next));

/**
 * PUT /api/${resource}/:id
 */
router.put('/:id', jwtMiddleware, find${resourceDenormalized}, ${resourceSingular}Validator,(req, res, next) => jwtMiddleware(req, res, next) ,(req,res,next)=>${resourceSingular}Controller.update(req,res,next));

/**
 * DELETE /api/${resource}/:id
 */
router.delete('/:id', jwtMiddleware ,find${resourceDenormalized}, (req,res,next)=>${resourceSingular}Controller.delete(req,res,next));

export default router;
`;
}

module.exports = literal