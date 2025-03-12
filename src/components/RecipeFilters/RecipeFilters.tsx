import type { ICategory } from "../../shared/types";

interface IRecipeFiltersProps {
	currentCategory: string;
	categories: ICategory[];
	setCategory: (category: string) => void;
}

const RecipeFilters = ({
	currentCategory,
	categories,
	setCategory,
}: IRecipeFiltersProps) => {
	return (
		<select
			value={currentCategory}
			onChange={(e) => setCategory(e.target.value)}
			style={{ marginLeft: "20px" }}
		>
			<option value="">All</option>
			{categories.map((c) => (
				<option key={c.idCategory}>{c.strCategory}</option>
			))}
		</select>
	);
};

export default RecipeFilters;
