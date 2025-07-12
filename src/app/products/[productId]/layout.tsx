import { Metadata } from 'next';

interface Props {
  params: { productId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const response = await fetch(`/v1/d-card-no/noauth/product?id=${params.productId}`);
    const data = await response.json();
    const product = data.data

    if (product) {
      return {
        title: `${product.name} - Product Details`,
        description: product.description || 'Product details',
        openGraph: {
          title: `${product.name} - Product Details`,
          description: product.description || 'Product details',
          images: [{
            url: product.images[0]?.filePath,
            width: 800,
            height: 600,
          }],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${product.name} - Product Details`,
          description: product.description || 'Product details',
          images: [product.images[0]?.filePath],
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