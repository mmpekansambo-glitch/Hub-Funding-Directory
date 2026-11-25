import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Browse from './pages/Browse.jsx'
import Directory from './pages/Directory.jsx'
import Program from './pages/Program.jsx'
import States from './pages/States.jsx'
import StatePage from './pages/StatePage.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Directory />} />
        <Route path="programs" element={<Directory />} />
        <Route path="programs/:id" element={<Program />} />
        <Route path="browse" element={<Browse />} />
        <Route path="states" element={<States />} />
        <Route path="states/:code" element={<StatePage />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
