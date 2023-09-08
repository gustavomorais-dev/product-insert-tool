import React, { useState } from 'react';
import './Form.css';

function Form() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedFile) {
      console.log('Arquivo selecionado:', selectedFile.name);
    }
  };

  return (
    <div className="form">
      <h2>Carregue o arquivo com a nova precificação:</h2>
      <form onSubmit={ handleSubmit }>
        <input
          type="file"
          accept=".csv"
          onChange={ handleFileChange }
        />
        <button type="submit">Enviar</button>
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
