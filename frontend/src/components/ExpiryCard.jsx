
const ExpiryProductCard = ({ product }) => {
    return (
      <div className="bg-red-100 p-4 w-[50%] rounded-lg shadow-md border border-red-400">
        <h3 className="text-lg font-bold text-red-700">{product.productName}</h3>
        <p className="text-gray-700">Expiry Date: {product.expiryDate}</p>
        <p className="text-red-600 font-semibold">⚠️ {product.alertMessage}</p>
      </div>
    );
  };
  
  export default ExpiryProductCard;
  