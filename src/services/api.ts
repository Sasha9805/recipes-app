import type { ICategoryResponse, IRecipesResponse } from "../shared/types";

export const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const fetchCategories = async (): Promise<ICategoryResponse> => {
	const response = await fetch(`${BASE_URL}/categories.php`);
	if (!response.ok) {
		throw new Error("Error while loading categories!");
	}
	return response.json();
};

export async function fetchRecipeById(id: string): Promise<IRecipesResponse> {
	const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
	if (!response.ok) {
		throw new Error("Error while loading recipe!");
	}
	return response.json();
}

export const fetchRecipesByLetter = async (
	letter: string
): Promise<IRecipesResponse> => {
	const response = await fetch(`${BASE_URL}/search.php?f=${letter}`);
	if (!response.ok) {
		throw new Error(
			`Error while loading recipes for the letter ${letter}!`
		);
	}
	return response.json();
};

// const fetchRecipesByCategory = async (categoryName: string) => {
// 	const response = await fetch(
// 		`${BASE_URL}/filter.php?c=${encodeURIComponent(categoryName)}`
// 	);
// 	if (!response.ok) {
// 		throw new Error(`Error while loading recipes for ${categoryName}!`);
// 	}
// 	return response.json();
// };

export async function fetchRecipes(
	search: string = ""
): Promise<IRecipesResponse> {
	const response = await fetch(`${BASE_URL}/search.php?s=${search}`);
	if (!response.ok) {
		throw new Error("Error while loading recipes!");
	}
	return response.json();
}
