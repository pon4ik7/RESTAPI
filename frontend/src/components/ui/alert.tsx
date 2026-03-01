import * as React from 'react';

import { cn } from '@/lib/utils/cn';

function Alert({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return <div className={cn('relative w-full rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm', className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>): JSX.Element {
  return <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>): JSX.Element {
  return <div className={cn('text-sm text-foreground/80', className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle };
