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

function shuffleArray(array: number[]): number[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateSolvablePuzzle(size: number): number[] {
  // Create sequence 1 to n (excluding the empty tile)
  const numbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
  
  let sequence: number[];
  do {
    sequence = shuffleArray(numbers);
  } while (countInversions(sequence) % 2 !== 0); // For 5x5, need even inversions
  
  return sequence;
}
