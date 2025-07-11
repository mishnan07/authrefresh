import { Metadata } from 'next';
import axios from 'axios';

interface Props {
  params: { productId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const response = await axios.get('https://apigateway.seclob.com/v1/ecard-no/product');
    const products = response.data.data;
    const product = products.find((p: any) => p._id === params.productId);

    if (product) {
      return {
        title: `${product.title} - Product Details`,
        description: product.description[0] || 'Product details',
        openGraph: {
          title: `${product.title} - Product Details`,
          description: product.description[0] || 'Product details',
          images: [product.images[0]?.filePath],
          type: 'website',
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'Product Details',
    description: 'Product details page',
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}