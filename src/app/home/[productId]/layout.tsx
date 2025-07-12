import { Metadata } from 'next';

interface Props {
  params: { productId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const response = await fetch('https://apigateway.seclob.com/v1/ecard-no/product');
    const data = await response.json();
    const product = data.data.find((p: any) => p._id === params.productId);

    if (product) {
      return {
        title: `${product.title} - Secure App`,
        description: product.description[0] || 'Product details in Secure App',
        openGraph: {
          title: `${product.title} - Secure App`,
          description: product.description[0] || 'Product details in Secure App',
          images: [{
            url: product.images[0]?.filePath,
            width: 800,
            height: 600,
          }],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${product.title} - Secure App`,
          description: product.description[0] || 'Product details in Secure App',
          images: [product.images[0]?.filePath],
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'Product - Secure App',
    description: 'Product details in Secure App',
  };
}

export default function HomeProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}