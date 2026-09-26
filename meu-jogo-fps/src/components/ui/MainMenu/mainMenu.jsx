import React, { useState } from "react";
import { useGameStore } from "../../../store/useGameStore";
import "./mainMenu.css";

// Importación de las imágenes principales
import marcoImg from "../../../assets/img/marco.png";
import logoImg from "../../../assets/img/logo.png"; 
import playImg from "../../../assets/img/play.png";
import tutorialImg from "../../../assets/img/tutorial.png";
import optionsImg from "../../../assets/img/options.png";
import creditsImg from "../../../assets/img/credits.png"; 
import quitImg from "../../../assets/img/quit.png";

// Importación de las imágenes para los pop-ups y botones de retorno
import confirmarImg from "../../../assets/img/confirmar.png";
import declinarImg from "../../../assets/img/declinar.png";
import returnImg from "../../../assets/img/return.png";

export function MainMenu() {
    const { resetGame } = useGameStore();
    
    // Estado unificado para controlar qué panel se muestra
    const [activePanel, setActivePanel] = useState(null);
    const [isTerminalTransitioning, setIsTerminalTransitioning] = useState(false);
    const [terminalText, setTerminalText] = useState("");

    // Estados funcionales para las opciones del juego
    const [audioAmbiente, setAudioAmbiente] = useState(70);
    const [audioMenu, setAudioMenu] = useState(70);
    const [audioJuego, setAudioJuego] = useState(80);
    const [sensibilidad, setSensibilidad] = useState(50);
    const [resolucion, setResolucion] = useState("windowed");

    // Lógica para abrir opciones con efecto de comandos tipo Kali Linux
    const handleOpenOptions = () => {
        setIsTerminalTransitioning(true);
        setTerminalText("root@killscript:~# ./load_sys_config.sh --init");
        
        setTimeout(() => {
            setTerminalText("root@killscript:~# ./load_sys_config.sh --init\n>> Parsing audio/mouse drivers... OK");
        }, 450);

        setTimeout(() => {
            setTerminalText("root@killscript:~# ./load_sys_config.sh --init\n>> Parsing audio/mouse drivers... OK\n>> Initializing cyber_terminal UI... DONE");
        }, 900);

        setTimeout(() => {
            setActivePanel('options');
            setIsTerminalTransitioning(false);
        }, 1400);
    };

    // Lógica para cerrar opciones
    const handleCloseOptions = () => {
        setIsTerminalTransitioning(true);
        setTerminalText("root@killscript:~# saving_config --exit");

        setTimeout(() => {
            setTerminalText("root@killscript:~# saving_config --exit\n>> Config saved successfully. Goodbye.");
        }, 550);

        setTimeout(() => {
            setActivePanel(null);
            setIsTerminalTransitioning(false);
        }, 1100);
    };

    const handleOpenPanel = (panelName) => {
        setActivePanel(panelName);
    };

    const handleClosePanel = () => {
        setActivePanel(null);
    };

    // Lógica real de Pantalla Completa vs Ventana
    const handleResolutionChange = (e) => {
        const mode = e.target.value;
        setResolucion(mode);
        
        if (mode === "fullscreen") {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch((err) => {
                    console.error("Error al intentar entrar en pantalla completa:", err);
                });
            }
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch((err) => {
                    console.error("Error al salir de pantalla completa:", err);
                });
            }
        }
    };

    const handleQuitGame = () => {
        console.log("Cerrando sistema...");
        window.location.reload(); 
    };

    return (
        <div className="main-menu-container">
            {/* El marco rota si el panel es tutorial, credits o quit. Options se queda horizontal. */}
            <div className={`menu-interactivo ${activePanel && activePanel !== 'options' ? 'giro-horario' : ''} ${activePanel === 'options' ? 'modo-opciones-horizontal' : ''}`}>
                
                <img src={marcoImg} alt="Marco" className="imagen-fondo" />

                <div className="contenido-interior">
                    
                    {/* Pantalla de Terminal / Boot para la transición de Options */}
                    {isTerminalTransitioning ? (
                        <div className="terminal-boot-screen cyber-font">
                            <p className="terminal-line">{terminalText}</p>
                            <p className="terminal-cursor">_</p>
                        </div>
                    ) : !activePanel ? (
                        <>
                            <img src={logoImg} alt="Kill.Script" className="logo-juego" />

                            <div className="contenedor-botones">
                                <button className="boton-juego" onClick={resetGame}>
                                    <img src={playImg} alt="Play" />
                                </button>

                                <button className="boton-juego" onClick={() => handleOpenPanel('tutorial')}>
                                    <img src={tutorialImg} alt="Tutorial" />
                                </button>

                                <button className="boton-juego" onClick={handleOpenOptions}>
                                    <img src={optionsImg} alt="Options" />
                                </button>

                                <button className="boton-juego" onClick={() => handleOpenPanel('credits')}>
                                    <img src={creditsImg} alt="Credits" />
                                </button>

                                <button className="boton-juego" onClick={() => handleOpenPanel('quit')}>
                                    <img src={quitImg} alt="Quit" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="instructions-panel">
                            
                            {/* === TUTORIAL MEJORADO (VERTICAL) === */}
                            {activePanel === 'tutorial' && (
                                <div className="panel-content-wrapper vertical-content matrix-text delay-0">
                                    <div className="cyber-header-box">
                                        <span className="blink-dot"></span>
                                        <h3 className="instructions-title">PROTOCOLO DE COMBATE</h3>
                                    </div>
                                    
                                    <div className="cyber-hud-grid cyber-font">
                                        <div className="hud-card">
                                            <span className="hud-key">OBJETIVO:</span>
                                            <p className="hud-desc">Elimine os vírus (<span className="text-danger">10 min</span>).</p>
                                        </div>
                                        <div className="hud-card">
                                            <span className="hud-key">MOVIMENTAÇÃO:</span>
                                            <p className="hud-desc"><span className="text-highlight">[W][A][S][D]</span> navegar.</p>
                                        </div>
                                        <div className="hud-card">
                                            <span className="hud-key">SALTO:</span>
                                            <p className="hud-desc"><span className="text-highlight">[ESPAÇO]</span> saltar.</p>
                                        </div>
                                        <div className="hud-card">
                                            <span className="hud-key">MIRA:</span>
                                            <p className="hud-desc"><span className="text-highlight">[MOUSE]</span> Atirar.</p>
                                        </div>
                                        <div className="hud-card">
                                            <span className="hud-key">PAUSA:</span>
                                            <p className="hud-desc"><span className="text-highlight">[ESC]</span> Pausar.</p>
                                        </div>
                                    </div>

                                    <div className="panel-footer-custom">
                                        <span className="footer-status">&gt; STATUS: OK</span>
                                        <span className="footer-version pixel-version">v1.0.0</span>
                                    </div>
                                </div>
                            )}

                            {/* === OPTIONS (ESTRUCTURA ORIGINAL HORIZONTAL) === */}
                            {activePanel === 'options' && (
                                <div className="options-wrapper-horizontal matrix-text delay-0">
                                    <h3 className="options-main-title">CONFIGURAÇÕES DO SISTEMA</h3>
                                    <div className="options-grid-compact cyber-font">
                                        
                                        <div className="option-item-compact">
                                            <label>Volume Ambiente: <span className="highlight-text">{audioAmbiente}%</span></label>
                                            <input 
                                                type="range" min="0" max="100" 
                                                value={audioAmbiente} 
                                                onChange={(e) => setAudioAmbiente(e.target.value)}
                                                className="pixel-slider speaker-thumb"
                                            />
                                        </div>

                                        <div className="option-item-compact">
                                            <label>Volume Menu: <span className="highlight-text">{audioMenu}%</span></label>
                                            <input 
                                                type="range" min="0" max="100" 
                                                value={audioMenu} 
                                                onChange={(e) => setAudioMenu(e.target.value)}
                                                className="pixel-slider speaker-thumb"
                                            />
                                        </div>

                                        <div className="option-item-compact">
                                            <label>Volume Jogo: <span className="highlight-text">{audioJuego}%</span></label>
                                            <input 
                                                type="range" min="0" max="100" 
                                                value={audioJuego} 
                                                onChange={(e) => setAudioJuego(e.target.value)}
                                                className="pixel-slider speaker-thumb"
                                            />
                                        </div>

                                        <div className="option-item-compact">
                                            <label>Sensibilidade Mouse: <span className="highlight-text">{sensibilidad}%</span></label>
                                            <input 
                                                type="range" min="10" max="100" 
                                                value={sensibilidad} 
                                                onChange={(e) => setSensibilidad(e.target.value)}
                                                className="pixel-slider mouse-thumb"
                                            />
                                        </div>

                                        <div className="option-item-compact option-full-compact">
                                            <label>Modo de Exibição</label>
                                            <select 
                                                value={resolucion} 
                                                onChange={handleResolutionChange}
                                                className="pixel-select"
                                            >
                                                <option value="windowed">Modo Janela</option>
                                                <option value="fullscreen">Tela Cheia (Fullscreen)</option>
                                            </select>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* === CRÉDITOS MEJORADOS (VERTICAL) === */}
                            {activePanel === 'credits' && (
                                <div className="panel-content-wrapper vertical-content matrix-text delay-0">
                                    <div className="cyber-header-box">
                                        <span className="blink-dot green-dot"></span>
                                        <h3 className="instructions-title">CRÉDITOS DO NÚCLEO</h3>
                                    </div>

                                    <div className="credits-hud-box cyber-font">
                                        <div className="credit-row">
                                            <span className="credit-role">&gt; DEV_LEAD:</span>
                                            <span className="credit-name">Pablo R. Paul</span>
                                        </div>
                                        <div className="credit-row">
                                            <span className="credit-role">&gt; DEV_LEAD:</span>
                                            <span className="credit-name">Eliezer V. Diaz</span>
                                        </div>
                                        <div className="credit-row institution-row">
                                            <span className="credit-role">&gt; INSTITUTION:</span>
                                            <span className="credit-name text-highlight">Senac Joinville</span>
                                        </div>
                                    </div>

                                    <div className="panel-footer-custom">
                                        <span className="footer-status">&gt; SECURE: OK</span>
                                        <span className="footer-version pixel-version">v1.0.0</span>
                                    </div>
                                </div>
                            )}

                            {/* === QUIT (CENTRADO Y AGRUPADO VERTICALMENTE) === */}
                            {activePanel === 'quit' && (
                                <div className="quit-wrapper">
                                    <h3 className="instructions-title matrix-text warning-text text-center delay-0 quit-title">ALERTA DE SISTEMA</h3>
                                    <p className="cyber-font text-center matrix-text delay-2 quit-text">
                                        Deseja realmente sair?
                                    </p>
                                    
                                    <div className="quit-buttons-container matrix-text delay-4">
                                        <button className="boton-juego btn-quit-action" onClick={handleQuitGame}>
                                            <img src={confirmarImg} alt="Confirmar" />
                                        </button>
                                        <button className="boton-juego btn-quit-action" onClick={handleClosePanel}>
                                            <img src={declinarImg} alt="Declinar" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Botón de Volver (Excluye Quit) */}
                            {activePanel !== 'quit' && (
                                <div className={`back-btn-wrapper matrix-text delay-6 ${activePanel === 'options' ? 'back-options-fix' : ''}`}>
                                    <button 
                                        className="boton-juego btn-back-action" 
                                        onClick={activePanel === 'options' ? handleCloseOptions : handleClosePanel}
                                    >
                                        <img src={returnImg} alt="Return" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}