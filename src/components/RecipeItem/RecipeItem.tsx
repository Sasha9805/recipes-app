import { useNavigate } from "react-router";
import type { IRecipe } from "../../shared/types";
import "./recipeItem.css";

interface IRecipeItemProps {
	recipe: IRecipe;
	onAddRecipe: (id: string) => void;
}

const RecipeItem = ({ recipe, onAddRecipe }: IRecipeItemProps) => {
	const navigate = useNavigate();
	return (
		<div
			className="recipe-item"
			onClick={() => navigate(`/${recipe.idMeal}`)}
		>
			<img
				src={recipe.strMealThumb}
				alt={recipe.strMeal}
				className="recipe-image"
			/>
			<div className="recipe-content">
				<h2 className="recipe-title">{recipe.strMeal}</h2>
				<p className="recipe-category">
					{recipe.strCategory} | {recipe.strArea}
				</p>
				<p className="recipe-description">
					{recipe.strInstructions.slice(0, 100)}...
				</p>
				<button
					className="recipe-button"
					onClick={(e) => {
						e.stopPropagation();
						onAddRecipe(recipe.idMeal);
					}}
				>
					Add the recipe to your cart
				</button>
			</div>
		</div>
	);
};

export default RecipeItem;
