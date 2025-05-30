import { useContext, useState } from 'react';
import { GameContext } from './GameProvider';

interface PlayerFormProps {
  index: number;
  word: string;
  onNext: () => void;
}

const PlayerForm = ({ index, word, onNext }: PlayerFormProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [playerPseudo, setPlayerPseudo] = useState('');
  const context = useContext(GameContext);
  if (!context) throw new Error('GameContext missing');

  const { setPlayerName } = context;

  const showWord = () => setModalOpen(true);
  const handleNext = () => {
    // set player name
    setPlayerName(index, playerPseudo);

    setModalOpen(false);
    onNext();
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Joueur {index + 1}</h2>
      <label className="block mb-2">Pseudo</label>
      <input
        type="text"
        placeholder={`Joueur ${index + 1}`}
        className="w-full border p-2 rounded mb-4"
        value={playerPseudo}
        onChange={(e) => {
          setPlayerPseudo(e.target.value);
        }}
      />

      <button
        onClick={showWord}
        className="w-full bg-black text-white p-2 rounded font-semibold"
      >
        Afficher mon mot
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p className="text-2xl font-bold mb-6">{word}</p>
            <button
              onClick={handleNext}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Joueur suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerForm;
