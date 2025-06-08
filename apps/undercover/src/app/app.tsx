import { Route, Routes } from 'react-router-dom';
import { GameProvider } from './GameProvider';
import SetupPage from './SetupPage';
import SetupPlayers from './SetupPlayers';
import Game from './Game';

const App = () => {

  return (
    <div className="safe-top-area">
      <GameProvider>
        <Routes>
          <Route path="/" element={<SetupPage />} />
          <Route path="/players" element={<SetupPlayers />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </GameProvider>
    </div>
  );
};

export default App;
