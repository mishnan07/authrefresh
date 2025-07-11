import { Metadata } from 'next';
import axios from 'axios';

interface Props {
  params: { userId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const response = await axios.get(`http://localhost:5000/api/users/${params.userId}`);
    const user = response.data.user;

    return {
      title: `${user.name} - User Profile`,
      description: `View ${user.name}'s profile details`,
      openGraph: {
        title: `${user.name} - User Profile`,
        description: `View ${user.name}'s profile details`,
        images: [user.profilePic],
        type: 'profile',
      },
    };
  } catch (error) {
    return {
      title: 'User Profile',
      description: 'User profile page',
    };
  }
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}