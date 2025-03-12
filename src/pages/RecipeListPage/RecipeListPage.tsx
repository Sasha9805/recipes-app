import { useQueries, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router";
import ErrorIndicator from "../../components/ErrorIndicator/ErrorIndicator";
import Loader from "../../components/Loader/Loader";
import NotFoundData from "../../components/NotFoundData/NotFoundData";
import {
	fetchCategories,
	fetchRecipes,
	fetchRecipesByLetter,
} from "../../services/api";
import { ALPHABET } from "../../config";
import RecipeSearch from "../../components/RecipeSearch/RecipeSearch";
import RecipeList from "../../components/RecipeList/RecipeList";
import RecipeFilters from "../../components/RecipeFilters/RecipeFilters";
import type { IRecipesResponse } from "../../shared/types";

const RecipeListPage = () => {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [debouncedSearch] = useDebounce(search, 500);
	const [category, setCategory] = useState("");

	const [chosenIds, setChosenIds] = useState<string[]>([]);

	const onAddRecipe = (id: string) => {
		if (!chosenIds.includes(id)) {
			setChosenIds((prevState) => [...prevState, id]);
		}
	};

	const selectRecipesWithCategory = useCallback(
		(data: IRecipesResponse) => {
			if (category) {
				return data.meals?.filter(
					(recipe) => recipe.strCategory === category
				);
			}
			return data.meals;
		},
		[category]
	);

	const allRecipes = useQueries({
		queries: ALPHABET.map((letter) => ({
			queryKey: ["recipesByLetter", letter],
			queryFn: () => fetchRecipesByLetter(letter),
			staleTime: Infinity,
			select: selectRecipesWithCategory,
		})),
		combine: (results) => {
			return {
				data: results.flatMap((result) => result.data || []),
				pending: results.some((result) => result.isPending),
				error: results.some((result) => result.error),
			};
		},
	});

	const {
		data: categoriesData,
		isPending: isCategoriesPending,
		error: isCategoriesError,
	} = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories,
		staleTime: Infinity,
	});

	const {
		data: searchedRecipes,
		isPending: isSearchedRecipesPending,
		error: isSearchedRecipesError,
	} = useQuery({
		queryKey: ["recipes", debouncedSearch],
		queryFn: () => fetchRecipes(debouncedSearch),
		// enabled: debouncedSearch.length > 0,
		select: selectRecipesWithCategory,
	});

	if (allRecipes.pending || isCategoriesPending) {
		return <Loader />;
	}

	if (allRecipes.error || isCategoriesError) {
		return <ErrorIndicator />;
	}

	if (!allRecipes.data) {
		return <NotFoundData />;
	}

	const filteredRecipes = debouncedSearch
		? searchedRecipes || []
		: allRecipes.data;

	return (
		<div>
			<h1>Recipes</h1>
			<RecipeSearch search={search} setSearch={setSearch} />
			<RecipeFilters
				categories={categoriesData?.categories || []}
				currentCategory={category}
				setCategory={setCategory}
			/>
			<button
				disabled={!chosenIds.length}
				onClick={() => navigate("/cart", { state: { chosenIds } })}
				style={{ marginLeft: "20px" }}
			>
				Go to Cart ({chosenIds.length})
			</button>

			{isSearchedRecipesPending ? (
				<Loader />
			) : isSearchedRecipesError ? (
				<ErrorIndicator />
			) : filteredRecipes.length ? (
				<RecipeList
					recipes={filteredRecipes}
					onAddRecipe={onAddRecipe}
				/>
			) : (
				<NotFoundData />
			)}
		</div>
	);
};

export default RecipeListPage;
