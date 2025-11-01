import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchProductColors, fetchProductSizes } from '../store/slices/productsSlice';
import { addToCart, processCheckout, resetCheckoutStatus, removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { logout } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store/store';

const ShopPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: cartItems, checkoutStatus } = useSelector((state: RootState) => state.cart);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productColors, setProductColors] = useState<{ [key: number]: any[] }>({});
  const [productSizes, setProductSizes] = useState<{ [key: number]: any[] }>({});
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: any }>({});
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: number }>({});
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  // Load colors and sizes for all products
  useEffect(() => {
    products.forEach(async (product) => {
      try {
        const colorsResponse = await dispatch(fetchProductColors(product.product_id));
        const sizesResponse = await dispatch(fetchProductSizes({ productId: product.product_id }));
        
        if (colorsResponse.payload) {
          setProductColors(prev => ({
            ...prev,
            [product.product_id]: colorsResponse.payload
          }));
          
          if (colorsResponse.payload.length > 0) {
            setSelectedColors(prev => ({
              ...prev,
              [product.product_id]: colorsResponse.payload[0]
            }));
          }
        }

        if (sizesResponse.payload) {
          setProductSizes(prev => ({
            ...prev,
            [product.product_id]: sizesResponse.payload
          }));
        }
      } catch (error) {
        console.error('Error loading product data:', error);
      }
    });
  }, [products, dispatch]);

  // Reload products and sizes after successful checkout
  useEffect(() => {
    if (checkoutStatus === 'success') {
      // Reload products to get updated stock
      dispatch(fetchProducts({}));
      
      // Reload sizes for all products to reflect updated stock
      products.forEach(async (product) => {
        try {
          const sizesResponse = await dispatch(fetchProductSizes({ productId: product.product_id }));
          if (sizesResponse.payload) {
            setProductSizes(prev => ({
              ...prev,
              [product.product_id]: sizesResponse.payload
            }));
          }
        } catch (error) {
          console.error('Error reloading sizes after checkout:', error);
        }
      });

      // Close cart modal
      setIsCartOpen(false);
      
      // Reset checkout status after showing success message
      setTimeout(() => {
        dispatch(resetCheckoutStatus());
      }, 3000);
    }
  }, [checkoutStatus, dispatch, products]);

  const handleAddToCart = (product: any) => {
    const selectedColor = selectedColors[product.product_id];
    const selectedSize = selectedSizes[product.product_id];
    const quantity = quantities[product.product_id] || 1;

    if (!selectedColor || !selectedSize) {
      alert('กรุณาเลือกสีและไซส์');
      return;
    }

    const cartItem = {
      color_id: selectedColor.color_id,
      size: selectedSize.toString(),
      quantity,
      price: product.price,
      brand: product.brand,
      model: product.model,
      color_name: selectedColor.color_name
    };

    dispatch(addToCart(cartItem));
    alert('เพิ่มสินค้าในตะกร้าแล้ว!');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('ตะกร้าสินค้าว่างเปล่า');
      return;
    }
    
    const totalPrice = getTotalPrice();
    const totalItems = getTotalItems();
    
    const confirmCheckout = window.confirm(
      `ยืนยันการสั่งซื้อ\n` +
      `จำนวนสินค้า: ${totalItems} ชิ้น\n` +
      `ยอดรวม: ฿${totalPrice.toLocaleString()}\n\n` +
      `เมื่อกดยืนยัน ข้อมูลการสั่งซื้อจะถูกบันทึกลงฐานข้อมูลและตะกร้าสินค้าจะถูกเคลียร์`
    );
    
    if (confirmCheckout) {
      dispatch(processCheckout());
    }
  };

  const handleRemoveFromCart = (item: any) => {
    const confirmDelete = window.confirm(
      `ต้องการลบ ${item.brand} ${item.model} (สี: ${item.color_name}, ไซส์: ${item.size}) ออกจากตะกร้าหรือไม่?`
    );
    
    if (confirmDelete) {
      dispatch(removeFromCart({
        color_id: item.color_id,
        size: item.size
      }));
    }
  };

  const handleUpdateQuantity = (item: any, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(item);
    } else {
      dispatch(updateQuantity({
        color_id: item.color_id,
        size: item.size,
        quantity: newQuantity
      }));
    }
  };

  const handleColorChange = (productId: number, color: any) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: color
    }));
    
    // Reload sizes for the selected color
    dispatch(fetchProductSizes({ productId, colorId: color.color_id }))
      .then((sizesResponse) => {
        if (sizesResponse.payload) {
          setProductSizes(prev => ({
            ...prev,
            [productId]: sizesResponse.payload
          }));
        }
      });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-purple-400">
            Urban Kicks Shop
          </Link>
          
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-purple-300">สวัสดี, {user.name}</span>
            )}
            
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center"
            >
              🛒 ตะกร้า
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {getTotalItems()}
                </span>
              )}
            </button>
            
            <button
              onClick={() => dispatch(logout())}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">รองเท้าทั้งหมด</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const colors = productColors[product.product_id] || [];
            const sizes = productSizes[product.product_id] || [];
            const selectedColor = selectedColors[product.product_id];
            const selectedSize = selectedSizes[product.product_id];
            const quantity = quantities[product.product_id] || 1;

            return (
              <div
                key={product.product_id}
                className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors"
              >
                {/* Product Image */}
                {selectedColor?.imageUrl && (
                  <img
                    src={selectedColor.imageUrl}
                    alt={`${product.brand} ${product.model}`}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}

                {/* Product Info */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {product.brand} {product.model}
                </h3>
                <p className="text-2xl font-bold text-purple-400 mb-4">
                  ฿{product.price.toLocaleString()}
                </p>

                {/* Color Selection */}
                {colors.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      สี: {selectedColor?.color_name || 'เลือกสี'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.color_id}
                          onClick={() => handleColorChange(product.product_id, color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            selectedColor?.color_id === color.color_id 
                              ? 'border-white ring-2 ring-purple-500' 
                              : 'border-gray-400 hover:border-white'
                          }`}
                          style={{ backgroundColor: color.colortag }}
                          title={color.color_name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {sizes.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      ไซส์
                    </label>
                    <select
                      value={selectedSize || ''}
                      onChange={(e) => setSelectedSizes(prev => ({
                        ...prev,
                        [product.product_id]: Number(e.target.value)
                      }))}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="">เลือกไซส์</option>
                      {sizes.map((size) => (
                        <option 
                          key={size._id} 
                          value={size.size}
                          className="bg-gray-800"
                        >
                          {size.size} (คงเหลือ: {size.stock_in})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    จำนวน
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantities(prev => ({
                      ...prev,
                      [product.product_id]: Number(e.target.value)
                    }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">ตะกร้าสินค้า</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-gray-400 text-center py-8">ตะกร้าสินค้าว่างเปล่า</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={`${item.color_id}-${item.size}`} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.brand} {item.model}</h4>
                          <p className="text-sm text-gray-400">สี: {item.color_name}</p>
                          <p className="text-sm text-gray-400">ไซส์: {item.size}</p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center mt-2 space-x-2">
                            <span className="text-sm text-gray-400">จำนวน:</span>
                            <button
                              onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                              className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded flex items-center justify-center"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="mx-2 min-w-[2rem] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                              className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <button
                            onClick={() => handleRemoveFromCart(item)}
                            className="text-red-400 hover:text-red-300 mb-2 text-sm"
                            title="ลบสินค้า"
                          >
                            🗑️ ลบ
                          </button>
                          <p className="font-bold text-purple-400">
                            ฿{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            ฿{item.price.toLocaleString()} x {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-4">
                  {/* Summary */}
                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">จำนวนสินค้า:</span>
                      <span className="text-white">{getTotalItems()} ชิ้น</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">ยอดรวม:</span>
                      <span className="text-xl font-bold text-purple-400">
                        ฿{getTotalPrice().toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      * ข้อมูลการสั่งซื้อจะถูกบันทึกลงฐานข้อมูล
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={checkoutStatus === 'pending'}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    {checkoutStatus === 'pending' ? 'กำลังดำเนินการ...' : 'สั่งซื้อ'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Success Message */}
      {checkoutStatus === 'success' && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg z-50 shadow-lg">
          <div className="flex items-center space-x-2">
            <span>✅</span>
            <div>
              <p className="font-semibold">สั่งซื้อสำเร็จ!</p>
              <p className="text-sm">ตะกร้าสินค้าถูกเคลียร์แล้ว</p>
              <p className="text-xs">ข้อมูลการสั่งซื้อถูกบันทึกลงฐานข้อมูลแล้ว</p>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Error Message */}
      {checkoutStatus === 'failed' && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg z-50 shadow-lg">
          <div className="flex items-center space-x-2">
            <span>❌</span>
            <div>
              <p className="font-semibold">การสั่งซื้อล้มเหลว</p>
              <p className="text-sm">กรุณาลองใหม่อีกครั้ง</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;