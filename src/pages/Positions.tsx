import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ROLE_COLORS } from '../constants/positions';

type ZoneId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'L';
type TeamSize = 4 | 5 | 6;

// Player position on the half-court diagram (% of container; 0 = net at top, 100 = baseline at bottom).
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

// ============================================================
// 6v6 — la grille 3×2 reflète la disposition au service FIVB
// ============================================================

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

// ============================================================
// 5v5 — pas de règlement officiel ; 3 configurations courantes
// ============================================================

// Pentagone — 1 filet centre, 2 ailes avancées, 2 arrière
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

// 3F/2B — passeur avant fixe, 3 attaquants devant
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

// 2F/3B — passeur arrière pénétrant, défensif
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

// ============================================================
// 4v4 — règlement UNSS ; 3 configurations courantes
// ============================================================

// Losange (1-2-1) — la plus utilisée
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

// Carré (2-2)
const CONFIG_4V4_CARRE: Configuration = {
  id: 'carre',
  name: 'Carré (2-2)',
  shortName: 'Carré',
  description: '2 joueurs au filet (P4 et P2) + 2 arrière (P5 et P1). Couverture équilibrée, permet le block à 2. Bien adapté quand on a 2 contreurs forts et 2 défenseurs forts. Mais arrières exposés sur les diagonales.',
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

// 3-1 passeur arrière pénétrant
const CONFIG_4V4_3_1: Configuration = {
  id: '3-1',
  name: 'Passeur pénétrant (3-1)',
  shortName: '3-1',
  description: 'Passeur unique en P1 (arrière) qui pénètre dès la frappe vers la zone 2. Libère 3 attaquants devant — équivalent simplifié du 5-1. Exige une réception très propre car le passeur n\'est pas au filet.',
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
    tagline: 'Format UNSS et loisir FFVB. Terrain 7×14 m ou 8×16 m, ligne d\'attaque à 3 m. Pas de libéro.',
    rules: 'Au service : 3 avants alignés 4-3-2, P1 derrière. Après la frappe, déplacement libre selon la configuration choisie.',
  },
};

const LIBERO_HIGHLIGHTED_ZONES: ZoneId[] = ['P1', 'P5', 'P6'];

// ============================================================
// Components
// ============================================================

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
    <div className="relative w-full max-w-[480px] mx-auto" style={{ aspectRatio: '1 / 1.1' }}>
      {/* Net at top */}
      <div className="absolute top-0 left-0 right-0 border-t-2 border-yellow-400" />
      {/* Court border */}
      <div className="absolute inset-0 border-2 border-gray-700" />
      {/* 3m attack line */}
      <div
        className="absolute left-0 right-0 border-t border-dashed border-gray-700"
        style={{ top: '33%' }}
      />
      {/* Player chips */}
      {configuration.positions.map(pos => {
        const active = isActive(pos.zoneId);
        const color = ROLE_COLORS[pos.zoneId];
        return (
          <button
            key={pos.zoneId}
            onClick={() => onToggle(pos.zoneId)}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-transform hover:scale-105 z-10"
            style={{ left: `${pos.court.x}%`, top: `${pos.court.y}%` }}
            title={pos.name}
          >
            <span
              className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-base md:text-lg font-bold border-2 transition-all ${active ? 'scale-110' : ''}`}
              style={{
                color: pos.zoneId === 'P5' ? '#000' : '#fff',
                backgroundColor: color,
                borderColor: active ? '#facc15' : 'rgba(0,0,0,0.4)',
                boxShadow: active ? '0 0 0 3px rgba(250, 204, 21, 0.45)' : undefined,
              }}
            >
              {pos.zoneId}
            </span>
            <span
              className="mt-1 text-[10px] uppercase tracking-wider whitespace-nowrap"
              style={{ color: active ? color : '#9ca3af' }}
            >
              {pos.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// Page
// ============================================================

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

  // Keep URL in sync so the link can be shared / bookmarked
  useEffect(() => {
    setSearchParams({ size: String(teamSize), config: configId }, { replace: true });
  }, [teamSize, configId, setSearchParams]);

  const configurations = CONFIGURATIONS[teamSize];
  const configuration = useMemo(
    () => configurations.find(c => c.id === configId) ?? configurations[0],
    [configurations, configId]
  );

  // Inject the libero card on configurations that have one (6v6 5-1 / 6-2)
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

  return (
    <div className="space-y-12">
      <div>
        <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2">Documentation</div>
        <h1 className="text-4xl font-bold text-white mb-3">Positions et rôles</h1>
        <p className="text-gray-400">
          Postes du volleyball indoor. Choisissez le format de jeu puis la configuration tactique pour adapter les rôles et la disposition.
        </p>
      </div>

      {/* Team size selector */}
      <div className="border-2 border-gray-700 p-4 space-y-3">
        <div className="text-gray-500 text-xs uppercase tracking-widest">1. Format de jeu</div>
        <div className="flex flex-wrap gap-2">
          {([6, 5, 4] as const).map(size => (
            <button
              key={size}
              onClick={() => changeTeamSize(size)}
              className={`px-4 py-2 text-xs uppercase tracking-wider border-2 transition-colors ${
                teamSize === size
                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {size}v{size}
            </button>
          ))}
        </div>
        <div className="text-gray-300 text-sm leading-relaxed">{TEAM_INTRO[teamSize].tagline}</div>
        <div className="text-gray-500 text-xs leading-relaxed border-l-2 border-gray-700 pl-3">
          {TEAM_INTRO[teamSize].rules}
        </div>
      </div>

      {/* Configuration selector */}
      <div className="border-2 border-gray-700 p-4 space-y-3">
        <div className="text-gray-500 text-xs uppercase tracking-widest">2. Configuration tactique</div>
        <div className="flex flex-wrap gap-2">
          {configurations.map(c => (
            <button
              key={c.id}
              onClick={() => changeConfig(c.id)}
              className={`px-4 py-2 text-xs uppercase tracking-wider border-2 transition-colors ${
                configId === c.id
                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {c.shortName}
            </button>
          ))}
        </div>
        <div className="text-white font-bold text-sm">{configuration.name}</div>
        <p className="text-gray-400 text-sm leading-relaxed">{configuration.description}</p>
      </div>

      {/* Court diagram */}
      <div className="border-2 border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-500 text-xs uppercase tracking-widest">
            Demi-court — {configuration.name}
          </div>
          {selectedId && (
            <button
              onClick={() => setSelectedId(null)}
              className="px-3 py-1 border border-yellow-400 text-yellow-400 text-xs uppercase tracking-wider hover:bg-yellow-400/10 transition-colors"
            >
              Tout afficher
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-[2fr_1fr] gap-6 items-start">
          <div className="flex flex-col items-center w-full">
            <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">Filet</div>
            <CourtField configuration={configuration} selectedId={selectedId} onToggle={toggle} />
            <div className="flex w-full max-w-[480px] justify-between mt-2 text-gray-600 text-[10px] uppercase tracking-widest">
              <span>Fond de court</span>
              <span>{teamSize === 4 ? '7×14 m / 8×16 m' : '9 m × 9 m'}</span>
            </div>
          </div>

          {/* Side legend */}
          <div className="flex flex-col gap-3 w-full">
            <div className="border-2 border-gray-800 p-3 text-xs">
              <div className="text-gray-500 uppercase tracking-widest mb-2">Repères</div>
              <ul className="space-y-1 text-gray-400">
                <li><span className="text-white font-bold">Filet</span> — ligne haute jaune</li>
                <li><span className="text-white font-bold">3 m</span> — ligne pointillée d'attaque</li>
                <li>Cliquez sur un joueur pour voir sa fiche</li>
              </ul>
            </div>
            {configuration.hasLibero ? (
              <button
                onClick={() => toggle('L')}
                className={`border-2 p-3 text-left transition-colors ${
                  selectedId === 'L'
                    ? 'border-yellow-400 bg-yellow-400/10'
                    : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center w-6 h-6 border-2 text-xs font-bold"
                    style={{ borderColor: ROLE_COLORS.L, color: ROLE_COLORS.L }}>L</span>
                  <span className={`text-xs uppercase tracking-wider font-bold ${
                    selectedId === 'L' ? 'text-yellow-400' : 'text-white'
                  }`}>Libéro</span>
                </div>
                <p className="text-gray-500 text-[10px] leading-relaxed">Hors rotation. Remplace les arrières (P1, P5, P6).</p>
              </button>
            ) : (
              <div className="border-2 border-gray-800 p-3 text-gray-500 text-xs leading-relaxed">
                <span className="text-white font-bold uppercase tracking-wider">Pas de libéro</span> dans cette configuration.
                Tous les joueurs (sauf passeur dédié) doivent savoir réceptionner.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Position cards */}
      <div className="space-y-6">
        {visiblePositions.map(pos => {
          const roleColor = ROLE_COLORS[pos.zoneId];
          return (
            <div key={pos.zoneId} className="border-2 border-gray-700 overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: roleColor }}>
                <span className="text-4xl font-bold min-w-[2.5rem] text-center" style={{ color: roleColor }}>{pos.number}</span>
                <div>
                  <h2 className="text-white font-bold text-xl">{pos.name}</h2>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">{pos.role}</div>
                </div>
              </div>
              <div className="px-6 pb-6 space-y-4">
                <p className="text-gray-400 text-sm leading-relaxed">{pos.description}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Compétences principales</div>
                    <div className="flex flex-wrap gap-2">
                      {pos.skills.map(s => (
                        <span key={s} className="px-2 py-1 border border-gray-600 text-gray-300 text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Caractéristiques</div>
                    <ul className="space-y-1">
                      {pos.traits.map(t => (
                        <li key={t} className="text-xs text-gray-400 flex items-start gap-2">
                          <span className="text-yellow-400">▸</span>{t}
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

      {/* Cross-link to defense guide */}
      <div className="border-2 border-gray-800 bg-gray-900/50 p-6 space-y-3">
        <div className="text-yellow-400 text-xs uppercase tracking-widest">Pour aller plus loin</div>
        <p className="text-gray-400 text-sm">
          Consultez le guide{' '}
          <Link
            to={`/guides/positionnement-defense?size=${teamSize}&config=${configuration.id}`}
            className="text-yellow-400 hover:underline"
          >
            Positionnement et défense
          </Link>{' '}
          pour voir comment cette configuration se place selon la zone d'attaque adverse.
        </p>
      </div>
    </div>
  );
}

// Re-export configurations so the defense guide can share them
export { CONFIGURATIONS, type TeamSize, type Configuration };
