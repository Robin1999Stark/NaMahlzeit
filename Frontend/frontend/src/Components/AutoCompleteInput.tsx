import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react'
import { Ingredient } from '../Datatypes/Ingredient';
import { TagDT } from '../Datatypes/Tag';
import { IngredientService } from '../Endpoints/IngredientService';
import { TagService } from '../Endpoints/TagService';

type Props = {
    onSelectIngredient: (ingredient: Ingredient | string) => void;
}

function AutoCompleteInput({ onSelectIngredient }: Props) {
    const [ingredients, setIngredients] = useState<Ingredient[]>()
    const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>();
    const [searchString, setSearchString] = useState<string>("");
    const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLUListElement>(null);

    async function fetchData() {
        try {
            const data = await IngredientService.getAllIngredients()
            const sortedIngredientsByTitle = data.sort((a, b) => a.title.localeCompare(b.title))
            setIngredients(sortedIngredientsByTitle)
            setFilteredIngredients(sortedIngredientsByTitle);

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    const debouncedSearch = debounce(async (search: string) => {
        if (!search.trim()) {
            setFilteredIngredients([]);
            setShowSuggestions(false);
            return;
        }

        if (!ingredients) return;

        const lowerCaseSearch = search.toLowerCase();
        let results = ingredients.filter(ingredient =>
            ingredient.title.toLowerCase().includes(lowerCaseSearch)
        );

        const tags = await TagService.getIngredientTagsFromTagList([new TagDT(lowerCaseSearch)]);
        const taggedIngredients = tags.flatMap(tag => tag.ingredient);

        results = [
            ...results,
            ...ingredients.filter(ingredient => taggedIngredients.includes(ingredient.title))
        ];

        setFilteredIngredients(results);
        setShowSuggestions(results.length > 0);
    }, 500);


    useEffect(() => {
        debouncedSearch(searchString.trim());
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchString]);

    const handleSuggestionClick = (ingredient: Ingredient) => {
        onSelectIngredient(ingredient);
        setSearchString(ingredient.title);
        setShowSuggestions(false);
        setHighlightedIndex(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!filteredIngredients) return;
        if (!filteredIngredients.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex(prev => (prev === null ? 0 : Math.min(prev + 1, filteredIngredients.length - 1)));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex(prev => (prev === null ? filteredIngredients.length - 1 : Math.max(prev - 1, 0)));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightedIndex !== null) {
                handleSuggestionClick(filteredIngredients[highlightedIndex]);
            } else if (searchString.trim()) {
                onSelectIngredient(searchString.trim());
                setSearchString("");
                setShowSuggestions(false);
            }
        }
    };
    useEffect(() => {
        if (highlightedIndex !== null && suggestionsRef.current) {
            const highlightedElement = suggestionsRef.current.children[highlightedIndex] as HTMLLIElement;
            highlightedElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [highlightedIndex]);


    return (
        <div className="relative">
            {showSuggestions && filteredIngredients && filteredIngredients.length > 0 && (
                <ul
                    className="absolute bottom-full mb-1 left-0 w-full bg-white rounded-md shadow-sm z-10"
                    ref={suggestionsRef}
                >
                    <li
                        key={'freetext'}
                        onMouseEnter={() => setHighlightedIndex(null)}
                        onClick={() => {
                            setShowSuggestions(false);
                            onSelectIngredient(searchString.trim());
                            setSearchString("");
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                        Add "{searchString.trim()}"
                    </li>

                    {filteredIngredients.map((ingredient, index) => (
                        <li
                            key={ingredient.title}
                            onClick={() => handleSuggestionClick(ingredient)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${highlightedIndex === index ? 'bg-gray-200' : ''}`}
                        >
                            {ingredient.title}
                        </li>
                    ))}
                    {/* Allow user to add a new ingredient */}


                </ul>
            )}
            <input
                type="text"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                onFocus={() => filteredIngredients && setShowSuggestions(filteredIngredients.length > 0)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                className='bg-white w-full focus:ring-2 focus:ring-green-500  py-2 text-start shadow-md px-6 rounded-md mr-2'
                placeholder='Search for ingredients'
            />

        </div>

    )
}

export default AutoCompleteInput