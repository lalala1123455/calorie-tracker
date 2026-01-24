import React, { useState, useEffect } from 'react';
import styles from './Calculator.module.css';
import type { CalculationMode } from '../types';

interface CalculatorProps {
    onAdd: (
        mode: CalculationMode,
        price: number,
        // Gram
        calories?: number,
        refWeight?: number,
        totalWeight?: number,
        // Count
        kcalPerPiece?: number,
        count?: number
    ) => void;
}

export function Calculator({ onAdd }: CalculatorProps) {
    const [mode, setMode] = useState<CalculationMode>('gram');

    // Gram inputs
    const [calories, setCalories] = useState('');
    const [refWeight, setRefWeight] = useState('100'); // Default 100g
    const [totalWeight, setTotalWeight] = useState('');

    // Count inputs
    const [kcalPerPiece, setKcalPerPiece] = useState('');
    const [count, setCount] = useState('');

    // Common
    const [price, setPrice] = useState('');
    const [result, setResult] = useState<number | null>(null);

    useEffect(() => {
        const p = parseFloat(price);
        if (isNaN(p) || p <= 0) {
            setResult(null);
            return;
        }

        if (mode === 'gram') {
            const c = parseFloat(calories);
            const r = parseFloat(refWeight);
            const t = parseFloat(totalWeight);
            if (!isNaN(c) && !isNaN(r) && !isNaN(t) && r > 0) {
                // (cal / ref) * total / price
                const totalCal = (c / r) * t;
                setResult(totalCal / p);
            } else {
                setResult(null);
            }
        } else {
            const k = parseFloat(kcalPerPiece);
            const n = parseFloat(count);
            if (!isNaN(k) && !isNaN(n)) {
                // (perPiece * count) / price
                const totalCal = k * n;
                setResult(totalCal / p);
            } else {
                setResult(null);
            }
        }
    }, [mode, calories, refWeight, totalWeight, kcalPerPiece, count, price]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (result !== null) {
            onAdd(
                mode,
                parseFloat(price),
                mode === 'gram' ? parseFloat(calories) : undefined,
                mode === 'gram' ? parseFloat(refWeight) : undefined,
                mode === 'gram' ? parseFloat(totalWeight) : undefined,
                mode === 'count' ? parseFloat(kcalPerPiece) : undefined,
                mode === 'count' ? parseFloat(count) : undefined
            );
            // Reset logic: keep mode, maybe clear price/specifics
            setPrice('');
            if (mode === 'gram') {
                // Keep refWeight usually
                setCalories('');
                setTotalWeight('');
            } else {
                setKcalPerPiece('');
                setCount('');
            }
        }
    };

    return (
        <div className={`card-panel ${styles.container}`}>
            {/* Mode Switcher */}
            <div className={styles.switcher}>
                <button
                    type="button"
                    className={`${styles.switchBtn} ${mode === 'gram' ? styles.active : ''}`}
                    onClick={() => setMode('gram')}
                >
                    グラム (g)
                </button>
                <button
                    type="button"
                    className={`${styles.switchBtn} ${mode === 'count' ? styles.active : ''}`}
                    onClick={() => setMode('count')}
                >
                    個数 (個)
                </button>
            </div>

            {/* Result Display */}
            <div className={styles.resultArea}>
                <div className={styles.resultValue}>
                    {result !== null ? result.toFixed(2) : '--.--'}
                    <span className={styles.unit}>kcal/円</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {mode === 'gram' ? (
                    <div className={`${styles.modeGroup} ${styles.fadeIn}`}>
                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>カロリー</label>
                                <input
                                    type="number" inputMode="decimal"
                                    value={calories} onChange={(e) => setCalories(e.target.value)}
                                    placeholder="例: 18" required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>基準量 (g)</label>
                                <input
                                    type="number" inputMode="decimal"
                                    value={refWeight} onChange={(e) => setRefWeight(e.target.value)}
                                    placeholder="100" required
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>内容総量 (g)</label>
                            <input
                                type="number" inputMode="decimal"
                                value={totalWeight} onChange={(e) => setTotalWeight(e.target.value)}
                                placeholder="例: 90" required
                            />
                        </div>
                    </div>
                ) : (
                    <div className={`${styles.modeGroup} ${styles.fadeIn}`}>
                        <div className={styles.inputGroup}>
                            <label>1個のカロリー</label>
                            <input
                                type="number" inputMode="decimal"
                                value={kcalPerPiece} onChange={(e) => setKcalPerPiece(e.target.value)}
                                placeholder="例: 250" required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>入り個数</label>
                            <input
                                type="number" inputMode="decimal"
                                value={count} onChange={(e) => setCount(e.target.value)}
                                placeholder="例: 4" required
                            />
                        </div>
                    </div>
                )}

                {/* Price - Common */}
                <div className={styles.inputGroup}>
                    <label>価格 (円)</label>
                    <input
                        type="number" inputMode="decimal"
                        value={price} onChange={(e) => setPrice(e.target.value)}
                        placeholder="例: 100" required
                    />
                </div>

                <button type="submit" className={styles.addButton} disabled={result === null}>
                    <span>✨ 計算する</span>
                </button>
            </form>
        </div>
    );
}
