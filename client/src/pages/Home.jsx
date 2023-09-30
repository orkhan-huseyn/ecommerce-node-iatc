import { useEffect, useState } from 'react';
import axios from '../axios';

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/products').then((response) => {
      setProducts(response.data.products);
    });

    return () => {
      // cancel request
    };
  }, []);

  return <h1>{JSON.stringify(products)}</h1>;
}

export default HomePage;
