// client/src/utils/puzzleUtils.ts
function countInversions(sequence: number[]): number {
  let inversions = 0;
  for (let i = 0; i < sequence.length - 1; i++) {
    for (let j = i + 1; j < sequence.length; j++) {
      if (sequence[i] > sequence[j]) {
        inversions++;
      }
    }
  }
  return inversions;
}

function seededRandom(seed: number) {
  return function() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function shuffleArray(array: number[], seed?: number): number[] {
  const shuffled = [...array];
  const random = seed !== undefined ? seededRandom(seed) : Math.random;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateSolvablePuzzle(size: number, seed?: number): number[] {
  // Create sequence 1 to n (excluding the empty tile)
  const numbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
  
  let sequence = shuffleArray(numbers, seed);
  
  // If sequence has odd inversions, swap last two numbers to make it even
  if (countInversions(sequence) % 2 !== 0) {
    const lastIndex = sequence.length - 1;
    [sequence[lastIndex], sequence[lastIndex - 1]] = [sequence[lastIndex - 1], sequence[lastIndex]];
  }
  
  return sequence;
}
