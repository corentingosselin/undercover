// src/components/SetupPlayers.tsx
import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerForm from './PlayerForm';
import { GameContext, shuffleArray } from './GameProvider';

const SetupPlayers = () => {
  const navigate = useNavigate();
  const {
    numPlayers,
    undercoverCount,
    players,
    setPlayers,
    generateWords,
    order,
    setOrder,
  } = useContext(GameContext)!;

  // local reveal index
  const [revealIdx, setRevealIdx] = useState(0);

  useEffect(() => {
    // 1) Generate a fresh pair of clue words
    const [civilWord, undercoverWord] = generateWords();

    // 2) Build & shuffle the roles array
    const roles = Array(numPlayers).fill('civil');
    for (let i = 0; i < undercoverCount; i++) {
      roles[i] = 'undercover';
    }
    const shuffledRoles = shuffleArray(roles);

    // 3) Assign each player their word
    const initialPlayers = shuffledRoles.map((role, idx) => ({
      id: idx,
      name: '',
      role: role as 'civil' | 'undercover',
      word: role === 'undercover' ? undercoverWord : civilWord,
    }));

    // 4) Seed context & reset local index
    setPlayers(initialPlayers);
    setOrder(initialPlayers.map((_, idx) => idx));
    setRevealIdx(0);
    // We only want to rerun this when numPlayers or undercoverCount change:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numPlayers, undercoverCount]);

  if (players.length === 0 || order.length === 0) {
    return null;
  }

  const finishSetup = () => navigate('/game');
  const playerId = order[revealIdx];
  const word = players[playerId].word;

  return (
    <PlayerForm
      key={playerId}
      index={playerId}
      word={word}
      onNext={() => {
        if (revealIdx < numPlayers - 1) {
          setRevealIdx((i) => i + 1);
        } else {
          finishSetup();
        }
      }}
    />
  );
};

export default SetupPlayers;