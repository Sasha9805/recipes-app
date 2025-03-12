import { Routes, Route } from "react-router";
import RecipeListPage from "./pages/RecipeListPage/RecipeListPage";
import RecipeItemPage from "./pages/RecipeItemPage/RecipeItemPage";
import RecipeCart from "./pages/RecipeCart/RecipeCart";

function App() {
	return (
		<Routes>
			<Route path="/" element={<RecipeListPage />} />
			<Route path="/:recipeId" element={<RecipeItemPage />} />
			<Route path="/cart" element={<RecipeCart />} />
		</Routes>
		// <RouterProvider router={router} />
	);
}

export default App;
