import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { AlertCircle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardContent className="py-12 text-center">
          <AlertCircle className="size-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
