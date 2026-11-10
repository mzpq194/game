
import React, { useState, useEffect, useRef } from 'react';

const MONSTERS_DB = {
  IGNIS: {
    id: 'IGNIS',
    name: 'Ignis',
    type: 'Fogo',
    color: '#ef4444',
    eyeColor: '#fef08a',
    baseHp: 100,
    baseAtk: 22,
    evolution: 'PYROCLAST',
    evoLevel: 10,
    moves: [
      { name: 'Chama Rápida', power: 20 },
      { name: 'Explosão Solar', power: 40 },
      { name: 'Investida', power: 15 }
    ]
  },

  PYROCLAST: {
    id: 'PYROCLAST',
    name: 'Pyroclast',
    type: 'Fogo',
    color: '#991b1b',
    eyeColor: '#f97316',
    baseHp: 180,
    baseAtk: 42,
    moves: [
      { name: 'Inferno Pixel', power: 55 },
      { name: 'Meteoro', power: 80 },
      { name: 'Garras de Titã', power: 35 }
    ]
  },

  AQUORA: {
    id: 'AQUORA',
    name: 'Aquora',
    type: 'Água',
    color: '#06b6d4',
    eyeColor: '#ffffff',
    baseHp: 110,
    baseAtk: 18,
    evolution: 'LEVIATHAN',
    evoLevel: 10,
    moves: [
      { name: "Jato d'Água", power: 22 },
      { name: 'Tsunami', power: 45 },
      { name: 'Escudo de Bolhas', power: 10 }
    ]
  },

  LEVIATHAN: {
    id: 'LEVIATHAN',
    name: 'Leviathan',
    type: 'Água',
    color: '#1e40af',
    eyeColor: '#38bdf8',
    baseHp: 210,
    baseAtk: 38,
    moves: [
      { name: 'Hydro Pressão', power: 60 },
      { name: 'Devastação Marinha', power: 90 }
    ]
  }
};

export default function App() {
  const canvasRef = useRef(null);

  const [gameState, setGameState] = useState('EXPLORE');

  const [playerPos, setPlayerPos] = useState({
    x: 4,
    y: 4
  });

  const [team, setTeam] = useState([
    {
      ...MONSTERS_DB.IGNIS,
      level: 5,
      currentHp: 100,
      maxHp: 100,
      exp: 0,
      nextExp: 50
    }
  ]);

  const [activeMonIndex] = useState(0);
  const [wildMon, setWildMon] = useState(null);
  const [battleLog, setBattleLog] = useState('');

  const mapSize = 12;

  const bushes = [
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 2, y: 3 },
    { x: 8, y: 7 },
    { x: 9, y: 7 },
    { x: 8, y: 8 },
    { x: 9, y: 8 }
  ];

  const healCenter = { x: 6, y: 1 };

  const activeMon = team[activeMonIndex];

  // Iniciar batalha
  const startWildBattle = () => {
    const keys = Object.keys(MONSTERS_DB);

    const randomKey =
      keys[Math.floor(Math.random() * keys.length)];

    const base = MONSTERS_DB[randomKey];

    const monster = {
      ...base,
      level: Math.floor(Math.random() * 4) + 3,
      currentHp: base.baseHp,
      maxHp: base.baseHp
    };

    setWildMon(monster);
    setGameState('BATTLE');

    setBattleLog(
      `Um ${base.name} selvagem apareceu na relva!`
    );
  };

  // Movimentação do jogador
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'EXPLORE') return;

      let newX = playerPos.x;
      let newY = playerPos.y;

      if (
        e.key === 'w' ||
        e.key === 'W' ||
        e.key === 'ArrowUp'
      ) newY--;

      if (
        e.key === 's' ||
        e.key === 'S' ||
        e.key === 'ArrowDown'
      ) newY++;

      if (
        e.key === 'a' ||
        e.key === 'A' ||
        e.key === 'ArrowLeft'
      ) newX--;

      if (
        e.key === 'd' ||
        e.key === 'D' ||
        e.key === 'ArrowRight'
      ) newX++;

      newX = Math.max(0, Math.min(mapSize - 1, newX));
      newY = Math.max(0, Math.min(mapSize - 1, newY));

      setPlayerPos({ x: newX, y: newY });

      // Centro de cura
      if (
        newX === healCenter.x &&
        newY === healCenter.y
      ) {
        setTeam((prev) =>
          prev.map((mon) => ({
            ...mon,
            currentHp: mon.maxHp
          }))
        );

        setBattleLog(
          'Seus monstros foram completamente curados!'
        );
      }

      // Encontro com monstros
      const inBush = bushes.some(
        (b) => b.x === newX && b.y === newY
      );

      if (inBush && Math.random() < 0.25) {
        startWildBattle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, playerPos]);

  // Sprites detalhados em pixel art
  const drawDetailedPixelMonster = (ctx, x, y, monster, scale = 1) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    const dark = '#171923';
    const mid = monster.color;
    const light = monster.type === 'Fogo' ? '#fca5a5' : '#a5f3fc';
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(3, 35, 30, 5);
    ctx.fillStyle = dark;
    ctx.fillRect(5, 5, 7, 9);
    ctx.fillRect(22, 5, 7, 9);
    ctx.fillStyle = mid;
    ctx.fillRect(7, 4, 5, 8);
    ctx.fillRect(22, 4, 5, 8);
    ctx.fillStyle = dark;
    ctx.fillRect(4, 12, 28, 22);
    ctx.fillRect(8, 8, 20, 29);
    ctx.fillStyle = mid;
    ctx.fillRect(7, 13, 22, 19);
    ctx.fillRect(10, 9, 16, 25);
    ctx.fillStyle = light;
    ctx.fillRect(10, 14, 5, 4);
    ctx.fillRect(22, 21, 5, 4);
    ctx.fillStyle = dark;
    ctx.fillRect(7, 29, 6, 7);
    ctx.fillRect(23, 29, 6, 7);
    ctx.fillStyle = '#fff7ed';
    ctx.fillRect(10, 17, 6, 6);
    ctx.fillRect(21, 17, 6, 6);
    ctx.fillStyle = monster.eyeColor || '#fef08a';
    ctx.fillRect(12, 18, 3, 4);
    ctx.fillRect(22, 18, 3, 4);
    ctx.fillStyle = dark;
    ctx.fillRect(13, 19, 2, 3);
    ctx.fillRect(23, 19, 2, 3);
    ctx.fillRect(15, 27, 7, 2);
    ctx.fillRect(17, 29, 3, 2);
    if (monster.type === 'Fogo') {
      ctx.fillStyle = '#f97316';
      ctx.fillRect(14, 2, 5, 5);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(15, 0, 3, 4);
    } else {
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(2, 23, 4, 5);
      ctx.fillRect(29, 11, 4, 5);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(3, 24, 2, 3);
    }
    ctx.restore();
  };

  // Barra de vida
  const drawHpBar = (
    ctx,
    x,
    y,
    width,
    current,
    max
  ) => {
    const pct = Math.max(0, current / max);

    ctx.fillStyle = '#475569';
    ctx.fillRect(x, y, width, 8);

    ctx.fillStyle =
      pct > 0.4 ? '#22c55e' : '#ef4444';

    ctx.fillRect(x, y, width * pct, 8);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(2, 0, 0, 2, 0, 0);

    const tileSize = 40;

    ctx.clearRect(0, 0, 480, 480);

    if (gameState === 'EXPLORE') {

      for (let x = 0; x < mapSize; x++) {
        for (let y = 0; y < mapSize; y++) {
          ctx.fillStyle =
            (x + y) % 2 === 0
              ? '#15803d'
              : '#16a34a';

          ctx.fillRect(
            x * tileSize,
            y * tileSize,
            tileSize,
            tileSize
          );
        }
      }

      ctx.fillStyle = '#a16207';
      ctx.fillRect(200, 0, 40, 480);
      ctx.fillRect(0, 200, 480, 40);

      ctx.fillStyle = '#ca8a04';

      for (let i = 0; i < 12; i++) {
        ctx.fillRect(205 + (i % 2) * 12, i * 40 + 8, 5, 5);
        ctx.fillRect(i * 40 + 7, 205 + (i % 2) * 12, 5, 5);
      }

      for (let i = 0; i < 28; i++) {
        const fx = (i * 73 + 19) % 470;
        const fy = (i * 47 + 31) % 470;

        if ((fx > 185 && fx < 255) || (fy > 185 && fy < 255)) continue;

        ctx.fillStyle = i % 2 === 0 ? '#f9a8d4' : '#fde68a';
        ctx.fillRect(fx, fy, 4, 4);

        ctx.fillStyle = '#166534';
        ctx.fillRect(fx + 1, fy + 4, 2, 4);
      }

      bushes.forEach((b) => {
        ctx.fillStyle = '#14532d';

        ctx.fillRect(
          b.x * tileSize + 4,
          b.y * tileSize + 4,
          tileSize - 8,
          tileSize - 8
        );

        ctx.fillStyle = '#22c55e';

        ctx.fillRect(
          b.x * tileSize + 8,
          b.y * tileSize + 8,
          tileSize - 16,
          tileSize - 16
        );
      });

      ctx.fillStyle = '#ef4444';

      ctx.fillRect(
        healCenter.x * tileSize + 4,
        healCenter.y * tileSize + 4,
        tileSize - 8,
        tileSize - 8
      );

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';

      ctx.fillText(
        '+',
        healCenter.x * tileSize + 14,
        healCenter.y * tileSize + 26
      );

      const px = playerPos.x * tileSize;
      const py = playerPos.y * tileSize;

      ctx.fillStyle = '#3b82f6';

      ctx.fillRect(
        px + 8,
        py + 8,
        24,
        24
      );

      ctx.fillStyle = '#fca5a5';

      ctx.fillRect(
        px + 12,
        py + 4,
        16,
        12
      );

      ctx.fillStyle = '#000000';

      ctx.fillRect(px + 16, py + 8, 3, 3);
      ctx.fillRect(px + 23, py + 8, 3, 3);

    } else if (gameState === 'BATTLE') {

      ctx.fillStyle = '#172554';
      ctx.fillRect(0, 0, 480, 480);

      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, 0, 480, 170);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 145, 480, 95);

      ctx.fillStyle = '#334155';
      ctx.fillRect(25, 115, 75, 70);
      ctx.fillRect(55, 88, 38, 30);
      ctx.fillRect(320, 125, 105, 60);
      ctx.fillRect(360, 95, 45, 35);

      ctx.fillStyle = '#64748b';
      ctx.fillRect(63, 105, 18, 13);
      ctx.fillRect(370, 110, 20, 12);

      ctx.fillStyle = '#bfdbfe';
      ctx.fillRect(55, 42, 52, 10);
      ctx.fillRect(68, 32, 28, 10);
      ctx.fillRect(340, 55, 66, 10);
      ctx.fillRect(355, 45, 35, 10);

      ctx.fillStyle = '#14532d';
      ctx.fillRect(0, 235, 480, 245);

      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 235, 480, 18);

      ctx.fillStyle = '#22c55e';

      for (let i = 0; i < 45; i++) {
        const gx = (i * 53 + 13) % 480;
        const gy = 260 + ((i * 37) % 205);

        ctx.fillRect(gx, gy, 4, 4);
      }

      ctx.fillStyle = '#365314';

      ctx.beginPath();
      ctx.ellipse(355, 205, 82, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#4d7c0f';

      ctx.beginPath();
      ctx.ellipse(355, 198, 75, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#365314';

      ctx.beginPath();
      ctx.ellipse(120, 365, 105, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#4d7c0f';

      ctx.beginPath();
      ctx.ellipse(120, 357, 96, 19, 0, 0, Math.PI * 2);
      ctx.fill();

      const currentMon = team[activeMonIndex];

      drawDetailedPixelMonster(
        ctx,
        78,
        285,
        currentMon,
        2.5
      );

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(15, 395, 210, 65);

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(15, 395, 210, 65);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px monospace';

      ctx.fillText(
        `${currentMon.name} Lv.${currentMon.level}`,
        25,
        416
      );

      drawHpBar(
        ctx,
        25,
        430,
        185,
        currentMon.currentHp,
        currentMon.maxHp
      );

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '10px monospace';

      ctx.fillText(
        `HP ${currentMon.currentHp}/${currentMon.maxHp}`,
        25,
        449
      );

      if (wildMon) {

        drawDetailedPixelMonster(
          ctx,
          315,
          105,
          wildMon,
          2.5
        );

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(255, 15, 210, 65);

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.strokeRect(255, 15, 210, 65);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 13px monospace';

        ctx.fillText(
          `${wildMon.name} Lv.${wildMon.level}`,
          265,
          36
        );

        drawHpBar(
          ctx,
          265,
          49,
          185,
          wildMon.currentHp,
          wildMon.maxHp
        );

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '10px monospace';

        ctx.fillText(
          `HP ${wildMon.currentHp}/${wildMon.maxHp}`,
          265,
          68
        );
      }
    }

  }, [gameState, playerPos, team, wildMon, activeMonIndex]);

  const gainExp = (amount) => {
    setTeam((prevTeam) => {
      return prevTeam.map((mon, idx) => {
        if (idx !== activeMonIndex) return mon;

        let newExp = mon.exp + amount;
        let newLevel = mon.level;

        let currentMonData = { ...mon };

        if (newExp >= mon.nextExp) {
          newLevel += 1;
          newExp -= mon.nextExp;

          if (
            currentMonData.evolution &&
            newLevel >= currentMonData.evoLevel
          ) {
            const evoData =
              MONSTERS_DB[currentMonData.evolution];

            alert(
              `✨ SEU MONSTRO EVOLUIU PARA ${evoData.name}! ✨`
            );

            currentMonData = {
              ...evoData,
              level: newLevel,
              currentHp: evoData.baseHp,
              maxHp: evoData.baseHp,
              exp: newExp,
              nextExp: mon.nextExp * 2
            };

          } else {
            currentMonData = {
              ...currentMonData,
              level: newLevel,
              maxHp: mon.maxHp + 20,
              currentHp: mon.maxHp + 20,
              exp: newExp,
              nextExp: mon.nextExp * 2
            };
          }

        } else {
          currentMonData.exp = newExp;
        }

        return currentMonData;
      });
    });
  };

  const handleAttack = (move) => {
    if (!wildMon || wildMon.currentHp <= 0) return;

    const currentMon = team[activeMonIndex];

    const damage = Math.floor(
      move.power * (currentMon.baseAtk / 15)
    );

    const newWildHp = Math.max(
      0,
      wildMon.currentHp - damage
    );

    setWildMon((prev) => ({
      ...prev,
      currentHp: newWildHp
    }));

    setBattleLog(
      `${currentMon.name} usou ${move.name} (${damage} dano)!`
    );

    if (newWildHp <= 0) {
      setTimeout(() => {
        setBattleLog(
          `Venceu o ${wildMon.name}! +40 EXP!`
        );

        gainExp(40);

        setTimeout(() => {
          setGameState('EXPLORE');
          setWildMon(null);
        }, 1500);

      }, 800);

    } else {
      setTimeout(() => {
        const enemyMove =
          wildMon.moves[
            Math.floor(
              Math.random() * wildMon.moves.length
            )
          ];

        const enemyDmg = Math.floor(
          enemyMove.power * (wildMon.baseAtk / 18)
        );

        setTeam((prev) => {
          return prev.map((mon, idx) => {
            if (idx !== activeMonIndex) return mon;

            return {
              ...mon,
              currentHp: Math.max(
                0,
                mon.currentHp - enemyDmg
              )
            };
          });
        });

        setBattleLog(
          `${wildMon.name} usou ${enemyMove.name} (${enemyDmg} dano)!`
        );

      }, 1000);
    }
  };

  const handleCatch = () => {
    if (!wildMon) return;

    if (Math.random() < 0.6) {
      setBattleLog(
        `🎉 Capturou ${wildMon.name}!`
      );

      setTeam((prev) => [
        ...prev,
        {
          ...wildMon,
          exp: 0,
          nextExp: 60
        }
      ]);

      setTimeout(() => {
        setGameState('EXPLORE');
        setWildMon(null);
      }, 1500);

    } else {
      setBattleLog(
        `O ${wildMon.name} escapou!`
      );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#090d16',
        color: '#fff',
        fontFamily: 'monospace',
        padding: 20
      }}
    >

      <h1
        style={{
          marginBottom: 10,
          color: '#60a5fa',
          textShadow: '3px 3px #1e3a8a',
          letterSpacing: 3
        }}
      >
        👾 MONSTER REALM
      </h1>

      <p
        style={{
          color: '#94a3b8',
          marginBottom: 20
        }}
      >
        PIXEL ART RPG ADVENTURE
      </p>

      <canvas
        ref={canvasRef}
        width={960}
        height={960}
        style={{
          width: '480px',
          height: '480px',
          maxWidth: '100%',
          imageRendering: 'pixelated',
          border: '5px solid #475569',
          borderRadius: 8,
          backgroundColor: '#000',
          boxShadow: '0 0 30px rgba(59,130,246,0.25)'
        }}
      />

      <div
        style={{
          width: 480,
          maxWidth: '100%',
          marginTop: 15,
          padding: 15,
          background: '#1e293b',
          border: '2px solid #475569',
          borderRadius: 8,
          boxSizing: 'border-box'
        }}
      >
        <p
          style={{
            color: '#fbbf24',
            fontSize: 13,
            margin: 0
          }}
        >
          {battleLog ||
            'Use WASD ou as Setas para explorar o mundo!'}
        </p>
      </div>

      {gameState === 'BATTLE' && (

        <div
          style={{
            width: 480,
            maxWidth: '100%',
            marginTop: 12,
            padding: 15,
            background: '#172554',
            border: '2px solid #3b82f6',
            borderRadius: 8,
            boxSizing: 'border-box'
          }}
        >

          <h3
            style={{
              color: '#93c5fd',
              marginTop: 0,
              textAlign: 'center'
            }}
          >
            ⚔️ ESCOLHA SEU ATAQUE
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10
            }}
          >

            {activeMon.moves.map((move, i) => (
              <button
                key={i}
                onClick={() => handleAttack(move)}
                disabled={!wildMon || wildMon.currentHp <= 0}
                style={{
                  padding: 12,
                  background: '#312e81',
                  color: '#ffffff',
                  border: '2px solid #6366f1',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontFamily: 'monospace'
                }}
              >
                {move.name}
                <br />
                <small>
                  Poder: {move.power}
                </small>
              </button>
            ))}

            <button
              onClick={handleCatch}
              disabled={!wildMon || wildMon.currentHp <= 0}
              style={{
                padding: 12,
                background: '#15803d',
                color: '#ffffff',
                border: '2px solid #4ade80',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                gridColumn: 'span 2'
              }}
            >
              🎯 CAPTURAR MONSTRO
            </button>

          </div>
        </div>
      )}

      <div
        style={{
          width: 480,
          maxWidth: '100%',
          marginTop: 15,
          padding: 15,
          background: '#1e293b',
          border: '2px solid #475569',
          borderRadius: 8,
          boxSizing: 'border-box'
        }}
      >

        <h3
          style={{
            color: '#60a5fa',
            marginTop: 0
          }}
        >
          🏆 MINHA EQUIPE
        </h3>

        {team.map((mon, index) => (
          <div
            key={index}
            style={{
              padding: 12,
              marginBottom: 10,
              background: '#334155',
              border: '1px solid #64748b',
              borderRadius: 6
            }}
          >
            <strong
              style={{
                color: '#f8fafc',
                fontSize: 15
              }}
            >
              {mon.name} - Nível {mon.level}
            </strong>

            <p style={{ color: '#cbd5e1' }}>
              Tipo: {mon.type}
            </p>

            <p style={{ color: '#86efac' }}>
              Vida: {mon.currentHp}/{mon.maxHp}
            </p>

            <div
              style={{
                height: 8,
                background: '#475569',
                borderRadius: 10,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${Math.max(0, mon.currentHp / mon.maxHp * 100)}%`,
                  height: '100%',
                  background: '#22c55e'
                }}
              />
            </div>

            <p style={{ color: '#fbbf24' }}>
              EXP: {mon.exp}/{mon.nextExp}
            </p>

          </div>
        ))}

      </div>

      <div
        style={{
          width: 480,
          maxWidth: '100%',
          marginTop: 15,
          padding: 15,
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: 8,
          boxSizing: 'border-box',
          textAlign: 'center'
        }}
      >
        <p style={{ color: '#94a3b8', fontSize: 12 }}>
          WASD ou SETAS: movimentar
        </p>

        <p style={{ color: '#94a3b8', fontSize: 12 }}>
          ENTRE NOS ARBUSTOS PARA ENCONTRAR MONSTROS
        </p>

        <p style={{ color: '#4ade80', fontSize: 12 }}>
          ENCONTRE O CENTRO DE CURA PARA RECUPERAR SUA EQUIPE
        </p>
      </div>

    </div>
  );
}
