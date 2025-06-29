import { SwaggerTag } from '~constants/swaggertag.constant';
import orderController from '~controllers/order.controller';
import authMiddleware from '~middlewares/auth.middleware';
import { orderCreateRequestSchema } from '~models/schemas/order.schemas.model';

import { Fastify } from '~types/fastify.type';

export default async function route(
	app: Fastify,
	options: unknown,
	next: unknown
) {
	app.post(
		'/order',
		{
			schema: {
				tags: [SwaggerTag.ORDER],
				body: orderCreateRequestSchema
			},
			onRequest: [authMiddleware.requireToken]
		},
		orderController.orderHandle
	);

	app.get(
		'/orders',
		{
			schema: {
				tags: [SwaggerTag.ORDER]
			},
			onRequest: [authMiddleware.requireToken]
		},
		orderController.getAllOrder
	);

	app.get(
		'/orders/:id',
		{
			schema: {
				tags: [SwaggerTag.ORDER]
			},
			onRequest: [authMiddleware.requireToken]
		},
		orderController.getOrder
	);

	app.get(
		'/order-status',
		{
			schema: {
				tags: [SwaggerTag.ORDER]
			}
		},
		orderController.getOrderStatus
	);
}
