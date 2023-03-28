//@ts-nocheck
import { useState, useEffect, FormEvent } from 'react'
import { TextField } from '@mui/material'
import './app.css'
import SignList from './SignList'
import Sign from './Sign'
import SignPage from './SignPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    exact
                    path={`${import.meta.env.BASE_URL}`}
                    element={<SignList />}
                />
                <Route
                    exact
                    path={`${import.meta.env.BASE_URL}signs/:id`}
                    element={<SignPage />}
                />
                <Route render={() => <div>404 Not Found</div>} />
            </Routes>
        </Router>
    )
}

export default App
