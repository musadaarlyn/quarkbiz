import { useState, useEffect, useRef } from "react";
import { fetchProjects } from "../../services/ProjectsService";
import { fetchTechStacks } from "../../services/TechStackService";
import { fetchCategories } from "../../services/CategoriesService";

type SearchResult = {
  type: 'project' | 'techstack' | 'category';
  id: number;
  title: string;
  description?: string;
  category?: string;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [techStacks, setTechStacks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, techStacksData, categoriesData] = await Promise.all([
          fetchProjects(),
          fetchTechStacks(),
          fetchCategories()
        ]);
        setProjects(projectsData);
        setTechStacks(techStacksData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load search data:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filteredResults: SearchResult[] = [];

    projects.forEach(project => {
      if (project.projName.toLowerCase().includes(searchQuery)) {
        filteredResults.push({
          type: 'project',
          id: project.id,
          title: project.projName,
          category: project.status
        });
      }
    });

    techStacks.forEach(stack => {
      if (stack.tsName.toLowerCase().includes(searchQuery)) {
        const category = categories.find(cat => cat.id === stack.categoryId);
        filteredResults.push({
          type: 'techstack',
          id: stack.id,
          title: stack.tsName,
          category: category?.tscName || ''
        });
      }
    });

    categories.forEach(category => {
      if (category.tscName.toLowerCase().includes(searchQuery)) {
        filteredResults.push({
          type: 'category',
          id: category.id,
          title: category.tscName,
          category: 'Category'
        });
      }
    });

    setResults(filteredResults.slice(0, 8));
    setIsOpen(true);
  }, [query, projects, techStacks, categories]);

  const handleResultClick = (result: SearchResult) => {
    const sectionMap = {
      'project': 'projects',
      'techstack': 'techstack',
      'category': 'categories'
    };
    
    // Scroll to section first
    const section = document.getElementById(sectionMap[result.type]);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      
      // Wait for scroll to complete, then highlight the card
      setTimeout(() => {
        const cardId = `${result.type}-card-${result.id}`;
        const card = document.getElementById(cardId);
        
        if (card) {
          // Add Tailwind classes for highlight effect with animation
          card.classList.add(
            'ring-1',
            'ring-[#2596be]',
            'ring-opacity-80',
            'scale-105',
            'shadow-xl',
            'shadow-[#2596be]/25'
          );
          
          // Remove highlight after 1 second
          setTimeout(() => {
            card.classList.remove(
              'ring-1',
              'ring-[#2596be]',
              'ring-opacity-80',
              'scale-105',
              'shadow-xl',
              'shadow-[#2596be]/25'
            );
          }, 1000);
        }
      }, 500); // Wait for scroll to complete
    }
    
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search projects, tech stacks, categories..."
          className="w-full px-4 py-2 pl-10 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#2596be] focus:bg-white/15 transition-all duration-300"
        />
        <svg
          className="absolute left-3 top-2.5 w-4 h-4 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#0d1f33]/95 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl z-50">
          <div className="max-h-80 overflow-y-auto overflow-x-hidden">
            {results.map((result, index) => (
              <div
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-all duration-200 hover:translate-x-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        result.type === 'project' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        result.type === 'techstack' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {result.type}
                      </span>
                      <h4 className="text-sm font-medium text-white">{result.title}</h4>
                    </div>
                    {result.category && (
                      <p className="text-xs text-white/60 mt-1">{result.category}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}