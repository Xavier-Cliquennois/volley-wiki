import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ROLE_COLORS } from '../constants/positions';

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
  description: '1 passeur unique distribuant dans toutes les rotations + 2 R4 + 2 centraux + 1 pointu + 1 libéro. Le système le plus utilisé en compétition.',
  hasLibero: true,
  positions: [
    { ...COMMON_DESC.P4, zoneId: 'P4', role: 'Attaquant aile (Outside)', court: POS_6v6_GRID.P4,
      description: "Zone d'attaque principale. L'aile reçoit la majorité des balles hautes et doit être polyvalent : attaque, contre, réception.",
      skills: ['Attaque', 'Contre', 'Réception', 'Service'],
      traits: ["Puissance et précision d'attaque", 'Grande envergure', 'Polyvalence', 'Endurance'] },
    { ...COMMON_DESC.P3, zoneId: 'P3', role: 'Central (Middle)', court: POS_6v6_GRID.P3,
      description: 'Joueur du filet en zone centrale. Contre les attaques adverses et frappe en tempo rapide.',
      skills: ['Contre', 'Attaque rapide', 'Couverture de filet'],
      traits: ['Grande taille requise', 'Contre dominant', 'Tempos 1 et 2', 'Rôle défensif limité au filet'] },
    { ...COMMON_DESC.P2, zoneId: 'P2', role: 'Passeur (Setter)', court: POS_6v6_GRID.P2,
      description: "Le chef d'orchestre. Reçoit la 2ᵉ touche et distribue le jeu. En 5-1 il distribue aussi quand il est arrière (avec pénétration).",
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
      description: 'Spécialiste défensif en maillot contrastant. Remplace les arrières (P1, P5, P6) sans compter comme substitution.',
      skills: ['Manchette', 'Réception', 'Défense', 'Lecture'],
      traits: ['Agilité maximale', 'Ne peut pas bloquer/attaquer au-dessus du filet', 'Remplacements illimités', 'Peut servir (FIVB 2021)'] },
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
  description: '2 passeurs polyvalents (passent quand arrière, attaquent quand avant) + 2 centraux + 2 R4. Garantit toujours 3 attaquants devant avec pénétration systématique.',
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
  description: '1 joueur au filet centre, 2 ailes en milieu de terrain, 2 arrière. Couverture régulière de tout le terrain — bonne option en initiation et loisir.',
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
  description: '3 attaquants au filet (P4, P3, P2 dont passeur en P2) + 2 arrière (P5, P1). Configuration offensive : block à 2 ou 3 possible. Le passeur est avant fixe.',
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
  description: '2 joueurs au filet + 3 arrière dont le passeur pénétrant (P1). Configuration la plus stable défensivement, idéale quand on a besoin de couverture. 2 attaquants devant seulement.',
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
  name: 'Losange (1-2-1)',
  shortName: 'Losange',
  description: 'Configuration la PLUS UTILISÉE en 4v4. 1 joueur au filet centre (P3, souvent passeur), 2 ailes en milieu de terrain (P4 et P2 reculés vers les 3 m), 1 arrière au fond. Un joueur dans chaque grande zone, mais un seul au filet limite le contre.',
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
  name: 'Carré (2-2)',
  shortName: 'Carré',
  description: '2 joueurs au filet (P4 et P2) + 2 arrière (P5 et P1). Couverture équilibrée, permet le block à 2. Bien adapté quand on a 2 contreurs forts et 2 défenseurs forts.',
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
  name: 'Passeur pénétrant (3-1)',
  shortName: '3-1',
  description: 'Passeur unique en P1 (arrière) qui pénètre dès la frappe vers la zone 2. Libère 3 attaquants devant — équivalent simplifié du 5-1. Exige une réception très propre.',
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
    tagline: 'Format officiel FIVB / FFVolley : 6 joueurs + libéro, terrain 9×18 m.',
    rules: 'Bloc à 1, 2 ou 3 selon la zone. Le libéro remplace les arrières (P1/P5/P6) sans compter comme substitution.',
  },
  5: {
    tagline: 'Format hybride (entraînement, loisir). Pas de règlement officiel français.',
    rules: 'Plusieurs configurations possibles selon que le passeur est avant fixe ou arrière pénétrant. Libéro toléré en entraînement, pas en compétition.',
  },
  4: {
    tagline: "Format UNSS et loisir FFVB. Terrain 7×14 m ou 8×16 m, ligne d'attaque à 3 m. Pas de libéro.",
    rules: 'Au service : 3 avants alignés 4-3-2, P1 derrière. Après la frappe, déplacement libre selon la configuration choisie.',
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

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 420, margin: '0 auto', aspectRatio: '1 / 1.1' }}>
      {/* Court surface */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'var(--paper)',
        border: '3px solid var(--ink)',
        boxShadow: 'var(--shadow)',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 37px, rgba(26,24,18,0.04) 37px 38px), repeating-linear-gradient(90deg, transparent 0 37px, rgba(26,24,18,0.04) 37px 38px)',
      }} />
      {/* Net */}
      <div style={{
        position: 'absolute', top: 0, left: -3, right: -3,
        height: 6, background: 'var(--orange)',
        borderTop: '3px solid var(--ink)', borderBottom: '3px solid var(--ink)',
      }} />
      {/* 3m line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '33%',
        borderTop: '2px dashed rgba(26,24,18,0.35)',
      }} />
      {/* Players */}
      {configuration.positions.map(pos => {
        const active = isActive(pos.zoneId);
        const color = ROLE_COLORS[pos.zoneId];
        return (
          <button
            key={pos.zoneId}
            onClick={() => onToggle(pos.zoneId)}
            style={{
              position: 'absolute',
              left: `${pos.court.x}%`,
              top: `${pos.court.y}%`,
              transform: 'translate(-50%, -50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'none', border: 'none', cursor: 'pointer', zIndex: 2,
              transition: 'transform 0.08s',
            }}
            title={pos.name}
          >
            <span style={{
              width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: '"Bungee", sans-serif', fontSize: 13,
              background: color,
              border: active ? `3px solid var(--ink)` : '3px solid rgba(26,24,18,0.5)',
              borderRadius: '50%',
              color: pos.zoneId === 'P5' ? '#000' : '#fff',
              boxShadow: active ? `0 0 0 3px var(--yellow), 2px 2px 0 var(--ink)` : '2px 2px 0 rgba(26,24,18,0.4)',
              transform: active ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.08s, box-shadow 0.08s',
            }}>
              {pos.zoneId}
            </span>
            <span style={{
              marginTop: 4, fontSize: 9, letterSpacing: '0.06em', fontFamily: '"DM Mono", monospace',
              color: active ? color : 'rgba(26,24,18,0.55)', whiteSpace: 'nowrap',
            }}>
              {pos.name.split(' ')[0]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function Positions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSize = parseInt(searchParams.get('size') ?? '6');
  const initialSize: TeamSize = ([4, 5, 6] as const).includes(urlSize as TeamSize)
    ? (urlSize as TeamSize)
    : 6;
  const urlConfig = searchParams.get('config');
  const initialConfig =
    urlConfig && CONFIGURATIONS[initialSize].some(c => c.id === urlConfig)
      ? urlConfig
      : CONFIGURATIONS[initialSize][0].id;

  const [teamSize, setTeamSize] = useState<TeamSize>(initialSize);
  const [configId, setConfigId] = useState<string>(initialConfig);
  const [selectedId, setSelectedId] = useState<ZoneId | null>(null);

  useEffect(() => {
    setSearchParams({ size: String(teamSize), config: configId }, { replace: true });
  }, [teamSize, configId, setSearchParams]);

  const configurations = CONFIGURATIONS[teamSize];
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

  const changeTeamSize = (size: TeamSize) => {
    setTeamSize(size);
    setConfigId(CONFIGURATIONS[size][0].id);
    setSelectedId(null);
  };

  const changeConfig = (id: string) => {
    setConfigId(id);
    setSelectedId(null);
  };

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, letterSpacing: '0.18em', color: 'var(--teal)', marginBottom: 10 }}>
          ★ DOCUMENTATION
        </div>
        <h1 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', margin: '0 0 10px 0', letterSpacing: '0.03em' }}>
          POSITIONS & RÔLES
        </h1>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.7, maxWidth: 600 }}>
          Postes du volleyball indoor. Choisissez le format de jeu puis la configuration tactique.
        </p>
      </div>

      {/* Team size selector */}
      <div style={{ border: '3px solid var(--ink)', boxShadow: 'var(--shadow)', background: 'var(--cream)', padding: 20 }}>
        <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', opacity: 0.6, marginBottom: 12 }}>
          1. FORMAT DE JEU
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {([6, 5, 4] as const).map(size => (
            <button
              key={size}
              onClick={() => changeTeamSize(size)}
              style={{
                ...btnBase,
                fontSize: 16,
                padding: '10px 24px',
                ...(teamSize === size ? { background: 'var(--orange)', boxShadow: 'var(--shadow-sm)', transform: 'translate(-1px,-1px)' } : {}),
              }}
            >
              {size}v{size}
            </button>
          ))}
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
          {configurations.map(c => (
            <button
              key={c.id}
              onClick={() => changeConfig(c.id)}
              style={{
                ...btnBase,
                ...(configId === c.id ? { background: 'var(--teal)', color: 'var(--cream)', boxShadow: 'var(--shadow-sm)', transform: 'translate(-1px,-1px)' } : {}),
              }}
            >
              {c.shortName}
            </button>
          ))}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 420, marginTop: 8 }}>
              <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, opacity: 0.5 }}>FOND DE COURT</span>
              <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, opacity: 0.5 }}>
                {teamSize === 4 ? '7×14 m / 8×16 m' : '9 m × 9 m'}
              </span>
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
            to={`/guides/positionnement-defense?size=${teamSize}&config=${configuration.id}`}
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
