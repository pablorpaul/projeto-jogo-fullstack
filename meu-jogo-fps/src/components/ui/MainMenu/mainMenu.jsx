import React, { useState } from "react";
import { useGameStore } from "../../../store/useGameStore";
import "./mainMenu.css";

export function MainMenu() {
    const { resetGame } = useGameStore();
    const [showInstructions, setShowInstructions] = useState(false);

    return (
        <div className="main-menu-container">
            {/* MARCO CONTENEDOR */}
            <div className="cyber-frame">
                {/* Título */}
                <h1 className="cyber-title">
                    Kill.Script
                </h1>

                {!showInstructions ? (
                    <div className="btn-wrapper">
                        <button className="btn-cyber" onClick={resetGame}>
                            <div className="corner-tl"></div>
                            <span className="btn-text">PLAY</span>
                            <div className="corner-br"></div>
                        </button>

                        <button
                            className="btn-cyber"
                            onClick={() => setShowInstructions(true)}
                        >
                            <div className="corner-tl"></div>
                            <span className="btn-text">TUTORIAL</span>
                            <div className="corner-br"></div>
                        </button>

                        <button className="btn-cyber" onClick={resetGame}>
                            <div className="corner-tl"></div>
                            <span className="btn-text">OPTIONS</span>
                            <div className="corner-br"></div>
                        </button>

                        <button className="btn-cyber" onClick={resetGame}>
                            <div className="corner-tl"></div>
                            <span className="btn-text">QUIT</span>
                            <div className="corner-br"></div>
                        </button>
                    </div>
                ) : (
                    /* Panel de Instrucciones adaptado al marco */
                    <div className="instructions-panel">
                        <h3 className="instructions-title">
                            Objetivo & Controles
                        </h3>
                        <ul className="instructions-list">
                            <li>
                                <span className="highlight-text">Obj:</span> Elimine os vírus (10 min).
                            </li>
                            <li>
                                <span className="highlight-text">WASD:</span> Movimentação
                            </li>
                            <li>
                                <span className="highlight-text">Espaço:</span> Pular
                            </li>
                            <li>
                                <span className="highlight-text">Mouse:</span> Mirar / Atirar
                            </li>
                            <li>
                                <span className="highlight-text">ESC:</span> Pausar Jogo
                            </li>
                        </ul>

                        <div className="back-btn-wrapper">
                            <button
                                className="btn-cyber btn-back"
                                onClick={() => setShowInstructions(false)}
                            >
                                <div className="corner-tl"></div>
                                <span className="btn-text">VOLTAR</span>
                                <div className="corner-br"></div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer de Créditos */}
            <footer className="cyber-footer">
                <div className="footer-college">
                    Faculdade Senac Joinville
                </div>
                <div className="footer-students">
                    Alunos: <strong>Pablo R. Paul</strong> e <strong>Eliezer V. Diaz</strong>
                </div>
            </footer>
        </div>
    );
}