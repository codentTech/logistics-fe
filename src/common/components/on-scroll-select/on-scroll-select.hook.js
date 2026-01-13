import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllProduct } from '@/provider/features/product/product.slice';

export default function useOnScrollSelect() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;
  const pageRef = useRef(1); // Use a ref to keep track of the page

  const containerRef = useRef(null);

  const loadMoreProducts = () => {
    if (!isLoading) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (scrollHeight - scrollTop === clientHeight) {
        // User has scrolled to the bottom, load more products
        setIsLoading(true);

        // Increment the page and calculate the next page
        pageRef.current++;
        const nextPage = pageRef.current;

        setTimeout(async () => {
          const response = await dispatch(
            getAllProduct({
              payload: {
                page: nextPage,
                pageSize,
                sortColumn: 'id',
                sortOrder: 'DESC',
                condition: ''
              }
            })
          );

          const newProducts = response?.payload?.data;

          if (newProducts.length > 0) {
            setProducts((prevProducts) => [...prevProducts, ...newProducts]);
          }

          setIsLoading(false);
        }, 1000); // Simulated loading delay
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', loadMoreProducts);
    return () => {
      window.removeEventListener('scroll', loadMoreProducts);
    };
  }, []);

  useEffect(() => {
    const newOptions = products.map((product) => ({
      value: product.id,
      label: product.productName
    }));
    setOptions(newOptions);
  }, [products]);

  return { containerRef, options, isLoading };
}
