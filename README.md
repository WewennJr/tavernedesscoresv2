# 🍺 La Taverne des Scores V2

Bienvenue à La Taverne des Scores ! Une application web pour compter les points de vos jeux de cartes et de société en famille ou entre amis.

[![Démo](https://img.shields.io/badge/Démo-Voir%20le%20site-8B4513?style=for-the-badge)](https://sgrapy.github.io/tavernedesscores/)
[![License](https://img.shields.io/badge/License-MIT-FFD700?style=for-the-badge)](LICENSE)

## 🎮 Fonctionnalités

- **18 jeux disponibles** avec calculs automatiques des scores
- **Interface intuitive** avec thème taverne chaleureux
- **Gestion des joueurs** - Ajoutez vos amis une fois, sélectionnez-les à chaque partie
- **Gestion des équipes** pour les jeux en 2v2 (Belote, Coinche)
- **Historique des manches** avec détails complets
- **Sauvegarde automatique** en session
- **Responsive** - Fonctionne sur mobile, tablette et PC
- **100% gratuit** - Aucune inscription, aucune pub

## 🎴 Jeux Disponibles

### Jeux Classiques 🎴
- **🃏 Tarot** - 3 à 5 joueurs - Calcul automatique avec bouts, poignées, petit au bout
- **🂡 Belote** - 4 joueurs (2v2) - Comptage par équipe
- **🎯 Coinche** - 4 joueurs (2v2) - Avec multiplicateurs (coinche, surcoinche)
- **🎴 Rami** - 2 à 6 joueurs - Points restants en main
- **🎲 Simonette** - 2 à 6 joueurs - Jeu de dés
- **🌍 Tarot Africain** - 3 à 5 joueurs - Variante africaine

### Jeux Modernes 🎮
- **☁️ Skyjo** - 2 à 8 joueurs - Plus bas score gagne
- **🦜 Papayoo** - 3 à 8 joueurs - Évitez le Papayoo (40 points)
- **🌈 UNO** - 2 à 10 joueurs - Comptage des cartes restantes
- **🎲 Rummikub** - 2 à 4 joueurs - Points restants
- **🎲 Yams** - 2 à 6 joueurs - Score final

### Jeux d'Extérieur 🌳
- **🥏 Palet Breton** - 2 à 4 joueurs - Premier à 12 points
- **🎳 Mölkky** - 2 à 6 joueurs - Premier à 50 points (avec règle spéciale)
- **⚪ Pétanque** - 2 à 6 joueurs - Premier à 13 points

### Autres ⚙️
- **🎴 8 Américain** - 2 à 8 joueurs
- **🃏 Poker** - 2 à 10 joueurs - Gains/pertes
- **📊 Compteur Libre** - Personnalisable

## 🚀 Installation & Déploiement

### Utilisation directe
Le site fonctionne immédiatement sans installation ! Ouvrez simplement `index.html` dans votre navigateur.

### Déploiement sur GitHub Pages

1. **Fork ou clone ce repo**
```bash
git clone https://github.com/wewennjr/tavernedesscores.git
cd tavernedesscores
```

2. **Push vers votre repo GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

3. **Activer GitHub Pages**
   - Allez dans **Settings** → **Pages**
   - Sélectionnez la branche `main` et dossier `/root`
   - Cliquez sur **Save**
   - Votre site sera accessible à `https://votre-username.github.io/tavernedesscores/`

### Hébergement local
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js
npx serve

# Puis ouvrez http://localhost:8000
```

## 📱 Utilisation

1. **Paramètres** ⚙️
   - Ajoutez tous vos joueurs habituels (famille, amis)
   - Ces noms seront sauvegardés pour vos prochaines parties

2. **Choisir un jeu**
   - Cliquez sur le jeu de votre choix parmi les 18 disponibles

3. **Sélectionner les joueurs**
   - Cochez les joueurs qui participent à cette partie
   - Pour les jeux en équipe, sélectionnez 2 joueurs par équipe

4. **Jouer**
   - Cliquez sur "➕ Nouvelle Manche" après chaque manche
   - Remplissez les informations demandées
   - Les scores se calculent automatiquement !

5. **Suivi des scores**
   - Tableau avec historique complet
   - Détails de chaque manche
   - Affichage du joueur/équipe en tête

## 🛠️ Technologies

- **HTML5** - Structure
- **CSS3** - Design avec dégradés et animations
- **Vanilla JavaScript** - Logique et calculs
- **SessionStorage** - Sauvegarde des données

Aucune dépendance externe ! Le site fonctionne 100% en local.

## 🎨 Design

- **Thème Taverne** avec couleurs bois et or
- **Animations** sur les cartes de jeux
- **Responsive** - S'adapte à tous les écrans
- **Scrollbar personnalisée** pour l'immersion
- **Icons & Emojis** pour une interface vivante

## 📊 Structure du Code

```
tavernedesscores/
├── index.html          # Application complète (HTML + CSS + JS)
├── README.md           # Ce fichier
└── LICENSE             # Licence MIT
```

Le code est volontairement dans un seul fichier pour faciliter le déploiement et la maintenance.

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AjoutJeu`)
3. Commit vos changements (`git commit -m 'Ajout du jeu X'`)
4. Push vers la branche (`git push origin feature/AjoutJeu`)
5. Ouvrez une Pull Request

### Idées de contribution
- 🎮 Ajouter de nouveaux jeux
- 🐛 Corriger des bugs
- 🎨 Améliorer le design
- 📱 Optimiser pour mobile
- 🌍 Ajouter des traductions
- 💾 Ajouter l'export des scores en PDF/CSV
- 📊 Ajouter des statistiques

## 🐛 Bugs Connus

Aucun bug connu pour le moment ! Si vous en trouvez, merci d'ouvrir une [issue](https://github.com/wewennjr/tavernedesscores/issues).

## 📝 Changelog

### V2.0.0 (2024)
- ✨ Refonte complète du design (thème taverne)
- 🎮 18 jeux disponibles (contre 4 en V1)
- 📱 Optimisation mobile complète
- 🎯 Sélection des joueurs avant chaque partie
- 📋 Détails complets dans chaque manche
- 🏆 Affichage du joueur en tête
- 💾 Sauvegarde en sessionStorage

### V1.0.0 (Ancienne version)
- 🎴 4 jeux de base (Tarot, Belote, Coinche, Rami)
- 🎯 Comptage manuel des scores

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

Vous êtes libre de :
- ✅ Utiliser ce projet à des fins personnelles ou commerciales
- ✅ Modifier le code source
- ✅ Distribuer le projet
- ✅ Utiliser le code dans vos propres projets

## 💬 Contact & Support

- **GitHub Issues** : [Signaler un bug](https://github.com/wewennjr/tavernedesscores/issues)
- **Discussions** : [Proposer des idées](https://github.com/wewennjr/tavernedesscores/discussions)

## 🌟 Remerciements

Merci à tous ceux qui jouent à ces jeux en famille et entre amis ! 🎲🎴

Ce projet a été créé pour faciliter vos parties et vous permettre de profiter pleinement sans vous prendre la tête avec les calculs. 🍺

---

**Fait avec ❤️ pour les soirées jeux en famille**

🍺 Bonne partie ! 🎮
