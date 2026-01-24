import styles from './ComparisonList.module.css';
import type { ProductItem } from '../types';

interface ComparisonListProps {
    items: ProductItem[];
    onDelete: (id: string) => void;
}

export function ComparisonList({ items, onDelete }: ComparisonListProps) {
    if (items.length === 0) {
        return null;
    }

    const maxEfficiency = Math.max(...items.map((i) => i.efficiency));

    return (
        <div className={styles.container}>
            <div className={styles.list}>
                {items.map((item) => {
                    const isBest = item.efficiency === maxEfficiency && items.length > 1;

                    return (
                        <div
                            key={item.id}
                            className={`${styles.item} ${isBest ? styles.bestItem : ''} card-panel`}
                        >
                            {isBest && <div className={styles.ribbon}><span>Best!</span></div>}

                            <div className={styles.content}>
                                <div className={styles.header}>
                                    <span className={styles.itemName}>{item.name}</span>
                                    <div className={styles.efficiencyBadge}>
                                        <span className={styles.efficiencyValue}>
                                            {item.efficiency.toFixed(2)}
                                        </span>
                                        <span className={styles.unit}>kcal/円</span>
                                    </div>
                                </div>

                                <div className={styles.details}>
                                    <div className={styles.detailRow}>
                                        <span className={styles.detailLabel}>価格</span>
                                        <span className={styles.detailValue}>¥{item.price}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span className={styles.detailLabel}>総カロリー</span>
                                        <span className={styles.detailValue}>{Math.round(item.totalCalories)}kcal</span>
                                    </div>

                                    {item.mode === 'gram' && (
                                        <div className={styles.subDetails}>
                                            ({item.calories}kcal/{item.referenceWeight}g × {item.totalWeight}g)
                                        </div>
                                    )}
                                    {item.mode === 'count' && (
                                        <div className={styles.subDetails}>
                                            ({item.caloriesPerPiece}kcal × {item.count}個)
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => onDelete(item.id)}
                                className={styles.deleteButton}
                                aria-label="Delete item"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
