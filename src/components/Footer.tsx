export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm">
        <p className="mb-1">
          <strong>DEMONSTRATION SYSTEM ONLY</strong> - Not for clinical use
        </p>
        <p>
          Production system would be HIPAA compliant with encrypted transmission, 
          audit logging, and secure authentication
        </p>
      </div>
    </footer>
  );
}