

const API_BASE_URL ='http://127.0.0.1:3000';


export const apiRoutes = {
  REMOVE_CART_ITEM: (productId:string) => `${API_BASE_URL}/cart/${productId}` 
}

export const apiStatus = {
  SUCCESS: 'success',
  ERROR: 'error',
  FAIL: 'fail',
}