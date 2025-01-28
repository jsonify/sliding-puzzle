// src/data/predefinedPuzzles.ts

export interface PredefinedPuzzle {
    id: string;
    name: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description?: string;
    pattern: number[][];
  }
  
  export const predefinedPuzzles: PredefinedPuzzle[] = [
    {
      id: 'l-and-l',
      name: 'L and L',
      category: 'Shapes',
      difficulty: 'Medium',
      description: 'Two L-shaped patterns interlock',
      pattern: [
        [1, 1, 2, 2, 2],
        [1, 3, 2, 4, 4],
        [1, 3, 0, 4, 5],
        [3, 3, 6, 4, 5],
        [3, 6, 6, 5, 5]
      ]
    },
    {
      id: 'stripes',
      name: 'Stripes',
      category: 'Patterns',
      difficulty: 'Easy',
      description: 'Horizontal striped pattern',
      pattern: [
        [1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2],
        [3, 3, 0, 3, 3],
        [4, 4, 4, 4, 4],
        [5, 5, 5, 5, 5]
      ]
    },
    {
      id: 'cross',
      name: 'Cross',
      category: 'Shapes',
      difficulty: 'Hard',
      description: 'A cross pattern with contrasting colors',
      pattern: [
        [1, 1, 2, 1, 1],
        [1, 1, 2, 1, 1],
        [2, 2, 0, 2, 2],
        [3, 3, 2, 3, 3],
        [3, 3, 2, 3, 3]
      ]
    }
  ];