import { Route, Routes } from 'react-router-dom';
import { GameProvider } from './GameProvider';
import SetupPage from './SetupPage';
import SetupPlayers from './SetupPlayers';
import Game from './Game';

const App = () => (
  <GameProvider>
    <Routes>
      <Route path="/" element={<SetupPage />} />
      <Route path="/players" element={<SetupPlayers />} />
      <Route
        path="/game"
        element={<Game />}
      />
      {/* <Route path="/reveal" element={<RevealPage />} /> */}
      {/* <Route path="/order" element={<OrderPage />} /> */}
      {/* <Route path="/results" element={<ResultsPage />} /> */}
    </Routes>
  </GameProvider>
);

export default App;
