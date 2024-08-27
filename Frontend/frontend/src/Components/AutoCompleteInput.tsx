import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react'
import { Ingredient } from '../Datatypes/Ingredient';

type Props = {
    onSelect: (ingredient: Ingredient | string) => void | ((ingredient: Ingredient, index: number) => void);
    search: (query: string) => Promise<string[]>;
}

function AutoCompleteInput({ onSelect, search }: Props) {
    const [filteredItems, setFilteredItems] = useState<string[]>([]);
    const [searchString, setSearchString] = useState<string>("");
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLUListElement>(null);

    async function searchForItems(query: string) {
        if (!query) {
            setFilteredItems([]);
            return;
        }

        try {
            const results = await search(query);
            setFilteredItems(results);
            setShowSuggestions(results.length > 0);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }
    const debouncedSearch = debounce(searchForItems, 300);

    useEffect(() => {
        debouncedSearch(searchString.trim());
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchString]);

    const handleSuggestionClick = (item: string) => {
        onSelect(item);
        setSearchString(item);
        setShowSuggestions(false);
        setHighlightedIndex(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!filteredItems.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex(prev =>
                prev === null ? 0 : Math.min(prev + 1, filteredItems.length - 1)
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex(prev =>
                prev === null ? filteredItems.length - 1 : Math.max(prev - 1, 0)
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightedIndex !== null && highlightedIndex < filteredItems.length) {
                handleSuggestionClick(filteredItems[highlightedIndex]);
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
            {showSuggestions && filteredItems.length > 0 && (
                <ul
                    className="absolute bottom-full mb-1 left-0 w-full bg-white rounded-md shadow-sm z-10"
                    ref={suggestionsRef}>
                    <li
                        key={'freetext'}
                        onMouseEnter={() => setHighlightedIndex(null)}
                        onClick={() => {
                            setShowSuggestions(false);
                            onSelect(searchString);
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                        Add "{searchString}"
                    </li>
                    {filteredItems.map((item, index) => (
                        <li
                            key={item}
                            onClick={() => handleSuggestionClick(item)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${highlightedIndex === index ? 'bg-gray-200' : ''}`}>
                            {item}
                        </li>
                    ))}
                </ul>
            )}
            <input
                type="text"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                onFocus={() => filteredItems.length > 0 && setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                className='bg-white w-full py-2 text-start shadow-sm focus:shadow-lg px-6 rounded-md mr-2'
                placeholder='Nach Zutaten Suchen'
            />
        </div>

    )
}

export default AutoCompleteInput