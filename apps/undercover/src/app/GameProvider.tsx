// src/components/GameProvider.tsx
import { createContext, ReactNode, useState, useEffect, useRef } from 'react';
import wordsData from '../../resources/words.json';

type WordData = {
  category: string;
  difficulties: {
    difficulty: 'facile' | 'moyen' | 'hard';
    words: { pairs: string[] }[];
  }[];
};

const allWords = wordsData as WordData[];

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
  isSetupNextGame: boolean;
  setIsSetupNextGame: (v: boolean) => void;
  reset: () => void;
  difficulty: 'facile' | 'moyen' | 'hard';
  setDifficulty: (d: 'facile' | 'moyen' | 'hard') => void;
  selectedCategory: string | null;
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
  const [difficulty, setDifficulty] = useState<'facile' | 'moyen' | 'hard'>(
    'facile'
  );

  // centralized game state
  const [order, setOrder] = useState<number[]>([]);
  const [eliminated, setEliminated] = useState<number[]>([]);
  const [round, setRound] = useState(1);
  const [isVoting, setIsVoting] = useState(false);
  const [isSetupNextGame, setIsSetupNextGame] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const usedPairsRef = useRef<Set<number>>(new Set());

  // whenever difficulty changes, clear out the used set
  useEffect(() => {
    usedPairsRef.current.clear();
  }, [difficulty]);

  // word options
  const [wordOptions, setWordOptions] = useState<[string, string]>(['', '']);

  const setPlayerName = (id: number, name: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  useEffect(() => {
    const count = Math.max(1, Math.floor((numPlayers - 1) / 3));
    setUndercoverCount(count);
  }, [numPlayers]);

  const pickWords = (): [string, string] => {
    // 1️⃣ pick a random category that has at least one group at the current difficulty
    const cats = allWords.filter((cat) =>
      cat.difficulties.some((d) => d.difficulty === difficulty)
    );
    const catIdx = Math.floor(Math.random() * cats.length);
    const { category, difficulties } = cats[catIdx];
    setSelectedCategory(category);

    // 2️⃣ find the matching difficulty block
    const diffBlock = difficulties.find((d) => d.difficulty === difficulty)!;
    const pool = diffBlock.words;

    // 3️⃣ if we’ve exhausted every group, start over
    if (usedPairsRef.current.size >= pool.length) {
      usedPairsRef.current.clear();
    }

    // 4️⃣ pick a fresh random index
    let idx: number;
    do {
      idx = Math.floor(Math.random() * pool.length);
    } while (usedPairsRef.current.has(idx));
    usedPairsRef.current.add(idx);

    // 5️⃣ now pick two distinct words out of that group
    const synonyms = shuffleArray(pool[idx].pairs);
    // note: we trust JSON always has ≥2 items per `pairs`
    const [civilWord, undercoverWord] = [synonyms[0], synonyms[1]];

    return [civilWord, undercoverWord];
  };

  const generateWords = (): [string, string] => {
    const pair = pickWords();
    setWordOptions(pair);
    return pair;
  };

  const reset = () => {
    setNumPlayers(4);
    setUndercoverCount(1);
    setPlayers([]);
    setOrder([]);
    setEliminated([]);
    setRound(1);
    setIsVoting(false);
    setIsSetupNextGame(false);
    setWordOptions(['', '']);
  };

  // replayGame resets words, order, eliminated, round, voting
  const replayGame = () => {
    const [civilWord, undercoverWord] = generateWords();

    // Shuffle player IDs to randomize roles
    const shuffledIds = shuffleArray(players.map((p) => p.id));

    // Pick first `undercoverCount` IDs as undercovers
    const newUndercoverIds = new Set(shuffledIds.slice(0, undercoverCount));

    // Assign new roles and words
    const newPlayers: Player[] = players.map((p) => {
      const isUndercover = newUndercoverIds.has(p.id);
      return {
        ...p,
        role: isUndercover ? 'undercover' : 'civil',
        word: isUndercover ? undercoverWord : civilWord,
      };
    });

    setPlayers(newPlayers);
    setOrder(shuffleArray(newPlayers.map((p) => p.id)));

    setEliminated([]);
    setRound(1);
    setIsVoting(false);
    setIsSetupNextGame(true);
  };

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
        isSetupNextGame,
        setIsSetupNextGame,
        reset,
        difficulty,
        setDifficulty,
        selectedCategory,
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
