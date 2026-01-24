export type CalculationMode = 'gram' | 'count';

export interface ProductItem {
    id: string;
    name: string;
    mode: CalculationMode;

    // Common
    price: number;
    totalCalories: number; // calculated total kcal
    efficiency: number; // kcal per yen
    createdAt: number;

    // Gram Mode specific
    calories?: number; // Raw input (e.g. 18kcal)
    referenceWeight?: number; // e.g. 100g or 4.5g
    totalWeight?: number; // e.g. 90g

    // Count Mode specific
    caloriesPerPiece?: number; // e.g. 250kcal
    count?: number; // e.g. 4 pieces
}
