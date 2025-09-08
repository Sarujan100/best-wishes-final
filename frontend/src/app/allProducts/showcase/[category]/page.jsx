import { CategoryShowcase } from "../category-showcase"
import { Providers } from "../providers"

export default function CategoryPage({ params }) {
  const { category } = params

  // Convert URL parameter to proper category name (e.g., "balloons" to "Balloons")
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <Providers initialCategory={categoryName}>
      <CategoryShowcase categoryName={categoryName} />
    </Providers>
  )
}
