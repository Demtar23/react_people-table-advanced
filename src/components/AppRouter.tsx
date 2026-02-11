import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './Navbar';
import { HomePage } from './HomePage';
import { PeoplePage } from './PeoplePage';
import { PageNotFound } from './PageNotFound';

export const AppRouter = () => {
  return (
    <HashRouter>
      <div data-cy="app">
        <Navbar />

        <div className="section">
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />}></Route>
              <Route path="/home" element={<Navigate to="/" replace />}></Route>
              <Route
                path="/people/:personSlug?"
                element={<PeoplePage />}
              ></Route>
              <Route path="*" element={<PageNotFound />}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};
