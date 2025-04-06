
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
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Browse Events by Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto"></div>
              </div>
            ))
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <Link 
                to={`/events?category=${category.name}`}
                key={category.id}
                className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition duration-200"
              >
                <div className="w-12 h-12 bg-eventPurple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-eventPurple-700 font-bold">
                    {category.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-medium text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.events_count || 0} events</p>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No categories available
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
