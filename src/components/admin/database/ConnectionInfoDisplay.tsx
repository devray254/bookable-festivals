
interface ConnectionInfoDisplayProps {}

export function ConnectionInfoDisplay({}: ConnectionInfoDisplayProps) {
  return (
    <div>
      <p>Click the button below to test connection to the online MySQL database.</p>
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mt-4 rounded">
        <p className="font-bold">Environment Information:</p>
        <p className="mt-1">This test will check if your Node.js API can properly connect to the MySQL database.</p>
      </div>
    </div>
  );
}
