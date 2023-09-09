import React, { useContext, useState } from 'react';
import './Form.css';
import { ProductsContext } from '../../context/products.provider';

function Form() {
  const {
    updateValidationResults,
    updateLoading,
    loading,
  } = useContext(ProductsContext);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleValidate = async (event) => {
    event.preventDefault();
    if (selectedFile) {
      updateLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        console.log('formdata ', formData);
        const response = await fetch('http://localhost:3001/file/validate', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          updateValidationResults(data);
        } else {
          console.error('Erro ao enviar o arquivo.');
        }
        updateLoading(false);
      } catch (error) {
        console.error('Erro ao enviar o arquivo:', error);
      }
    }
  };

  return (
    <div className="form">
      <h2>Carregue o arquivo com a nova precificação:</h2>
      <form onSubmit={ handleValidate } encType="multipart/form-data">
        <input
          type="file"
          accept=".csv"
          onChange={ handleFileChange }
        />
        <button type="submit" disabled={ loading }>Validar</button>
      </form>
      {selectedFile && (
        <p>
          Arquivo selecionado:
          {selectedFile.name}
        </p>
      )}
    </div>
  );
}

export default Form;
