import { Recipe } from './recipe.entity';
import { Ingredient } from './ingredient.entity';
import { v4 as uuidv4 } from 'uuid';
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { Unit } from './unit.entity';

@Entity({ name: 'recipe_ingredient' })
export class RecipeIngredient {
	@PrimaryColumn({ type: 'uuid' })
	id: string = uuidv4();

	@ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients)
	recipe!: Relation<Recipe>;

	@ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredients)
	ingredient!: Relation<Ingredient>;

	@ManyToOne(() => Unit, (unit) => unit.recipeIngredients)
	unit!: Relation<Unit>;

	@Column({
		type: 'float'
	})
	amount!: number;
}
