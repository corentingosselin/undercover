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
      <div className="flex gap-1 items-center mb-6">
        <img
          src="/images/logo.png"
          alt="Undercover des bebous"
          className="w-10 h-10"
        />
        <h2 className="text-2xl font-bold">Joueur {index + 1}</h2>
      </div>
      <label className="block mb-2 text-xl">Pseudo</label>
      <input
        type="text"
        placeholder={`Joueur ${index + 1}`}
        className="w-full border p-4 text-xl rounded mb-4"
        value={playerPseudo}
        onChange={(e) => {
          setPlayerPseudo(e.target.value);
        }}
      />

      <button
        onClick={showWord}
        className="w-full bg-black text-white p-4 rounded-lg text-xl font-semibold"
      >
        Afficher mon mot
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p className="text-lg mb-4">
              Votre mot est
            </p>
            <p className="text-2xl font-bold mb-6">{word}</p>
            <button
              onClick={handleNext}
              className="bg-black text-white px-4 py-2 rounded font-bold text-xl"
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
