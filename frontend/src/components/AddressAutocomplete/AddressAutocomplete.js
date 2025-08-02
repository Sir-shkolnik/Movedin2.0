import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
const MAPBOX_TOKEN =
    import.meta.env.VITE_MAPBOX_TOKEN;
const AddressAutocomplete = ({ value, onChange, placeholder }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const timeoutRef = useRef(null);
    const dropdownRef = useRef(null);
    const fetchSuggestions = async(query) => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5&country=ca`;
            const res = await fetch(url);
            const data = await res.json();
            setSuggestions(data.features || []);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };
    const handleInput = (e) => {
        const val = e.target.value;
        onChange(val);
        setShowDropdown(true);
        setSelectedIndex(-1);
        if (timeoutRef.current)
            window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => fetchSuggestions(val), 300);
    };
    const handleSelect = (feature) => {
        onChange(feature.place_name);
        setSuggestions([]);
        setShowDropdown(false);
        setSelectedIndex(-1);
    };
    const handleKeyDown = (e) => {
        if (!showDropdown || suggestions.length === 0)
            return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    handleSelect(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowDropdown(false);
                setSelectedIndex(-1);
                break;
        }
    };
    const highlightText = (text, query) => {
        if (!query)
            return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) => regex.test(part) ? (_jsx("span", { className: "highlight", children: part }, index)) : (part));
    };
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
                setSelectedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && dropdownRef.current) {
            const selectedElement = dropdownRef.current.children[selectedIndex];
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex]);
    return (_jsxs("div", { className: "autocomplete-wrapper", ref: dropdownRef, children: [_jsx("input", { type: "text", value: value, onChange: handleInput, onKeyDown: handleKeyDown, placeholder: placeholder, className: "autocomplete-input", autoComplete: "off", onFocus: () => value && setShowDropdown(true) }), showDropdown && (_jsx("div", { className: "autocomplete-dropdown", children: loading ? (_jsx("div", { className: "autocomplete-loading", children: "Searching for addresses..." })) : suggestions.length > 0 ? (suggestions.map((feature, index) => (_jsx("div", { className: `autocomplete-suggestion ${index === selectedIndex ? 'selected' : ''}`, onMouseDown: () => handleSelect(feature), onMouseEnter: () => setSelectedIndex(index), children: highlightText(feature.place_name, value) }, feature.id)))) : value.length >= 2 ? (_jsx("div", { className: "autocomplete-no-results", children: "No addresses found" })) : null }))] }));
};
export default AddressAutocomplete;