import { useState, useEffect } from 'react';
import type { ProductItem, CalculationMode } from '../types';

const STORAGE_KEY = 'calorie_efficiency_history_v2'; // Bumped version to reset history

export function useHistory() {
    const [history, setHistory] = useState<ProductItem[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load history', e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }, [history]);

    const addItem = (
        mode: CalculationMode,
        price: number,
        inputName: string,
        // Gram Mode Args
        calories?: number,
        referenceWeight?: number, // default 100
        totalWeight?: number,
        // Count Mode Args
        caloriesPerPiece?: number,
        count?: number
    ) => {
        if (price <= 0) return;

        let totalCalories = 0;
        let name = inputName.trim() || '商品名なし';
        const suffix = inputName.trim() ? '' : (mode === 'gram' ? ' (Gram)' : ' (Count)');

        // Auto-generate name based on mode if empty
        if (mode === 'gram') {
            // Calculation: (kcal / refWeight) * totalWeight
            if (!calories || !referenceWeight || !totalWeight) return;
            totalCalories = (calories / referenceWeight) * totalWeight;
            if (!inputName.trim()) name += suffix;
        } else {
            // Calculation: kcalPerPiece * count
            if (!caloriesPerPiece || !count) return;
            totalCalories = caloriesPerPiece * count;
            if (!inputName.trim()) name += suffix;
        }

        const efficiency = totalCalories / price;

        const newItem: ProductItem = {
            id: crypto.randomUUID(),
            name,
            mode,
            price,
            totalCalories,
            efficiency,
            createdAt: Date.now(),
            // Optional fields depending on mode
            ...(mode === 'gram' ? { calories, referenceWeight, totalWeight } : {}),
            ...(mode === 'count' ? { caloriesPerPiece, count } : {})
        };

        setHistory((prev) => [newItem, ...prev]);
    };

    const clearHistory = () => {
        setHistory([]);
    };

    const deleteItem = (id: string) => {
        setHistory((prev) => prev.filter((item) => item.id !== id));
    };

    return { history, addItem, clearHistory, deleteItem };
}
