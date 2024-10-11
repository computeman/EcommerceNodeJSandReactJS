import React from "react";
import { useLocation } from "react-router-dom";
import "./SearchResults.css"; // Add your styling here

const SearchResults = () => {
  const location = useLocation();
  const { results } = location.state || { results: [] }; // Get search results from state

  return (
    <div className="search-results-container">
      <h2>Search Results</h2>
      {results.length > 0 ? (
        <ul className="search-results-list">
          {results.map((product) => (
            <li key={product.id} className="search-result-item">
              <img
                src={product.image_url}
                alt={product.name}
                className="product-image"
              />
              <div>
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default SearchResults;
