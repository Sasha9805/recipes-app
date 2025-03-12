interface IRecipeSearchProps {
	search: string;
	setSearch: (search: string) => void;
}

const RecipeSearch = ({ search, setSearch }: IRecipeSearchProps) => {
	return (
		<input
			type="text"
			placeholder="Search recipes..."
			value={search}
			onChange={(e) => setSearch(e.target.value)}
		/>
	);
};

export default RecipeSearch;
