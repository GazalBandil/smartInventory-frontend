const LowstockCard = ({ product }) => {
    return (
      <div className="bg-red-100 p-4 rounded-lg w-[50%] shadow-md border border-red-400">
        <h3 className="text-lg font-bold text-red-700">{product.productName}</h3>
        <p className="text-gray-700">Product Quantity: {product.quantity}</p>
        <p className="text-red-600 font-semibold">⚠️ {product.message}</p>
      </div>
    );
  };
  
  export default LowstockCard;