
import { Link } from "react-router-dom";

interface Category {
  id: number;
  name: string;
  events_count?: number;
}

interface CategoriesSectionProps {
  categories: Category[];
  isLoading: boolean;
}

export const CategoriesSection = ({ categories, isLoading }: CategoriesSectionProps) => {
  return (
    <section className="py-16 bg-gradient-to-br from-teal-50 to-purple-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-purple-800">
          Browse Events by Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 text-center shadow-sm border border-teal-100 animate-pulse"
              >
                <div className="w-16 h-16 bg-teal-200 rounded-full mx-auto mb-4"></div>
                <div className="h-5 bg-teal-100 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-teal-50 rounded w-1/2 mx-auto"></div>
              </div>
            ))
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <Link 
                to={`/events?category=${category.name}`}
                key={category.id}
                className="bg-white rounded-lg p-6 text-center shadow-md border border-teal-100 hover:shadow-lg transition duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-teal-700">
                  {category.name.charAt(0)}
                </div>
                <h3 className="font-medium text-purple-800 text-lg">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.events_count || 0} events</p>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-lg shadow">
              <p>No categories available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
