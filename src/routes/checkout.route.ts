import { SwaggerTag } from '~constants/swaggertag.constant';
import checkoutController from '~controllers/checkout.controller';
import authMiddleware from '~middlewares/auth.middleware';

import { checkoutCreateRequestSchema } from '~models/schemas/checkout.schemas.model';
import { Fastify } from '~types/fastify.type';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.get(
		'/checkout',
		{
			schema: {
				tags: [SwaggerTag.CHECKOUT]
			},
			onRequest: [authMiddleware.requireToken]
		},
		checkoutController.getCheckout
	);
	app.post(
		'/checkout',
		{
			schema: {
				tags: [SwaggerTag.CHECKOUT],
				body: checkoutCreateRequestSchema
			},
			onRequest: [authMiddleware.requireToken]
		},
		checkoutController.createCheckout
	);
}
