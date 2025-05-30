// src/components/GameProvider.tsx
import { createContext, ReactNode, useState, useEffect } from 'react';

export type Player = {
  id: number;
  name: string;
  role: 'civil' | 'undercover';
  word: string;
};

export interface GameContextType {
  numPlayers: number;
  setNumPlayers: (n: number) => void;
  undercoverCount: number;
  players: Player[];
  setPlayers: (p: Player[]) => void;
  // game state
  order: number[];
  eliminated: number[];
  round: number;
  isVoting: boolean;
  setOrder: (o: number[]) => void;
  setEliminated: (e: number[]) => void;
  setRound: (r: number) => void;
  setIsVoting: (v: boolean) => void;
  wordOptions: [string, string]; // [civilWord, undercoverWord]
  replayGame: () => void;
  setPlayerName: (id: number, name: string) => void;
  generateWords: () => [string, string];
}

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}
export function GameProvider({ children }: Props) {
  const [numPlayers, setNumPlayers] = useState(4);
  const [undercoverCount, setUndercoverCount] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);

  // centralized game state
  const [order, setOrder] = useState<number[]>([]);
  const [eliminated, setEliminated] = useState<number[]>([]);
  const [round, setRound] = useState(1);
  const [isVoting, setIsVoting] = useState(false);

  // word options
  const [wordOptions, setWordOptions] = useState<[string, string]>(['', '']);

  const setPlayerName = (id: number, name: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  useEffect(() => {
    const count = Math.max(1, Math.floor((numPlayers - 1) / 3));
    setUndercoverCount(count);
  }, [numPlayers]);

  const WORD_PAIRS: [string, string][] = [
    ['chat', 'chien'],
    ['voiture', 'camion'],
    ['soleil', 'lune'],
    ['thé', 'café'],
    ['rouge', 'bleu'],
  ];

  const generateWords = (): [string, string] => {
    const pair = pickWords();
    setWordOptions(pair);
    return pair;
  };

  const pickWords = (): [string, string] => {
    const idx = Math.floor(Math.random() * WORD_PAIRS.length);
    return WORD_PAIRS[idx];
  };

  // replayGame resets words, order, eliminated, round, voting
  const replayGame = () => {
    generateWords();
    setOrder(shuffleArray(players.map((p) => p.id)));
    setEliminated([]);
    setRound(1);
    setIsVoting(false);
  };

  // init on mount
  useEffect(() => {
    replayGame();
  }, []);

  return (
    <GameContext.Provider
      value={{
        numPlayers,
        setNumPlayers,
        undercoverCount,
        players,
        setPlayers,
        order,
        eliminated,
        round,
        isVoting,
        setOrder,
        setEliminated,
        setRound,
        setIsVoting,
        wordOptions,
        replayGame,
        setPlayerName,
        generateWords,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
