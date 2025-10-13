// Configuration des jeux
const GAMES_CONFIG = {
    tarot: {
        name: 'Tarot',
        icon: '🃏',
        minPlayers: 3,
        maxPlayers: 5,
        hasTeams: false,
        description: 'Jeu de tarot français traditionnel',
        
        getRoundForm: (players) => `
            <div class="input-group">
                <label>Donneur</label>
                <select id="dealer">
                    ${players.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
            </div>
            <div class="input-group">
                <label>Preneur</label>
                <select id="taker">
                    ${players.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
            </div>
            <div class="input-group">
                <label>Contrat</label>
                <select id="contract">
                    <option value="petite">Petite</option>
                    <option value="garde">Garde</option>
                    <option value="garde-sans">Garde Sans</option>
                    <option value="garde-contre">Garde Contre</option>
                </select>
            </div>
            <div class="input-group">
                <label>Points réalisés (sur 91)</label>
                <input type="number" id="points" value="41" min="0" max="91">
            </div>
            <div class="input-group">
                <label>Nombre de bouts</label>
                <input type="number" id="bouts" value="1" min="0" max="3">
            </div>
            <div class="input-group">
                <label>Petit au bout</label>
                <select id="petit-bout">
                    <option value="none">Non</option>
                    <option value="attaque">Attaque (preneur)</option>
                    <option value="defense">Défense</option>
                </select>
            </div>
            <div class="input-group">
                <label>Poignée</label>
                <select id="poignee">
                    <option value="none">Aucune</option>
                    <option value="simple-attaque">Simple (Attaque)</option>
                    <option value="simple-defense">Simple (Défense)</option>
                    <option value="double-attaque">Double (Attaque)</option>
                    <option value="double-defense">Double (Défense)</option>
                    <option value="triple-attaque">Triple (Attaque)</option>
                    <option value="triple-defense">Triple (Défense)</option>
                </select>
            </div>
        `,
        
        calculateRound: (formData, players, scores) => {
            const taker = formData.taker;
            const contract = formData.contract;
            const points = parseInt(formData.points);
            const bouts = parseInt(formData.bouts);
            const petitBout = formData['petit-bout'];
            const poignee = formData.poignee;
            
            const required = [56, 51, 41, 36][bouts];
            const diff = points - required;
            
            const multipliers = {
                'petite': 1,
                'garde': 2,
                'garde-sans': 4,
                'garde-contre': 6
            };
            
            let baseScore = (25 + Math.abs(diff)) * multipliers[contract];
            
            // Petit au bout
            if (petitBout !== 'none') {
                baseScore += (petitBout === 'attaque' ? 10 : -10) * multipliers[contract];
            }
            
            // Poignée
            const poigneeBonus = {
                'simple-attaque': 20,
                'simple-defense': -20,
                'double-attaque': 30,
                'double-defense': -30,
                'triple-attaque': 40,
                'triple-defense': -40
            };
            if (poignee !== 'none') {
                baseScore += poigneeBonus[poignee];
            }
            
            const numDefenders = players.length - 1;
            const won = diff >= 0;
            
            if (won) {
                scores[taker] += baseScore * numDefenders;
                players.forEach(p => {
                    if (p !== taker) scores[p] -= baseScore;
                });
            } else {
                scores[taker] -= baseScore * numDefenders;
                players.forEach(p => {
                    if (p !== taker) scores[p] += baseScore;
                });
            }
            
            return {
                type: 'tarot',
                taker,
                contract,
                points,
                bouts,
                required,
                won,
                baseScore,
                petitBout,
                poignee,
                details: `${taker} - ${contract} - ${points}pts (${bouts} bouts) - ${won ? 'Gagné' : 'Perdu'}`
            };
        }
    },
    
    belote: {
        name: 'Belote',
        icon: '🂡',
        minPlayers: 4,
        maxPlayers: 4,
        hasTeams: true,
        description: 'Belote classique en équipe',
        
        getRoundForm: (players, teams) => `
            <div class="input-group">
                <label>Équipe 1 (${teams[0].join(' & ')})</label>
                <input type="number" id="team1-score" value="0" min="0">
            </div>
            <div class="input-group">
                <label>Équipe 2 (${teams[1].join(' & ')})</label>
                <input type="number" id="team2-score" value="0" min="0">
            </div>
            <div class="info-box">
                <strong>Rappel :</strong> Total de 162 points par donne (+ annonces éventuelles)
            </div>
        `,
        
        calculateRound: (formData, players, scores, teams) => {
            const team1Score = parseInt(formData['team1-score']);
            const team2Score = parseInt(formData['team2-score']);
            
            teams[0].forEach(p => scores[p] += team1Score);
            teams[1].forEach(p => scores[p] += team2Score);
            
            return {
                type: 'belote',
                team1: team1Score,
                team2: team2Score,
                details: `${teams[0].join('/')} : ${team1Score} - ${teams[1].join('/')} : ${team2Score}`
            };
        }
    },
    
    coinche: {
        name: 'Coinche',
        icon: '🎯',
        minPlayers: 4,
        maxPlayers: 4,
        hasTeams: true,
        description: 'Belote coinchée',
        
        getRoundForm: (players, teams) => `
            <div class="input-group">
                <label>Équipe preneur</label>
                <select id="taking-team">
                    <option value="0">Équipe 1 (${teams[0].join(' & ')})</option>
                    <option value="1">Équipe 2 (${teams[1].join(' & ')})</option>
                </select>
            </div>
            <div class="input-group">
                <label>Contrat annoncé</label>
                <input type="number" id="contract" value="80" min="80" max="160" step="10">
            </div>
            <div class="input-group">
                <label>Points réalisés par le preneur</label>
                <input type="number" id="points" value="0" min="0">
            </div>
            <div class="input-group">
                <label>Coinche ?</label>
                <select id="coinche">
                    <option value="none">Non</option>
                    <option value="coinche">Coinche</option>
                    <option value="surcoinche">Surcoinche</option>
                </select>
            </div>
        `,
        
        calculateRound: (formData, players, scores, teams) => {
            const takingTeam = parseInt(formData['taking-team']);
            const contract = parseInt(formData.contract);
            const points = parseInt(formData.points);
            const coinche = formData.coinche;
            
            const multiplier = coinche === 'surcoinche' ? 4 : coinche === 'coinche' ? 2 : 1;
            const won = points >= contract;
            
            let teamScore;
            if (won) {
                teamScore = (contract + points) * multiplier;
            } else {
                teamScore = -contract * multiplier;
            }
            
            const defendingTeam = takingTeam === 0 ? 1 : 0;
            const defendingScore = won ? 0 : 160 * multiplier;
            
            teams[takingTeam].forEach(p => scores[p] += teamScore);
            teams[defendingTeam].forEach(p => scores[p] += defendingScore);
            
            return {
                type: 'coinche',
                takingTeam,
                contract,
                points,
                won,
                coinche,
                details: `${teams[takingTeam].join('/')} annonce ${contract} - ${won ? 'Gagné' : 'Perdu'} avec ${points}pts${coinche !== 'none' ? ' (' + coinche + ')' : ''}`
            };
        }
    },
    
    rami: {
        name: 'Rami',
        icon: '🎴',
        minPlayers: 2,
        maxPlayers: 6,
        hasTeams: false,
        description: 'Rami classique',
        
        getRoundForm: (players) => `
            <div class="input-group">
                <label>Gagnant de la manche</label>
                <select id="winner">
                    ${players.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
            </div>
            ${players.map(p => `
                <div class="input-group">
                    <label>Points restants pour ${p}</label>
                    <input type="number" id="score-${p}" value="0" min="0">
                </div>
            `).join('')}
            <div class="info-box">
                Les points restants en main comptent négativement pour tous sauf le gagnant
            </div>
        `,
        
        calculateRound: (formData, players, scores) => {
            const winner = formData.winner;
            let totalPenalty = 0;
            
            players.forEach(p => {
                const points = parseInt(formData[`score-${p}`]);
                if (p !== winner) {
                    scores[p] -= points;
                    totalPenalty += points;
                }
            });
            
            scores[winner] += totalPenalty;
            
            return {
                type: 'rami',
                winner,
                details: `${winner} gagne la manche (+${totalPenalty}pts)`
            };
        }
    },
    
    poker: {
        name: 'Poker',
        icon: '🃏',
        minPlayers: 2,
        maxPlayers: 10,
        hasTeams: false,
        description: 'Poker - Comptage des gains/pertes',
        
        getRoundForm: (players) => `
            ${players.map(p => `
                <div class="input-group">
                    <label>${p} (+ gain / - perte)</label>
                    <input type="number" id="score-${p}" value="0">
                </div>
            `).join('')}
            <div class="info-box">
                Entrez les gains en positif et les pertes en négatif
            </div>
        `,
        
        calculateRound: (formData, players, scores) => {
            players.forEach(p => {
                const amount = parseInt(formData[`score-${p}`]);
                scores[p] += amount;
            });
            
            return {
                type: 'poker',
                details: 'Main jouée'
            };
        }
    },
    
    rummikub: {
        name: 'Rummikub',
        icon: '🎲',
        minPlayers: 2,
        maxPlayers: 4,
        hasTeams: false,
        description: 'Rummikub',
        
        getRoundForm: (players) => `
            <div class="input-group">
                <label>Gagnant de la manche</label>
                <select id="winner">
                    ${players.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
            </div>
            ${players.map(p => `
                <div class="input-group">
                    <label>Points restants pour ${p}</label>
                    <input type="number" id="score-${p}" value="0" min="0">
                </div>
            `).join('')}
        `,
        
        calculateRound: (formData, players, scores) => {
            const winner = formData.winner;
            let totalPenalty = 0;
            
            players.forEach(p => {
                const points = parseInt(formData[`score-${p}`]);
                if (p !== winner) {
                    scores[p] -= points;
                    totalPenalty += points;
                }
            });
            
            scores[winner] += totalPenalty;
            
            return {
                type: 'rummikub',
                winner,
                details: `${winner} gagne (+${totalPenalty}pts)`
            };
        }
    },
    
    uno: {
        name: 'UNO',
        icon: '🌈',
        minPlayers: 2,
        maxPlayers: 10,
        hasTeams: false,
        description: 'UNO',
        
        getRoundForm: (players) => `
            <div class="input-group">
                <label>Gagnant de la manche</label>
                <select id="winner">
                    ${players.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
            </div>
            ${players.map(p => `
                <div class="input-group">
                    <label>Cartes restantes pour ${p}</label>
                    <input type="number" id="cards-${p}" value="0" min="0">
                </div>
            `).join('')}
            <div class="info-box">
                <strong>Valeurs :</strong> 0-9 = valeur faciale, +2/Inverse/Stop = 20pts, Joker/+4 = 50pts
            </div>
        `,
        
        calculateRound: (formData, players, scores) => {
            const winner = formData.winner;
            let totalPoints = 0;
            
            players.forEach(p => {
                const cards = parseInt(formData[`cards-${p}`]);
                if (p !== winner) {
                    totalPoints += cards;
                }
            });
            
            scores[winner] += totalPoints;
            
            return {
                type: 'uno',
                winner,
                details: `${winner} gagne (+${totalPoints}pts)`
            };
        }
    },
    
    yams: {
        name: 'Yams',
        icon: '🎲',
        minPlayers: 2,
        maxPlayers: 6,
        hasTeams: false,
        description: 'Yams / Yahtzee',
        
        getRoundForm: (players) => `
            ${players.map(p => `
                <div class="input-group">
                    <label>Score total de ${p}</label>
                    <input type="number" id="score-${p}" value="0" min="0">
                </div>
            `).join('')}
            <div class="info-box">
                Entrez le score final de chaque joueur pour cette partie
            </div>
        `,
        
        calculateRound: (formData, players, scores) => {
            players.forEach(p => {
                scores[p] = parseInt(formData[`score-${p}`]);
            });
            
            return {
                type: 'yams',
                details: 'Partie terminée'
            };
        }
    },
    
    '8americain': {
        name: '8 Américain',
        icon: '🎴',
        minPlayers: 2,
        maxPlayers: 8,
        hasTeams: false,
        description: '8 Américain',
        
        getRoundForm: (players) => `
            <div class="input-group">
                <label>Gagnant de la manche</label>
                <select id="winner">
                    ${players.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
            </div>
            ${players.map(p => `
                <div class="input-group">
                    <label>Cartes restantes pour ${p}</label>
                    <input type="number" id="cards-${p}" value="0" min="0">
                </div>
            `).join('')}
            <div class="info-box">
                Les cartes restantes comptent comme points négatifs
            </div>
        `,
        
        calculateRound: (formData, players, scores) => {
            const winner = formData.winner;
            let totalCards = 0;
            
            players.forEach(p => {
                const cards = parseInt(formData[`cards-${p}`]);
                if (p !== winner) {
                    scores[p] -= cards;
                    totalCards += cards;
                }
            });
            
            scores[winner] += totalCards;
            
            return {
                type: '8americain',
                winner,
                details: `${winner} gagne la manche (+${totalCards}pts)`
            };
        }
    },
    
    simple: {
        name: 'Compteur Simple',
        icon: '📊',
        minPlayers: 1,
        maxPlayers: 20,
        hasTeams: false,
        description: 'Score libre pour tout type de jeu',
        
        getRoundForm: (players) => `
            ${players.map(p => `
                <div class="input-group">
                    <label>${p}</label>
                    <input type="number" id="score-${p}" value="0">
                </div>
            `).join('')}
        `,
        
        calculateRound: (formData, players, scores) => {
            players.forEach(p => {
                const score = parseInt(formData[`score-${p}`]);
                scores[p] += score;
            });
            
            return {
                type: 'simple',
                details: 'Scores ajoutés'
            };
        }
    }
}