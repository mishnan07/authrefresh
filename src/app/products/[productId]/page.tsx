'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

interface Product {
  _id: string;
  unique_id: string;
  title: string;
  description: string[];
  images: { filePath: string }[];
  price: {
    actualPrice: number;
    sellingPrice: number;
    dealerPrice: number;
  };
  subSegmentId: {
    title: string;
  };
}

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);
  const params = useParams();

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get('https://apigateway.seclob.com/v1/ecard-no/product');
        const products = response.data.data;
        const foundProduct = products.find((p: Product) => p._id === params.productId);
        setProduct(foundProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [params.productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/products" className="text-blue-600 hover:text-blue-800">
            ← Back to Products
          </Link>
          <button
            onClick={copyLink}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
          >
            {copied ? '✓ Copied!' : '📋 Copy Link'}
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={product.images[0]?.filePath}
                alt={product.title}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {product.subSegmentId.title}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <ul className="space-y-2">
                  {product.description.map((desc, index) => (
                    <li key={index} className="text-gray-600 flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-green-600">
                    ${product.price.sellingPrice}
                  </span>
                  {product.price.actualPrice > product.price.sellingPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ${product.price.actualPrice}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">Product ID: {product.unique_id}</p>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}