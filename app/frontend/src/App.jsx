import './App.css';
import Form from './components/Form/Form';
import Header from './components/Header/Header';
import List from './components/List/List';
import ProductsProvider from './context/products.provider';

function App() {
  return (
    <div className="app">
      <Header />
      <ProductsProvider>
        <Form />
        <List />
      </ProductsProvider>
    </div>
  );
}

export default App;
