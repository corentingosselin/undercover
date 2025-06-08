import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from './GameProvider';

const difficulties = ['facile', 'moyen', 'hard'];

const SetupPage = () => {
  const navigate = useNavigate();
  const context = useContext(GameContext);
  if (!context) throw new Error('GameContext missing');
  const {
    numPlayers,
    setNumPlayers,
    undercoverCount,
    setDifficulty,
    difficulty,
  } = context;

  const [inputValue, setInputValue] = useState(numPlayers.toString());

  useEffect(() => {
    // Sync input if context updates (e.g. on back navigation)
    setInputValue(numPlayers.toString());
  }, [numPlayers]);

  const clampPlayers = (value: number) => {
    if (value < 4) return 4;
    if (value > 12) return 12;
    return value;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setInputValue(raw);
  };

  const handleInputBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) {
      setNumPlayers(clampPlayers(parsed));
      setInputValue(clampPlayers(parsed).toString());
    } else {
      setNumPlayers(4);
      setInputValue('4');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg">
      <div className="text-center mb-6">
        <img
          src="/images/logo.png"
          alt="Undercover des bebous"
          className="w-9 mx-auto"
        />
        <h2 className="text-2xl font-bold">Undercover des bebous</h2>
      </div>

      <label className="block text-xl mb-2">Nombre de bebous</label>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className="w-full border p-4 rounded mb-4 appearance-none"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
      />

      <p className="mb-4 bg-gray-100 rounded px-2 py-3 text-gray-500 text-xl">
        Undercovers: {undercoverCount}
      </p>

      <label className="block mb-2 text-xl">Difficulté</label>
      <div className="relative mb-4">
        <select
          className="w-full appearance-none border p-4 rounded text-xl pr-10"
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value as 'facile' | 'moyen' | 'hard')
          }
        >
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </option>
          ))}
        </select>
        {/* Down arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <button
        onClick={() => navigate('/players')}
        className="w-full bg-black text-white p-4 rounded-lg text-xl"
      >
        Suivant
      </button>
    </div>
  );
};

export default SetupPage;
