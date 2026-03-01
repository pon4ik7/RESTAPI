import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function EndpointBanner(): JSX.Element {
  return (
    <Alert>
      <AlertTitle>Backend endpoint not implemented yet.</AlertTitle>
      <AlertDescription>
        This section is using a graceful fallback. Implement the corresponding API endpoint and refresh.
      </AlertDescription>
    </Alert>
  );
}
