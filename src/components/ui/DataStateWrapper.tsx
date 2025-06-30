
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

interface DataStateWrapperProps {
  loading: boolean;
  error?: string | null;
  data?: any;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: 'search' | 'alert' | 'info';
  emptyActionText?: string;
  onEmptyAction?: () => void;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function DataStateWrapper({
  loading,
  error,
  data,
  emptyTitle = "No data found",
  emptyDescription = "There's no data to display at the moment.",
  emptyIcon = 'info',
  emptyActionText,
  onEmptyAction,
  onRetry,
  children,
  className = ""
}: DataStateWrapperProps) {
  if (loading) {
    return <LoadingSpinner className={`py-12 ${className}`} />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Error"
        description={error}
        action={onRetry ? {
          label: "Try Again",
          onClick: onRetry
        } : undefined}
      />
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
        action={emptyActionText && onEmptyAction ? {
          label: emptyActionText,
          onClick: onEmptyAction
        } : undefined}
      />
    );
  }

  return <>{children}</>;
}
