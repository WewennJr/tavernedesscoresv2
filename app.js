// Application principale
const app = {
    state: {
        allPlayers: ['Joueur 1', 'Joueur 2', 'Joueur 3', 'Joueur 4'],
        selectedGame: null,
        activePlayers: [],
        teams: [],
        rounds: [],
        scores: {}
    },
    
    // Initialisation
    init() {
        this.loadData();
        this.updatePlayerList();
    },
    
    // Sauvegarde et chargement
    loadData() {
        const saved = sessionStorage.getItem('scoreTrackerData');
        if (saved) {
            const data = JSON.parse(saved);
            this.state.allPlayers = data.allPlayers || this.state.allPlayers;
        }
    },
    
    saveData() {
        sessionStorage.setItem('scoreTrackerData', JSON.stringify({
            allPlayers: this.state.allPlayers,
            selectedGame: this.state.selectedGame,
            activePlayers: this.state.activePlayers,
            teams: this.state.teams,
            rounds: this.state.rounds,
            scores: this.state.scores
        }));
    },
    
    // Navigation
    goHome() {
        document.getElementById('home-screen').classList.remove('hidden');
        document.getElementById('player-selection-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.add('hidden');
        this.state.selectedGame = null;
        this.state.activePlayers = [];
        this.state.teams = [];
        this.saveData();
    },
    
    selectGame(gameType) {
        this.state.selectedGame = gameType;
        const game = GAMES_CONFIG[gameType];
        
        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('player-selection-screen').classList.remove('hidden');
        
        this.showPlayerSelection(game);
    },
    
    showPlayerSelection(game) {
        const content = document.getElementById('player-selection-content');
        
        let html = `
            <div class="info-box">
                <strong>${game.name}</strong> - ${game.description}<br>
                Nombre de joueurs : ${game.minPlayers} à ${game.maxPlayers}
            </div>
        `;
        
        if (game.hasTeams) {
            html += `
                <div class="warning-box">
                    Ce jeu se joue en équipes de 2. Sélectionnez exactement 4 joueurs.
                </div>
                <div class="team-section">
                    <h3>Équipe 1</h3>
                    ${this.state.allPlayers.slice(0, Math.ceil(this.state.allPlayers.length / 2)).map((p, i) => `
                        <label class="player-checkbox">
                            <input type="checkbox" value="${p}" data-team="0" onchange="app.handleTeamSelection()">
                            ${p}
                        </label>
                    `).join('')}
                </div>
                <div class="team-section">
                    <h3>Équipe 2</h3>
                    ${this.state.allPlayers.slice(Math.ceil(this.state.allPlayers.length / 2)).map((p, i) => `
                        <label class="player-checkbox">
                            <input type="checkbox" value="${p}" data-team="1" onchange="app.handleTeamSelection()">
                            ${p}
                        </label>
                    `).join('')}
                </div>
            `;
        } else {
            html += `<h3>Sélectionnez les joueurs :</h3>`;
            html += this.state.allPlayers.map(p => `
                <label class="player-checkbox">
                    <input type="checkbox" value="${p}" onchange="app.handlePlayerSelection()">
                    ${p}
                </label>
            `).join('');
        }
        
        content.innerHTML = html;
    },
    
    handlePlayerSelection() {
        const checkboxes = document.querySelectorAll('#player-selection-content input[type="checkbox"]:checked');
        this.state.activePlayers = Array.from(checkboxes).map(cb => cb.value);
    },
    
    handleTeamSelection() {
        const checkboxes = document.querySelectorAll('#player-selection-content input[type="checkbox"]:checked');
        this.state.teams = [[], []];
        this.state.activePlayers = [];
        
        checkboxes.forEach(cb => {
            const team = parseInt(cb.dataset.team);
            this.state.teams[team].push(cb.value);
            this.state.activePlayers.push(cb.value);
        });
    },
    
    startGameWithPlayers() {
        const game = GAMES_CONFIG[this.state.selectedGame];
        
        if (this.state.activePlayers.length < game.minPlayers || 
            this.state.activePlayers.length > game.maxPlayers) {
            alert(`Veuillez sélectionner entre ${game.minPlayers} et ${game.maxPlayers} joueurs.`);
            return;
        }
        
        if (game.hasTeams) {
            if (this.state.teams[0].length !== 2 || this.state.teams[1].length !== 2) {
                alert('Chaque équipe doit avoir exactement 2 joueurs.');
                return;
            }
        }
        
        // Initialisation des scores
        this.state.rounds = [];
        this.state.scores = {};
        this.state.activePlayers.forEach(p => this.state.scores[p] = 0);
        
        // Affichage de l'écran de jeu
        document.getElementById('player-selection-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        
        document.getElementById('game-title').textContent = `${game.icon} ${game.name}`;
        
        this.updateScoreDisplay();
        this.saveData();
    },
    
    resetGame() {
        if (confirm('Voulez-vous vraiment réinitialiser la partie ?')) {
            this.state.rounds = [];
            this.state.scores = {};
            this.state.activePlayers.forEach(p => this.state.scores[p] = 0);
            this.updateScoreDisplay();
            this.saveData();
        }
    },
    
    // Gestion des joueurs
    addPlayer() {
        const input = document.getElementById('new-player-name');
        const name = input.value.trim();
        if (name && !this.state.allPlayers.includes(name)) {
            this.state.allPlayers.push(name);
            input.value = '';
            this.updatePlayerList();
            this.saveData();
        }
    },
    
    removePlayer(name) {
        if (confirm(`Supprimer ${name} ?`)) {
            this.state.allPlayers = this.state.allPlayers.filter(p => p !== name);
            this.updatePlayerList();
            this.saveData();
        }
    },
    
    updatePlayerList() {
        const list = document.getElementById('player-list');
        if (list) {
            list.innerHTML = this.state.allPlayers.map(p => `
                <div class="player-item">
                    <span>${p}</span>
                    <button class="btn btn-danger btn-small" onclick="app.removePlayer('${p}')">Supprimer</button>
                </div>
            `).join('');
        }
    },
    
    // Modals
    showSettings() {
        this.updatePlayerList();
        document.getElementById('settings-modal').style.display = 'block';
    },
    
    showNewRoundModal() {
        const game = GAMES_CONFIG[this.state.selectedGame];
        const form = document.getElementById('round-form');
        
        if (game.hasTeams) {
            form.innerHTML = game.getRoundForm(this.state.activePlayers, this.state.teams);
        } else {
            form.innerHTML = game.getRoundForm(this.state.activePlayers);
        }
        
        document.getElementById('new-round-modal').style.display = 'block';
    },
    
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    },
    
    // Soumission de manche
    submitRound() {
        const game = GAMES_CONFIG[this.state.selectedGame];
        const form = document.getElementById('round-form');
        const formData = {};
        
        // Récupération des données du formulaire
        form.querySelectorAll('input, select').forEach(input => {
            const id = input.id;
            if (id) {
                formData[id] = input.value;
            }
        });
        
        // Calcul des scores
        let roundData;
        if (game.hasTeams) {
            roundData = game.calculateRound(formData, this.state.activePlayers, this.state.scores, this.state.teams);
        } else {
            roundData = game.calculateRound(formData, this.state.activePlayers, this.state.scores);
        }
        
        this.state.rounds.push(roundData);
        
        this.updateScoreDisplay();
        this.closeModal('new-round-modal');
        this.saveData();
    },
    
    // Affichage des scores
    updateScoreDisplay() {
        const display = document.getElementById('score-display');
        const game = GAMES_CONFIG[this.state.selectedGame];
        
        let html = '<table class="score-table"><thead><tr><th>Manche</th>';
        
        if (game.hasTeams) {
            html += `<th>Équipe 1<br><small>${this.state.teams[0].join(' & ')}</small></th>`;
            html += `<th>Équipe 2<br><small>${this.state.teams[1].join(' & ')}</small></th>`;
        } else {
            this.state.activePlayers.forEach(p => html += `<th>${p}</th>`);
        }
        
        html += '<th>Détails</th></tr></thead><tbody>';
        
        // Affichage des manches
        this.state.rounds.forEach((round, idx) => {
            html += `<tr><td><strong>Manche ${idx + 1}</strong></td>`;
            
            if (game.hasTeams) {
                const team1Total = this.state.teams[0].reduce((sum, p) => sum + (this.state.scores[p] || 0), 0);
                const team2Total = this.state.teams[1].reduce((sum, p) => sum + (this.state.scores[p] || 0), 0);
                
                html += `<td>${team1Total}</td>`;
                html += `<td>${team2Total}</td>`;
            } else {
                // Calcul des scores intermédiaires pour cette manche
                const scoresAtRound = this.calculateScoresAtRound(idx);
                this.state.activePlayers.forEach(p => {
                    html += `<td>${scoresAtRound[p]}</td>`;
                });
            }
            
            html += `<td><div class="round-details">${round.details}</div></td>`;
            html += '</tr>';
        });
        
        // Ligne des totaux
        html += '<tr class="total-row"><td>TOTAL</td>';
        
        if (game.hasTeams) {
            const team1Total = this.state.teams[0].reduce((sum, p) => sum + (this.state.scores[p] || 0), 0);
            const team2Total = this.state.teams[1].reduce((sum, p) => sum + (this.state.scores[p] || 0), 0);
            html += `<td>${team1Total}</td><td>${team2Total}</td>`;
        } else {
            this.state.activePlayers.forEach(p => {
                html += `<td>${this.state.scores[p] || 0}</td>`;
            });
        }
        
        html += '<td></td></tr></tbody></table>';
        
        display.innerHTML = html;
    },
    
    calculateScoresAtRound(roundIndex) {
        const tempScores = {};
        this.state.activePlayers.forEach(p => tempScores[p] = 0);
        
        const game = GAMES_CONFIG[this.state.selectedGame];
        
        // Recalcul jusqu'à la manche spécifiée
        for (let i = 0; i <= roundIndex; i++) {
            const round = this.state.rounds[i];
            // Cette partie nécessiterait de stocker les deltas par manche
            // Pour simplifier, on affiche juste le total actuel
        }
        
        return this.state.scores;
    }
};

// Initialisation au chargement
window.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Fermeture des modals en cliquant à l'extérieur
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});