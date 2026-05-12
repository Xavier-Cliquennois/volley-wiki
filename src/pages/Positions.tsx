import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ROLE_COLORS } from '../constants/positions';
import { Court, type CourtLayout } from '../components/court';
import { Head } from '../seo/Head';
import { DEFAULT_POSITION_CONFIG, TEAM_SIZES, TEAM_SIZE_LABEL, type TeamSizeSlug } from '../seo/constants';
import { buildArticle, buildBreadcrumb } from '../seo/structuredData';

const SLUG_TO_SIZE: Record<TeamSizeSlug, 4 | 5 | 6> = { '4v4': 4, '5v5': 5, '6v6': 6 };

type ZoneId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'L';
type TeamSize = 4 | 5 | 6;

type CourtPos = { x: number; y: number };

type ConfigPosition = {
  zoneId: ZoneId;
  number: string;
  name: string;
  role: string;
  description: string;
  skills: string[];
  traits: string[];
  court: CourtPos;
};

type Configuration = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  hasLibero: boolean;
  positions: ConfigPosition[];
};

const POS_6v6_GRID: Record<ZoneId, CourtPos> = {
  P4: { x: 20, y: 22 },
  P3: { x: 50, y: 22 },
  P2: { x: 80, y: 22 },
  P5: { x: 20, y: 75 },
  P6: { x: 50, y: 75 },
  P1: { x: 80, y: 75 },
  L:  { x: 50, y: 92 },
};

const COMMON_DESC: Record<ZoneId, Pick<ConfigPosition, 'number' | 'name'>> = {
  P4: { number: '④', name: 'Avant gauche' },
  P3: { number: '③', name: 'Avant centre' },
  P2: { number: '②', name: 'Avant droit' },
  P5: { number: '⑤', name: 'Arrière gauche' },
  P6: { number: '⑥', name: 'Arrière centre' },
  P1: { number: '①', name: 'Arrière droit (service)' },
  L:  { number: 'L', name: 'Libéro' },
};

const CONFIG_6V6_5_1: Configuration = {
  id: '5-1',
  name: 'Système 5-1 (standard)',
  shortName: '5-1',
  description: '1 passeur unique distribuant sur les 6 rotations (3 arrière avec pénétration + 3 avant) + 2 R4 + 2 centraux + 1 pointu (diagonalement opposé au passeur) + 1 libéro. Le système le plus utilisé en compétition haut niveau.',
  hasLibero: true,
  positions: [
    { ...COMMON_DESC.P4, zoneId: 'P4', role: 'Attaquant aile (Outside)', court: POS_6v6_GRID.P4,
      description: "Zone d'attaque principale. L'aile reçoit la majorité des balles hautes et doit être polyvalent : attaque, contre, réception. C'est aussi l'off-blocker côté gauche sur attaque Z4 adverse.",
      skills: ['Attaque', 'Contre', 'Réception', 'Service'],
      traits: ["Puissance et précision d'attaque", 'Grande envergure', 'Polyvalence', 'Endurance'] },
    { ...COMMON_DESC.P3, zoneId: 'P3', role: 'Central (Middle)', court: POS_6v6_GRID.P3,
      description: 'Joueur du filet en zone centrale. Contre les attaques adverses et frappe en tempo rapide (quick). Sur attaque adverse en aile, il ferme la diagonale en bloc à 2.',
      skills: ['Contre', 'Attaque rapide', 'Couverture de filet'],
      traits: ['Grande taille requise', 'Contre dominant', 'Tempos 1 et 2', 'Rôle défensif limité au filet'] },
    { ...COMMON_DESC.P2, zoneId: 'P2', role: 'Passeur (Setter)', court: POS_6v6_GRID.P2,
      description: "Le chef d'orchestre. Reçoit la 2ᵉ touche et distribue le jeu. En 5-1 il joue toutes les rotations : pénétration depuis P1, P6 ou P5 (arrière), distribution depuis P4, P3 ou P2 (avant). Cible : entre Z2 et Z3, ~1 m du filet.",
      skills: ['Passe en touche', 'Lecture du bloc', 'Communication', 'Pénétration'],
      traits: ['Précision technique maximale', 'Vision 360°', 'Sang-froid', 'Leadership'] },
    { ...COMMON_DESC.P5, zoneId: 'P5', role: 'Réception / défense', court: POS_6v6_GRID.P5,
      description: "Zone de réception et défense côté gauche. Souvent occupée par le 2ᵉ R4 en rotation arrière. Le libéro peut le remplacer.",
      skills: ['Manchette', 'Réception', 'Défense', 'Lecture'],
      traits: ['Lecture des attaques', 'Premier rideau', 'Couverture fond gauche', 'Souvent remplacé par libéro'] },
    { ...COMMON_DESC.P6, zoneId: 'P6', role: 'Défense centrale', court: POS_6v6_GRID.P6,
      description: 'Pivot défensif au fond du terrain. Couvre les balles longues et soutient ses coéquipiers. Le libéro y est souvent.',
      skills: ['Défense longue', 'Couverture', 'Soutien', 'Manchette'],
      traits: ['Lecture du jeu', 'Mobilité maximale', 'Communication arrière', 'Souvent remplacé par libéro'] },
    { ...COMMON_DESC.P1, zoneId: 'P1', role: 'Opposé (Opposite)', court: POS_6v6_GRID.P1,
      description: `L'opposé ("pointu") en opposition au passeur. Ne participe pas à la réception, c'est le finisseur. En arrière 3 rotations sur 6 (attaque depuis le fond — pipe).`,
      skills: ['Attaque forte', 'Service', 'Contre', 'Attaque arrière'],
      traits: ['Puissance maximale', 'Attaque back-row 3 rotations/6', 'Libéré de la réception', 'Synonyme : "pointu"'] },
    { ...COMMON_DESC.L, zoneId: 'L', role: 'Spécialiste défensif', court: POS_6v6_GRID.L,
      description: 'Spécialiste défensif en maillot contrastant. Remplace les arrières (P1, P5, P6) sans compter comme substitution. Restrictions FIVB : pas de contre, pas d\'attaque au-dessus du filet, pas de passe haute devant la ligne des 3 m pour un coéquipier qui attaque ensuite au-dessus du filet.',
      skills: ['Manchette', 'Réception', 'Défense', 'Lecture'],
      traits: ['Agilité maximale', 'Ne peut pas bloquer/attaquer au-dessus du filet', 'Pas de passe haute devant 3 m → attaquant', 'Remplacements illimités', 'Peut servir (FIVB 2021)'] },
  ],
};

const CONFIG_6V6_4_2: Configuration = {
  id: '4-2',
  name: 'Système 4-2 (débutant)',
  shortName: '4-2',
  description: '2 passeurs en opposition diagonale (P2 et P5) + 2 centraux + 2 R4. Toujours le passeur AVANT qui fait la 2ᵉ touche. Pas de pénétration : système le plus simple à apprendre.',
  hasLibero: false,
  positions: [
    { ...COMMON_DESC.P4, zoneId: 'P4', role: 'R4 (Outside)', court: POS_6v6_GRID.P4,
      description: "Aile gauche. Cible principale du passeur en zone 4.",
      skills: ['Attaque', 'Contre', 'Réception'],
      traits: ['Polyvalence', 'Cible n°1 du passeur', 'Réception en W'] },
    { ...COMMON_DESC.P3, zoneId: 'P3', role: 'Central (Middle)', court: POS_6v6_GRID.P3,
      description: 'Central avant : contre + attaque rapide quand la réception le permet.',
      skills: ['Contre', 'Attaque rapide'],
      traits: ['Contre dominant', 'Réception centrale en W'] },
    { ...COMMON_DESC.P2, zoneId: 'P2', role: 'Passeur 1 (avant)', court: POS_6v6_GRID.P2,
      description: "Passeur avant : il fait la 2ᵉ touche. Pas de pénétration, pas de réception. Distribue depuis sa position.",
      skills: ['Passe en touche', 'Distribution', 'Communication'],
      traits: ['Toujours en avant lors de la passe', 'Sort de la réception', 'Pas de pénétration'] },
    { ...COMMON_DESC.P5, zoneId: 'P5', role: 'Passeur 2 (arrière)', court: POS_6v6_GRID.P5,
      description: "Passeur 2, en opposition. Il joue uniquement comme arrière, ne fait PAS la 2ᵉ touche tant qu'il est arrière. Réceptionne et défend.",
      skills: ['Réception', 'Défense', 'Manchette'],
      traits: ['Devient passeur avant après rotation', 'Pas de passe quand arrière', 'Fait équipe en réception'] },
    { ...COMMON_DESC.P6, zoneId: 'P6', role: 'Central arrière', court: POS_6v6_GRID.P6,
      description: 'Central qui passe par les positions arrière. Réception centrale + défense.',
      skills: ['Défense', 'Manchette', 'Réception'],
      traits: ['Pivot défensif', 'Couvre le centre du fond'] },
    { ...COMMON_DESC.P1, zoneId: 'P1', role: 'R4 / serveur', court: POS_6v6_GRID.P1,
      description: 'Aile en rotation arrière, sert depuis P1 puis enchaîne réception/défense.',
      skills: ['Service', 'Réception', 'Défense'],
      traits: ['Serveur principal', 'Réception en W'] },
  ],
};

const CONFIG_6V6_6_2: Configuration = {
  id: '6-2',
  name: 'Système 6-2 (avancé)',
  shortName: '6-2',
  description: '2 passeurs polyvalents : distribuent UNIQUEMENT depuis l\'arrière (avec pénétration), deviennent attaquants droits (right-side) quand ils passent en avant. + 2 centraux + 2 R4 + 1 libéro. Avantage : toujours 3 attaquants au filet. Inconvénient : chimie passeur-attaquants diluée, et en variante avec doubles substitutions, consomme rapidement les 6 substitutions par set (Règle 15.6 FIVB).',
  hasLibero: true,
  positions: [
    { ...COMMON_DESC.P4, zoneId: 'P4', role: 'R4 (Outside)', court: POS_6v6_GRID.P4,
      description: 'Aile gauche, attaquant principal en zone 4.',
      skills: ['Attaque', 'Contre', 'Réception'],
      traits: ['Polyvalence', 'Réception à 3'] },
    { ...COMMON_DESC.P3, zoneId: 'P3', role: 'Central (Middle)', court: POS_6v6_GRID.P3,
      description: 'Central avant : contre + tempo 1.',
      skills: ['Contre', 'Attaque rapide'],
      traits: ['Contre dominant', 'Permutation sur les ailes'] },
    { ...COMMON_DESC.P2, zoneId: 'P2', role: 'Passeur-attaquant', court: POS_6v6_GRID.P2,
      description: "En 6-2 le joueur en avant (passeur ou pas) attaque. Quand le passeur est avant, il devient attaquant en zone 2. Le passeur arrière distribue.",
      skills: ['Attaque zone 2', 'Contre', 'Service'],
      traits: ['Polyvalent passe + attaque', 'Attaque en zone 2', '3 attaquants devant en permanence'] },
    { ...COMMON_DESC.P5, zoneId: 'P5', role: 'R4 (back)', court: POS_6v6_GRID.P5,
      description: 'Aile en rotation arrière. Réception et défense.',
      skills: ['Réception', 'Manchette', 'Défense'],
      traits: ['Réception à 3', 'Souvent remplacé par libéro'] },
    { ...COMMON_DESC.P6, zoneId: 'P6', role: 'Central arrière', court: POS_6v6_GRID.P6,
      description: 'Central en rotation arrière, souvent remplacé par le libéro pour la réception et défense.',
      skills: ['Défense', 'Manchette'],
      traits: ['Souvent remplacé par libéro', 'Pivot défensif'] },
    { ...COMMON_DESC.P1, zoneId: 'P1', role: 'Passeur (pénétrant)', court: POS_6v6_GRID.P1,
      description: 'Passeur arrière qui pénètre dès le service vers la zone 2-3 pour distribuer. En face de lui le 2ᵉ passeur en P2 attaque.',
      skills: ['Pénétration', 'Passe en touche', 'Service'],
      traits: ['Pénètre depuis P1 → zone 2/3', 'Distribue', 'Sa rotation alterne avec le 2ᵉ passeur'] },
    { ...COMMON_DESC.L, zoneId: 'L', role: 'Libéro', court: POS_6v6_GRID.L,
      description: 'Libéro standard, remplace les centraux en rotation arrière.',
      skills: ['Manchette', 'Réception', 'Défense'],
      traits: ['Remplace P5/P6', 'Maillot contrastant'] },
  ],
};

const CONFIG_5V5_PENTAGON: Configuration = {
  id: 'pentagon',
  name: 'Pentagone (1-2-2)',
  shortName: 'Pentagone',
  description: '1 joueur au filet centre, 2 ailes en milieu de terrain, 2 arrière. Couverture régulière du terrain — bonne option en initiation et loisir. Défense type : système 1-2-2 (man-up adapté, 1 contreur + 2 couvreurs + 2 défenseurs profonds).',
  hasLibero: false,
  positions: [
    { zoneId: 'P3', number: '③', name: 'Centre filet', role: 'Passeur ou central',
      court: { x: 50, y: 18 },
      description: 'Au filet centre. Souvent passeur si joueur fixe ; sinon central principal au bloc.',
      skills: ['Passe', 'Contre', 'Communication'],
      traits: ['Hub du jeu', 'Block central', "Dispense partielle de réception"] },
    { zoneId: 'P4', number: '④', name: 'Aile gauche', role: 'Outside',
      court: { x: 20, y: 42 },
      description: 'Aile gauche en milieu de terrain : réceptionne et attaque depuis la zone 4.',
      skills: ['Attaque', 'Réception', 'Contre'],
      traits: ['Polyvalence', "Course d'élan moyenne", 'Couverture petite diagonale'] },
    { zoneId: 'P2', number: '②', name: 'Aile droite', role: 'Outside / pointu',
      court: { x: 80, y: 42 },
      description: "Aile droite. Si le passeur est central, c'est l'attaquant en zone 2.",
      skills: ['Attaque ligne', 'Contre', 'Service'],
      traits: ['Attaque diagonale longue', 'Block à 2 avec central', 'Couverture grande diagonale'] },
    { zoneId: 'P5', number: '⑤', name: 'Arrière gauche', role: 'Réception / défense',
      court: { x: 25, y: 78 },
      description: 'Arrière gauche : couvre la défense côté gauche, souvent meilleur réceptionneur.',
      skills: ['Manchette', 'Réception', 'Défense'],
      traits: ['Pilier défensif', '~30 m² couverts', 'Lecture en grande diagonale'] },
    { zoneId: 'P1', number: '①', name: 'Arrière droit', role: 'Défense / service',
      court: { x: 75, y: 78 },
      description: 'Arrière droit : couvre la défense côté droit + service.',
      skills: ['Service', 'Défense', 'Manchette'],
      traits: ['Serveur principal', 'Couverture ligne droite', 'Soutien attaque zone 2'] },
  ],
};

const CONFIG_5V5_3F_2B: Configuration = {
  id: '3F-2B',
  name: '3 avant / 2 arrière',
  shortName: '3F/2B',
  description: '3 attaquants au filet (P4, P3, P2 dont passeur en P2) + 2 arrière (P5, P1). Configuration offensive : bloc à 2 ou 3 possible. Défense type : système 2-1-2 (2 contreurs + 1 off-blocker + 2 défenseurs profonds). Inconvénient : 30+ m² par défenseur en fond.',
  hasLibero: false,
  positions: [
    { zoneId: 'P4', number: '④', name: 'Aile gauche', role: 'Outside',
      court: { x: 20, y: 22 },
      description: 'Aile gauche au filet. Cible principale du passeur en zone 4.',
      skills: ['Attaque', 'Contre', 'Réception'],
      traits: ['Polyvalence', 'Block à 2 avec central', 'Cible favorite du passeur'] },
    { zoneId: 'P3', number: '③', name: 'Central', role: 'Middle',
      court: { x: 50, y: 22 },
      description: 'Central au filet. Block + attaque rapide quand la réception le permet.',
      skills: ['Contre', 'Attaque rapide'],
      traits: ['Block central', 'Tempo 1 conservé', 'Permutation possible'] },
    { zoneId: 'P2', number: '②', name: 'Passeur (avant)', role: 'Setter',
      court: { x: 80, y: 22 },
      description: "Passeur avant fixe. Pas de pénétration. Distribue depuis le filet ; attaque possible en 2 si le ballon arrive haut côté droit.",
      skills: ['Passe en touche', 'Distribution', 'Block aile droite'],
      traits: ['Avant fixe', 'Pas de pénétration', "Attaque exceptionnelle en zone 2"] },
    { zoneId: 'P5', number: '⑤', name: 'Arrière gauche', role: 'Réception / défense',
      court: { x: 25, y: 75 },
      description: 'Arrière gauche : réception côté gauche + défense en grande diagonale.',
      skills: ['Manchette', 'Défense', 'Réception'],
      traits: ['Meilleur réceptionneur idéalement', 'Grande diagonale', 'Couverture ~30 m²'] },
    { zoneId: 'P1', number: '①', name: 'Arrière droit', role: 'Service / défense',
      court: { x: 75, y: 75 },
      description: 'Arrière droit : sert puis défend la ligne droite et la diagonale courte.',
      skills: ['Service', 'Défense', 'Manchette'],
      traits: ['Serveur', 'Ligne droite + couloir', 'Soutien attaque zone 2'] },
  ],
};

const CONFIG_5V5_2F_3B: Configuration = {
  id: '2F-3B',
  name: '2 avant / 3 arrière',
  shortName: '2F/3B',
  description: '2 joueurs au filet + 3 arrière dont le passeur pénétrant (P1). Configuration la plus stable défensivement, la plus proche du 5-1 6v6. Défense type : système 1-1-3 (1 contreur + 1 off-blocker + 3 défenseurs profonds). Recommandée pour préparer la transition vers le 6v6.',
  hasLibero: false,
  positions: [
    { zoneId: 'P4', number: '④', name: 'Aile gauche', role: 'Outside',
      court: { x: 25, y: 22 },
      description: 'Aile gauche au filet. Attaquant principal en zone 4.',
      skills: ['Attaque', 'Contre', 'Réception'],
      traits: ['Cible n°1 du passeur', 'Block à 2', 'Polyvalence'] },
    { zoneId: 'P3', number: '③', name: 'Central', role: 'Middle / pointu',
      court: { x: 75, y: 22 },
      description: 'Central polyvalent : block central + attaque en zone 3 ou 2 selon la passe.',
      skills: ['Contre', 'Attaque rapide', 'Couverture filet'],
      traits: ['Block central', 'Permutation vers zone 2 fréquente', "Pas d'attaquant pur en P2"] },
    { zoneId: 'P5', number: '⑤', name: 'Arrière gauche', role: 'Réception / défense',
      court: { x: 15, y: 75 },
      description: 'Arrière gauche : réception côté gauche + grande diagonale.',
      skills: ['Manchette', 'Réception', 'Défense'],
      traits: ['Pilier défensif', 'Réception à 3 avec P6'] },
    { zoneId: 'P6', number: '⑥', name: 'Arrière centre', role: 'Pilier défense',
      court: { x: 50, y: 75 },
      description: 'Arrière centre : couvre tout le centre du fond, lecture des balles longues.',
      skills: ['Défense longue', 'Manchette', 'Couverture'],
      traits: ['Mobilité maximale', "Récupère pipe et balles longues", 'Réception centrale'] },
    { zoneId: 'P1', number: '①', name: 'Passeur (pénétrant)', role: 'Setter',
      court: { x: 85, y: 75 },
      description: 'Passeur arrière en P1 qui pénètre dès le service vers la zone 2-3. Sert puis distribue.',
      skills: ['Pénétration', 'Passe en touche', 'Service'],
      traits: ['Pénètre depuis P1', 'Distribue avec 2 attaquants devant', 'Couverture courte après passe'] },
  ],
};

const CONFIG_4V4_LOSANGE: Configuration = {
  id: 'losange',
  name: 'Losange / Diamant (1-2-1)',
  shortName: 'Losange',
  description: 'Formation « diamant » : la PLUS UTILISÉE en 4v4 indoor. 1 joueur au filet centre (P3, souvent passeur), 2 ailes en milieu de terrain (P4 et P2 vers les 3 m), 1 arrière au fond. Défense type : système A (1 contreur + 3 défenseurs). Zone la plus vulnérable : grande diagonale longue (manque de monde au fond).',
  hasLibero: false,
  positions: [
    { zoneId: 'P3', number: '③', name: 'Centre filet', role: 'Passeur ou central',
      court: { x: 50, y: 18 },
      description: "Au centre du filet. Souvent le PASSEUR (variante « passeur centre ») qui distribue vers gauche ou droite. Sinon contreur principal.",
      skills: ['Passe', 'Contre', 'Communication'],
      traits: ['Hub du jeu en losange', 'Block à 1 standard', 'Distribue sans pénétration'] },
    { zoneId: 'P4', number: '④', name: 'Aile gauche', role: 'Attaquant principal',
      court: { x: 20, y: 48 },
      description: 'Aile gauche, en milieu de terrain (vers les 3 m). Cible préférée du passeur.',
      skills: ['Attaque', 'Réception', 'Couverture'],
      traits: ["Course d'élan courte", 'Réception côté gauche', 'Polyvalence (~35 m²)'] },
    { zoneId: 'P2', number: '②', name: 'Aile droite', role: 'Attaquant secondaire',
      court: { x: 80, y: 48 },
      description: 'Aile droite, en milieu de terrain. Attaque en zone 2 si le passeur distribue à droite.',
      skills: ['Attaque ligne', 'Réception', 'Service'],
      traits: ['Attaque diagonale longue', 'Réception côté droit', 'Couverture courte droite'] },
    { zoneId: 'P1', number: '①', name: 'Arrière unique', role: 'Défenseur principal',
      court: { x: 50, y: 80 },
      description: "Pas de libéro autorisé : c'est le meilleur défenseur de l'équipe au fond. Couvre tout le fond seul.",
      skills: ['Réception', 'Défense profonde', 'Lecture'],
      traits: ['~40 m² seul', 'Anticipation = compétence n°1', 'Doit savoir relayer en 2ᵉ touche'] },
  ],
};

const CONFIG_4V4_CARRE: Configuration = {
  id: 'carre',
  name: 'Carré / Box (2-2)',
  shortName: 'Carré',
  description: 'Formation « box » 2-2 : 2 joueurs au filet (P4 et P2) + 2 arrière (P5 et P1). Permet le bloc à 2 (système B) — mais à n\'utiliser que contre des frappeurs très puissants sans finesse, car laisse seulement 2 défenseurs profonds (tip non couvert). Plus souvent joué en système A avec un seul contreur.',
  hasLibero: false,
  positions: [
    { zoneId: 'P4', number: '④', name: 'Aile gauche (filet)', role: 'Contreur / attaquant',
      court: { x: 25, y: 22 },
      description: 'Au filet à gauche. Contre + attaque en zone 4.',
      skills: ['Contre', 'Attaque', 'Couverture filet'],
      traits: ['Block à 2 avec aile droite', 'Permutation possible avec passeur', 'Pas de tempo 1 traditionnel'] },
    { zoneId: 'P2', number: '②', name: 'Passeur-attaquant (filet)', role: 'Passeur avant',
      court: { x: 75, y: 22 },
      description: 'Passeur-attaquant au filet à droite. Fait la 2ᵉ touche systématiquement (pas de pénétration en carré).',
      skills: ['Passe', 'Contre', 'Attaque zone 2'],
      traits: ['Toujours en avant', 'Pas de pénétration', 'Block à 2 avec aile gauche'] },
    { zoneId: 'P5', number: '⑤', name: 'Arrière gauche', role: 'Défense / réception',
      court: { x: 25, y: 75 },
      description: 'Arrière gauche : réception côté gauche + grande diagonale.',
      skills: ['Réception', 'Défense', 'Manchette'],
      traits: ['Pilier défensif', 'Couverture ~35 m²', 'Soutien attaque zone 4'] },
    { zoneId: 'P1', number: '①', name: 'Arrière droit', role: 'Défense / service',
      court: { x: 75, y: 75 },
      description: 'Arrière droit : sert puis défend la ligne droite et la grande diagonale.',
      skills: ['Service', 'Défense', 'Manchette'],
      traits: ['Serveur', 'Ligne + diagonale', 'Soutien attaque zone 2'] },
  ],
};

const CONFIG_4V4_3_1: Configuration = {
  id: '3-1',
  name: 'Ligne 3-1 (passeur pénétrant)',
  shortName: '3-1',
  description: 'Formation « ligne 3-1 » : passeur unique en P1 (arrière) qui pénètre dès la frappe vers la zone 2. Libère 3 attaquants devant — équivalent simplifié du 5-1 6v6. Exige une réception très propre et un passeur rapide. Défense : système A possible (1 contreur central + 3 défenseurs).',
  hasLibero: false,
  positions: [
    { zoneId: 'P4', number: '④', name: 'Aile gauche', role: 'Outside',
      court: { x: 20, y: 22 },
      description: 'Aile gauche au filet. Attaquant principal en zone 4 + réception.',
      skills: ['Attaque', 'Réception', 'Contre'],
      traits: ['Cible n°1', 'Réception à 3', "Course d'élan zone 4"] },
    { zoneId: 'P3', number: '③', name: 'Central', role: 'Middle',
      court: { x: 50, y: 22 },
      description: 'Central au filet. Block + attaque en zone 3 si la passe est tendue.',
      skills: ['Contre', 'Attaque rapide'],
      traits: ['Block central', 'Tempo 2 possible', 'Sans réception'] },
    { zoneId: 'P2', number: '②', name: 'Aile droite', role: 'Outside',
      court: { x: 80, y: 22 },
      description: 'Aile droite. Attaque en zone 2 quand le passeur distribue à droite.',
      skills: ['Attaque', 'Contre', 'Réception'],
      traits: ['Attaque zone 2', 'Réception à 3', 'Block à 2 avec central'] },
    { zoneId: 'P1', number: '①', name: 'Passeur (pénétrant)', role: 'Setter',
      court: { x: 50, y: 78 },
      description: 'Passeur unique en P1. Sert puis pénètre vers la zone 2 pour distribuer.',
      skills: ['Pénétration', 'Passe', 'Service'],
      traits: ['Pénètre depuis P1', "3 attaquants devant en permanence", 'Couverture courte après passe'] },
  ],
};

const CONFIGURATIONS: Record<TeamSize, Configuration[]> = {
  6: [CONFIG_6V6_5_1, CONFIG_6V6_4_2, CONFIG_6V6_6_2],
  5: [CONFIG_5V5_PENTAGON, CONFIG_5V5_3F_2B, CONFIG_5V5_2F_3B],
  4: [CONFIG_4V4_LOSANGE, CONFIG_4V4_CARRE, CONFIG_4V4_3_1],
};

const TEAM_INTRO: Record<TeamSize, { tagline: string; rules: string }> = {
  6: {
    tagline: 'Format officiel FIVB / FFVolley : 6 joueurs + libéro, terrain 9×18 m, ligne d\'attaque à 3 m, filet 2,43 m (H) / 2,24 m (F).',
    rules: 'Zones numérotées dans le sens antihoraire vu depuis l\'arrière de son camp (Z1 = serveur). Rotation horaire au side-out (Z2→Z1→Z6→Z5→Z4→Z3→Z2). Règle 7.4 : au contact du serveur, les positions sont contrôlées par les pieds (Z2 plus près du filet que Z1, etc.). Bloc à 1, 2 ou 3. Le libéro remplace les arrières sans compter comme substitution.',
  },
  5: {
    tagline: 'Format hybride non officiel FIVB/FFVb. Pratiqué en scolaire, intramurals, dépannage et pédagogie de transition entre 4v4 et 6v6.',
    rules: '2+3 (passeur pénétrant recommandé) ou 3+2 (passeur avant fixe). Pas de libéro. Règle de chevauchement adaptée : Z4>Z5, Z3>Z6, Z2>Z1 (configuration 3-2) ou relations partielles (2-3). Les recommandations défensives sont des adaptations logiques du 6v6, pas un règlement codifié.',
  },
  4: {
    tagline: "Pas de règlement FIVB officiel. Pratiqué en intramurals universitaires (USA), tournois loisir, transition pédagogique (FFVb, Volleyball Canada).",
    rules: 'Terrain 9×9 m (parfois réduit), 3 touches, contre autorisé, rotation horaire. 2 avants + 2 arrières à chaque rotation. Formations courantes : diamant (1-2-1 passeur centre), ligne 3-1 (passeur pénétrant), box 2-2. Certains organisateurs suppriment les fautes de chevauchement (Texas A&M).',
  },
};

const LIBERO_HIGHLIGHTED_ZONES: ZoneId[] = ['P1', 'P5', 'P6'];

function CourtField({
  configuration,
  selectedId,
  onToggle,
}: {
  configuration: Configuration;
  selectedId: ZoneId | null;
  onToggle: (id: ZoneId) => void;
}) {
  const isActive = (id: ZoneId): boolean => {
    if (!selectedId) return false;
    if (selectedId === 'L') return LIBERO_HIGHLIGHTED_ZONES.includes(id);
    return selectedId === id;
  };

  const layout: CourtLayout = {
    players: configuration.positions.map(pos => ({
      id: pos.zoneId,
      x: pos.court.x,
      y: pos.court.y,
      label: pos.zoneId,
      role: pos.zoneId,
      caption: pos.name.split(' ')[0],
      active: isActive(pos.zoneId),
      onClick: () => onToggle(pos.zoneId),
      title: pos.name,
    })),
  };

  return (
    <Court
      layout={layout}
      view="our-side"
      show3mLine
      withShadow={false}
      idSuffix={`positions-${configuration.id}`}
    />
  );
}

export default function Positions() {
  const { size: sizeParam, config: configParam } = useParams<{ size: string; config: string }>();

  const isValidSize = !!sizeParam && (TEAM_SIZES as readonly string[]).includes(sizeParam);
  const sizeSlug = (isValidSize ? sizeParam : '6v6') as TeamSizeSlug;
  const teamSize: TeamSize = SLUG_TO_SIZE[sizeSlug];
  const configurations = CONFIGURATIONS[teamSize];

  const configIsValid = !!configParam && configurations.some(c => c.id === configParam);
  const configId = configIsValid ? configParam! : DEFAULT_POSITION_CONFIG[sizeSlug];

  const [selectedId, setSelectedId] = useState<ZoneId | null>(null);

  const configuration = useMemo(
    () => configurations.find(c => c.id === configId) ?? configurations[0],
    [configurations, configId]
  );

  const positions = useMemo(() => {
    if (!configuration.hasLibero) return configuration.positions;
    const libero = CONFIG_6V6_5_1.positions.find(p => p.zoneId === 'L')!;
    return configuration.positions.some(p => p.zoneId === 'L')
      ? configuration.positions
      : [...configuration.positions, libero];
  }, [configuration]);

  const visiblePositions = selectedId
    ? positions.filter(p => p.zoneId === selectedId)
    : positions;

  const toggle = (id: ZoneId) => setSelectedId(prev => (prev === id ? null : id));

  if (!isValidSize) {
    return <Navigate to="/positions" replace />;
  }
  // Invalid config slug in URL: redirect to default config for this size.
  if (configParam && !configIsValid) {
    return <Navigate to={`/positions/${sizeSlug}/${DEFAULT_POSITION_CONFIG[sizeSlug]}`} replace />;
  }

  const btnBase: React.CSSProperties = {
    padding: '7px 16px',
    fontFamily: '"Bungee", sans-serif',
    fontSize: 11,
    letterSpacing: '0.06em',
    border: '2.5px solid var(--ink)',
    background: 'var(--cream)',
    color: 'var(--ink)',
    cursor: 'pointer',
    transition: 'all 0.08s',
  };

  const seoTitle = `Positions au volley-ball ${sizeSlug} — ${configuration.shortName} | Volley-Wiki`;
  const seoDescription = `Postes et rôles au volley-ball ${TEAM_SIZE_LABEL[sizeSlug]} : système ${configuration.name}. ${configuration.description.slice(0, 100)}`;
  // Canonical always points to the explicit /:size/:config URL — visiting
  // /:size alone (default config) consolidates ranking to /:size/:defaultConfig.
  const canonicalPath = `/positions/${sizeSlug}/${configId}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Head
        title={seoTitle}
        description={seoDescription}
        path={canonicalPath}
        ogType="article"
        jsonLd={[
          buildBreadcrumb([
            { name: 'Accueil', path: '/' },
            { name: 'Positions', path: '/positions' },
            { name: sizeSlug.toUpperCase(), path: `/positions/${sizeSlug}` },
            { name: configuration.shortName, path: canonicalPath },
          ]),
          buildArticle({
            headline: `Positions au volley-ball ${sizeSlug} — ${configuration.shortName}`,
            description: seoDescription,
            path: canonicalPath,
          }),
        ]}
      />
      {/* Header */}
      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          ★ DOCUMENTATION · {sizeSlug.toUpperCase()}
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          POSITIONS — {sizeSlug.toUpperCase()}
        </h1>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.7, maxWidth: 600 }}>
          Postes et systèmes tactiques pour le volley-ball {TEAM_SIZE_LABEL[sizeSlug]}.
        </p>
      </div>

      {/* Team size selector */}
      <div style={{ border: '3px solid var(--ink)', boxShadow: 'var(--shadow)', background: 'var(--cream)', padding: 20 }}>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', opacity: 0.6, marginBottom: 12 }}>
          1. FORMAT DE JEU
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {TEAM_SIZES.map(slug => {
            const isActive = slug === sizeSlug;
            const activeStyle = isActive
              ? { background: 'var(--orange)', boxShadow: 'var(--shadow-sm)', transform: 'translate(-1px,-1px)' }
              : {};
            return (
              <Link
                key={slug}
                to={`/positions/${slug}`}
                style={{
                  ...btnBase,
                  fontSize: 16,
                  padding: '10px 24px',
                  textDecoration: 'none',
                  ...activeStyle,
                }}
              >
                {slug}
              </Link>
            );
          })}
        </div>
        <div style={{ fontSize: 14, marginBottom: 6 }}>{TEAM_INTRO[teamSize].tagline}</div>
        <div style={{ borderLeft: '4px solid var(--teal)', paddingLeft: 12, fontSize: 13, opacity: 0.7 }}>
          {TEAM_INTRO[teamSize].rules}
        </div>
      </div>

      {/* Configuration selector */}
      <div style={{ border: '3px solid var(--ink)', boxShadow: 'var(--shadow)', background: 'var(--cream)', padding: 20 }}>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', opacity: 0.6, marginBottom: 12 }}>
          2. CONFIGURATION TACTIQUE
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {configurations.map(c => {
            const isActive = configId === c.id;
            return (
              <Link
                key={c.id}
                to={`/positions/${sizeSlug}/${c.id}`}
                onClick={() => setSelectedId(null)}
                style={{
                  ...btnBase,
                  textDecoration: 'none',
                  ...(isActive ? { background: 'var(--teal)', color: 'var(--cream)', boxShadow: 'var(--shadow-sm)', transform: 'translate(-1px,-1px)' } : {}),
                }}
              >
                {c.shortName}
              </Link>
            );
          })}
        </div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, marginBottom: 8 }}>{configuration.name}</div>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>{configuration.description}</p>
      </div>

      {/* Court diagram */}
      <div style={{ border: '3px solid var(--ink)', boxShadow: 'var(--shadow)', background: 'var(--cream)', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.1em', opacity: 0.6 }}>
            DEMI-COURT — {configuration.name.toUpperCase()}
          </div>
          {selectedId && (
            <button
              onClick={() => setSelectedId(null)}
              style={{ ...btnBase, fontSize: 9, padding: '5px 12px' }}
            >
              TOUT AFFICHER
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 24, alignItems: 'start' }} className="md:grid-cols-[2fr_1fr] grid-cols-1">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.18em', opacity: 0.55, marginBottom: 8 }}>
              ← FILET →
            </div>
            <CourtField configuration={configuration} selectedId={selectedId} onToggle={toggle} />
            <div style={{ width: '100%', maxWidth: 420, marginTop: 8, textAlign: 'center' }}>
              <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: '0.18em', opacity: 0.55 }}>FOND DE COURT</span>
            </div>
          </div>

          {/* Side legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ border: '3px solid var(--ink)', background: 'var(--paper)', padding: '12px 14px' }}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em', marginBottom: 10 }}>REPÈRES</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                <li><strong>Filet</strong> — bande orange</li>
                <li><strong>3 m</strong> — ligne pointillée</li>
                <li style={{ opacity: 0.6, fontSize: 11 }}>Cliquez sur un joueur pour sa fiche</li>
              </ul>
            </div>
            {configuration.hasLibero ? (
              <button
                onClick={() => toggle('L')}
                style={{
                  ...btnBase,
                  padding: '12px 14px',
                  textAlign: 'left',
                  display: 'block',
                  width: '100%',
                  ...(selectedId === 'L' ? { background: ROLE_COLORS.L, color: '#fff' } : {}),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 24, height: 24, borderRadius: '50%',
                    border: `2.5px solid var(--ink)`, background: ROLE_COLORS.L,
                    fontFamily: '"Bungee", sans-serif', fontSize: 10, color: '#fff',
                  }}>L</span>
                  <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, letterSpacing: '0.06em' }}>LIBÉRO</span>
                </div>
                <p style={{ margin: 0, fontSize: 11, opacity: 0.65 }}>Remplace les arrières (P1, P5, P6).</p>
              </button>
            ) : (
              <div style={{ border: '3px solid var(--ink)', background: 'var(--paper)', padding: '12px 14px', fontSize: 12, opacity: 0.7 }}>
                <strong>Pas de libéro</strong> dans cette configuration.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Position cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
          <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--orange)', whiteSpace: 'nowrap' }}>★ FICHES POSTES</span>
          <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
        </div>

        {visiblePositions.map(pos => {
          const roleColor = ROLE_COLORS[pos.zoneId];
          return (
            <div key={pos.zoneId} style={{ border: '3px solid var(--ink)', boxShadow: 'var(--shadow)', background: 'var(--cream)', overflow: 'hidden' }}>
              {/* Card header */}
              <div style={{
                padding: '16px 22px',
                borderBottom: '3px solid var(--ink)',
                borderLeft: `6px solid ${roleColor}`,
                background: 'var(--paper)',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <span style={{
                  width: 52, height: 52, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"Bungee", sans-serif', fontSize: 15,
                  background: roleColor,
                  border: '3px solid var(--ink)',
                  borderRadius: '50%',
                  color: pos.zoneId === 'P5' ? '#1a1812' : '#fff',
                  boxShadow: '3px 3px 0 var(--ink)',
                }}>
                  {pos.zoneId}
                </span>
                <div>
                  <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 18, margin: '0 0 4px 0', letterSpacing: '0.03em' }}>{pos.name}</h2>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.08em', opacity: 0.6 }}>{pos.role}</div>
                </div>
              </div>
              {/* Card body */}
              <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>{pos.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <div>
                    <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--teal)', marginBottom: 10 }}>COMPÉTENCES</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {pos.skills.map(s => (
                        <span key={s} style={{
                          padding: '3px 10px',
                          border: '2px solid var(--ink)',
                          background: 'var(--paper)',
                          fontFamily: '"DM Mono", monospace',
                          fontSize: 11,
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--orange)', marginBottom: 10 }}>CARACTÉRISTIQUES</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {pos.traits.map(t => (
                        <li key={t} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13 }}>
                          <span style={{ fontFamily: '"Bungee", sans-serif', color: roleColor, flexShrink: 0 }}>▸</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-link */}
      <div style={{ border: '3px solid var(--ink)', background: 'var(--paper)', boxShadow: 'var(--shadow-sm)', padding: 20 }}>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--teal)', marginBottom: 10 }}>
          POUR ALLER PLUS LOIN
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
          Consultez le guide{' '}
          <Link
            to={`/guides/positionnement-defense/${sizeSlug}/${configuration.id}`}
            style={{ color: 'var(--orange)', fontWeight: 700 }}
          >
            Positionnement et défense
          </Link>{' '}
          pour voir comment cette configuration se place selon la zone d'attaque adverse.
        </p>
      </div>
    </div>
  );
}

export { CONFIGURATIONS, type TeamSize, type Configuration };
