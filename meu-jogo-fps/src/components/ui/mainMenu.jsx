import React, { useState } from "react";
import { useGameStore } from "../../store/useGameStore";

export function MainMenu() {
    const { resetGame } = useGameStore();
    const [showInstructions, setShowInstructions] = useState(false);

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 30,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                // Fondo usando la imagen solicitada
                backgroundImage: "url('/mainmenu.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                fontFamily: "'Press Start 2P', 'Courier New', monospace",
            }}
        >
            {/* Inyección de CSS para recrear los botones pixel art y el marco */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
                    
                    /* === ESTILO DEL MARCO CONTENEDOR === */
                    .cyber-frame {
                        background: rgba(10, 15, 25, 0.85);
                        opacity: 0.8;
                        border: 4px solid #45f3ff;
                        padding: 20px 20px 20px 30px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        box-shadow: 0 0 30px rgba(69, 243, 255, 0.15), inset 0 0 20px rgba(69, 243, 255, 0.1);
                        backdrop-filter: blur(5px);
                    }
                    /* Adornos blancos en las esquinas del marco */
                    .cyber-frame::before, .cyber-frame::after {
                        content: '';
                        position: absolute;
                        width: 24px;
                        height: 24px;
                        border: 6px solid #fff;
                    }
                    .cyber-frame::before {
                        top: -6px; left: -6px;
                        border-right: none; border-bottom: none;
                    }
                    .cyber-frame::after {
                        bottom: -6px; right: -6px;
                        border-left: none; border-top: none;
                    }

                    /* === ESTILO DE BOTONES PIXELADOS (REF: image_204124) === */
                    .btn-cyber {
                        position: relative;
                        align-items; center;
                        background: transparent;
                        color: #45f3ff;
                        font-family: 'Press Start 2P', monospace;
                        font-size: 1rem;
                        padding: 22px 30px;
                        border: none;
                        cursor: pointer;
                        text-transform: uppercase;
                        width: 80%;
                        transition: all 0.2s ease-in-out;
                        margin-bottom: 20px;
                        text-shadow: 2px 2px 0px #000;
                    }

                 
                    .btn-cyber::after {
                        content: '';
                        position: absolute;
                        inset: 4px; /* Grosor del borde cian */
                        background: repeating-linear-gradient(
                            0deg,
                            #05121c,
                            #05121c 3px,
                            #102a3d 3px,
                            #102a3d 6px
                        );
                        /* Esquinas cortadas (Top-Left y Bottom-Right) */
                        clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
                        z-index: -1;
                        transition: all 0.2s ease;
                    }

                    /* Borde cian que sigue la forma de las esquinas cortadas */
                    .btn-cyber::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background: #45f3ff;
                        clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
                        z-index: -2;
                    }

                    /* Efecto Hover */
                    .btn-cyber:hover {
                        transform: scale(1.05);
                        color: #ffffff;
                    }
                    .btn-cyber:hover::after {
                        background: repeating-linear-gradient(
                            0deg,
                            #102a3d,
                            #102a3d 3px,
                            #1b4363 3px,
                            #1b4363 6px
                        );
                    }
                    
                    /* Adornos de triángulos en las esquinas cortadas de los botones */
                    .btn-cyber .corner-tl {
                        position: absolute; top: 0; left: 0; width: 15px; height: 15px;
                        background: linear-gradient(135deg, transparent 50%, #45f3ff 50%);
                        z-index: 0;
                    }
                    .btn-cyber .corner-br {
                        position: absolute; bottom: 0; right: 0; width: 15px; height: 15px;
                        background: linear-gradient(315deg, transparent 50%, #45f3ff 50%);
                        z-index: 0;
                    }
                `}
            </style>

            {/* MARCO CONTENEDOR */}
            <div className="cyber-frame">
                {/* Título */}
                <h1
                    style={{
                        fontSize: "50px",
                        fontWeight: "400",
                        margin: "0 0 50px 0px",
                        color: "#ffffff",
                        textShadow:
                            "4px 4px 0px #0a5060, -2px -2px 0px #052030, 0 0 20px rgba(69, 243, 255, 0.8)",
                        textAlign: "center"
                    }}
                >
                    Kill.Script
                </h1>

                {!showInstructions ? (
                    <div style={{ width: "100%", maxWidth: "420px" }}>
                        <button className="btn-cyber" onClick={resetGame}>
                            <div className="corner-tl"></div>
                            <span
                                style={{
                                    position: "relative",
                                    zIndex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "15px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "1.2rem",
                                        color: "#45f3ff",
                                    }}
                                ></span>
                                PLAY
                            </span>
                            <div className="corner-br"></div>
                        </button>

                        <button
                            className="btn-cyber"
                            onClick={() => setShowInstructions(true)}
                        >
                            <div className="corner-tl"></div>
                            <span
                                style={{
                                    position: "relative",
                                    zIndex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "15px",
                                }}
                            >
                                <span style={{ fontSize: "1.2rem" }}></span>
                                TUTORIAL
                            </span>
                            <div className="corner-br"></div>
                        </button>

                        <button className="btn-cyber" onClick={resetGame}>
                            <div className="corner-tl"></div>
                            <span
                                style={{
                                    position: "relative",
                                    zIndex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "15px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "1.2rem",
                                        color: "#45f3ff",
                                    }}
                                ></span>
                                OPTIONS
                            </span>
                            <div className="corner-br"></div>
                        </button>

                        <button className="btn-cyber" onClick={resetGame}>
                            <div className="corner-tl"></div>
                            <span
                                style={{
                                    position: "relative",
                                    zIndex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "15px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "1.2rem",
                                        color: "#45f3ff",
                                    }}
                                ></span>
                                QUIT
                            </span>
                            <div className="corner-br"></div>
                        </button>
                    </div>
                ) : (
                    /* Panel de Instrucciones adaptado al marco */
                    <div
                        style={{
                            textAlign: "left",
                            maxWidth: "420px",
                            width: "100%",
                        }}
                    >
                        <h3
                            style={{
                                color: "#45f3ff",
                                marginTop: 0,
                                textAlign: "center",
                                fontSize: "1.2rem",
                                marginBottom: "20px",
                            }}
                        >
                            Objetivo & Controles
                        </h3>
                        <ul
                            style={{
                                paddingLeft: "20px",
                                lineHeight: "2.2",
                                fontSize: "0.8rem",
                                color: "#d0d0e0",
                                listStyleType: "square",
                            }}
                        >
                            <li>
                                <span style={{ color: "#45f3ff" }}>Obj:</span>{" "}
                                Elimine os vírus (10 min).
                            </li>
                            <li>
                                <span style={{ color: "#45f3ff" }}>WASD:</span>{" "}
                                Movimentação
                            </li>
                            <li>
                                <span style={{ color: "#45f3ff" }}>
                                    Espaço:
                                </span>{" "}
                                Pular
                            </li>
                            <li>
                                <span style={{ color: "#45f3ff" }}>Mouse:</span>{" "}
                                Mirar / Atirar
                            </li>
                            <li>
                                <span style={{ color: "#45f3ff" }}>ESC:</span>{" "}
                                Pausar Jogo
                            </li>
                        </ul>

                        <div style={{ marginTop: "30px" }}>
                            <button
                                className="btn-cyber"
                                onClick={() => setShowInstructions(false)}
                                style={{ marginBottom: 0, padding: "15px" }}
                            >
                                <div className="corner-tl"></div>
                                <span
                                    style={{ position: "relative", zIndex: 1 }}
                                >
                                    VOLTAR
                                </span>
                                <div className="corner-br"></div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer de Créditos */}
            <footer
                style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "25px",
                    textAlign: "right",
                    backgroundColor: "rgba(5, 10, 15, 0.9)",
                    padding: "12px 20px",
                    border: "2px solid #45f3ff",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.8)",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        fontWeight: "bold",
                        color: "#45f3ff",
                        fontSize: "0.9rem",
                        letterSpacing: "1px",
                        marginBottom: "4px",
                    }}
                >
                    Faculdade Senac Joinville
                </div>
                <div style={{ color: "#a0a0c0", fontSize: "0.8rem" }}>
                    Alunos:{" "}
                    <strong style={{ color: "#fff" }}>Pablo R. Paul</strong> e{" "}
                    <strong style={{ color: "#fff" }}>Eliezer V. Diaz</strong>
                </div>
            </footer>
        </div>
    );
}
