import { useEffect, useState } from 'react';
import axios from '../axios';
import { ProductItem } from '../components/ProductItem';

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

  return (
    <div>
      {products.map((product) => (
        <ProductItem key={product.id} {...product} />
      ))}
    </div>
  );
}

export default HomePage;
