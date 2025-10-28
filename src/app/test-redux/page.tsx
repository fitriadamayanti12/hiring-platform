'use client';
import { useSelector } from 'react-redux';

export default function TestRedux() {
  const jobs = useSelector((state: any) => state.jobs);
  const candidates = useSelector((state: any) => state.candidates);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Redux Store Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Jobs State</h2>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(jobs, null, 2)}
            </pre>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Candidates State</h2>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(candidates, null, 2)}
            </pre>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-green-600 font-medium">
            ✅ Jika Anda melihat state di atas, Redux berhasil terintegrasi!
          </p>
        </div>
      </div>
    </div>
  );
}