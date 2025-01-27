// client/src/App.tsx
import SlidingPuzzle from './components/SlidingPuzzle';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Sliding Puzzle</h1>
      <SlidingPuzzle />
    </div>
  );
}
