import React, { useState } from "react";
import { useGameStore } from "../../../store/useGameStore";
import "./mainMenu.css";

// Importación de las imágenes usando las rutas exactas de tu proyecto
import marcoImg from "../../../assets/img/marco.png";
import logoImg from "../../../assets/img/logo.jpeg"; /* <-- OJO: Tu archivo es .jpeg */
import playImg from "../../../assets/img/play.png";
import tutorialImg from "../../../assets/img/tutorial.png";
import optionsImg from "../../../assets/img/options.png";
import quitImg from "../../../assets/img/quit.png";

export function MainMenu() {
    const { resetGame } = useGameStore();
    const [showInstructions, setShowInstructions] = useState(false);

    return (
        <div className="main-menu-container">
            {/* CONTENEDOR CENTRAL: Marco + Logo + Botones */}
            <div className="menu-interactivo">
                
                {/* El marco de fondo */}
                <img src={marcoImg} alt="Marco" className="imagen-fondo" />

                {/* El contenido dentro de la pantalla del marco */}
                <div className="contenido-interior">
                    
                    {/* El título (Imagen) */}
                    <img src={logoImg} alt="Kill.Script" className="logo-juego" />

                    {!showInstructions ? (
                        <div className="contenedor-botones">
                            <button className="boton-juego" onClick={resetGame}>
                                <img src={playImg} alt="Play" />
                            </button>

                            <button className="boton-juego" onClick={() => setShowInstructions(true)}>
                                <img src={tutorialImg} alt="Tutorial" />
                            </button>

                            <button className="boton-juego" onClick={resetGame}>
                                <img src={optionsImg} alt="Options" />
                            </button>

                            <button className="boton-juego" onClick={resetGame}>
                                <img src={quitImg} alt="Quit" />
                            </button>
                        </div>
                    ) : (
                        <div className="instructions-panel">
                            <h3 className="instructions-title">Objetivo & Controles</h3>
                            <ul className="instructions-list">
                                <li><span className="highlight-text">Obj:</span> Elimine os vírus (10 min).</li>
                                <li><span className="highlight-text">WASD:</span> Movimentação</li>
                                <li><span className="highlight-text">Espaço:</span> Pular</li>
                                <li><span className="highlight-text">Mouse:</span> Mirar / Atirar</li>
                                <li><span className="highlight-text">ESC:</span> Pausar Jogo</li>
                            </ul>
                            <div className="back-btn-wrapper">
                                <button className="btn-cyber-back" onClick={() => setShowInstructions(false)}>
                                    VOLTAR
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="cyber-footer">
                <div className="footer-college">Faculdade Senac Joinville</div>
                <div className="footer-students">
                    Alunos: <strong>Pablo R. Paul</strong> e <strong>Eliezer V. Diaz</strong>
                </div>
            </footer>
        </div>
    );
}