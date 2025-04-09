
export function FormInfoSection() {
  return (
    <div className="bg-muted p-4 rounded-md mb-4">
      <h3 className="text-sm font-medium mb-2">About the Callback URL</h3>
      <p className="text-xs text-muted-foreground">
        The callback URL must be a publicly accessible HTTPS endpoint. For production use, this should be your domain with the path to the mpesa-callback.php file. For testing, you can use a service like Ngrok to create a temporary public URL for your local environment.
      </p>
    </div>
  );
}
