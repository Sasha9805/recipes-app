import { useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useQueries } from "@tanstack/react-query";
import { fetchRecipeById } from "../../services/api";
import type { IRecipe } from "../../shared/types";
import Loader from "../../components/Loader/Loader";
import ErrorIndicator from "../../components/ErrorIndicator/ErrorIndicator";
import "./recipeCart.css";

const RecipeCart = () => {
	const { state } = useLocation() as { state: { chosenIds: string[] } };
	const navigate = useNavigate();

	const chosenRecipes = useQueries({
		queries: state?.chosenIds?.map((id: string) => ({
			queryKey: ["recipe", id],
			queryFn: () => fetchRecipeById(id),
		})),
		combine: (results) => {
			return {
				data: results.flatMap((result) => result.data?.meals || []),
				pending: results.some((result) => result.isPending),
				error: results.some((result) => result.error),
			};
		},
	});

	const extractIngredients = (recipe: IRecipe) => {
		const ingredients = [];
		for (let i = 1; i <= 20; i++) {
			const ingredientKey = `strIngredient${i}` as keyof IRecipe;
			const measureKey = `strMeasure${i}` as keyof IRecipe;

			const ingredient = recipe[ingredientKey];
			const measure = recipe[measureKey];

			if (ingredient && ingredient.trim() !== "") {
				ingredients.push({
					ingredient: ingredient.trim(),
					measure: measure ? measure.trim() : "",
				});
			}
		}
		return ingredients;
	};

	const getCombinedIngredients = useCallback(
		(recipes: IRecipe[]) => {
			const combinedIngredientsMap: {
				[key: string]: { measure: string; count: number };
			} = {};

			recipes?.forEach((recipe) => {
				const ingredients = extractIngredients(recipe);
				ingredients.forEach(({ ingredient, measure }) => {
					if (combinedIngredientsMap[ingredient]) {
						combinedIngredientsMap[ingredient].count += 1;
					} else {
						combinedIngredientsMap[ingredient] = {
							measure,
							count: 1,
						};
					}
				});
			});

			const combinedIngredients = Object.entries(
				combinedIngredientsMap
			).map(([ingredient, { measure, count }]) => ({
				ingredient,
				measure,
				count,
			}));

			return combinedIngredients;
		},
		[chosenRecipes.data]
	);

	const combinedIngredients = useMemo(
		() => getCombinedIngredients(chosenRecipes.data),
		[chosenRecipes.data]
	);

	if (chosenRecipes.pending) {
		return <Loader />;
	}

	if (chosenRecipes.error) {
		return <ErrorIndicator />;
	}

	return (
		<div className="recipe-cart">
			<h1>Favourites recipes</h1>
			<div className="recipe-cart__buttons">
				<button
					className="recipe-cart__button"
					onClick={() => navigate(-1)}
				>
					← Back
				</button>

				<Link to="/">Go Home</Link>
			</div>
			<div className="recipe-cart__cards">
				{chosenRecipes.data.map((recipe) => (
					<div key={recipe.idMeal} className="recipe-cart__card">
						<img src={recipe.strMealThumb} alt={recipe.strMeal} />
						<h2>{recipe.strMeal}</h2>
						<p className="recipe-cart__meta">
							{recipe.strCategory} | {recipe.strArea}
						</p>
						<p className="recipe-cart__instructions">
							{recipe.strInstructions}
						</p>
					</div>
				))}
			</div>
			<div className="recipe-cart__combined-ingredients">
				<h2>Mutual list of ingredients</h2>
				<ul>
					{combinedIngredients.map(
						({ ingredient, measure, count }) => (
							<li key={ingredient}>
								{ingredient} {measure}{" "}
								{count > 1 ? `(x${count})` : ""}
							</li>
						)
					)}
				</ul>
			</div>
		</div>
	);
};

export default RecipeCart;
