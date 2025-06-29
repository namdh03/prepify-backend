import { DEFAULT_IMAGE } from '~constants/default.constant';
import { HTTP_STATUS_CODE } from '~constants/httpstatuscode.constant';
import { ImageType } from '~constants/image.constant';
import { OrderBy, SortBy } from '~constants/sort.constant';
import { ExtraSpice } from '~models/entities/extra-spice.entity';
import { MealKit } from '~models/entities/meal-kit.entity';
import { Recipe } from '~models/entities/recipe.entity';
import { GetMealKitModeratorResponse } from '~models/responses/moderator/mealkit.response';
import ResponseModel from '~models/responses/response.model';
import {
	MealKitModeratorCreateRequest,
	MealKitModeratorGetRequest
} from '~models/schemas/moderator/mealkit.schemas.model';
import imageRepository from '~repositories/image.repository';
import mealKitRepository from '~repositories/mealKit.repository';
import { FastifyRequest, FastifyResponse } from '~types/fastify.type';
import mapperUtil from '~utils/mapper.util';

class MealKitModeratorService {
	async createMealKitHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: MealKitModeratorCreateRequest =
			req.body as MealKitModeratorCreateRequest;

		const response = new ResponseModel(res);
		query.forEach((item) => {
			const mealKits = item.mealKits;
			mealKits.forEach(async (mealKit) => {
				const newMealKit = new MealKit();
				newMealKit.recipe = {
					id: item.recipeId
				} as Recipe;
				newMealKit.serving = mealKit.serving;
				newMealKit.price = mealKit.price;
				if (mealKit.extraSpice) {
					newMealKit.extraSpice = {
						name: mealKit.extraSpice.name,
						price: mealKit.extraSpice.price
					} as ExtraSpice;
				}
				await mealKitRepository.create(newMealKit);
			});
		});

		return response.send();
	}

	async getAllMealKitHandle(req: FastifyRequest, res: FastifyResponse) {
		const query: MealKitModeratorGetRequest =
			req.query as MealKitModeratorGetRequest;

		const pageSize =
			query.pageSize && query.pageSize <= 100 && query.pageSize > 0
				? query.pageSize
				: 10;

		const pageIndex =
			query.pageIndex && query.pageIndex > 0 ? query.pageIndex : 1;

		const orderBy = query.orderBy ? query.orderBy : OrderBy.ASC;

		let mealKitQuery = mealKitRepository
			.getRepository()
			.createQueryBuilder('mealkit')
			.leftJoinAndSelect('mealkit.extraSpice', 'extraSpice')
			.leftJoinAndSelect('mealkit.recipe', 'recipe')
			.groupBy('mealkit.id')
			.addGroupBy('extraSpice.id')
			.addGroupBy('recipe.id')
			.take(pageSize)
			.skip((pageIndex - 1) * pageSize);

		switch (query.sortBy) {
			case SortBy.SERVING:
				mealKitQuery = mealKitQuery.orderBy('mealkit.serving', orderBy);
				break;
			case SortBy.PRICE:
				mealKitQuery = mealKitQuery.orderBy('mealkit.price', orderBy);
				break;
			case SortBy.RECIPENAME:
				mealKitQuery = mealKitQuery.orderBy('recipe.name', orderBy);
				break;
			case SortBy.STATUS:
				mealKitQuery = mealKitQuery.orderBy('mealkit.status', orderBy);
				break;
			case SortBy.EXTRASPICENAME:
				mealKitQuery = mealKitQuery.orderBy('extraSpice.name', orderBy);
				break;
			case SortBy.EXTRASPICEPRICE:
				mealKitQuery = mealKitQuery.orderBy('extraSpice.price', orderBy);
				break;
		}

		if (query.search) {
			mealKitQuery = mealKitQuery.andWhere(
				`LOWER(REPLACE(recipe.name, ' ', '')) LIKE LOWER(REPLACE(:search, ' ', ''))`,
				{
					search: `%${query.search}%`
				}
			);
		}

		if (query.status) {
			if (query.status) {
				const statusArray = query.status
					.split(',')
					.map((status) => status === 'true');
				mealKitQuery = mealKitQuery.andWhere('mealkit.status IN (:...status)', {
					status: statusArray
				});
			}
		}

		const [mealKits, itemTotal] = await mealKitQuery.getManyAndCount();

		const pageTotal = Math.ceil(itemTotal / pageSize);

		const getAllMealKitModeratorResponseList: Array<GetMealKitModeratorResponse> =
			[];
		for (const item of mealKits) {
			const getAllMealKitModeratorResponse = mapperUtil.mapEntityToClass(
				item,
				GetMealKitModeratorResponse
			);
			getAllMealKitModeratorResponse.recipeName = item.recipe.name;
			getAllMealKitModeratorResponse.recipeId = item.recipe.id;

			const image = await imageRepository.findOneBy({
				type: ImageType.RECIPE,
				entityId: item.recipe.id
			});

			getAllMealKitModeratorResponse.image = image ? image.url : DEFAULT_IMAGE;

			if (getAllMealKitModeratorResponse.extraSpice && item.extraSpice) {
				const images = await imageRepository.findBy({
					type: ImageType.EXTRASPICE,
					entityId: item.extraSpice.id
				});

				getAllMealKitModeratorResponse.extraSpice.image = images[0]
					? images[0].url
					: DEFAULT_IMAGE;
			}
			getAllMealKitModeratorResponseList.push(getAllMealKitModeratorResponse);
		}

		const response = new ResponseModel(res);
		response.data = {
			data: getAllMealKitModeratorResponseList,
			itemTotal,
			pageTotal,
			pageIndex,
			pageSize
		};
		return response.send();
	}

	async getMealKitHandle(req: FastifyRequest, res: FastifyResponse) {
		const { id }: any = req.params as Object;

		const mealKit = await mealKitRepository.findOne({
			where: {
				id
			},
			relations: ['extraSpice']
		});

		const response = new ResponseModel(res);
		if (!mealKit) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}
		const getAllMealKitModeratorResponse = mapperUtil.mapEntityToClass(
			mealKit,
			GetMealKitModeratorResponse
		);

		response.data = getAllMealKitModeratorResponse;
		return response.send();
	}

	async updateMealKitHandle(req: FastifyRequest, res: FastifyResponse) {
		const { id }: any = req.params as Object;

		const mealKit = await mealKitRepository.findOne({
			where: {
				id
			},
			relations: ['extraSpice']
		});

		const response = new ResponseModel(res);
		if (!mealKit) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}
		const getAllMealKitModeratorResponse = mapperUtil.mapEntityToClass(
			mealKit,
			GetMealKitModeratorResponse
		);

		response.data = getAllMealKitModeratorResponse;
		return response.send();
	}

	async toggleStatusHandle(req: FastifyRequest, res: FastifyResponse) {
		const { id }: any = req.params as Object;

		const mealKit = await mealKitRepository.findOneBy({
			id
		});

		const response = new ResponseModel(res);
		if (!mealKit) {
			response.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
			return response.send();
		}

		mealKit.status = !mealKit.status;
		await mealKitRepository.update(mealKit);

		return response.send();
	}
}

export default new MealKitModeratorService();
