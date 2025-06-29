import swagger from '@fastify/swagger';
import swagger_ui from '@fastify/swagger-ui';
import envConfig from './env.config';

const SWAGGER_CONFIG = {
	openapi: {
		openapi: '3.0.0',
		info: {
			title: 'Prepify API',
			description: 'API ui for Prepify API',
			version: String(
				'Last Updated: ' +
					new Date().toLocaleString('vi-VN', {
						weekday: 'long',
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit'
					})
			)
		},
		servers: [
			{
				url: 'https://prepifyb.thanhf.dev/',
				description: 'BE server'
			},
			{
				url: `http://localhost:${envConfig.SERVER_PORT}`,
				description: 'Localhost'
			}
		],
		components: {
			securitySchemes: {
				access_token: {
					type: 'apiKey',
					in: 'header',
					name: 'Authorization'
				}
			}
		},
		security: [
			{
				access_token: []
			}
		],
		externalDocs: {
			url: 'https://editor.swagger.io/',
			description: 'Editor in swagger.io'
		}
	}
};

const SWAGGER_UI_CONFIG = {
	routePrefix: '/docs',
	uiConfig: {
		docExpansion: 'list',
		deepLinking: false
	},
	uiHooks: {
		onRequest: function (request: unknown, reply: unknown, next: any) {
			next();
		},
		preHandler: function (request: unknown, reply: unknown, next: any) {
			next();
		}
	},
	staticCSP: true,
	transformStaticCSP: (header: unknown) => header,
	transformSpecification: (
		swaggerObject: unknown,
		request: unknown,
		reply: unknown
	) => {
		return swaggerObject;
	},
	transformSpecificationClone: true
};

export default function swaggerConfig(app: any) {
	app.register(swagger, SWAGGER_CONFIG);
	app.register(swagger_ui, SWAGGER_UI_CONFIG);
}
