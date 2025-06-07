// src/components/Game.tsx
import {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  FC,
} from 'react';
import { GameContext, shuffleArray } from './GameProvider';
import { useNavigate } from 'react-router-dom';

type ModalPlayer = {
  name: string;
  role: string;
};

type Player = {
  id: number;
  name: string;
  role: 'civil' | 'undercover';
  word: string;
};

const PlayerCard = ({
  player,
  order,
  isKilled,
  isVoting,
  isCurrentTurn,
  onEliminate,
  isSetupNextGame,
  handleNextWordDisplay,
  currentWordDisplayIndex,
  totalPlayers,
}: {
  player: Player;
  order: number;
  isKilled: boolean;
  isVoting: boolean;
  isCurrentTurn: boolean;
  onEliminate: (id: number) => void;
  isSetupNextGame?: boolean;
  handleNextWordDisplay?: () => void;
  currentWordDisplayIndex: number;
  totalPlayers: number;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const displayName = player.name || `Joueur ${player.id + 1}`;
  const displayRole =
    player.role.charAt(0).toUpperCase() + player.role.slice(1);

  const SetupGameStatus = () => {
    if (!isSetupNextGame || currentWordDisplayIndex === undefined) {
      return null;
    }

    // if order after index
    if (currentWordDisplayIndex < order - 1) {
      return <p className="text-xs text-gray-500 mt-2">En attente</p>;
    }

    if (currentWordDisplayIndex > order - 1) {
      return <p className="text-xs text-gray-500 mt-2">Mot déjà vu</p>;
    }

    return (
      <p
        className="text-xs text-black mt-2 border border-black px-2 py-1 rounded cursor-pointer"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Voir mon mot
      </p>
    );
  };

  const isLastPlayer =  isSetupNextGame && order === totalPlayers;

  return (
    <>
      <div
        onClick={() => onEliminate(player.id)}
        className={`
        relative p-4 border rounded-lg cursor-pointer transition
        ${isVoting ? 'border-black' : 'border-gray-300'}
      `}
      >
        {/* Order badge */}
        {!isKilled && (
          <div
            className={`
              absolute top-2 right-2 rounded-full flex items-center justify-center text-[10px] font-semibold
              ${
                (isCurrentTurn && !isSetupNextGame) ||
                (isSetupNextGame && currentWordDisplayIndex === order - 1)
                  ? 'bg-red-500 text-white'
                  : 'bg-black text-white'
              }
            `}
            style={{ width: '1.5rem', height: '1.5rem' }}
          >
            {order}
          </div>
        )}

        {/* Player name and role */}
        <div className="flex flex-col items-start">
          {/* only this wrapper fades */}
          <div className={`transition ${isKilled ? 'opacity-50' : ''}`}>
            <p className={`font-semibold ${isKilled ? 'line-through' : ''}`}>
              {displayName}
            </p>

            {isVoting && !isKilled && (
              <p className="text-xs text-black mt-2 border border-black px-2 py-1 rounded">
                Éliminer ce joueur
              </p>
            )}

            <SetupGameStatus />
          </div>

          {/* role badge stays fully opaque, right under the name */}
          {isKilled && (
            <span
              className={`
              mt-2 px-2 py-1 rounded text-xs
              ${
                player.role === 'undercover'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-600'
              }
            `}
            >
              {displayRole}
            </span>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p className="text-2xl font-bold mb-6">{player.word}</p>
            <button
              onClick={() => {
                setIsModalOpen(false);
                if (handleNextWordDisplay) {
                  handleNextWordDisplay();
                }
              }}
              className="bg-black text-white px-4 py-2 rounded"
            >
              {isLastPlayer ? 'Commencer la partie' : 'Joueur suivant'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const WordBadge: FC<{ word: string; isUndercover: boolean }> = ({
  word,
  isUndercover,
}) => (
  <span
    className={`
      px-2 py-1 rounded text-center text-xs
      ${
        isUndercover ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
      }
    `}
  >
    {word}
  </span>
);

const RoleRevealModal = ({
  player,
  isUndercoverWin,
  isCivilWin,
  underCoverWord,
  civilWord,
  onClose,
  replayGame,
  restartGame,
}: {
  player: ModalPlayer;
  isUndercoverWin: boolean;
  isCivilWin: boolean;
  underCoverWord?: string;
  civilWord?: string;
  onClose: () => void;
  replayGame: () => void;
  restartGame: () => void;
}) => {
  const isUndercover = player.role === 'undercover';

  // Titles when a single player is revealed
  const LOST_TITLE = `Oups, ${player.name} était un vrai bebou !`;
  const WON_TITLE = `Bravo, ${player.name} était un bebou dissimulé !`;

  // Victory section content
  const hasVictory = isCivilWin || isUndercoverWin;
  const victoryMessage = isCivilWin
    ? 'Les bebous remportent la victoire !'
    : 'Les bebous dissimulés remportent la victoire !';
  const actionLabel = hasVictory ? 'Rejouer' : 'Fermer';

  // List out the words in the correct order
  const wordBadges = [
    civilWord && (
      <WordBadge key="civil" word={civilWord} isUndercover={false} />
    ),
    underCoverWord && (
      <WordBadge key="undercover" word={underCoverWord} isUndercover={true} />
    ),
  ].filter(Boolean);

  const handleClick = () => {
    if (hasVictory) {
      replayGame();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-16 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-sm w-full relative flex flex-col items-center shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Single-player reveal */}
        <h2 className="font-semibold mb-4">
          {isUndercover ? WON_TITLE : LOST_TITLE}
        </h2>
        <div className="mb-4 flex items-center justify-center w-full">
          <span
            className={`
                  px-2 py-1 rounded text-lg w-full text-center
                  ${
                    isUndercover
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-600'
                  }
                `}
          >
            {player.role.charAt(0).toUpperCase() + player.role.slice(1)}
          </span>
        </div>

        {/* Victory reveal */}
        {hasVictory && (
          <>
            <p className="text-sm text-gray-600 mb-4">{victoryMessage}</p>
            <div className="flex gap-1 mb-4">{wordBadges}</div>
          </>
        )}

        <div className="flex gap-4 mt-2">
          {hasVictory && (
            <button
              className="px-4 py-2 bg-black text-gray-200 rounded hover:opacity-90"
              onClick={restartGame}
            >
              Quitter
            </button>
          )}

          <button
            className="px-4 py-2 bg-amber-400 text-black rounded hover:opacity-90"
            onClick={handleClick}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const Game: FC = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('GameContext missing');
  const {
    players,
    wordOptions,
    isSetupNextGame,
    replayGame,
    reset,
    setIsSetupNextGame,
    selectedCategory
  } = context;
  const [civilWord, underCoverWord] = wordOptions;
  const navigate = useNavigate();

  const [eliminated, setEliminated] = useState<number[]>([]);
  const [playerOrder, setPlayerOrder] = useState<number[]>([]);
  const [round, setRound] = useState(1);
  const [isVoting, setIsVoting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalPlayer, setModalPlayer] = useState<ModalPlayer | null>(null);

  const [currentWordDisplayIndex, setCurrentWordDisplayIndex] = useState(0);

  const handleNextWordDisplay = useCallback(() => {
    setCurrentWordDisplayIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (currentWordDisplayIndex >= players.length) {
      setCurrentWordDisplayIndex(0);
      setIsSetupNextGame(false);
    }
  }, [currentWordDisplayIndex, players.length]);

  // initialize/shuffle once when players change
  useEffect(() => {
    setPlayerOrder(shuffleArray(players.map((p) => p.id)));
    setEliminated([]);
    setRound(1);
    setIsVoting(false);
  }, [players]);

  // Map from id to player for quick lookup
  const playerMap = useMemo(
    () => new Map(players.map((p) => [p.id, p])),
    [players]
  );

  const orderedPlayers = useMemo(
    () => playerOrder.map((id) => playerMap.get(id)!).filter(Boolean),
    [playerOrder, playerMap]
  );

  const remainingUndercovers = useMemo(
    () =>
      players.reduce(
        (count, p) =>
          p.role === 'undercover' && !eliminated.includes(p.id)
            ? count + 1
            : count,
        0
      ),
    [players, eliminated]
  );

  const remainingCivils = useMemo(
    () =>
      players.reduce(
        (cnt, p) =>
          p.role !== 'undercover' && !eliminated.includes(p.id) ? cnt + 1 : cnt,
        0
      ),
    [players, eliminated]
  );

  const handleEliminate = useCallback(
    (id: number) => {
      if (!isVoting) return;

      // 1) Rotate the order around the eliminated player
      setPlayerOrder((prevOrder) => {
        const idx = prevOrder.indexOf(id);
        return [
          // everything after the eliminated one
          ...prevOrder.slice(idx + 1),
          // then up to & including the eliminated one
          ...prevOrder.slice(0, idx + 1),
        ];
      });

      // 2) Mark them eliminated
      setEliminated((prev) => [...prev, id]);

      // 3) Show the modal
      const player = playerMap.get(id)!;
      setModalPlayer({
        name: player.name || `Joueur ${id + 1}`,
        role: player.role,
      });
      setShowModal(true);

      // 4) Advance the round & turn-off voting
      setRound((r) => r + 1);
      setIsVoting(false);
    },
    [isVoting, playerMap]
  );

  const restartGame = useCallback(() => {
    setShowModal(false);
    reset();
    navigate('/');
  }, [reset]);

  return (
    <div className="p-6">
      <p className="text-lg font-semibold">Undercover des bebous</p>
      <p className="mb-4 text-sm text-gray-500">
        Catégorie: {selectedCategory || 'Aucune'}
      </p>

      <div className="mb-6">
        <p className="text-sm mb-2 bg-gray-100 p-2 rounded">
          {isSetupNextGame
            ? 'Préparez-vous pour la prochaine partie !'
            : `Undercovers restants: ${remainingUndercovers} `}
        </p>
      </div>

      {isVoting && (
        <div className="mb-4">
          <p className="text-sm mb-2 bg-black text-white px-2 py-1 rounded">
            Cliquez sur un joueur pour l'éliminer.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {orderedPlayers.map((player, idx) => {
          const id = player.id;
          const isKilled = eliminated.includes(id);
          const isCurrentTurn = idx === 0 && !isKilled;

          return (
            <PlayerCard
              key={id}
              player={player}
              order={idx + 1}
              isKilled={isKilled}
              isVoting={isVoting}
              isCurrentTurn={isCurrentTurn}
              onEliminate={handleEliminate}
              isSetupNextGame={isSetupNextGame}
              handleNextWordDisplay={handleNextWordDisplay}
              currentWordDisplayIndex={currentWordDisplayIndex}
              totalPlayers={orderedPlayers.length}
            />
          );
        })}

        {!isSetupNextGame && (
          <button
            className={`
            col-span-2 md:col-span-4 py-2 bg-black text-white rounded mt-4
            ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
            disabled={isVoting}
            style={{ transition: 'opacity 0.3s' }}
            onClick={() => setIsVoting(true)}
          >
            Passer au vote
          </button>
        )}
      </div>

      {showModal && modalPlayer && (
        <RoleRevealModal
          player={modalPlayer}
          onClose={() => setShowModal(false)}
          isCivilWin={remainingUndercovers === 0}
          isUndercoverWin={
            remainingUndercovers > 0 && remainingUndercovers >= remainingCivils
          }
          civilWord={civilWord}
          underCoverWord={underCoverWord}
          replayGame={replayGame}
          restartGame={restartGame}
        />
      )}
    </div>
  );
};

export default Game;
