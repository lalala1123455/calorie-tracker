import { Calculator } from './components/Calculator';
import { ComparisonList } from './components/ComparisonList';
import { useHistory } from './hooks/useHistory';

function App() {
  const { history, addItem, deleteItem } = useHistory();

  return (
    <div className="app-container">
      <header style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{
          color: 'var(--primary-dark)',
          fontSize: '1.5rem',
          fontWeight: 800,
          textShadow: '2px 2px 0px #fff'
        }}>
          カロリーコスパ比較
        </h1>
      </header>
      <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Calculator onAdd={addItem} />
        <ComparisonList items={history} onDelete={deleteItem} />
      </main>
    </div>
  );
}

export default App;
