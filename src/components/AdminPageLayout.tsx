import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Home } from 'lucide-react';

interface AdminPageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  title,
  description,
  children,
  showBackButton = true
}) => {
  const location = useLocation();

  const getBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Admin', path: '/admin' }
    ];

    if (pathSegments.length > 2) {
      const currentPage = pathSegments[2];
      const pageNames: Record<string, string> = {
        users: 'Usuários',
        finance: 'Financeiro',
        analytics: 'Analytics',
        settings: 'Configurações',
        teachers: 'Professores'
      };
      breadcrumbs.push({
        label: pageNames[currentPage] || currentPage,
        path: location.pathname
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Home className="h-4 w-4" />
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {index > 0 && <span>/</span>}
            <Link
              to={crumb.path}
              className="hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          </React.Fragment>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>

        {showBackButton && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar ao Admin
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default AdminPageLayout;