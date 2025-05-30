import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from './GameProvider';

const SetupPage = () => {
  const navigate = useNavigate();
  const context = useContext(GameContext);
  if (!context) throw new Error('GameContext missing');
  const { numPlayers, setNumPlayers, undercoverCount } =
    context;

  const goNext = () => {
    navigate('/players');
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Undercover des bebous</h2>
      <label className="block mb-2">Nombre de bebous</label>
      <input
        type="number"
        min={4}
        max={12}
        value={numPlayers}
        onChange={(e) => setNumPlayers(Number(e.target.value))}
        className="w-full border p-2 rounded mb-4"
      />
      <p className="mb-4">Undercovers: {undercoverCount}</p>
      <button
        onClick={() => goNext()}
        className="w-full bg-black text-white p-2 rounded"
      >
        Suivant
      </button>
    </div>
  );
};

export default SetupPage;
