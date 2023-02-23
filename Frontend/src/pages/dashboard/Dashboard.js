import React, { useEffect } from 'react'
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsLoggedIn } from '../../redux/features/auth/authSlice'
import { getProducts } from '../../redux/features/product/productSlice'
import ProductList from '../../components/product/productList/ProductList'

const Dashboard = () => {
  useRedirectLoggedOutUser("/login")
  
  const dispatch = useDispatch()

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const {products, isLoading, isError, message} = useSelector((state) => state.product)

  useEffect(() => {
    
    if(isLoggedIn === true) {
      dispatch(getProducts())
    }
    // console.log(products)

    if(isError) {
      console.log(message)
    }

  },[isLoggedIn, isError, message, dispatch])

  return (
    <div>
        <h2>Dashboard</h2>
        <ProductList products={products} isLoading={isLoading}/>
    </div>
  )
}

export default Dashboard