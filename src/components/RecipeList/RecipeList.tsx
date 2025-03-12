import { useEffect, useMemo, useState } from "react";
import type { IRecipe } from "../../shared/types";
import RecipeItem from "../RecipeItem/RecipeItem";
import Pagination from "../Pagination/Pagination";
import { RECIPES_PER_PAGE } from "../../config";
import "./recipeList.css";

interface IRecipeListProps {
	recipes: IRecipe[];
	onAddRecipe: (id: string) => void;
}

const RecipeList = ({ recipes, onAddRecipe }: IRecipeListProps) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(
		Math.ceil(recipes.length / RECIPES_PER_PAGE)
	);

	const onPageChange = (page: number) => {
		setCurrentPage(page);
	};

	useEffect(() => {
		setCurrentPage(1);
		setTotalPages(Math.ceil(recipes.length / RECIPES_PER_PAGE));
	}, [recipes]);

	const recipesToRender = useMemo(() => {
		return recipes.slice(
			(currentPage - 1) * RECIPES_PER_PAGE,
			currentPage * RECIPES_PER_PAGE
		);
	}, [recipes, currentPage]);

	return (
		<div className="recipe-list">
			<ul className="recipe-list__list">
				{recipesToRender ? (
					recipesToRender.map((recipe) => (
						<li key={recipe.idMeal} className="recipe-list__item">
							<RecipeItem
								recipe={recipe}
								onAddRecipe={onAddRecipe}
							/>
						</li>
					))
				) : (
					<li className="recipe-list__item">No data found</li>
				)}
			</ul>

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={onPageChange}
			/>
		</div>
	);
};

export default RecipeList;
