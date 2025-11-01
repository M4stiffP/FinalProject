import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById, fetchProductColors, fetchProductSizes } from '../store/slices/productsSlice';
import { createOrder } from '../store/slices/ordersSlice';
import { logout } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store/store';

const ProductDetailPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const { currentProduct, colors, sizes, isLoading, error } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);
  const { isLoading: orderLoading } = useSelector((state: RootState) => state.orders);

  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    if (id) {
      const productId = parseInt(id);
      dispatch(fetchProductById(productId));
      dispatch(fetchProductColors(productId));
      dispatch(fetchProductSizes({ productId }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0]);
    }
  }, [colors, selectedColor]);

  useEffect(() => {
    if (selectedColor && id) {
      dispatch(fetchProductSizes({ 
        productId: parseInt(id), 
        colorId: selectedColor.color_id 
      }));
    }
  }, [selectedColor, id, dispatch]);

  const handleColorChange = (color: any) => {
    setSelectedColor(color);
    setSelectedSize(0);
  };

  const addToCart = () => {
    if (!currentProduct || !selectedColor || !selectedSize) {
      alert('กรุณาเลือกสีและไซส์');
      return;
    }

    // In a real app, you'd want to share this state with ShopPage
    // For now, just show success message
    alert(`เพิ่ม ${currentProduct.brand} ${currentProduct.model} (สี: ${selectedColor.color_name}, ไซส์: ${selectedSize}) จำนวน ${quantity} คู่ ลงตะกร้าแล้ว!`);
  };

  const handleOrderSubmit = async () => {
    if (!currentProduct || !selectedSize) {
      alert('กรุณาเลือกไซส์');
      return;
    }

    const orderData = {
      product_id: currentProduct.product_id,
      quantity,
      unit_price: currentProduct.price,
      size: selectedSize,
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();
      alert('สั่งซื้อสินค้าเรียบร้อยแล้ว!');
      setShowOrderForm(false);
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการสั่งซื้อ');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const availableSizes = sizes.filter(size => 
    selectedColor ? size.color_id === selectedColor.color_id : true
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white text-lg">กำลังโหลดข้อมูลสินค้า...</span>
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">ไม่พบสินค้าที่ต้องการ</p>
          <Link
            to="/shop"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            กลับไปหน้าร้านค้า
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/shop" className="text-2xl font-bold text-white">
              ← กลับไปร้านค้า
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-white">สวัสดี, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
              {selectedColor?.imageUrl ? (
                <img
                  src={selectedColor.imageUrl}
                  alt={`${currentProduct.brand} ${currentProduct.model}`}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.setAttribute('style', 'display: flex');
                  }}
                />
              ) : null}
              <div className="text-gray-400 text-lg">รูปภาพสินค้า</div>
            </div>
            
            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <h3 className="text-white font-semibold mb-3">เลือกสี</h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.color_id}
                      onClick={() => handleColorChange(color)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        selectedColor?.color_id === color.color_id
                          ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {color.color_name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentProduct.brand} {currentProduct.model}
              </h1>
              <p className="text-4xl font-bold text-purple-400 mb-4">
                ฿{currentProduct.price.toLocaleString()}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {currentProduct.description}
              </p>
            </div>

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-white font-semibold mb-3">เลือกไซส์</h3>
                <div className="grid grid-cols-4 gap-3">
                  {availableSizes.map((sizeItem) => {
                    const stock = sizeItem.stock_in - sizeItem.stock_out;
                    const isAvailable = stock > 0;
                    
                    return (
                      <button
                        key={sizeItem._id}
                        onClick={() => setSelectedSize(sizeItem.size)}
                        disabled={!isAvailable}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedSize === sizeItem.size
                            ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                            : isAvailable
                            ? 'border-white/20 bg-white/5 text-gray-300 hover:border-purple-400'
                            : 'border-red-500/30 bg-red-500/10 text-red-400 cursor-not-allowed'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-semibold">{sizeItem.size}</div>
                          <div className="text-xs">
                            {isAvailable ? `คงเหลือ ${stock}` : 'หมด'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">สั่งซื้อสินค้า</h3>
              
              {!showOrderForm ? (
                <div className="space-y-3">
                  <button
                    onClick={addToCart}
                    disabled={!selectedSize}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
                  >
                    {selectedSize ? 'เพิ่มในตะกร้า' : 'กรุณาเลือกไซส์'}
                  </button>
                  <button
                    onClick={() => setShowOrderForm(true)}
                    disabled={!selectedSize}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
                  >
                    {selectedSize ? 'สั่งซื้อทันที' : 'กรุณาเลือกไซส์'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      จำนวน
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-300">รวมทั้งหมด:</span>
                      <span className="text-2xl font-bold text-purple-400">
                        ฿{(currentProduct.price * quantity).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowOrderForm(false)}
                        className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        ยกเลิก
                      </button>
                      <button
                        onClick={handleOrderSubmit}
                        disabled={orderLoading}
                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
                      >
                        {orderLoading ? 'กำลังสั่งซื้อ...' : 'ยืนยันการสั่งซื้อ'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;