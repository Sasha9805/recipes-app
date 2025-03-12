import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import { fetchRecipeById } from "../../services/api";
import Loader from "../../components/Loader/Loader";
import ErrorIndicator from "../../components/ErrorIndicator/ErrorIndicator";
import NotFoundData from "../../components/NotFoundData/NotFoundData";
import type { IRecipe } from "../../shared/types";
import "./recipeItemPage.css";

const RecipeItemPage = () => {
	const { recipeId } = useParams();
	const navigate = useNavigate();

	const { data, isPending, error } = useQuery({
		queryKey: ["recipe", recipeId],
		queryFn: () => fetchRecipeById(recipeId!),
	});

	if (isPending) {
		return <Loader />;
	}

	if (error) {
		return (
			<div>
				<ErrorIndicator />
				<div>Error: {error.message}</div>
				<Link to="/">Go Home</Link>
			</div>
		);
	}

	if (!data.meals) {
		return (
			<div>
				<NotFoundData />
				<Link to="/">Go Home</Link>
			</div>
		);
	}

	const recipe = data.meals[0];

	const ingredients = Array.from({ length: 20 }, (_, i) => {
		const ingredient = recipe[`strIngredient${i + 1}` as keyof IRecipe];
		const measure = recipe[`strMeasure${i + 1}` as keyof IRecipe];
		return ingredient
			? `${measure ? measure + " " : ""}${ingredient}`
			: null;
	}).filter(Boolean);

	return (
		<div className="recipe-item__container">
			<h1>Recipe Item #{recipe.idMeal}</h1>
			<div className="recipe-item__buttons">
				<button
					className="recipe-item__button"
					onClick={() => navigate(-1)}
				>
					← Back
				</button>

				<Link to="/">Go Home</Link>
			</div>

			<div className="recipe-item__image-block">
				<img
					className="recipe-item__image"
					src={recipe.strMealThumb}
					alt={recipe.strMeal}
				/>
			</div>
			<h1 className="recipe-item__title">{recipe.strMeal}</h1>
			<p className="recipe-item__category">
				{recipe.strCategory} | {recipe.strArea}
			</p>

			<h2>Ingredients</h2>
			<ul className="recipe-item__list">
				{ingredients.map((item, idx) => (
					<li key={idx}>{item}</li>
				))}
			</ul>

			<h2>Steps</h2>
			<p className="recipe-item__instructions">
				{recipe.strInstructions}
			</p>

			{recipe.strYoutube && (
				<div className="video-container">
					<h2>Video recipe</h2>
					<iframe
						width="100%"
						height="315"
						src={`https://www.youtube.com/embed/${
							recipe.strYoutube.split("v=")[1]
						}`}
						title="Video recipe"
						allowFullScreen
					></iframe>
				</div>
			)}
		</div>
	);
};

export default RecipeItemPage;
