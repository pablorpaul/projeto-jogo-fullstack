import React, { useState } from "react";
import { useGameStore } from "../../../store/useGameStore";
import "./mainMenu.css";

// Importación de las imágenes usando las rutas exactas de tu proyecto
import marcoImg from "../../../assets/img/marco.png";
import logoImg from "../../../assets/img/logo.png"; 
import playImg from "../../../assets/img/play.png";
import tutorialImg from "../../../assets/img/tutorial.png";
import optionsImg from "../../../assets/img/options.png";
import creditsImg from "../../../assets/img/credits.png"; /* <-- NUEVA IMAGEN DE CRÉDITOS */
import quitImg from "../../../assets/img/quit.png";

export function MainMenu() {
    const { resetGame } = useGameStore();
    
    // Estados para controlar qué panel se muestra
    const [showInstructions, setShowInstructions] = useState(false);
    const [showCredits, setShowCredits] = useState(false);

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

                    {!showInstructions && !showCredits ? (
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

                            {/* NUEVO BOTÓN DE CRÉDITOS */}
                            <button className="boton-juego" onClick={() => setShowCredits(true)}>
                                <img src={creditsImg} alt="Credits" />
                            </button>

                            <button className="boton-juego" onClick={resetGame}>
                                <img src={quitImg} alt="Quit" />
                            </button>
                        </div>
                    ) : showInstructions ? (
                        /* PANEL DE INSTRUCCIONES */
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
                    ) : (
                        /* NUEVO PANEL DE CRÉDITOS */
                        <div className="instructions-panel">
                            <h3 className="instructions-title">Créditos</h3>
                            <ul className="instructions-list">
                                <li><span className="highlight-text">Desenvolvedores:</span></li>
                                <li>Pablo R. Paul</li>
                                <li>Eliezer V. Diaz</li>
                                <br />
                                <li><span className="highlight-text">Instituição:</span></li>
                                <li>Faculdade Senac Joinville</li>
                            </ul>
                            <div className="back-btn-wrapper">
                                <button className="btn-cyber-back" onClick={() => setShowCredits(false)}>
                                    VOLTAR
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}