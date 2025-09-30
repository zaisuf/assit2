import React from 'react';

interface ProductsFormatProps {
  content: string;
  textColor?: string;
}

const ProductsFormat: React.FC<ProductsFormatProps> = ({ content, textColor = 'inherit' }) => {
  const products = content.split('\n\n');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {products.map((product, index) => {
        const [title, ...details] = product.split('\n');
        return (
          <div 
            key={index} 
            className="group relative overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-700/50"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-[100px] transition-opacity duration-300 group-hover:opacity-100 opacity-50" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-[100px] transition-opacity duration-300 group-hover:opacity-100 opacity-50" />
            
            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {title}
              </h3>
              <div className="space-y-3">
                {details.map((detail, i) => {
                  const [label, value] = detail.split(': ');
                  return (
                    <div 
                      key={i} 
                      className="flex flex-col space-y-1 group/item hover:bg-white/5 p-2 rounded-lg transition-colors duration-200"
                    >
                      <span className="text-sm text-blue-400/90 font-medium">{label}</span>
                      <span className="text-base text-gray-300/90">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        );
      })}
    </div>
  );
};

export default ProductsFormat;
