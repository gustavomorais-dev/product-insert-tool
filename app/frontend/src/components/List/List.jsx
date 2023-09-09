import React, { useContext } from 'react';
import './List.css';
import { ProductsContext } from '../../context/products.provider';

function List() {
  const { validationResults, loading } = useContext(ProductsContext);

  let content;
  if (loading) {
    content = <p>Loading</p>;
  } else if (validationResults.length > 0) {
    content = (
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Price</th>
            <th>New Price</th>
            <th>Errors</th>
          </tr>
        </thead>
        <tbody>
          {validationResults.map((result, index) => (
            <tr key={ index }>
              <td>{result.code}</td>
              <td>{result.name}</td>
              <td>{result.price}</td>
              <td>{result.newPrice}</td>
              <td>
                {result.errors.length === 0 ? (
                  <div>
                    <span className="valid">Válido</span>
                  </div>
                ) : (
                  <ul>
                    {result.errors.map((error, errorIndex) => (
                      <li key={ errorIndex }>{error}</li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else {
    content = <p>Aguardando arquivo</p>;
  }

  return (
    <div className="list">
      {content}
    </div>
  );
}

export default List;
