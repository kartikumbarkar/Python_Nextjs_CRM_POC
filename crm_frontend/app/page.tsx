import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to CRM System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A powerful multi-tenant CRM solution connected to your FastAPI backend.
          </p>
          <div className="space-x-4">
            <Link href="/login">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
                Sign In
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition">
                Get Started
              </button>
            </Link>
          </div>
          
          <div className="mt-12 p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Backend Connected</h2>
            <div className="space-y-2 text-left">
              <p className="text-green-600">✅ FastAPI Backend Ready</p>
              <p className="text-green-600">✅ PostgreSQL Database</p>
              <p className="text-green-600">✅ Multi-tenant Architecture</p>
              <p className="text-blue-600">🔵 Next.js Frontend Running</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}