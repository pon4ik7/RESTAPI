import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function PageError({ message }: { message: string }): JSX.Element {
  return (
    <Alert>
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
