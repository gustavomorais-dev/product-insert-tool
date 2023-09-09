import PropTypes from 'prop-types';
import React, { createContext, useMemo, useState } from 'react';

export const ProductsContext = createContext(null);

export default function ProductsProvider({ children }) {
  const [validationResults, setValidationResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateValidationResults = (newResults) => {
    setValidationResults(newResults);
  };

  const updateLoading = (newLoadingValue) => {
    setLoading(newLoadingValue);
  };

  const contextValue = useMemo(() => ({
    validationResults,
    updateValidationResults,
    loading,
    updateLoading,
  }), [validationResults, loading]);

  return (
    <ProductsContext.Provider value={ contextValue }>
      {children}
    </ProductsContext.Provider>
  );
}

ProductsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
