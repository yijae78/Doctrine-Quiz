/// <reference types="vite/client" />
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import type { Topic, QuizQuestion, TeacherCategory, Class, LoggedInStudent, Student, ShopItem, Challenge, PendingMissionCompletion, Teacher, ChurchConfig, GoogleDriveFile, GoogleDriveState } from './types';
import { 
  BookOpen, 
  Sun, 
  Heart, 
  Wind, 
  ShieldCheck, 
  Users, 
  Send, 
  Sparkles, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Award,
  Gamepad2,
  RefreshCw,
  MessageCircle,
  Coins,
  Star,
  ShoppingBag,
  CheckCircle2,
  LogIn,
  ExternalLink,
  LogOut,
  User,
  Presentation,
  FileText,
  CloudUpload,
  Download,
  Trash2,
  Library,
  Trophy,
  CloudSun,
  Lock,
  KeyRound,
  Gift,
  Pencil,
  Map,
  Plus,
  Minus,
  UserPlus,
  X,
  Check,
  HelpCircle,
  Zap,
  BookMarked,
  Lightbulb,
  Footprints,
  Home,
  Loader2,
  PlusCircle,
  UserMinus,
  Settings,
  Copy
} from 'lucide-react';

// 성경 본문 데이터셋 (오프라인 환경 및 성능 최적화를 위해 로컬에 포함)
const BIBLE_DATASET: Record<string, string> = {
  "시 119:105": "주의 말씀은 내 발에 등이요 내 길에 빛이니이다",
  "딤후 3:16": "모든 성경은 하나님의 감동으로 된 것으로 교훈과 책망과 바르게 함과 의로 교육하기에 유익하니",
  "벧후 1:21": "예언은 언제든지 사람의 뜻으로 낸 것이 아니요 오직 성령의 감동하심을 받은 사람들이 하나님께 받아 말한 것임이라",
  "히 1:1": "옛적에 선지자들을 통하여 여러 부분과 여러 모양으로 우리 조상들에게 말씀하신 하나님이",
  "요 20:31": "오직 이것을 기록함은 너희로 예수께서 하나님의 아들 그리스도이심을 믿게 하려 함이요",
  "시 1:2": "오직 여호와의 율법을 즐거워하여 그의 율법을 주야로 묵상하는도다",
  "출 3:14": "하나님이 모세에게 이르시되 나는 스스로 있는 자이니라",
  "계 1:8": "주 하나님이 이르시되 나는 알파와 오메라라 이제도 있고 전에도 있었고 장차 올 자요 전능한 자라 하시더라",
  "시 90:2": "산이 생기기 전, 땅과 세계도 주께서 조성하시기 전 곧 영원부터 영원까지 주는 하나님이시니이다",
  "신 5:26": "육신을 가진 자로서 우리처럼 살아 계시는 하나님의 음성이 불 가운데에서 발함을 듣고 생존한 자가 누구니이까",
  "히 13:8": "예수 그리스도는 어제나 오늘이나 영원토록 동일하시니라",
  "시 62:8": "백성들아 시시로 그를 의지하고 그의 앞에 마음을 토하라 하나님은 우리의 피난처시로다",
  "요 1:1": "태초에 말씀이 계시니라 이 말씀이 하나님과 함께 계셨으니 이 말씀은 곧 하나님이시니라",
  "요 10:30": "나와 아버지는 하나이니라 하신대",
  "요 1:14": "말씀이 육신이 되어 우리 가운데 거하시매 우리가 그의 영광을 보니 아버지의 독생자의 영광이요 은혜와 진리가 충만하더라",
  "요 3:16": "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라",
  "요 14:9": "나를 본 자는 아버지를 보았거늘 어찌하여 아버지를 보이라 하느냐",
  "요 13:34": "새 계명을 너희에게 주노니 서로 사랑하라 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라",
  "요 13:15": "내가 너희에게 행한 것 같이 너희도 행하게 하려 하여 본을 보였노라",
  "마 28:19": "그러므로 너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로 세례를 베풀고",
  "고전 6:19": "너희 몸은 너희가 하나님께로부터 받은 바 너희 가운데 계신 성령의 전인 줄을 알지 못하느냐",
  "요 14:26": "보혜사 곧 아버지께서 내 이름으로 보내실 성령 그가 너희에게 모든 것을 가르치고 내가 너희에게 말한 모든 것을 생각나게 하리라",
  "고후 3:17": "주는 영이시니 주의 영이 계신 곳에는 자유가 있느니라",
  "요 14:16": "내가 아버지께 구하겠으니 그가 또 다른 보혜사를 너희에게 주사 영원토록 너희와 함께 있게 하리니",
  "롬 5:5": "우리에게 주신 성령으로 말미암아 하나님의 사랑이 우리 마음에 부은 바 됨이니",
  "엡 2:8": "너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니 이것은 너희에게서 난 것이 아니요 하나님의 선물이라",
  "엡 2:8-9": "너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니... 행위에서 난 것이 아니니 이는 누구든지 자랑하지 못하게 함이라",
  "롬 5:8": "우리가 아직 죄인 되었을 때에 그리스도께서 우리를 위하여 죽으심으로 하나님께서 우리에 대한 자기의 사랑을 확증하셨느니라",
  "롬 5:10": "곧 우리가 원수 되었을 때에 그의 아들의 죽으심으로 말미암아 하나님과 화목하게 되었은즉",
  "요일 4:10": "사랑은 여기 있으니 우리가 하나님을 사랑한 것이 아니요 하나님이 우리를 사랑한 것이 아니요 하나님이 우리를 사랑하사 우리 죄를 속하기 위하여 화목 제물로 그 아들을 보내셨음이라",
  "골 2:6": "그러므로 너희가 그리스도 예수를 주로 받았으니 그 안에서 행하되",
  "고전 12:27": "너희는 그리스도의 몸이요 지체의 각 부분이라",
  "행 2:46": "날마다 마음을 같이하여 성전에 모이기를 힘쓰고 집에서 떡을 떼며 기쁨과 순전한 마음으로 음식을 먹고",
  "행 2:42": "그들이 사도의 가르침을 받아 서로 교제하고 떡을 떼며 오로지 기도하기를 힘쓰니라",
  "행 2:44-45": "믿는 사람이 다 함께 있어 모든 물건을 서로 통용하고 또 재산과 소유를 팔아 각 사람의 필요를 따라 나눠 주며",
  "계 21:5": "보좌에 앉으신 이가 이르시되 보라 내가 만물을 새롭게 하노라 하시고",
  "계 21:1": "또 내가 새 하늘과 새 땅을 보니 처음 하늘과 처음 땅이 없어졌고 바다도 다시 있지 않더라",
  "마 24:36": "그러나 그 날과 그 때는 아무도 모르나니 하늘의 천사들도, 아들도 모르고 오직 아버지만 아시느니라",
  "살전 4:16-17": "주께서 호령과 천사장의 소리와 하나님의 나팔 소리로 친히 하늘로부터 강림하시리니 그리스도 안에서 죽은 자들이 먼저 일어나고",
  "계 21:4": "모든 눈물을 그 눈에서 닦아 주시니 다시는 사망이 없고 애통하는 것이나 곡하는 것이나 아픈 것이 다시 있지 아니하리니",
  "딛 2:13": "복스러운 소망과 우리의 크신 하나님 구주 예수 그리스도의 영광 나타나심을 기다리게 하셨으니",
  "벧후 3:11": "이 모든 것이 이렇게 풀어지리니 너희가 어떠한 사람이 되어야 마땅하냐 거룩한 행실과 경건함으로"
};

// ── 템플릿 Google Sheet ID (한 번 만들어서 여기에 넣으면 코드 복붙 불필요) ──
// 사용법: 1) Google Sheet 만들기 2) 확장프로그램→Apps Script에 코드 붙여넣기 3) 시트 ID를 아래에 입력
// 시트 URL이 https://docs.google.com/spreadsheets/d/ABC123/edit 이면 ABC123이 ID
const TEMPLATE_SHEET_ID = ''; // 비어있으면 수동 설정 모드

// ── 교회 설정 (범용) ──
const DEFAULT_CHURCH_CONFIG: ChurchConfig = {
  churchName: '',
  departmentName: '',
  eventName: '',
  teacherPassword: '1004',
  adminPassword: '0220',
  currencyName: '달란트',
  initialCurrency: 100,
  firstLoginBonus: 5,
};

function loadChurchConfig(): ChurchConfig {
  const saved = localStorage.getItem('church_config');
  if (saved) {
    try { return { ...DEFAULT_CHURCH_CONFIG, ...JSON.parse(saved) }; } catch { /* ignore */ }
  }
  return DEFAULT_CHURCH_CONFIG;
}

function saveChurchConfig(config: ChurchConfig) {
  localStorage.setItem('church_config', JSON.stringify(config));
}

function loadTeachers(): Teacher[] {
  const saved = localStorage.getItem('church_teachers');
  if (saved) {
    try { return JSON.parse(saved); } catch { /* ignore */ }
  }
  return [];
}

function saveTeachers(teachers: Teacher[]) {
  localStorage.setItem('church_teachers', JSON.stringify(teachers));
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

/** Supabase 연동 시 교체 포인트: fetchLoggedInStudents, church_logged_in_students, church_students, church_classes, church_pending_missions, church_challenges, church_completed_challenges, church_talents 등 각 localStorage 키를 Supabase 테이블/함수로 교체. */

async function fetchLoggedInStudents(): Promise<LoggedInStudent[]> {
  const saved = localStorage.getItem('church_logged_in_students');
  return saved ? JSON.parse(saved) : [];
}

async function fetchMaterials(): Promise<Record<string, { name: string; file: string }[]>> {
  const res = await fetch('/materials/materials.json');
  if (!res.ok) return {};
  const data = await res.json();
  return data || {};
}

// ===== Google Drive API 유틸리티 =====
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => any;
          revoke: (token: string, callback: () => void) => void;
        };
      };
    };
  }
}

async function driveApiFetch(endpoint: string, token: string, options?: RequestInit): Promise<any> {
  const res = await fetch(`${DRIVE_API}${endpoint}`, {
    ...options,
    headers: { 'Authorization': `Bearer ${token}`, ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Drive API ${res.status}: ${err}`);
  }
  return res.json();
}

async function findOrCreateFolder(token: string, folderName: string, parentId?: string): Promise<string> {
  let query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  if (parentId) query += ` and '${parentId}' in parents`;
  const result = await driveApiFetch(`/files?q=${encodeURIComponent(query)}&fields=files(id,name)`, token);
  if (result.files?.length > 0) return result.files[0].id;
  const metadata: any = { name: folderName, mimeType: 'application/vnd.google-apps.folder' };
  if (parentId) metadata.parents = [parentId];
  const created = await driveApiFetch('/files', token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metadata),
  });
  return created.id;
}

const DRIVE_CATEGORY_NAMES: Record<string, string> = {
  'teacher-manual': '교사용 지도안',
  'teacher-workbook': '학생용 활동지',
  'slides': '교육용 PPT',
  'corner-learning': '코너학습 가이드',
};

async function initDriveFolders(token: string, appName: string): Promise<{ appFolderId: string; categoryFolderIds: Record<string, string> }> {
  const appFolderId = await findOrCreateFolder(token, appName || 'Church Education App');
  // 앱 폴더 공개 설정
  try {
    await driveApiFetch(`/files/${appFolderId}/permissions`, token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'reader', type: 'anyone' }),
    });
  } catch { /* 이미 공개인 경우 무시 */ }
  const categoryFolderIds: Record<string, string> = {};
  for (const [catId, catName] of Object.entries(DRIVE_CATEGORY_NAMES)) {
    categoryFolderIds[catId] = await findOrCreateFolder(token, catName, appFolderId);
  }
  return { appFolderId, categoryFolderIds };
}

async function uploadFileToDrive(token: string, file: File, folderId: string): Promise<GoogleDriveFile> {
  const metadata = { name: file.name, parents: [folderId] };
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);
  const res = await fetch(`${UPLOAD_API}/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,webContentLink,size,createdTime`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const data = await res.json();
  // 파일 공개 설정
  await driveApiFetch(`/files/${data.id}/permissions`, token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  });
  return data;
}

async function listDriveFiles(token: string, folderId: string): Promise<GoogleDriveFile[]> {
  const query = `'${folderId}' in parents and trashed=false`;
  const result = await driveApiFetch(`/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,webViewLink,webContentLink,size,createdTime)&orderBy=createdTime desc`, token);
  return result.files || [];
}

async function deleteDriveFile(token: string, fileId: string): Promise<void> {
  const res = await fetch(`${DRIVE_API}/files/${fileId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
}

// ===== Google Apps Script API 서비스 =====
async function gasGet(apiUrl: string, params: Record<string, string>): Promise<any> {
  const url = new URL(apiUrl);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { redirect: 'follow' });
  if (!res.ok) throw new Error(`API GET failed: ${res.status}`);
  return res.json();
}

async function gasPost(apiUrl: string, body: Record<string, any>): Promise<any> {
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body),
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`API POST failed: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

async function testApiConnection(url: string): Promise<boolean> {
  try {
    const result = await gasGet(url, { action: 'ping' });
    return result?.ok === true;
  } catch { return false; }
}

function saveDriveMaterialsToStorage(materials: Record<string, GoogleDriveFile[]>): void {
  localStorage.setItem('church_drive_materials', JSON.stringify(materials));
}

function loadDriveMaterialsFromStorage(): Record<string, GoogleDriveFile[]> {
  try {
    const saved = localStorage.getItem('church_drive_materials');
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

// 성경 66권 한글 이름 (미니 게임 블록 표시용)
const BIBLE_BOOKS_66: string[] = [
  '창세기','출애굽기','레위기','민수기','신명기','여호수아','사사기','룻기','사무엘상','사무엘하','열왕기상','열왕기하','역대상','역대하','에스라','느헤미야','에스더','욥기','시편','잠언','전도서','아가','이사야','예레미야','예레미야애가','에스겔','다니엘','호세아','요엘','아모스','오바댜','요나','미가','나훔','하박국','스바냐','학개','스가랴','말라기',
  '마태복음','마가복음','누가복음','요한복음','사도행전','로마서','고린도전서','고린도후서','갈라디아서','에베소서','빌립보서','골로새서','데살로니가전서','데살로니가후서','디모데전서','디모데후서','디도서','빌레몬서','히브리서','야고보서','베드로전서','베드로후서','요한일서','요한이서','요한삼서','유다서','요한계시록'
];

// 테트리스 7종 블록 형태 (행/열)
const TETROMINO_SHAPES: number[][][] = [
  [[1,1,1,1]],                                           // I
  [[1,1],[1,1]],                                          // O
  [[0,1,0],[1,1,1]],                                      // T
  [[0,1,1],[1,1,0]],                                      // S
  [[1,1,0],[0,1,1]],                                      // Z
  [[1,0,0],[1,1,1]],                                      // J
  [[0,0,1],[1,1,1]],                                      // L
];

const COLS = 10;
const ROWS = 20;
const TARGET_LINES = 5;
const TARGET_SCORE = 500;

const DEFAULT_CHALLENGES: Challenge[] = [
  { id: 'ch-game', title: '미니 게임', description: '성경책 이름을 쌓아서 5줄을 없애 보세요!', talents: 1, type: 'normal' },
  { id: 'ch-bible', title: '성경 읽기', description: '오늘의 말씀 한 절을 소리 내어 읽어 보세요.', talents: 1, type: 'normal' },
  { id: 'ch-kakao', title: '선생님께 카톡 보내기', description: '선생님께 인사 카톡을 보내 보세요.', talents: 1, type: 'normal' },
  { id: 'ch-bet', title: '달란트 2배 도전', description: '달란트를 걸고 완료하면 2배로 받아요! (최대 1 달란트)', talents: 1, type: 'bet' },
];

// 선생님 목록은 관리자 설정에서 동적으로 관리 (localStorage: church_teachers)

const THEOLOGY_TOPICS: Topic[] = [
  {
    id: 'bibliology',
    title: '제1과 성경론 (The Bible)',
    subTitle: '하나님의 특별한 편지',
    Icon: BookOpen,
    color: 'bg-blue-400',
    verse: '주의 말씀은 내 발에 등이요 내 길에 빛이니이다 (시 119:105)',
    coreContent: `📖 성경은 하나님이 우리에게 보내신 '사랑의 편지'이자 '인생의 지도'예요.\n\n1. 하나님이 주인이세요: 성경은 약 40명의 사람들이 1,600년 동안 기록했지만, 성령님이 그들의 마음을 완벽하게 인도하셔서 하나님의 말씀만 적게 하셨어요. 그래서 성경의 진짜 저자는 하나님이시랍니다.\n\n2. 오직 진리만 담겨 있어요: 성경은 우리가 하나님을 어떻게 믿어야 하는지, 그리고 하나님의 자녀로서 어떻게 살아야 하는지를 알려주는 가장 정확하고 유일한 기준이에요. 세상의 그 어떤 책보다 소중한 하나님의 음성이 담겨 있죠.\n\n3. 우리를 예수님께 인도해요: 성경을 읽으면 우리는 우리가 죄인이라는 사실과, 우리를 구원하시기 위해 오신 예수님을 만날 수 있게 된답니다.`,
    deepContent: '하나님은 두 가지 방법으로 자신을 보여주세요. 첫째는 자연(꽃, 나무, 별)을 통해 보여주시는 "일반계시"이고, 둘째는 성경을 통해 보여주시는 "특별계시"예요. 자연만 봐서는 예수님을 알 수 없지만, 성경을 보면 우리를 구원하시는 하나님을 확실히 만날 수 있답니다!',
    meaningContent: '성경은 그냥 옛날 이야기가 아니라, 오늘 나에게 말씀하시는 하나님의 음성이에요. 세상이 어둡고 길을 잃은 것 같을 때 성경이라는 안경을 쓰면 하나님의 뜻을 밝게 볼 수 있어요. 매일 성경을 읽으며 하나님과 대화해봐요!',
    missions: ['오늘 성경 한 절 소리 내어 읽기', '내 성경책을 소중하게 정리하기']
  },
  {
    id: 'theology_proper',
    title: '제2과 신론 (God)',
    subTitle: '우리를 만드신 하나님',
    Icon: Sun,
    color: 'bg-yellow-400',
    verse: '태초에 하나님이 천지를 창조하시니라 (창 1:1)',
    coreContent: `✨ 하나님은 온 세상을 말씀으로 만드신 위대한 왕이세요.\n\n1. 스스로 계신 분: 하나님은 누가 만든 분이 아니에요. 처음부터 계셨고 영원히 계시는 창조주 하나님이세요. 우리는 하나님의 허락 없이는 살 수 없지만, 하나님은 스스로 충분히 행복하고 위대하신 분이죠.\n\n2. 삼위일체 하나님: 하나님은 성부(아버지), 성자(아들 예수님), 성령(도우미) 세 분으로 계시지만, 사실은 영광과 권능이 똑같으신 '한 분' 하나님이시라는 놀라운 비밀이 있어요.\n\n3. 모든 것을 아시고 다스리세요: 하나님은 내가 어디에 있든 다 보시고, 내 마음의 생각까지 다 아세요. 그리고 지금도 온 우주와 지구, 그리고 나의 삶을 가장 선한 길로 다스리고 계신답니다.`,
    deepContent: '하나님은 우리처럼 몸이 있는 분이 아니라 "영"이세요. 그래서 어디에나 계시고(편재성), 모든 것을 다 아시고(전지성), 무엇이든 하실 수 있죠(전능성). 하나님은 어제나 오늘이나 변하지 않으시고 우리를 향한 사랑을 끝까지 지키시는 신실하신 분이에요.',
    meaningContent: '온 세상을 만드신 그 위대하신 하나님이 바로 나의 "아빠"가 되어주셨어요. 하나님은 나를 영화롭게 하고 기쁘게 하기 위해 만드셨답니다. 내가 숨 쉬고 살아가는 모든 이유가 하나님께 있어요. 하나님 한 분만으로 충분히 행복해요!',
    missions: ['하늘을 보며 하나님께 감사 기도하기', '하나님이 만드신 예쁜 꽃 이름 찾아보기']
  },
  {
    id: 'christology',
    title: '제3과 기독론 (Jesus)',
    subTitle: '우리의 유일한 구원자',
    Icon: Heart,
    color: 'bg-red-400',
    verse: '내가 곧 길이요 진리요 생명이니 (요 14:6)',
    coreContent: `✝️ 예수님은 우리를 죄에서 건져주신 유일한 영웅이세요.\n\n1. 하나님이 사람이 되셨어요: 예수님은 원래 하나님과 함께 계셨던 하나님의 아들이세요. 그런데 우리를 너무 사랑하셔서 우리와 똑같은 사람의 모습으로 이 땅에 오셨답니다. 이것을 '성육신'이라고 불러요.\n\n2. 십자가와 부활: 우리는 죄 때문에 하나님께 갈 수 없었지만, 예수님이 우리 대신 십자가에서 벌을 받으시고 죽으셨어요. 그리고 3일 만에 다시 살아나셔서 죄와 죽음의 권세를 이기셨죠!\n\n3. 우리의 세 가지 직분: 예수님은 하나님의 뜻을 알려주시는 '선지자', 우리 죄를 위해 제사 드려주시는 '제사장', 그리고 온 세상을 통치하시는 '왕'으로서 지금도 우리를 다스리고 계세요.`,
    deepContent: '예수님은 세 가지 아주 중요한 일을 하세요(삼중직). 첫째, 하나님 말씀을 전하는 "선지자", 둘째, 우리를 위해 제사장이 되어 기도해주시는 "대제사장", 셋째, 온 세상을 다스리는 "왕"이에요. 이 세 가지 일을 통해 우리를 완벽하게 구원해주셨어요.',
    meaningContent: '예수님만이 하나님께로 가는 유일한 길이에요. 내 힘으로 해결할 수 없는 죄의 문제를 예수님이 다 해결해주셨죠. 이제는 나도 예수님처럼 사람들을 사랑하고, 예수님의 말씀을 세상에 전하는 작은 제자로 살아가요.',
    missions: ['십자가 그림 그려서 책상에 붙이기', '예수님을 모르는 친구에게 교회 가자고 말하기']
  },
  {
    id: 'pneumatology',
    title: '제4과 성령론 (Holy Spirit)',
    subTitle: '함께하시는 도우미',
    Icon: Wind,
    color: 'bg-teal-400',
    verse: '보혜사 곧 성령 그가 너희에게 모든 것을 가르치고 (요 14:26)',
    coreContent: `🌬️ 성령님은 우리 마음속에 사시는 '보이지 않는 도우미'세요.\n\n1. 우리를 믿게 하세요: 성령님이 내 마음의 문을 두드려 주시지 않으면 우리는 절대로 예수님을 믿을 수 없어요. 성령님은 우리 눈을 밝혀주셔서 하나님 나라를 보게 하시고 복음을 믿게 하신답니다.\n\n2. 항상 함께하세요: 예수님은 하늘나라로 올라가셨지만, 성령님을 우리에게 보내주셨어요. 성령님은 우리 마음을 성전(집) 삼아 영원히 우리 곁을 떠나지 않고 지켜주세요.\n\n3. 우리를 변화시켜요: 성령님은 우리가 죄를 멀리하고 하나님이 기뻐하시는 행동을 하도록 도와주세요. 사랑, 희락, 화평 같은 '성령의 열매'를 맺게 해서 우리가 점점 예수님을 닮아가게 만드신답니다.`,
    deepContent: '성령님은 우리 마음을 집 삼아 사세요(내주). 성령님이 우리 안에 계시면 우리는 죄를 이길 힘이 생기고, 사랑, 기쁨, 화평 같은 아름다운 "성령의 열매"를 맺게 돼요. 성령님은 우리가 예수님을 닮아가도록 매일매일 인도해주신답니다.',
    meaningContent: '혼자라고 느껴질 때나 힘들 때, 성령님은 내 곁에서 나를 위해 기도해주고 계세요. 성령님은 내 마음의 내비게이션과 같아요. 매일 "성령님, 오늘도 도와주세요"라고 말하며 성령님과 함께 걸어가요!',
    missions: ['오늘 내 마음의 열매 하나 실천하기', '힘든 친구를 위해 기도해주기']
  },
  {
    id: 'soteriology',
    title: '제5과 구원론 (Salvation)',
    subTitle: '가장 큰 선물, 구원',
    Icon: ShieldCheck,
    color: 'bg-indigo-400',
    verse: '너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니 (엡 2:8)',
    coreContent: `🎁 구원은 하나님이 우리에게 거저 주시는 세상에서 가장 큰 선물이에요.\n\n1. 은혜로 받는 선물: 구원은 우리가 공부를 잘하거나 착한 일을 많이 해서 따내는 상장이 아니에요. 하나님이 우리를 불쌍히 여기셔서 아무 대가 없이 주시는 '은혜'랍니다.\n\n2. 오직 믿음으로: 우리가 할 일은 하나님이 주신 선물인 예수님을 '믿음'으로 받아들이는 것뿐이에요. "예수님이 나의 죄를 위해 죽으셨음을 믿어요!"라고 고백할 때 우리는 하나님의 자녀가 돼요.\n\n3. 하나님의 가족이 되었어요: 이제 우리는 죄인이 아니라 '의인'이라고 불리게 되었어요. 하나님은 우리를 양자(아들, 딸)로 삼아주셨고, 이제 우리는 영원히 하나님의 가족으로 살게 되었답니다.`,
    deepContent: '구원받은 우리는 거기서 멈추지 않아요. 이제는 하나님의 자녀답게 점점 예수님을 닮아가는 "성화"의 길을 걷게 돼요. 이것은 우리 힘이 아니라 하나님의 은혜로 이루어지는 거예요.',
    meaningContent: '나는 하나님의 소중한 자녀라는 사실을 절대 잊지 마세요. 내가 조금 실수해도 하나님은 나를 버리지 않으세요. 나를 구원해주신 하나님께 매일 감사하며 살아요.',
    missions: ['"나는 하나님의 보물이에요"라고 5번 말하기', '구원해주신 예수님께 감사 편지 쓰기']
  },
  {
    id: 'ecclesiology',
    title: '제6과 교회론 (The Church)',
    subTitle: '함께하는 천국 가족',
    Icon: Users,
    color: 'bg-purple-400',
    verse: '너희는 그리스도의 몸이요 지체의 각 부분이라 (고전 12:27)',
    coreContent: `⛪ 교회는 건물이 아니라 '예수님을 믿는 사람들의 모임'이에요.\n\n1. 그리스도의 몸: 교회는 마치 우리 몸과 같아요. 예수님은 교회의 '머리'이시고, 우리 한 사람 한 사람은 손, 발, 눈과 같은 '지체'랍니다. 그래서 우리는 서로 연결되어 있고 서로가 꼭 필요해요.\n\n2. 사랑의 공동체: 교회 안에서는 서로를 아껴주고 도와줘야 해요. 형제와 자매처럼 기쁜 일은 함께 기뻐하고 슬픈 일은 함께 울어주며 하나님의 사랑을 나누는 곳이 바로 교회예요.\n\n3. 세상을 향한 빛: 교회는 모여서 예배할 뿐만 아니라, 세상으로 나가서 예수님의 사랑을 전해야 해요. 어두운 세상을 밝히는 등불처럼 예수님의 살아계심을 보여주는 통로가 되어야 한답니다.`,
    deepContent: '교회에는 하나님이 세워주신 소중한 일꾼들이 있어요. 목사님, 장로님, 집사님, 선생님들이 계시죠. 우리는 각자 다른 모습이지만, 성령님의 끈으로 꽉 묶여 있는 하나랍니다.',
    meaningContent: '교회에 오면 옆에 있는 친구와 선생님을 하나님의 눈으로 바라보세요. 우리는 서로를 아껴줘야 하는 소중한 지체들이에요.',
    missions: ['교회 청소 한 가지 돕기', '친구 칭찬해주기']
  },
  {
    id: 'eschatology',
    title: '제7과 종말론 (Eschatology)',
    subTitle: '기다려지는 새로운 시작',
    Icon: CloudSun,
    color: 'bg-pink-400',
    verse: '보라 내가 만물을 새롭게 하노라 (계 21:5)',
    coreContent: `🌈 세상의 끝은 무서운 파멸이 아니라 '영광스러운 완성'이에요.\n\n1. 예수님이 다시 오세요: 예수님은 약속하신 대로 다시 이 땅에 오실 거예요. 그때는 아기 예수님이 아니라 영광스러운 왕의 모습으로 오셔서 세상을 심판하시고 우리를 영접해 주실 거예요.\n\n2. 새 하늘과 새 땅: 죄와 죽음, 눈물과 아픔이 모두 사라지고, 하나님과 함께 영원히 행복하게 사는 '천국'이 완성될 거예요. 우리는 그곳에서 가장 아름답고 건강한 모습으로 다시 살아나게 된답니다.\n\n3. 오늘을 준비해요: 종말을 기다리는 사람은 무서워하는 사람이 아니에요. 오히려 다시 오실 예수님을 기대하며, 오늘 하루를 하나님의 자녀답게 거룩하고 기쁘게 살아가는 사람이죠!`,
    deepContent: '우리는 영광스러운 몸으로 다시 살아날 거예요. 천국은 나중에 가는 곳이기도 하지만, 지금 내 마음속에서 이미 시작된 하나님의 나라랍니다.',
    meaningContent: '우리는 소망이 있는 사람들이이에요. 다시 오실 예수님을 기다리며, 오늘 하루를 기쁘고 당당하게 살아가는 용기 있는 어린이가 되어요!',
    missions: ['천국에 가면 하고 싶은 일 그림으로 그려보기', '가족과 함께 기도하기']
  }
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  // 제1과 성경론
  { id: 'q1', topicId: 'bibliology', question: "1번. 성경은 주로 누가 쓰게 하신 책일까요?", options: ["아주 똑똑한 사람들", "유명한 왕과 학자들", "하나님께서 성령님을 통해 쓰게 하신 책", "천사들"], answerIndex: 2, explanation: "성경은 사람이 기록했지만, 하나님께서 성령님을 통해 쓰게 하신 책이기 때문이에요. (시 119:105)" },
  { id: 'q2', topicId: 'bibliology', question: "2번. [OX] 성경은 사람의 생각만 모아 놓은 책이다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 1, explanation: "성경에는 사람의 말이 아니라, 하나님께서 주신 말씀이 담겨 있어요. (딤후 3:16)" },
  { id: 'q3', topicId: 'bibliology', question: "3번. 성경을 쓰실 때 하나님께서 사용하신 분은 누구일까요?", options: ["예수님", "천사", "성령님", "모세"], answerIndex: 2, explanation: "하나님께서는 성령님을 통해 사람들에게 말씀을 기록하게 하셨어요. (벧후 1:21)" },
  { id: 'q4', topicId: 'bibliology', question: "4번. [OX] 성경은 한 사람이 한 번에 다 쓴 책이다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 1, explanation: "성경은 많은 사람들이 오랜 시간에 걸쳐 나누어 기록했어요. (히 1:1)" },
  { id: 'q5', topicId: 'bibliology', question: "5번. 성경은 왜 믿을 수 있는 책일까요?", options: ["아주 오래된 책이기 때문에", "사람들이 많이 읽어서", "하나님께서 성령님을 통해 쓰게 하셨기 때문에", "교회에 있기 때문에"], answerIndex: 2, explanation: "성경은 하나님께서 직접 말씀하신 내용이기 때문에 믿을 수 있어요. (딤후 3:16)" },
  { id: 'q6', topicId: 'bibliology', question: "6번. [빈칸] “모든 성경은 하나님의 ( )으로 된 것입니다.”", options: ["지혜", "능력", "감동", "계획"], answerIndex: 2, explanation: "하나님께서 사람들의 마음을 움직여 말씀을 쓰게 하셨다는 뜻이에요. (딤후 3:16)" },
  { id: 'q7', topicId: 'bibliology', question: "7번. [OX] 성경은 하나님께서 우리에게 알려 주고 싶은 이야기를 담고 있다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 0, explanation: "성경에는 하나님께서 우리에게 전하고 싶은 말씀이 들어 있어요. (요 20:31)" },
  { id: 'q8', topicId: 'bibliology', question: "8번. 성경은 우리에게 무엇을 알려 주는 책일까요?", options: ["세상 역사 이야기", "재미있는 옛날 이야기", "하나님의 말씀과 뜻", "공부를 잘하는 방법"], answerIndex: 2, explanation: "성경은 하나님이 어떤 분이신지, 어떻게 살기 원하시는지 알려 줘요. (시 119:105)" },
  { id: 'q9', topicId: 'bibliology', question: "9번. 성경은 어떤 책인지 한 문장으로 가장 잘 표현한 것은?", options: ["착하게 살라고 가르치는 도덕책", "하나님께서 성령님을 통해 쓰게 하신 하나님의 말씀", "오래된 옛날 이야기 모음집", "유명한 학자들이 쓴 연구서"], answerIndex: 1, explanation: "성경은 하나님께서 성령님을 통해 우리에게 주신 살아있는 말씀입니다. (딤후 3:16)" },
  { id: 'q10', topicId: 'bibliology', question: "10번. 성경이 하나님의 말씀이라면, 나는 성경을 어떻게 대해야 할까요?", options: ["어려우니 가끔 생각날 때만 본다", "남들에게 자랑하기 위해 가지고 다닌다", "소중히 읽고, 하나님의 말씀으로 믿는다", "책상 위에 장식품으로 둔다"], answerIndex: 2, explanation: "성경이 하나님의 말씀이기 때문에 귀하게 여기고 읽어야 해요. (시 1:2)" },
  
  // 제2과 신론
  { id: 'q11', topicId: 'theology_proper', question: "1번. 하나님은 어떤 분이신가요?", options: ["다른 신이 만들어 주셨다", "세상이 생길 때 함께 생기셨다", "원래부터 스스로 계신 분이다", "천사에게서 오셨다"], answerIndex: 2, explanation: "하나님은 누가 만든 분이 아니라 처음부터 계신 분이에요. (출 3:14)" },
  { id: 'q12', topicId: 'theology_proper', question: "2번. [OX] 하나님은 시작과 끝이 있으신 분이다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 1, explanation: "하나님은 시작도 끝도 없으신 영원한 분이에요. (계 1:8)" },
  { id: 'q13', topicId: 'theology_proper', question: "3번. ‘영원하신 하나님’이라는 말의 뜻으로 가장 알맞은 것은?", options: ["아주 오래 사신 분", "시간이 많은 분", "언제나 계신 분", "나중에 생긴 분"], answerIndex: 2, explanation: "하나님은 언제나 계시고 앞으로도 항상 계세요. (시 90:2)" },
  { id: 'q14', topicId: 'theology_proper', question: "4번. [OX] 사람은 하나님이 만드셨지만, 하나님은 누군가에게 만들어지지 않으셨다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 0, explanation: "하나님은 창조주이시고, 스스로 계신 분이에요. (출 3:14)" },
  { id: 'q15', topicId: 'theology_proper', question: "5번. 성경은 하나님이 언제부터 계셨다고 말하나요?", options: ["세상이 만들어진 후부터", "산이 생긴 뒤부터", "영원 전부터 영원까지", "사람 이후부터"], answerIndex: 2, explanation: "성경은 하나님이 영원부터 영원까지 계신 분이라고 말해요. (시 90:2)" },
  { id: 'q16', topicId: 'theology_proper', question: "6번. [빈칸] 하나님은 누가 만든 분이 아니라, ( ) 계신 분입니다.", options: ["태어나", "우연히", "스스로", "몰래"], answerIndex: 2, explanation: "하나님은 다른 누군가에게 만들어지지 않으셨어요. (출 3:14)" },
  { id: 'q17', topicId: 'theology_proper', question: "7번. [OX] 하나님은 지금도 살아 계신 하나님이시다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 0, explanation: "하나님은 과거에만 계셨던 분이 아니라 지금도 계세요. (신 5:26)" },
  { id: 'q18', topicId: 'theology_proper', question: "8번. 하나님이 영원하시다는 사실은 우리에게 무엇을 알려 줄까요?", options: ["하나님은 멀리 계신다", "하나님은 변하신다", "언제나 믿을 수 있다", "하나님은 쉬신다"], answerIndex: 2, explanation: "언제나 계시는 하나님은 항상 믿을 수 있어요. (히 13:8)" },
  { id: 'q19', topicId: 'theology_proper', question: "9번. 하나님은 어떤 분이신지 한 문장으로 가장 잘 말한 것은?", options: ["우리가 필요할 때만 계시는 분", "하나님은 스스로 계신 영원하신 분이십니다", "천사들과 비슷한 능력을 가진 분", "세상 끝날 때 함께 사라지시는 분"], answerIndex: 1, explanation: "하나님은 스스로 계신 영원하신 분입니다. (시 90:2)" },
  { id: 'q20', topicId: 'theology_proper', question: "10번. 영원하신 하나님을 믿는 나는 어떻게 살아가면 좋을까요?", options: ["내 마음대로 자유롭게 산다", "가끔만 하나님을 생각한다", "언제나 하나님을 믿고 의지하며 살아요", "하나님보다 돈을 더 소중히 한다"], answerIndex: 2, explanation: "하나님은 변하지 않으시기 때문에 늘 믿고 따라갈 수 있어요. (시 62:8)" },

  // 제3과 기독론
  { id: 'q21', topicId: 'christology', question: "1번. 예수님은 누구신가요?", options: ["착한 선생님", "위대한 사람", "하나님이시며 사람이신 분", "천사"], answerIndex: 2, explanation: "예수님은 하나님이시면서 우리를 위해 사람이 되어 오셨어요. (요 1:1)" },
  { id: 'q22', topicId: 'christology', question: "2번. [OX] 예수님은 하나님이 아니시고 사람일 뿐이다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 1, explanation: "성경은 예수님이 하나님이시라고 분명히 말해요. (요 1:1)" },
  { id: 'q23', topicId: 'christology', question: "3번. 예수님을 ‘하나님의 아들’이라고 부르는 이유는 무엇일까요?", options: ["하나님이 예수님을 만드셨기 때문에", "예수님이 천사이기 때문에", "예수님이 하나님과 똑같은 분이시기 때문에", "예수님이 특별한 능력이 있어서"], answerIndex: 2, explanation: "예수님은 바로 하나님이시기 때문이에요. 예수님은 하나님과 같아요. (요 10:30)" },
  { id: 'q24', topicId: 'christology', question: "4번. [OX] 예수님은 우리와 같은 몸을 가지고 이 땅에 오셨다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 0, explanation: "말씀이 육신이 되어 우리 가운데 오셨어요. (요 1:14)" },
  { id: 'q25', topicId: 'christology', question: "5번. 예수님이 사람이 되어 오신 이유로 가장 알맞은 것은?", options: ["세상을 여행하려고", "사람들에게 유명해지려고", "우리를 사랑하시고 구원하시기 위해", "기적을 보여 주려고"], answerIndex: 2, explanation: "예수님은 우리를 구원하시기 위해 사람이 되셨어요. (요 3:16)" },
  { id: 'q26', topicId: 'christology', question: "6번. [빈칸] 예수님은 참 ( )이시며 참 ( )이십니다.", options: ["선지자 / 왕", "사람 / 천사", "하나님 / 사람", "스승 / 제자"], answerIndex: 2, explanation: "예수님은 두 본성을 모두 가지신 분이에요. (요 1:14)" },
  { id: 'q27', topicId: 'christology', question: "7번. [OX] 예수님을 보면 하나님이 어떤 분이신지 알 수 있다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 0, explanation: "예수님은 하나님의 모습을 우리에게 보여 주셨어요. (요 14:9)" },
  { id: 'q28', topicId: 'christology', question: "8번. 예수님은 우리에게 하나님을 어떻게 보여 주셨나요?", options: ["무서운 모습으로", "멀리 계신 모습으로", "사랑하고 섬기는 모습으로", "아무 말씀도 하지 않고"], answerIndex: 2, explanation: "예수님의 삶을 통해 하나님의 사랑을 볼 수 있어요. (요 13:34)" },
  { id: 'q29', topicId: 'christology', question: "9번. 예수님은 어떤 분이신지 한 문장으로 가장 잘 말한 것은?", options: ["그냥 좋은 일을 많이 한 사람", "예수님은 하나님이시며 우리를 사랑하시기 위해 사람이 되어 오신 분이십니다", "미래를 잘 맞추는 예언자", "세상의 역사만 기록하는 분"], answerIndex: 1, explanation: "예수님은 하나님이시며 우리를 사랑하시기 위해 사람이 되어 오신 분이십니다. (요 1:1)" },
  { id: 'q30', topicId: 'christology', question: "10번. 예수님이 어떤 분이신지를 알 때 나는 어떻게 살아가면 좋을까요?", options: ["공부만 열심히 한다", "가끔만 하나님을 생각한다", "예수님을 믿고, 예수님처럼 사랑하며 살아요", "나의 성공만을 위해 노력한다"], answerIndex: 2, explanation: "예수님은 우리에게 사랑의 본을 보여 주셨어요. (요 13:15)" },

  // 제4과 성령론
  { id: 'q31', topicId: 'pneumatology', question: "1번. 성령님은 어떤 분이실까요?", options: ["천사이다", "사람이 만든 힘이다", "하나님이시다", "보이지 않는 바람이다"], answerIndex: 2, explanation: "성령님은 하나님이시라고 성경이 말해요. (마 28:19)" },
  { id: 'q32', topicId: 'pneumatology', question: "2번. [OX] 성령님은 예수님을 믿는 사람들과 함께 계신다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 0, explanation: "성령님은 우리 안에 계신다고 성경이 말해요. (고전 6:19)" },
  { id: 'q33', topicId: 'pneumatology', question: "3번. 성령님은 우리에게 무엇을 알려 주실까요?", options: ["세상 비밀", "미래 시험 문제", "하나님을 알게 하심", "돈 버는 방법"], answerIndex: 2, explanation: "성령님은 하나님을 알게 하세요. (요 14:26)" },
  { id: 'q34', topicId: 'pneumatology', question: "4번. [OX] 성령님은 눈에 보이지 않지만 하나님이 아니다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 1, explanation: "눈에 보이지 않아도 성령님은 하나님이세요. (고후 3:17)" },
  { id: 'q35', topicId: 'pneumatology', question: "5번. 성령님이 우리와 함께 계신다는 말의 뜻은 무엇일까요?", options: ["멀리서 보고만 계신다", "가끔만 찾아오신다", "항상 우리 곁에 계신다", "옛날에만 계셨다"], answerIndex: 2, explanation: "성령님은 항상 우리와 함께 계세요. (요 14:16)" },
  { id: 'q36', topicId: 'pneumatology', question: "6번. [빈칸] 성령님은 예수님을 믿는 사람들 ( )에 계십니다.", options: ["옆", "뒤", "안", "밖"], answerIndex: 2, explanation: "성령님은 우리 안에 거하신다고 성경이 말해요. (고전 6:19)" },
  { id: 'q37', topicId: 'pneumatology', question: "7번. [OX] 성령님은 삼위일체 하나님의 한 분이시다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 0, explanation: "성부·성자·성령은 한 하나님이세요. (마 28:19)" },
  { id: 'q38', topicId: 'pneumatology', question: "8번. 성령님은 우리에게 어떤 마음을 주실까요?", options: ["두려움만", "미움", "하나님을 사랑하는 마음", "욕심"], answerIndex: 2, explanation: "성령님은 하나님을 사랑하게 하세요. (롬 5:5)" },
  { id: 'q39', topicId: 'pneumatology', question: "9번. 성령님은 어떤 분이신지 한 문장으로 가장 잘 말한 것은?", options: ["그냥 착한 마음", "성령님은 하나님이시며 지금도 우리와 함께 계신 분이십니다", "하늘을 나는 천사", "보이지 않는 신비한 바람"], answerIndex: 1, explanation: "성령님은 하나님이시며 지금도 우리와 함께 계신 분이십니다. (고전 6:19)" },
  { id: 'q40', topicId: 'pneumatology', question: "10번. 성령님이 함께 계신다는 것을 믿는 나는 어떻게 살아가면 좋을까요?", options: ["내 힘으로만 산다", "무서워하며 산다", "기도하며 하나님을 의지하며 살아요", "대충 아무렇게나 산다"], answerIndex: 2, explanation: "성령님은 우리를 떠나지 않으세요. (요 14:16)" },

  // 제5과 구원론
  { id: 'q41', topicId: 'soteriology', question: "1번. 하나님은 우리를 어떻게 구원하실까요?", options: ["우리가 착해서", "우리가 공부를 잘해서", "하나님의 은혜로", "우리가 돈이 많아서"], answerIndex: 2, explanation: "구원은 하나님의 은혜로 주어지는 선물이에요. (엡 2:8)" },
  { id: 'q42', topicId: 'soteriology', question: "2번. [OX] 구원은 하나님이 우리에게 주시는 선물이다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 0, explanation: "성경은 구원이 하나님의 선물이라고 말해요. (엡 2:8)" },
  { id: 'q43', topicId: 'soteriology', question: "3번. 하나님이 우리를 구원하시기 위해 보내신 분은 누구일까요?", options: ["천사", "모세", "예수님", "선지자"], answerIndex: 2, explanation: "하나님은 예수님을 보내셔서 우리를 구원하셨어요. (요 3:16)" },
  { id: 'q44', topicId: 'soteriology', question: "4번. [OX] 우리가 착하게 살면 구원받을 수 있다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 1, explanation: "구원은 우리의 행동이 아니라 하나님의 은혜로 받아요. (엡 2:8-9)" },
  { id: 'q45', topicId: 'soteriology', question: "5번. 예수님은 우리를 위해 무엇을 하셨나요?", options: ["좋은 말씀만 하셨다", "병만 고쳐 주셨다", "십자가에서 죄를 대신 지셨다", "친구만 만들어 주셨다"], answerIndex: 2, explanation: "예수님은 십자가에서 우리의 죄를 대신 지셨어요. (롬 5:8)" },
  { id: 'q46', topicId: 'soteriology', question: "6번. [빈칸] 우리는 ( )으로 예수님을 믿어 구원받습니다.", options: ["착한 일", "지혜", "믿음", "행운"], answerIndex: 2, explanation: "구원은 믿음으로 받는 하나님의 선물이에요. (엡 2:8)" },
  { id: 'q47', topicId: 'soteriology', question: "7번. [OX] 구원은 하나님과 다시 친구가 되는 것이다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 0, explanation: "구원은 하나님과의 관계가 회복되는 것이에요. (롬 5:10)" },
  { id: 'q48', topicId: 'soteriology', question: "8번. 하나님이 우리를 구원하신 가장 큰 이유는 무엇일까요?", options: ["우리가 필요해서", "우리가 약해서", "우리를 사랑하시기 때문에", "우리가 부탁해서"], answerIndex: 2, explanation: "하나님은 사랑으로 우리를 구원하셨어요. (요일 4:10)" },
  { id: 'q49', topicId: 'soteriology', question: "9번. 하나님은 우리를 어떻게 구원하시는지 한 문장으로 가장 잘 말한 것은?", options: ["열심히 공부하면 구원하신다", "하나님은 은혜로 예수님을 통해 우리를 구원하십니다", "천사가 우리를 데리러 온다", "세상 끝날 때 착한 사람만 골라낸다"], answerIndex: 1, explanation: "하나님은 은혜로 예수님을 통해 우리를 구원하십니다. (엡 2:8)" },
  { id: 'q50', topicId: 'soteriology', question: "10번. 구원받은 나는 오늘 어떻게 살아가면 좋을까요?", options: ["내 마음대로 자유롭게 산다", "구원받았으니 아무렇게나 산다", "하나님께 감사하며 예수님을 믿고 따라가요", "남보다 앞서기 위해 경쟁하며 산다"], answerIndex: 2, explanation: "구원은 삶의 태도를 감사함으로 바꾸어요. (골 2:6)" },

  // 제6과 교회론
  { id: 'q51', topicId: 'ecclesiology', question: "1번. 성경이 말하는 교회는 무엇일까요?", options: ["큰 건물", "사람들이 만든 동호회", "예수님을 믿는 사람들이 모인 공동체", "학교"], answerIndex: 2, explanation: "교회는 건물이 아니라 예수님을 믿는 사람들이 함께 모인 공동체예요. (고전 12:27)" },
  { id: 'q52', topicId: 'ecclesiology', question: "2번. [OX] 교회는 건물만 있으면 된다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 1, explanation: "교회는 건물이 아니라 사람들의 모임이에요. (행 2:46)" },
  { id: 'q53', topicId: 'ecclesiology', question: "3번. 교회에서 우리가 함께하는 중요한 일은 무엇일까요?", options: ["놀기만 한다", "세상 공부만 한다", "예배하고 말씀을 듣는다", "잠만 잔다"], answerIndex: 2, explanation: "교회는 함께 하나님을 예배하고 말씀을 나누는 소중한 곳이에요. (행 2:42)" },
  { id: 'q54', topicId: 'ecclesiology', question: "4번. [OX] 교회는 서로 사랑하고 돕는 공동체이다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 0, explanation: "초대교회 성도들은 서로 사랑하고 돕고 나누었어요. (행 2:44-45)" },
  { id: 'q55', topicId: 'ecclesiology', question: "5번. 성경은 교회를 무엇이라고 부를까요?", options: ["집", "그리스도의 몸", "나라", "백성"], answerIndex: 1, explanation: "성경은 우리가 각자 지체이며, 교회는 그리스도의 몸이라고 말해요. (고전 12:27)" },
  { id: 'q56', topicId: 'ecclesiology', question: "6번. [빈칸] 교회는 예수님을 ( ) 사람들이 함께 모인 곳입니다.", options: ["좋아하는", "이용하는", "믿는", "구경하는"], answerIndex: 2, explanation: "교회는 예수님을 구주로 믿는 사람들의 모임이에요. (행 2:46)" },
  { id: 'q57', topicId: 'ecclesiology', question: "7번. [OX] 교회에서는 서로를 위해 기도한다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 0, explanation: "교회는 함께 모여 기도와 교제를 소중히 여겨요. (행 2:42)" },
  { id: 'q58', topicId: 'ecclesiology', question: "8번. 교회에 모이는 가장 중요한 이유는 무엇일까요?", options: ["친구를 만나서 놀기 위해", "선물을 받으려고", "하나님을 예배하기 위해", "간식을 먹으러"], answerIndex: 2, explanation: "교회에 모이는 최고의 목적은 하나님을 예배하는 것이에요. (행 2:46)" },
  { id: 'q59', topicId: 'ecclesiology', question: "9번. 교회는 무엇인지 한 문장으로 가장 잘 말한 것은?", options: ["그냥 오래된 건물 중 하나", "예수님을 믿는 사람들이 함께 모여 하나님을 예배하는 공동체", "매주 일요일에만 가는 장소", "친구들과 게임하는 곳"], answerIndex: 1, explanation: "교회는 믿는 자들의 공동체이자 예배하는 곳입니다. (고전 12:27)" },
  { id: 'q60', topicId: 'ecclesiology', question: "10번. 교회의 한 사람으로서 나는 무엇을 해 볼 수 있을까요?", options: ["나 혼자서만 기도하고 끝낸다", "예배에 빠지고 놀러 간다", "예배에 성실히 참여하고, 친구를 돕고 기도해요", "남이 무엇을 하든 신경 쓰지 않는다"], answerIndex: 2, explanation: "우리는 서로 연결된 지체로서 함께 자라가야 해요. (행 2:42)" },

  // 제7과 종말론
  { id: 'q61', topicId: 'eschatology', question: "1번. 성경이 말하는 이 세상의 마지막은 무엇일까요?", options: ["우연히 사라진다", "다시 처음으로 돌아간다", "하나님께서 새롭게 하신다", "아무도 모른다"], answerIndex: 2, explanation: "하나님은 만물을 새롭게 하신다고 약속하셨어요. (계 21:5)" },
  { id: 'q62', topicId: 'eschatology', question: "2번. [OX] 종말은 하나님 나라가 완성되는 날이다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 0, explanation: "종말은 하나님의 구원 계획이 완성되는 날이에요. (계 21:1)" },
  { id: 'q63', topicId: 'eschatology', question: "3번. 예수님은 언제 다시 오실까요?", options: ["이미 오셨다", "우리가 정할 수 있다", "하나님이 정하신 때에 오신다", "오시지 않는다"], answerIndex: 2, explanation: "예수님의 다시 오심은 하나님께서 정하신 때에 이루어져요. (마 24:36)" },
  { id: 'q64', topicId: 'eschatology', question: "4번. [OX] 종말은 믿는 사람에게도 무서운 날이다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 1, explanation: "믿는 사람에게 종말은 슬픔이 끝나는 소망의 날이에요. (살전 4:16-17)" },
  { id: 'q65', topicId: 'eschatology', question: "5번. 하나님 나라가 완성되면 어떤 일이 일어날까요?", options: ["슬픔과 눈물이 계속된다", "눈물과 아픔이 사라진다", "다시 죄가 많아진다", "아무 변화가 없다"], answerIndex: 1, explanation: "하나님은 모든 눈물을 씻어 주시고 아픔이 없게 하실 거예요. (계 21:4)" },
  { id: 'q66', topicId: 'eschatology', question: "6번. [빈칸] 하나님은 이 세상을 ( ) 하십니다.", options: ["슬프게", "그대로", "새롭게", "잊게"], answerIndex: 2, explanation: "하나님은 만물을 처음보다 더 좋고 새롭게 하십니다. (계 21:5)" },
  { id: 'q67', topicId: 'eschatology', question: "7번. [OX] 예수님의 다시 오심은 하나님의 약속이다.", options: ["⭕ 그렇다", "❌ 아니다"], answerIndex: 0, explanation: "예수님의 재림은 성경이 우리에게 준 확실한 약속이에요. (행 1:11)" },
  { id: 'q68', topicId: 'eschatology', question: "8번. 종말 신앙이 오늘 우리의 삶에 주는 모습으로 알맞은 것은?", options: ["아무 생각 없이 산다", "무서워해서 숨어 지낸다", "소망을 가지고 바르게 산다", "내일은 중요하지 않다"], answerIndex: 2, explanation: "천국 소망은 오늘 하루를 더욱 보람차게 살게 해요. (딛 2:13)" },
  { id: 'q69', topicId: 'eschatology', question: "9번. 하나님은 이 세상을 어떻게 마무리하시는지 한 문장으로 가장 잘 말한 것은?", options: ["세상을 갑자기 없애 버리신다", "하나님은 이 세상을 새롭게 하시고 하나님 나라를 완성하십니다", "사람들이 알아서 하게 두신다", "아무도 모르게 조용히 끝내신다"], answerIndex: 1, explanation: "하나님은 세상을 완성하시고 새롭게 하십니다. (계 21:5)" },
  { id: 'q70', topicId: 'eschatology', question: "10번. 종말의 소망을 믿는 나는 오늘 어떻게 살아가면 좋을까요?", options: ["놀기만 하며 시간을 보낸다", "무서워하며 미래를 걱정한다", "하나님을 믿고 사랑하며 바르게 살아요", "나의 성공만을 위해 살아간다"], answerIndex: 2, explanation: "소망을 품은 사람은 오늘을 거룩하고 바르게 살아가요. (벧후 3:11)" }
];

const TEACHER_CATEGORIES: TeacherCategory[] = [
  { id: 'teacher-manual', name: '교사용 지도안', Icon: Library, color: 'bg-slate-700', description: '체계적인 공과 지도를 위한 가이드라인' },
  { id: 'teacher-workbook', name: '학생용 활동지', Icon: Pencil, color: 'bg-indigo-600', description: '학생들의 참여를 이끄는 워크북 자료' },
  { id: 'slides', name: '교육용 PPT', Icon: Presentation, color: 'bg-orange-500', description: '예배 및 공과 시간에 활용하는 시각 자료' },
  { id: 'corner-learning', name: '코너학습 가이드', Icon: Gamepad2, color: 'bg-rose-500', description: '교육 테마별 활동 매뉴얼' },
  { id: 'talent-gifts', name: '보상 선물 명단', Icon: Gift, color: 'bg-amber-500', description: '학생별 보상 관리 및 시상 현황' },
  { id: 'mission-confirm', name: '오늘의 미션 확인', Icon: CheckCircle2, color: 'bg-teal-600', description: '학생이 한 미션을 확인하고 보상 부여' },
  { id: 'logged-in-students', name: '로그인한 학생 명단', Icon: Users, color: 'bg-sky-600', description: '로그인한 학생 목록' },
];

const ADMIN_CATEGORIES: TeacherCategory[] = [
  { id: 'church-settings', name: '교회 설정', Icon: Settings, color: 'bg-gray-600', description: '교회명, 비밀번호, 선생님 관리' },
  { id: 'shop-admin', name: '상점 관리', Icon: ShoppingBag, color: 'bg-emerald-600', description: '상점 아이템 추가 및 가격 설정' },
  { id: 'class-management', name: '반별 관리', Icon: Map, color: 'bg-violet-600', description: '반 생성 및 학생 반 배정' },
  { id: 'logged-in-students', name: '로그인한 학생 명단', Icon: Users, color: 'bg-sky-600', description: '로그인한 학생 목록' },
  { id: 'teacher-manual', name: '교사용 지도안', Icon: Library, color: 'bg-slate-700', description: '체계적인 공과 지도를 위한 가이드라인' },
  { id: 'teacher-workbook', name: '학생용 활동지', Icon: Pencil, color: 'bg-indigo-600', description: '학생들의 참여를 이끄는 워크북 자료' },
  { id: 'slides', name: '교육용 PPT', Icon: Presentation, color: 'bg-orange-500', description: '예배 및 공과 시간에 활용하는 시각 자료' },
  { id: 'corner-learning', name: '코너학습 가이드', Icon: Gamepad2, color: 'bg-rose-500', description: '교육 테마별 활동 매뉴얼' },
  { id: 'talent-gifts', name: '보상 선물 명단', Icon: Gift, color: 'bg-amber-500', description: '학생별 보상 관리 및 시상 현황' },
  { id: 'mission-confirm', name: '오늘의 미션 확인', Icon: CheckCircle2, color: 'bg-teal-600', description: '학생이 한 미션을 확인하고 보상 부여' },
];

const STICKERS = [
  { id: 'sticker-1', name: '기쁨의 별', icon: '⭐', price: 30 },
  { id: 'sticker-2', name: '사랑의 하트', icon: '❤️', price: 50 },
  { id: 'sticker-3', name: '믿음의 방패', icon: '🛡️', price: 100 },
  { id: 'sticker-4', name: '성령의 비둘기', icon: '🕊️', price: 150 },
  { id: 'sticker-5', name: '천국의 열쇠', icon: '🔑', price: 200 },
];

const CLASS_COLORS: { bg: string; text: string; border: string; borderL: string; light: string }[] = [
  { bg: 'bg-violet-500', text: 'text-white', border: 'border-violet-600', borderL: 'border-l-violet-600', light: 'bg-violet-50' },
  { bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-600', borderL: 'border-l-amber-600', light: 'bg-amber-50' },
  { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600', borderL: 'border-l-emerald-600', light: 'bg-emerald-50' },
  { bg: 'bg-rose-500', text: 'text-white', border: 'border-rose-600', borderL: 'border-l-rose-600', light: 'bg-rose-50' },
  { bg: 'bg-sky-500', text: 'text-white', border: 'border-sky-600', borderL: 'border-l-sky-600', light: 'bg-sky-50' },
  { bg: 'bg-fuchsia-500', text: 'text-white', border: 'border-fuchsia-600', borderL: 'border-l-fuchsia-600', light: 'bg-fuchsia-50' },
];
const DEFAULT_CLASS_COLOR = { bg: 'bg-slate-500', text: 'text-white', border: 'border-slate-600', borderL: 'border-l-slate-600', light: 'bg-slate-50' };

const App: React.FC = () => {
  // ── 교회 설정 & 선생님 목록 ──
  const [churchConfig, setChurchConfig] = useState<ChurchConfig>(loadChurchConfig);
  const [teachers, setTeachersState] = useState<Teacher[]>(loadTeachers);
  const [showSetupWizard, setShowSetupWizard] = useState<boolean>(() => !localStorage.getItem('church_config'));
  const [setupStep, setSetupStep] = useState(0);
  const [setupConfig, setSetupConfig] = useState<ChurchConfig>({ ...DEFAULT_CHURCH_CONFIG });

  // ── 멀티디바이스 연결 상태 ──
  const [apiUrl, setApiUrl] = useState<string>(() => localStorage.getItem('church_api_url') || '');
  const connectionMode: 'local' | 'cloud' = apiUrl ? 'cloud' : 'local';
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [cloudOnline, setCloudOnline] = useState(true);
  const [setupApiUrl, setSetupApiUrl] = useState('');
  const [setupApiTesting, setSetupApiTesting] = useState(false);
  const [setupApiResult, setSetupApiResult] = useState<'success' | 'fail' | null>(null);

  const updateChurchConfig = (newConfig: ChurchConfig) => {
    setChurchConfig(newConfig);
    saveChurchConfig(newConfig);
    if (connectionMode === 'cloud' && apiUrl) {
      gasPost(apiUrl, { action: 'updateConfig', config: newConfig }).catch(console.error);
    }
  };

  const updateTeachers = (newTeachers: Teacher[]) => {
    setTeachersState(newTeachers);
    saveTeachers(newTeachers);
  };

  // 동적 타이틀 반영
  useEffect(() => {
    const parts = [churchConfig.departmentName, churchConfig.eventName].filter(Boolean);
    document.title = parts.length > 0 ? parts.join(' ') : '교회 교육 앱';
  }, [churchConfig.departmentName, churchConfig.eventName]);

  const getDisplayTitle = () => {
    if (churchConfig.departmentName || churchConfig.eventName) {
      return { line1: churchConfig.departmentName || '교회 교육부', line2: churchConfig.eventName || '교리성경공부' };
    }
    return { line1: '교회 교육부', line2: '교리성경공부' };
  };

  const [userName, setUserName] = useState<string>(() => localStorage.getItem('church_user_name') || '');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState('');

  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('church_admin_session');
    return saved === churchConfig.adminPassword;
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem('church_admin_session');
    return saved === churchConfig.adminPassword;
  });
  const [showTeacherAuthModal, setShowTeacherAuthModal] = useState(false);
  const [teacherPassword, setTeacherPassword] = useState('');
  const [authRoleChoice, setAuthRoleChoice] = useState<'student' | 'teacher' | 'admin' | null>(null);
  const [selectedTeacherCategory, setSelectedTeacherCategory] = useState<TeacherCategory | null>(null);
  const [selectedAdminCategory, setSelectedAdminCategory] = useState<TeacherCategory | null>(null);

  // 교사 라운지 학생 명단 상태
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('church_students');
    const parsed: Student[] = saved ? JSON.parse(saved) : [];
    return parsed.map(s => ({ ...s, classId: s.classId ?? null }));
  });
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('');
  const [loggedInStudents, setLoggedInStudents] = useState<LoggedInStudent[]>([]);
  const [classes, setClasses] = useState<Class[]>(() => {
    const saved = localStorage.getItem('church_classes');
    return saved ? JSON.parse(saved) : [];
  });
  const [quizRewardTalents, setQuizRewardTalents] = useState(1);
  const [newStudentName, setNewStudentName] = useState('');
  const [newShopItemName, setNewShopItemName] = useState('');
  const [newShopItemIcon, setNewShopItemIcon] = useState('⭐');
  const [newShopItemPrice, setNewShopItemPrice] = useState(30);
  const [editingShopItemId, setEditingShopItemId] = useState<string | null>(null);
  const [editShopName, setEditShopName] = useState('');
  const [editShopIcon, setEditShopIcon] = useState('');
  const [editShopPrice, setEditShopPrice] = useState(0);
  const [newClassName, setNewClassName] = useState('');
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editClassName, setEditClassName] = useState('');

  const [talents, setTalents] = useState<number>(() => {
    const saved = localStorage.getItem('church_talents');
    return saved ? parseInt(saved) : loadChurchConfig().initialCurrency;
  });
  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    const saved = localStorage.getItem('church_missions');
    return saved ? JSON.parse(saved) : [];
  });
  const [ownedStickers, setOwnedStickers] = useState<string[]>(() => {
    const saved = localStorage.getItem('church_stickers');
    return saved ? JSON.parse(saved) : [];
  });

  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem('church_shop_items');
    return saved ? JSON.parse(saved) : STICKERS;
  });

  const [materialsList, setMaterialsList] = useState<Record<string, { name: string; file: string }[]>>({});

  // Google Drive state
  const [gDriveState, setGDriveState] = useState<GoogleDriveState>({
    isSignedIn: false, accessToken: null, userEmail: null, appFolderId: null, categoryFolderIds: {},
  });
  const [gDriveLoading, setGDriveLoading] = useState(false);
  const [gDriveMaterials, setGDriveMaterials] = useState<Record<string, GoogleDriveFile[]>>(() => loadDriveMaterialsFromStorage());
  const tokenClientRef = useRef<any>(null);

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('church_challenges');
    return saved ? JSON.parse(saved) : DEFAULT_CHALLENGES;
  });
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(() => {
    const saved = localStorage.getItem('church_completed_challenges');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedChallengeRoom, setSelectedChallengeRoom] = useState(false);
  const [pendingBetChallengeId, setPendingBetChallengeId] = useState<string | null>(null);
  const [pendingBetAmount, setPendingBetAmount] = useState(0);
  const [pendingClassAssign, setPendingClassAssign] = useState<{ studentId: string; classId: string | null } | null>(null);
  const [unassignedSelectedClassId, setUnassignedSelectedClassId] = useState<Record<string, string>>({});
  const [editingChallengeId, setEditingChallengeId] = useState<string | null>(null);
  const [editChallengeTalents, setEditChallengeTalents] = useState(0);
  const [betInputAmount, setBetInputAmount] = useState(0);
  const [giftAmountByStudent, setGiftAmountByStudent] = useState<Record<string, number>>({});
  const [talentGiftListMode, setTalentGiftListMode] = useState<'loggedIn' | 'all'>('all');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile' | null>(null);
  const [showPreviewViewportDropdown, setShowPreviewViewportDropdown] = useState(false);

  const [pendingMissionCompletions, setPendingMissionCompletions] = useState<PendingMissionCompletion[]>(() => {
    const saved = localStorage.getItem('church_pending_missions');
    return saved ? JSON.parse(saved) : [];
  });

  const [blockedStudentIds, setBlockedStudentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('church_blocked_students');
    return saved ? JSON.parse(saved) : [];
  });

  // Tetris (성경책 이름 쌓기) game state
  const emptyGrid = (): string[][] => Array(ROWS).fill(null).map(() => Array(COLS).fill(''));
  const [tetrisGrid, setTetrisGrid] = useState<string[][]>(emptyGrid);
  const [tetrisScore, setTetrisScore] = useState(0);
  const [tetrisLinesCleared, setTetrisLinesCleared] = useState(0);
  const [tetrisGameOver, setTetrisGameOver] = useState(false);
  const [tetrisGameStarted, setTetrisGameStarted] = useState(false);
  type TetrisPiece = { shapeIndex: number; rotation: number; x: number; y: number; bookNames: string[] };
  const [tetrisPiece, setTetrisPiece] = useState<TetrisPiece | null>(null);
  const tetrisIntervalRef = useRef<number | null>(null);
  const tetrisStateRef = useRef({ grid: emptyGrid(), score: 0, linesCleared: 0, gameOver: false, piece: null as TetrisPiece | null });
  const tetrisOnCompleteRef = useRef<() => void>(() => {});

  // 성경 읽기 챌린지: 현재 표시 구절
  const bibleEntries = Object.entries(BIBLE_DATASET);
  const [currentBibleVerseKey, setCurrentBibleVerseKey] = useState<string>(() => bibleEntries[0]?.[0] ?? '');

  // Quiz States
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Bible Verse Display State
  const [currentVerseText, setCurrentVerseText] = useState<string | null>(null);
  const [isVerseShowing, setIsVerseShowing] = useState(false);
  
  // 퀴즈 하드 리셋을 위한 키 (React가 컴포넌트를 완전히 새로 그리게 함)
  const [quizSessionKey, setQuizSessionKey] = useState(0);
  
  // Ref for timer cleanup
  const verseTimerRef = useRef<number | null>(null);
  const materialFileInputRef = useRef<HTMLInputElement>(null);

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'deep' | 'meaning' | 'shop' | 'teacher' | 'admin'>('info');
  const [showClassListView, setShowClassListView] = useState(false);
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);

  useEffect(() => {
    if (connectionMode === 'local') localStorage.setItem('church_talents', talents.toString());
  }, [talents, connectionMode]);

  useEffect(() => {
    if (connectionMode === 'local') localStorage.setItem('church_missions', JSON.stringify(completedMissions));
  }, [completedMissions, connectionMode]);

  useEffect(() => {
    if (connectionMode === 'local') localStorage.setItem('church_stickers', JSON.stringify(ownedStickers));
  }, [ownedStickers, connectionMode]);

  useEffect(() => {
    if (connectionMode === 'local') localStorage.setItem('church_user_name', userName);
  }, [userName, connectionMode]);

  useEffect(() => {
    localStorage.setItem('church_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('church_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('church_shop_items', JSON.stringify(shopItems));
  }, [shopItems]);

  useEffect(() => {
    localStorage.setItem('church_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    if (connectionMode === 'local') localStorage.setItem('church_completed_challenges', JSON.stringify(completedChallenges));
  }, [completedChallenges, connectionMode]);

  useEffect(() => {
    localStorage.setItem('church_pending_missions', JSON.stringify(pendingMissionCompletions));
  }, [pendingMissionCompletions]);

  useEffect(() => {
    localStorage.setItem('church_blocked_students', JSON.stringify(blockedStudentIds));
  }, [blockedStudentIds]);

  // ── Cloud 모드: 10초마다 공유 데이터 폴링 ──
  useEffect(() => {
    if (connectionMode !== 'cloud' || !apiUrl) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const shared = await gasGet(apiUrl, { action: 'getSharedData' });
        if (cancelled) return;
        setCloudOnline(true);
        if (shared.students) setStudents(shared.students);
        if (shared.classes) setClasses(shared.classes);
        if (shared.shopItems?.length > 0) setShopItems(shared.shopItems);
        if (shared.challenges?.length > 0) setChallenges(shared.challenges);
        if (shared.pendingMissions) setPendingMissionCompletions(shared.pendingMissions);
        if (shared.sessions) setLoggedInStudents(shared.sessions);
        if (shared.teachers) setTeachersState(shared.teachers);
        if (shared.students) setBlockedStudentIds(shared.students.filter((s: any) => s.blocked === true || s.blocked === 'true').map((s: any) => s.id));
        // 현재 로그인한 학생의 최신 데이터 반영
        if (currentStudentId && shared.students) {
          const me = shared.students.find((s: any) => s.id === currentStudentId);
          if (me) {
            setTalents(Number(me.talents) || 0);
            if (me.completedMissions) setCompletedMissions(me.completedMissions);
            if (me.ownedStickers) setOwnedStickers(me.ownedStickers);
            if (me.completedChallenges) setCompletedChallenges(me.completedChallenges);
          }
        }
      } catch {
        if (!cancelled) setCloudOnline(false);
      }
    };
    poll();
    const interval = setInterval(poll, 10000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [connectionMode, apiUrl, currentStudentId]);

  useEffect(() => {
    fetchMaterials().then(setMaterialsList).catch(() => setMaterialsList({}));
  }, []);

  useEffect(() => {
    fetchLoggedInStudents().then(setLoggedInStudents).catch(() => setLoggedInStudents([]));
  }, []);

  // 성경 구절 로컬 데이터셋에서 즉시 매핑
  useEffect(() => {
    if (isQuizMode && showFeedback && activeQuizQuestions[currentQuizIndex]) {
      const { verse: reference } = parseExplanation(activeQuizQuestions[currentQuizIndex].explanation);
      
      // Cleanup previous timer
      if (verseTimerRef.current) clearTimeout(verseTimerRef.current);

      if (reference && BIBLE_DATASET[reference]) {
        setIsVerseShowing(false);
        verseTimerRef.current = window.setTimeout(() => {
          setCurrentVerseText(BIBLE_DATASET[reference]);
          setIsVerseShowing(true);
        }, 100);
      } else {
        setCurrentVerseText(null);
        setIsVerseShowing(false);
      }
    } else {
      setCurrentVerseText(null);
      setIsVerseShowing(false);
      if (verseTimerRef.current) clearTimeout(verseTimerRef.current);
    }
    
    return () => {
      if (verseTimerRef.current) clearTimeout(verseTimerRef.current);
    };
  }, [showFeedback, currentQuizIndex, isQuizMode]);

  const handleSaveName = async () => {
    if (!tempName.trim()) { alert("이름을 입력해주세요!"); return; }
    const name = tempName.trim();

    if (connectionMode === 'cloud' && apiUrl) {
      try {
        const result = await gasPost(apiUrl, { action: 'login', name });
        if (result.blocked) { alert('차단된 계정이에요.'); return; }
        setUserName(name);
        setCurrentStudentId(result.id);
        setTalents(Number(result.talents) || 0);
        setCompletedMissions(result.completedMissions || []);
        setOwnedStickers(result.ownedStickers || []);
        setCompletedChallenges(result.completedChallenges || []);
        setShowNamePrompt(false);
        if (result.firstLoginBonus) {
          setTimeout(() => alert(`첫 로그인 선물로 ${result.firstLoginBonus} ${churchConfig.currencyName}가 지급되었어요!`), 100);
        }
      } catch (err) { alert('로그인 실패: ' + (err as Error).message); }
    } else {
      const existingLogin = loggedInStudents.find(s => s.name === name);
      if (existingLogin && blockedStudentIds.includes(existingLogin.id)) { alert('차단된 계정이에요.'); return; }
      setUserName(name);
      setShowNamePrompt(false);
      if (!localStorage.getItem('church_first_login_done')) {
        addTalents(churchConfig.firstLoginBonus);
        localStorage.setItem('church_first_login_done', '1');
        setTimeout(() => alert(`첫 로그인 선물로 ${churchConfig.firstLoginBonus} ${churchConfig.currencyName}가 지급되었어요!`), 100);
      }
      setLoggedInStudents(prev => {
        const existingIdx = prev.findIndex(s => s.name === name);
        const entry: LoggedInStudent = { id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(), name, loggedInAt: new Date().toISOString() };
        const next = existingIdx >= 0 ? prev.map((s, i) => i === existingIdx ? { ...s, loggedInAt: entry.loggedInAt } : s) : [...prev, entry];
        localStorage.setItem('church_logged_in_students', JSON.stringify(next));
        return next;
      });
    }
  };

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      setUserName('');
      setCurrentStudentId(null);
      setIsTeacherAuthenticated(false);
      if (connectionMode === 'local') localStorage.removeItem('church_user_name');
    }
  };

  const addTalents = (amount: number) => {
    setTalents(prev => prev + amount);
    if (connectionMode === 'cloud' && apiUrl && currentStudentId) {
      gasPost(apiUrl, { action: 'addTalents', studentId: currentStudentId, amount }).catch(err => {
        console.error('Talent sync failed:', err);
        setTalents(prev => prev - amount);
      });
    }
  };

  const toggleMission = (missionId: string) => {
    if (completedMissions.includes(missionId)) {
      setCompletedMissions(prev => prev.filter(id => id !== missionId));
      setPendingMissionCompletions(prev => prev.filter(p => !(p.studentName === userName && p.missionId === missionId)));
      if (connectionMode === 'cloud' && apiUrl && currentStudentId) {
        gasPost(apiUrl, { action: 'uncompleteMission', studentId: currentStudentId, missionId }).catch(console.error);
      }
    } else {
      setCompletedMissions(prev => [...prev, missionId]);
      if (connectionMode === 'cloud' && apiUrl && currentStudentId) {
        gasPost(apiUrl, { action: 'completeMission', studentId: currentStudentId, missionId }).catch(console.error);
      }
      if (!userName) return;
      const parts = missionId.split('-m-');
      if (parts.length !== 2) return;
      const [topicId, idxStr] = parts;
      const topic = THEOLOGY_TOPICS.find(t => t.id === topicId);
      const missionText = topic?.missions[parseInt(idxStr, 10)] ?? '';
      const topicTitle = topic?.title ?? '';
      const studentId = currentStudentId || loggedInStudents.find(s => s.name === userName)?.id || userName;
      const newItem: PendingMissionCompletion = {
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(),
        studentId,
        studentName: userName,
        topicId,
        topicTitle,
        missionId,
        missionText,
        createdAt: new Date().toISOString(),
      };
      setPendingMissionCompletions(prev => [...prev, newItem]);
      if (connectionMode === 'cloud' && apiUrl) {
        gasPost(apiUrl, { action: 'submitMission', data: newItem }).catch(console.error);
      }
    }
  };

  const buySticker = (stickerId: string, price: number) => {
    if (ownedStickers.includes(stickerId)) return;
    if (talents < price) { alert(`${churchConfig.currencyName}가 부족해요!`); return; }
    setTalents(prev => prev - price);
    setOwnedStickers(prev => [...prev, stickerId]);
    if (connectionMode === 'cloud' && apiUrl && currentStudentId) {
      gasPost(apiUrl, { action: 'buySticker', studentId: currentStudentId, stickerId, price }).catch(err => {
        setTalents(prev => prev + price);
        setOwnedStickers(prev => prev.filter(id => id !== stickerId));
        alert('구매 실패: ' + (err as Error).message);
      });
    }
  };

  const resetMyTalents = () => {
    if (!confirm(`내 ${churchConfig.currencyName}와 수집한 스티커를 모두 초기화할까요?`)) return;
    setTalents(0);
    setOwnedStickers([]);
    if (connectionMode === 'local') {
      localStorage.setItem('church_talents', '0');
      localStorage.setItem('church_stickers', '[]');
    }
    if (connectionMode === 'cloud' && apiUrl && currentStudentId) {
      gasPost(apiUrl, { action: 'writeRecord', table: 'students', data: { id: currentStudentId, name: userName, talents: 0, classId: '', completedMissions, ownedStickers: [], completedChallenges, firstLoginDone: true, blocked: false } }).catch(console.error);
    }
  };

  const markChallengeComplete = (challengeId: string) => {
    setCompletedChallenges(prev => [...prev, challengeId]);
    if (connectionMode === 'cloud' && apiUrl && currentStudentId) {
      gasPost(apiUrl, { action: 'completeChallenge', studentId: currentStudentId, challengeId }).catch(console.error);
    }
  };

  const resetStudentTalents = (id: string) => {
    if (!confirm(`이 학생의 ${churchConfig.currencyName}를 0으로 초기화할까요?`)) return;
    setStudents(prev => prev.map(s => s.id === id ? { ...s, talents: 0 } : s));
  };

  const addShopItem = (name: string, icon: string, price: number) => {
    if (!name.trim() || price < 0) return;
    setShopItems(prev => [...prev, { id: Date.now().toString(), name: name.trim(), icon: icon || '📌', price }]);
  };

  const updateShopItem = (id: string, name: string, icon: string, price: number) => {
    setShopItems(prev => prev.map(item => item.id === id ? { ...item, name: name.trim(), icon: icon || item.icon, price } : item));
  };

  const deleteShopItem = (id: string) => {
    if (!confirm("이 상점 아이템을 삭제할까요?")) return;
    setShopItems(prev => prev.filter(item => item.id !== id));
  };

  const startEditShopItem = (item: ShopItem) => {
    setEditingShopItemId(item.id);
    setEditShopName(item.name);
    setEditShopIcon(item.icon);
    setEditShopPrice(item.price);
  };

  const saveEditShopItem = () => {
    if (editingShopItemId) {
      updateShopItem(editingShopItemId, editShopName, editShopIcon, editShopPrice);
      setEditingShopItemId(null);
    }
  };

  const MATERIAL_CATEGORY_IDS = ['teacher-manual', 'teacher-workbook', 'slides', 'corner-learning'];

  const handleTeacherLoungeClick = () => {
    if (isTeacherAuthenticated) {
      setActiveTab('teacher');
      setSelectedTopic(null);
    } else {
      setAuthRoleChoice('teacher');
      setShowTeacherAuthModal(true);
    }
  };


  const handleAdminRoomClick = () => {
    if (isAdmin) {
      setActiveTab('admin');
      setSelectedTopic(null);
    } else {
      setAuthRoleChoice('admin');
      setShowTeacherAuthModal(true);
    }
  };

  const uploadMaterial = async (categoryId: string, file: File): Promise<void> => {
    if (connectionMode === 'cloud' && apiUrl) {
      setGDriveLoading(true);
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => { const result = reader.result as string; resolve(result.split(',')[1]); };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const res = await gasPost(apiUrl, { action: 'uploadFile', categoryId, fileName: file.name, base64Data: base64, mimeType: file.type });
        if (res.ok && res.file) {
          setGDriveMaterials(prev => {
            const updated = { ...prev, [categoryId]: [res.file, ...(prev[categoryId] || [])] };
            saveDriveMaterialsToStorage(updated);
            return updated;
          });
        } else {
          alert('업로드 실패: ' + (res.error || '알 수 없는 오류'));
        }
      } catch (err) {
        alert('업로드 실패: ' + (err as Error).message);
      } finally {
        setGDriveLoading(false);
      }
    } else if (gDriveState.isSignedIn && gDriveState.accessToken && gDriveState.categoryFolderIds[categoryId]) {
      setGDriveLoading(true);
      try {
        const driveFile = await uploadFileToDrive(gDriveState.accessToken, file, gDriveState.categoryFolderIds[categoryId]);
        setGDriveMaterials(prev => {
          const updated = { ...prev, [categoryId]: [driveFile, ...(prev[categoryId] || [])] };
          saveDriveMaterialsToStorage(updated);
          return updated;
        });
      } catch (err) {
        alert('Google Drive 업로드 실패: ' + (err as Error).message);
      } finally {
        setGDriveLoading(false);
      }
    } else {
      const blobUrl = URL.createObjectURL(file);
      setMaterialsList(prev => ({
        ...prev,
        [categoryId]: [...(prev[categoryId] || []), { name: file.name, file: blobUrl }]
      }));
    }
  };

  const deleteMaterial = async (categoryId: string, itemKeyOrIndex: string | number): Promise<void> => {
    setMaterialsList(prev => {
      const list = prev[categoryId] || [];
      const idx = typeof itemKeyOrIndex === 'number' ? itemKeyOrIndex : list.findIndex(m => m.name === itemKeyOrIndex || m.file === itemKeyOrIndex);
      if (idx < 0) return prev;
      const item = list[idx];
      if (item.file.startsWith('blob:')) URL.revokeObjectURL(item.file);
      return {
        ...prev,
        [categoryId]: list.filter((_, i) => i !== idx)
      };
    });
  };

  const handleDeleteDriveFile = async (categoryId: string, fileId: string) => {
    if (!confirm('이 자료를 삭제하시겠어요?')) return;
    setGDriveLoading(true);
    try {
      if (connectionMode === 'cloud' && apiUrl) {
        await gasPost(apiUrl, { action: 'deleteFile', fileId });
      } else if (gDriveState.accessToken) {
        await deleteDriveFile(gDriveState.accessToken, fileId);
      }
      setGDriveMaterials(prev => {
        const updated = { ...prev, [categoryId]: (prev[categoryId] || []).filter(f => f.id !== fileId) };
        saveDriveMaterialsToStorage(updated);
        return updated;
      });
    } catch (err) {
      alert('삭제 실패: ' + (err as Error).message);
    } finally {
      setGDriveLoading(false);
    }
  };

  const connectGoogleDrive = () => {
    if (connectionMode === 'cloud' && apiUrl) {
      alert('Cloud 모드에서는 Google Drive가 자동으로 연결되어 있습니다. 교사 라운지에서 자료를 올리고 내릴 수 있습니다.');
      return;
    }
    if (connectionMode === 'local') {
      if (confirm('Google Drive 자료 관리는 Cloud 모드에서만 사용 가능합니다.\n\nCloud 설정을 시작할까요?')) {
        setSetupStep(3);
        setSetupConfig({ ...churchConfig });
        setShowSetupWizard(true);
      }
      return;
    }
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId || !window.google?.accounts?.oauth2) {
      alert('Google Drive 연결이 불가합니다. Cloud 모드를 사용해 주세요.');
      return;
    }
    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email',
      callback: async (response: any) => {
        if (!response.access_token) return;
        const accessToken = response.access_token;
        setGDriveLoading(true);
        try {
          const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          }).then(r => r.json());
          const folderName = churchConfig.departmentName || churchConfig.churchName || 'Church Education App';
          const { appFolderId, categoryFolderIds } = await initDriveFolders(accessToken, folderName);
          updateChurchConfig({ ...churchConfig, googleDriveAppFolderId: appFolderId, googleDriveCategoryFolderIds: categoryFolderIds });
          setGDriveState({ isSignedIn: true, accessToken, userEmail: userInfo.email, appFolderId, categoryFolderIds });
          const materials: Record<string, GoogleDriveFile[]> = {};
          for (const [catId, folderId] of Object.entries(categoryFolderIds)) {
            materials[catId] = await listDriveFiles(accessToken, folderId);
          }
          setGDriveMaterials(materials);
          saveDriveMaterialsToStorage(materials);
        } catch (err) {
          alert('Google Drive 연결 실패: ' + (err as Error).message);
        } finally {
          setGDriveLoading(false);
        }
      },
    });
    tokenClientRef.current.requestAccessToken({ prompt: 'consent' });
  };

  const disconnectGoogleDrive = () => {
    if (gDriveState.accessToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(gDriveState.accessToken, () => {});
    }
    setGDriveState({ isSignedIn: false, accessToken: null, userEmail: null, appFolderId: null, categoryFolderIds: {} });
  };

  const refreshDriveMaterials = async () => {
    setGDriveLoading(true);
    try {
      const materials: Record<string, GoogleDriveFile[]> = {};
      if (connectionMode === 'cloud' && apiUrl) {
        for (const catId of MATERIAL_CATEGORY_IDS) {
          const res = await gasGet(apiUrl, { action: 'listFiles', categoryId: catId });
          materials[catId] = res.files || [];
        }
      } else if (gDriveState.isSignedIn && gDriveState.accessToken) {
        for (const [catId, folderId] of Object.entries(gDriveState.categoryFolderIds) as [string, string][]) {
          materials[catId] = await listDriveFiles(gDriveState.accessToken!, folderId);
        }
      } else {
        setGDriveLoading(false);
        return;
      }
      setGDriveMaterials(materials);
      saveDriveMaterialsToStorage(materials);
    } catch { /* ignore */ } finally {
      setGDriveLoading(false);
    }
  };

  const adminGoogleLogin = () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId || !window.google?.accounts?.oauth2) {
      alert('Google 로그인을 사용할 수 없습니다. 비밀번호를 사용하세요.');
      return;
    }
    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email',
      callback: async (response: any) => {
        if (!response.access_token) return;
        try {
          const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${response.access_token}` }
          }).then(r => r.json());
          // 관리자 이메일 확인
          if (connectionMode === 'cloud' && apiUrl) {
            const config = await gasGet(apiUrl, { action: 'getConfig' });
            if (config.adminEmail && config.adminEmail !== userInfo.email) {
              alert('등록된 관리자 이메일이 아닙니다: ' + config.adminEmail);
              return;
            }
            if (!config.adminEmail) {
              await gasPost(apiUrl, { action: 'updateConfig', config: { adminEmail: userInfo.email } });
            }
          }
          setGDriveState({ isSignedIn: true, accessToken: response.access_token, userEmail: userInfo.email, appFolderId: null, categoryFolderIds: {} });
          setIsTeacherAuthenticated(true);
          setIsAdmin(true);
          localStorage.setItem('church_admin_session', churchConfig.adminPassword);
          setShowTeacherAuthModal(false);
          setAuthRoleChoice(null);
          setActiveTab('admin');
          setSelectedTopic(null);
        } catch (err) {
          alert('Google 로그인 실패: ' + (err as Error).message);
        }
      },
    });
    tokenClientRef.current.requestAccessToken({ prompt: 'consent' });
  };

  const verifyTeacherPassword = () => {
    if (authRoleChoice === 'admin' && connectionMode === 'cloud') {
      adminGoogleLogin();
      return;
    }
    if (authRoleChoice === 'admin') {
      // 관리자 전용실: 관리자 비밀번호만 허용
      if (teacherPassword === churchConfig.adminPassword) {
        setIsTeacherAuthenticated(true);
        setIsAdmin(true);
        localStorage.setItem('church_admin_session', teacherPassword);
        setShowTeacherAuthModal(false);
        setAuthRoleChoice(null);
        setActiveTab('admin');
        setSelectedTopic(null);
        setTeacherPassword('');
      } else {
        alert("관리자 비밀번호가 틀렸어요!");
        setTeacherPassword('');
      }
    } else {
      // 교사 전용실: 교사 비밀번호 또는 관리자 비밀번호 허용 (단, 교사실에서는 항상 교사 권한)
      if (teacherPassword === churchConfig.teacherPassword || teacherPassword === churchConfig.adminPassword) {
        setIsTeacherAuthenticated(true);
        setIsAdmin(false);
        setShowTeacherAuthModal(false);
        setAuthRoleChoice(null);
        setActiveTab('teacher');
        setSelectedTopic(null);
        setTeacherPassword('');
      } else {
        alert("비밀번호가 틀렸어요!");
        setTeacherPassword('');
      }
    }
  };

  const previewGridCols = previewViewport === 'mobile' ? 'grid-cols-1' : previewViewport === 'tablet' ? 'grid-cols-2' : previewViewport === 'desktop' ? 'grid-cols-3' : null;

  const getClassColor = (classId: string) => {
    const idx = classes.findIndex(c => c.id === classId);
    if (idx < 0) return DEFAULT_CLASS_COLOR;
    return CLASS_COLORS[idx % CLASS_COLORS.length];
  };

  const currentStudent = students.find(s => s.name === userName);
  const currentClass = currentStudent?.classId ? classes.find(c => c.id === currentStudent.classId) : null;
  const currentClassColor = currentClass ? getClassColor(currentClass.id) : null;

  const handleAdminLogout = () => {
    localStorage.removeItem('church_admin_session');
    setIsAdmin(false);
    setIsTeacherAuthenticated(false);
    setSelectedTeacherCategory(null);
    setSelectedAdminCategory(null);
    setActiveTab('info');
  };

  // 현재 활성화된 카테고리 (교사/관리자 탭에 따라)
  const currentCategories = activeTab === 'admin' ? ADMIN_CATEGORIES : TEACHER_CATEGORIES;
  const selectedCategory = activeTab === 'admin' ? selectedAdminCategory : selectedTeacherCategory;
  const setSelectedCategory = activeTab === 'admin' ? setSelectedAdminCategory : setSelectedTeacherCategory;

  const resetView = () => {
    setSelectedTopic(null);
    setSelectedTeacherCategory(null);
    setSelectedAdminCategory(null);
    setSelectedChallengeRoom(false);
    setShowClassListView(false);
    setActiveTab('info');
    setIsQuizMode(false);
    setIsQuizFinished(false);
    setCurrentQuizIndex(0);
    setUserAnswers({});
    setShowFeedback(false);
    setCurrentVerseText(null);
    setIsVerseShowing(false);
  };

  const updateChallengeTalents = (challengeId: string, value: number) => {
    setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, talents: Math.max(0, value) } : c));
    setEditingChallengeId(null);
  };

  const startQuiz = (topicId?: string) => {
    setQuizRewardTalents(topicId === undefined ? 5 : 1);
    const filtered = topicId 
      ? QUIZ_QUESTIONS.filter(q => q.topicId === topicId)
      : QUIZ_QUESTIONS;
    
    if (filtered.length === 0) {
      alert("준비된 퀴즈가 없어요!");
      return;
    }

    setActiveQuizQuestions(filtered);
    setIsQuizMode(true);
    setCurrentQuizIndex(0);
    setUserAnswers({});
    setIsQuizFinished(false);
    setShowFeedback(false);
    setQuizSessionKey(prev => prev + 1); // 퀴즈 시작할 때 고유 세션 부여
  };

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    setUserAnswers(prev => ({ ...prev, [currentQuizIndex]: index }));
    setShowFeedback(true);
  };

  const calculateScore = () => {
    let score = 0;
    activeQuizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answerIndex) score++;
    });
    return (score / activeQuizQuestions.length) * 100;
  };

  const resetCurrentQuiz = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파 방지
    
    if(confirm("처음부터 다시 시작할까요?")) {
      // 1. 타이머 즉시 정리
      if (verseTimerRef.current) {
        clearTimeout(verseTimerRef.current);
        verseTimerRef.current = null;
      }
      
      // 2. 상태 초기화
      setQuizSessionKey(prev => prev + 1); // 리액트가 퀴즈 섹션을 완전히 새로 그리게 함
      setUserAnswers({});
      setShowFeedback(false);
      setCurrentQuizIndex(0);
      setIsQuizFinished(false);
      setCurrentVerseText(null);
      setIsVerseShowing(false);
    }
  };

  const navigateNext = () => {
    if (currentQuizIndex < activeQuizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setShowFeedback(userAnswers[currentQuizIndex + 1] !== undefined);
      setCurrentVerseText(null);
      setIsVerseShowing(false);
    } else {
      setIsQuizFinished(true);
      addTalents(quizRewardTalents);
    }
  };

  const navigatePrev = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      setShowFeedback(true); 
    }
  };

  const parseExplanation = (text: string) => {
    const match = text.match(/\(([^)]+)\)$/);
    if (match) {
      const verse = match[1];
      const explanationText = text.replace(/\([^)]+\)$/, '').trim();
      return { explanationText, verse };
    }
    return { explanationText: text, verse: null };
  };

  // 학생 명단 관리 로직
  const addStudent = () => {
    if (!newStudentName.trim()) return;
    const newStudent: Student = {
      id: Date.now().toString(),
      name: newStudentName.trim(),
      talents: 0,
      classId: null
    };
    setStudents(prev => [...prev, newStudent]);
    setNewStudentName('');
  };

  const addClass = (name: string) => {
    if (!name.trim()) return;
    setClasses(prev => [...prev, { id: Date.now().toString(), name: name.trim() }]);
  };
  const updateClass = (id: string, name: string) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, name: name.trim() } : c));
  };
  const deleteClass = (id: string) => {
    if (!confirm('이 반을 삭제할까요? 해당 반 학생의 반 배정이 해제됩니다.')) return;
    setStudents(prev => prev.map(s => s.classId === id ? { ...s, classId: null } : s));
    setClasses(prev => prev.filter(c => c.id !== id));
  };
  const assignStudentToClass = (studentId: string, classId: string | null) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, classId } : s));
  };

  const assignUnassignedToClass = (loggedInName: string, classId: string | null) => {
    if (!classId) return;
    const existing = students.find(s => s.name === loggedInName);
    if (existing) {
      assignStudentToClass(existing.id, classId);
    } else {
      setStudents(prev => [...prev, { id: Date.now().toString(), name: loggedInName, talents: 0, classId }]);
    }
  };

  const deleteStudent = (id: string) => {
    if (confirm("정말 이 학생을 명단에서 삭제할까요?")) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const giveTalentToStudent = (id: string, amount: number) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, talents: s.talents + amount } : s));
    if (connectionMode === 'cloud' && apiUrl) {
      gasPost(apiUrl, { action: 'giveTalents', studentId: id, amount }).catch(console.error);
    }
  };

  const confirmMissionCompletion = (pendingId: string) => {
    const pending = pendingMissionCompletions.find(p => p.id === pendingId);
    if (!pending) return;
    const existing = students.find(s => s.name === pending.studentName);
    if (existing) {
      giveTalentToStudent(existing.id, 3);
    } else {
      setStudents(prev => [...prev, { id: Date.now().toString(), name: pending.studentName, talents: 3, classId: null }]);
    }
    setPendingMissionCompletions(prev => prev.filter(p => p.id !== pendingId));
    if (connectionMode === 'cloud' && apiUrl) {
      gasPost(apiUrl, { action: 'approveMission', missionId: pendingId, talentReward: 3 }).catch(console.error);
    }
  };

  const toggleBlockStudent = (loggedInStudentId: string) => {
    const isBlocked = blockedStudentIds.includes(loggedInStudentId);
    setBlockedStudentIds(prev => isBlocked ? prev.filter(id => id !== loggedInStudentId) : [...prev, loggedInStudentId]);
    if (connectionMode === 'cloud' && apiUrl) {
      // loggedInStudentId를 students에서 찾기
      const student = students.find(s => s.id === loggedInStudentId) || loggedInStudents.find(s => s.id === loggedInStudentId);
      if (student) {
        gasPost(apiUrl, { action: isBlocked ? 'unblockStudent' : 'blockStudent', studentId: loggedInStudentId }).catch(console.error);
      }
    }
  };

  const giveBulkTalents = () => {
    if (students.length === 0) return;
    if (confirm(`모든 학생에게 1 ${churchConfig.currencyName}씩 선물할까요?`)) {
      setStudents(prev => prev.map(s => ({ ...s, talents: s.talents + 1 })));
      if (connectionMode === 'cloud' && apiUrl) {
        students.forEach(s => gasPost(apiUrl, { action: 'giveTalents', studentId: s.id, amount: 1 }).catch(console.error));
      }
    }
  };

  // --- Tetris (성경책 이름 쌓기) helpers ---
  const randomBook = () => BIBLE_BOOKS_66[Math.floor(Math.random() * BIBLE_BOOKS_66.length)];
  const getShapeCells = (shapeIndex: number, rotation: number): number[][] => {
    let s = TETROMINO_SHAPES[shapeIndex];
    for (let r = 0; r < rotation % 4; r++) {
      const rows = s[0]?.length ?? 0;
      const cols = s.length;
      s = Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => s[cols - 1 - j]?.[i] ?? 0));
    }
    return s;
  };
  const collide = (grid: string[][], piece: TetrisPiece, dx: number, dy: number): boolean => {
    const cells = getShapeCells(piece.shapeIndex, piece.rotation);
    for (let row = 0; row < cells.length; row++) {
      for (let col = 0; col < (cells[row]?.length ?? 0); col++) {
        if (!cells[row]?.[col]) continue;
        const ny = piece.y + row + dy;
        const nx = piece.x + col + dx;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && grid[ny]?.[nx]) return true;
      }
    }
    return false;
  };
  const mergePiece = (grid: string[][], piece: TetrisPiece): string[][] => {
    const next = grid.map(row => [...row]);
    const cells = getShapeCells(piece.shapeIndex, piece.rotation);
    let bi = 0;
    for (let row = 0; row < cells.length; row++) {
      for (let col = 0; col < (cells[row]?.length ?? 0); col++) {
        if (!cells[row]?.[col]) continue;
        const ny = piece.y + row;
        const nx = piece.x + col;
        if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && piece.bookNames[bi])
          next[ny][nx] = piece.bookNames[bi];
        bi++;
      }
    }
    return next;
  };
  const clearFullLines = (grid: string[][]): { grid: string[][]; cleared: number } => {
    const full = grid.map((row, i) => (row.every(c => c !== '') ? i : -1)).filter(i => i >= 0);
    if (full.length === 0) return { grid, cleared: 0 };
    const emptyRow = Array(COLS).fill('');
    let next = grid.filter((_, i) => !full.includes(i));
    for (let i = 0; i < full.length; i++) next = [emptyRow, ...next];
    return { grid: next, cleared: full.length };
  };
  const spawnPiece = (): TetrisPiece => {
    const shapeIndex = Math.floor(Math.random() * TETROMINO_SHAPES.length);
    const shape = TETROMINO_SHAPES[shapeIndex];
    const cellCount = shape.flat().filter(Boolean).length;
    const bookNames = Array.from({ length: cellCount }, () => randomBook());
    return { shapeIndex, rotation: 0, x: Math.max(0, Math.floor((COLS - (shape[0]?.length ?? 0)) / 2)), y: 0, bookNames };
  };
  const resetTetris = () => {
    if (tetrisIntervalRef.current) {
      clearInterval(tetrisIntervalRef.current);
      tetrisIntervalRef.current = null;
    }
    setTetrisGrid(emptyGrid());
    setTetrisScore(0);
    setTetrisLinesCleared(0);
    setTetrisGameOver(false);
    setTetrisGameStarted(false);
    setTetrisPiece(null);
  };
  const startTetris = () => {
    resetTetris();
    const piece = spawnPiece();
    setTetrisPiece(piece);
    setTetrisGameStarted(true);
  };

  useEffect(() => {
    tetrisStateRef.current = { grid: tetrisGrid, score: tetrisScore, linesCleared: tetrisLinesCleared, gameOver: tetrisGameOver, piece: tetrisPiece };
  }, [tetrisGrid, tetrisScore, tetrisLinesCleared, tetrisGameOver, tetrisPiece]);

  useEffect(() => {
    if (!tetrisGameStarted || tetrisGameOver) return;
    tetrisIntervalRef.current = window.setInterval(() => {
      const { grid, piece } = tetrisStateRef.current;
      if (!piece) return;
      if (collide(grid, piece, 0, 1)) {
        const merged = mergePiece(grid, piece);
        const { grid: afterClear, cleared } = clearFullLines(merged);
        const addScore = cleared * 100;
        const newLines = (tetrisStateRef.current.linesCleared || 0) + cleared;
        const newScore = (tetrisStateRef.current.score || 0) + addScore;
        const next = spawnPiece();
        tetrisStateRef.current.grid = afterClear;
        tetrisStateRef.current.linesCleared = newLines;
        tetrisStateRef.current.score = newScore;
        tetrisStateRef.current.piece = next;
        setTetrisGrid(afterClear);
        setTetrisScore(s => s + addScore);
        setTetrisLinesCleared(l => l + cleared);
        if (newLines >= TARGET_LINES || newScore >= TARGET_SCORE) {
          if (tetrisIntervalRef.current) { clearInterval(tetrisIntervalRef.current); tetrisIntervalRef.current = null; }
          setTetrisGameOver(true);
          tetrisOnCompleteRef.current();
          return;
        }
        if (collide(afterClear, next, 0, 0)) {
          if (tetrisIntervalRef.current) { clearInterval(tetrisIntervalRef.current); tetrisIntervalRef.current = null; }
          setTetrisGameOver(true);
          return;
        }
        setTetrisPiece(next);
      } else {
        setTetrisPiece(p => p ? { ...p, y: p.y + 1 } : null);
      }
    }, 500);
    return () => {
      if (tetrisIntervalRef.current) clearInterval(tetrisIntervalRef.current);
    };
  }, [tetrisGameStarted, tetrisGameOver]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden text-slate-800 bg-sky-50/50 border-l-0 outline-none [outline:0]">
      {/* Setup Wizard */}
      {showSetupWizard && (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600 p-6">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-md space-y-6 animate-in zoom-in-95 duration-300">
            {setupStep === 0 && (
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 bg-sky-100 rounded-3xl flex items-center justify-center mx-auto text-sky-500"><Sparkles className="w-10 h-10" /></div>
                <h3 className="text-2xl font-black text-sky-900">환영합니다!</h3>
                <p className="text-slate-500 font-bold">우리 교회에 맞게 앱을 설정해 볼까요?</p>
                <div className="space-y-3">
                  <button onClick={() => setSetupStep(1)} className="w-full py-4 bg-sky-500 text-white rounded-[24px] font-black shadow-lg shadow-sky-100">새로 시작하기</button>
                  <button onClick={() => setSetupStep(10)} className="w-full py-4 bg-blue-600 text-white rounded-[24px] font-black shadow-lg shadow-blue-100">기존 교회에 연결</button>
                  <button onClick={() => { saveChurchConfig(DEFAULT_CHURCH_CONFIG); setShowSetupWizard(false); }} className="w-full py-3 bg-slate-100 text-slate-500 rounded-[24px] font-bold">건너뛰기 (이 기기만 사용)</button>
                </div>
              </div>
            )}
            {/* 기존 교회 연결 화면 */}
            {setupStep === 10 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-black text-sky-900">기존 교회에 연결</h3>
                  <p className="text-slate-500 font-bold text-sm">관리자에게 받은 API URL을 붙여넣으세요</p>
                </div>
                <input type="text" value={setupApiUrl} onChange={(e) => { setSetupApiUrl(e.target.value); setSetupApiResult(null); }} placeholder="https://script.google.com/macros/s/..." className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-sky-400 focus:outline-none text-sm" />
                <button onClick={async () => {
                  if (!setupApiUrl.trim()) return;
                  setSetupApiTesting(true); setSetupApiResult(null);
                  const ok = await testApiConnection(setupApiUrl.trim());
                  setSetupApiTesting(false);
                  if (ok) {
                    setSetupApiResult('success');
                    try {
                      const config = await gasGet(setupApiUrl.trim(), { action: 'getConfig' });
                      const merged = { ...DEFAULT_CHURCH_CONFIG, ...config, apiUrl: setupApiUrl.trim() };
                      saveChurchConfig(merged);
                      setChurchConfig(merged);
                      setApiUrl(setupApiUrl.trim());
                      localStorage.setItem('church_api_url', setupApiUrl.trim());
                      setTimeout(() => setShowSetupWizard(false), 500);
                    } catch { setSetupApiResult('fail'); }
                  } else { setSetupApiResult('fail'); }
                }} disabled={setupApiTesting || !setupApiUrl.trim()} className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2">
                  {setupApiTesting ? <><Loader2 className="w-5 h-5 animate-spin" /> 연결 테스트 중...</> : '연결 테스트'}
                </button>
                {setupApiResult === 'success' && <p className="text-green-600 font-black text-center">연결 성공!</p>}
                {setupApiResult === 'fail' && <p className="text-red-500 font-bold text-center">연결 실패. URL을 확인해주세요.</p>}
                <button onClick={() => { setSetupStep(0); setSetupApiUrl(''); setSetupApiResult(null); }} className="w-full py-3 bg-slate-100 text-slate-500 rounded-2xl font-bold">이전</button>
              </div>
            )}
            {setupStep === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-black text-sky-900">1단계: 교회 정보</h3>
                  <p className="text-slate-500 font-bold text-sm">교회 이름과 부서 이름을 입력하세요</p>
                </div>
                <div className="space-y-3">
                  <input type="text" value={setupConfig.churchName} onChange={(e) => setSetupConfig(c => ({ ...c, churchName: e.target.value }))} placeholder="교회 이름 (예: 새빛교회)" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-sky-400 focus:outline-none" />
                  <input type="text" value={setupConfig.departmentName} onChange={(e) => setSetupConfig(c => ({ ...c, departmentName: e.target.value }))} placeholder="부서 이름 (예: 드림아동부)" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-sky-400 focus:outline-none" />
                  <input type="text" value={setupConfig.eventName} onChange={(e) => setSetupConfig(c => ({ ...c, eventName: e.target.value }))} placeholder="행사 이름 (예: 2026 여름성경학교)" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-sky-400 focus:outline-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setSetupStep(0)} className="flex-1 py-3.5 bg-slate-100 text-slate-500 rounded-2xl font-bold">이전</button>
                  <button onClick={() => setSetupStep(2)} className="flex-2 py-3.5 bg-sky-500 text-white rounded-2xl font-black shadow-lg shadow-sky-100">다음</button>
                </div>
              </div>
            )}
            {setupStep === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-black text-sky-900">2단계: 비밀번호 설정</h3>
                  <p className="text-slate-500 font-bold text-sm">관리자와 교사 비밀번호를 설정하세요</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800 rounded-2xl space-y-2">
                    <label className="text-sm font-black text-white flex items-center gap-2"><Lock className="w-4 h-4" /> 관리자 비밀번호</label>
                    <input type="text" value={setupConfig.adminPassword} onChange={(e) => setSetupConfig(c => ({ ...c, adminPassword: e.target.value }))} placeholder="관리자 비밀번호 입력" className="w-full px-5 py-3.5 bg-white border-2 border-slate-200 rounded-2xl font-bold focus:border-sky-400 focus:outline-none text-center text-lg tracking-widest" />
                    <p className="text-xs text-slate-400 font-medium">모든 설정과 관리 권한을 가진 최고 관리자용</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl space-y-2 border-2 border-indigo-100">
                    <label className="text-sm font-black text-indigo-700 flex items-center gap-2"><KeyRound className="w-4 h-4" /> 교사 비밀번호</label>
                    <input type="text" value={setupConfig.teacherPassword} onChange={(e) => setSetupConfig(c => ({ ...c, teacherPassword: e.target.value }))} placeholder="교사 비밀번호 입력" className="w-full px-5 py-3.5 bg-white border-2 border-indigo-200 rounded-2xl font-bold focus:border-indigo-400 focus:outline-none text-center text-lg tracking-widest" />
                    <p className="text-xs text-indigo-400 font-medium">자료 열람, 미션 확인, 보상 지급용</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setSetupStep(1)} className="flex-1 py-3.5 bg-slate-100 text-slate-500 rounded-2xl font-bold">이전</button>
                  <button onClick={() => setSetupStep(3)} className="flex-2 py-3.5 bg-sky-500 text-white rounded-2xl font-black shadow-lg shadow-sky-100">다음</button>
                </div>
              </div>
            )}
            {setupStep === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-black text-sky-900">설정 완료!</h3>
                  <p className="text-slate-500 font-bold text-sm">아래 내용으로 설정할게요</p>
                </div>
                <div className="bg-sky-50 rounded-2xl p-5 space-y-2 text-sm">
                  {setupConfig.churchName && <p><span className="font-black text-slate-600">교회:</span> <span className="font-bold text-sky-700">{setupConfig.churchName}</span></p>}
                  {setupConfig.departmentName && <p><span className="font-black text-slate-600">부서:</span> <span className="font-bold text-sky-700">{setupConfig.departmentName}</span></p>}
                  {setupConfig.eventName && <p><span className="font-black text-slate-600">행사:</span> <span className="font-bold text-sky-700">{setupConfig.eventName}</span></p>}
                  <p><span className="font-black text-slate-600">교사 비밀번호:</span> <span className="font-bold text-sky-700">{setupConfig.teacherPassword}</span></p>
                  <p><span className="font-black text-slate-600">관리자 비밀번호:</span> <span className="font-bold text-sky-700">{setupConfig.adminPassword}</span></p>
                </div>
                <div className="space-y-3">
                  <button onClick={() => { updateChurchConfig(setupConfig); setShowSetupWizard(false); }} className="w-full py-3.5 bg-sky-500 text-white rounded-2xl font-black shadow-lg shadow-sky-100">이 기기에서만 사용</button>
                  <button onClick={() => { updateChurchConfig(setupConfig); setSetupStep(4); }} className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100">여러 기기에서 사용 (Cloud 설정)</button>
                  <button onClick={() => setSetupStep(2)} className="w-full py-3 bg-slate-100 text-slate-500 rounded-2xl font-bold">이전</button>
                </div>
              </div>
            )}
            {/* Cloud(Apps Script) 설정 */}
            {setupStep === 4 && (
              <div className="space-y-5">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg"><CloudUpload className="w-7 h-7" /></div>
                  <h3 className="text-xl font-black text-sky-900">여러 기기 연동 설정</h3>
                  <p className="text-slate-500 font-bold text-sm">
                    {TEMPLATE_SHEET_ID ? '2단계만 따라하면 완료!' : '아래 순서대로 천천히 따라해 주세요'}
                  </p>
                </div>

                {/* ── 템플릿이 있을 때: 복사 + 배포 + URL ── */}
                {TEMPLATE_SHEET_ID ? (<>
                  {/* Step 1: 템플릿 복사 */}
                  <div className="rounded-2xl border-2 border-blue-200 overflow-hidden">
                    <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-3">
                      <span className="w-7 h-7 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-black shrink-0">1</span>
                      <span className="font-black">내 Google Sheet 만들기 (1클릭)</span>
                    </div>
                    <div className="p-4 bg-blue-50 space-y-3">
                      <p className="text-sm font-bold text-slate-600">아래 버튼을 누르면 모든 코드가 포함된 Google Sheet가 자동으로 만들어집니다.</p>
                      <button onClick={() => window.open(`https://docs.google.com/spreadsheets/d/${TEMPLATE_SHEET_ID}/copy`, '_blank')} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-base shadow-lg">
                        <ExternalLink className="w-5 h-5" /> Google Sheet 복사하기
                      </button>
                      <div className="bg-white rounded-xl p-3 border border-blue-100 space-y-1.5">
                        <p className="text-xs font-bold text-slate-600">복사 후 해야 할 것:</p>
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">a</span>
                          <p className="text-xs font-bold text-slate-700">"사본 만들기" 클릭</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">b</span>
                          <p className="text-xs font-bold text-slate-700">복사된 시트에서 <span className="px-1.5 py-0.5 bg-slate-800 text-white rounded text-[10px] font-black">확장 프로그램</span> → <span className="px-1.5 py-0.5 bg-slate-800 text-white rounded text-[10px] font-black">Apps Script</span> 클릭</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: 배포 + URL */}
                  <div className="rounded-2xl border-2 border-green-200 overflow-hidden">
                    <div className="bg-green-600 text-white px-4 py-3 flex items-center gap-3">
                      <span className="w-7 h-7 bg-white text-green-600 rounded-full flex items-center justify-center text-sm font-black shrink-0">2</span>
                      <span className="font-black">배포하고 URL 입력</span>
                    </div>
                    <div className="p-4 bg-green-50 space-y-3">
                      <div className="bg-white rounded-xl p-3 space-y-2 border border-green-100">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">a</span>
                          <p className="text-sm font-bold text-slate-700">Apps Script 화면에서 <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs font-black">배포</span> → <span className="px-2 py-0.5 bg-slate-800 text-white rounded text-xs font-black">새 배포</span></p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">b</span>
                          <p className="text-sm font-bold text-slate-700">톱니바퀴 → <span className="px-2 py-0.5 bg-slate-800 text-white rounded text-xs font-black">웹 앱</span> → 액세스: <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs font-black">모든 사용자</span></p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">c</span>
                          <p className="text-sm font-bold text-slate-700"><span className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs font-black">배포</span> → 승인 → 나온 URL 복사</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                        <p className="text-xs font-bold text-amber-700">"확인되지 않은 앱" 경고 → <span className="font-black">고급 → 이동</span> 클릭하세요</p>
                      </div>
                      <input type="text" value={setupApiUrl} onChange={(e) => { setSetupApiUrl(e.target.value); setSetupApiResult(null); }} placeholder="https://script.google.com/macros/s/..." className="w-full px-4 py-3.5 bg-white border-2 border-green-300 rounded-xl font-bold focus:border-green-500 focus:outline-none text-sm" />
                      <button onClick={async () => {
                        if (!setupApiUrl.trim()) return;
                        setSetupApiTesting(true); setSetupApiResult(null);
                        const ok = await testApiConnection(setupApiUrl.trim());
                        setSetupApiTesting(false);
                        if (ok) {
                          setSetupApiResult('success');
                          const url = setupApiUrl.trim();
                          setApiUrl(url);
                          localStorage.setItem('church_api_url', url);
                          updateChurchConfig({ ...churchConfig, apiUrl: url });
                          await gasPost(url, { action: 'updateConfig', config: churchConfig }).catch(console.error);
                          setTimeout(() => setShowSetupWizard(false), 800);
                        } else { setSetupApiResult('fail'); }
                      }} disabled={setupApiTesting || !setupApiUrl.trim()} className="w-full py-3.5 bg-green-600 text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-green-700 transition-colors text-base">
                        {setupApiTesting ? <><Loader2 className="w-5 h-5 animate-spin" /> 연결 테스트 중...</> : <><CheckCircle2 className="w-5 h-5" /> 연결 테스트 & 완료</>}
                      </button>
                      {setupApiResult === 'success' && <div className="text-center py-2"><p className="text-green-600 font-black text-lg">연결 성공!</p></div>}
                      {setupApiResult === 'fail' && <div className="bg-red-50 border border-red-200 rounded-xl p-3"><p className="text-red-600 font-bold text-sm">연결 실패. URL과 배포 설정을 확인해 주세요.</p></div>}
                    </div>
                  </div>
                </>) : (<>
                  {/* ── 템플릿 없을 때: 기존 수동 방식 (3단계) ── */}

                  {/* Step 1: Google Sheet 만들기 */}
                  <div className="rounded-2xl border-2 border-blue-200 overflow-hidden">
                    <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-3">
                      <span className="w-7 h-7 bg-white text-blue-600 rounded-full flex items-center justify-center text-sm font-black shrink-0">1</span>
                      <span className="font-black">Google Sheet 만들기</span>
                    </div>
                    <div className="p-4 bg-blue-50 space-y-3">
                      <p className="text-sm font-bold text-slate-600">아래 버튼을 눌러 새 Google Sheet를 만드세요.</p>
                      <button onClick={() => window.open('https://sheets.new', '_blank')} className="w-full py-3 bg-white text-blue-700 rounded-xl font-black border-2 border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-base">
                        <ExternalLink className="w-5 h-5" /> Google Sheet 새로 만들기
                      </button>
                    </div>
                  </div>

                  {/* Step 2: 코드 복사 + 배포 */}
                  <div className="rounded-2xl border-2 border-indigo-200 overflow-hidden">
                    <div className="bg-indigo-600 text-white px-4 py-3 flex items-center gap-3">
                      <span className="w-7 h-7 bg-white text-indigo-600 rounded-full flex items-center justify-center text-sm font-black shrink-0">2</span>
                      <span className="font-black">코드 붙여넣기 & 배포</span>
                    </div>
                    <div className="p-4 bg-indigo-50 space-y-3">
                      <div className="bg-white rounded-xl p-3 space-y-2 border border-indigo-100">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">a</span>
                          <p className="text-sm font-bold text-slate-700">시트 상단 <span className="px-2 py-0.5 bg-slate-800 text-white rounded text-xs font-black">확장 프로그램</span> → <span className="px-2 py-0.5 bg-slate-800 text-white rounded text-xs font-black">Apps Script</span></p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">b</span>
                          <p className="text-sm font-bold text-slate-700">기존 코드 <span className="text-red-500 font-black">전체 선택(Ctrl+A)</span> → <span className="text-red-500 font-black">삭제</span></p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">c</span>
                          <p className="text-sm font-bold text-slate-700">아래 버튼으로 복사 → <span className="text-blue-600 font-black">붙여넣기(Ctrl+V)</span> → <span className="text-blue-600 font-black">저장(Ctrl+S)</span></p>
                        </div>
                      </div>
                      <button onClick={async () => {
                        try {
                          const res = await fetch('/apps-script.js');
                          const code = await res.text();
                          await navigator.clipboard.writeText(code);
                          alert('코드가 복사되었습니다!\n\nApps Script 에디터에서 Ctrl+V로 붙여넣기하세요.');
                        } catch { alert('복사 실패. /apps-script.js 파일을 직접 열어 복사해 주세요.'); }
                      }} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-base">
                        <Copy className="w-5 h-5" /> 코드 한 번에 복사하기
                      </button>
                      <div className="bg-white rounded-xl p-3 space-y-2 border border-indigo-100 mt-2">
                        <p className="text-xs font-black text-indigo-700">코드 저장 후 배포:</p>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">d</span>
                          <p className="text-sm font-bold text-slate-700"><span className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs font-black">배포</span> → <span className="px-2 py-0.5 bg-slate-800 text-white rounded text-xs font-black">새 배포</span></p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">e</span>
                          <p className="text-sm font-bold text-slate-700">톱니바퀴 → <span className="px-2 py-0.5 bg-slate-800 text-white rounded text-xs font-black">웹 앱</span> → 액세스: <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs font-black">모든 사용자</span> → <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs font-black">배포</span></p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">f</span>
                          <p className="text-sm font-bold text-slate-700">승인 → 나온 <span className="text-green-600 font-black">URL을 복사</span></p>
                        </div>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                        <p className="text-xs font-bold text-amber-700">"확인되지 않은 앱" 경고 → <span className="font-black">고급 → 이동</span> 클릭하세요</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: URL 입력 */}
                  <div className="rounded-2xl border-2 border-green-200 overflow-hidden">
                    <div className="bg-green-600 text-white px-4 py-3 flex items-center gap-3">
                      <span className="w-7 h-7 bg-white text-green-600 rounded-full flex items-center justify-center text-sm font-black shrink-0">3</span>
                      <span className="font-black">URL 붙여넣기 & 연결</span>
                    </div>
                    <div className="p-4 bg-green-50 space-y-3">
                      <input type="text" value={setupApiUrl} onChange={(e) => { setSetupApiUrl(e.target.value); setSetupApiResult(null); }} placeholder="https://script.google.com/macros/s/..." className="w-full px-4 py-3.5 bg-white border-2 border-green-300 rounded-xl font-bold focus:border-green-500 focus:outline-none text-sm" />
                      <button onClick={async () => {
                        if (!setupApiUrl.trim()) return;
                        setSetupApiTesting(true); setSetupApiResult(null);
                        const ok = await testApiConnection(setupApiUrl.trim());
                        setSetupApiTesting(false);
                        if (ok) {
                          setSetupApiResult('success');
                          const url = setupApiUrl.trim();
                          setApiUrl(url);
                          localStorage.setItem('church_api_url', url);
                          updateChurchConfig({ ...churchConfig, apiUrl: url });
                          await gasPost(url, { action: 'updateConfig', config: churchConfig }).catch(console.error);
                          setTimeout(() => setShowSetupWizard(false), 800);
                        } else { setSetupApiResult('fail'); }
                      }} disabled={setupApiTesting || !setupApiUrl.trim()} className="w-full py-3.5 bg-green-600 text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-green-700 transition-colors text-base">
                        {setupApiTesting ? <><Loader2 className="w-5 h-5 animate-spin" /> 연결 테스트 중...</> : <><CheckCircle2 className="w-5 h-5" /> 연결 테스트 & 완료</>}
                      </button>
                      {setupApiResult === 'success' && <div className="text-center py-2"><p className="text-green-600 font-black text-lg">연결 성공!</p></div>}
                      {setupApiResult === 'fail' && <div className="bg-red-50 border border-red-200 rounded-xl p-3"><p className="text-red-600 font-bold text-sm">연결 실패. URL과 배포 설정을 확인해 주세요.</p></div>}
                    </div>
                  </div>
                </>)}

                <button onClick={() => { setShowSetupWizard(false); }} className="w-full py-3 bg-slate-100 text-slate-500 rounded-2xl font-bold">나중에 설정하기</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Name Prompt Modal */}
      {showNamePrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-sm space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-sky-100 rounded-3xl flex items-center justify-center mx-auto text-sky-500"><User className="w-8 h-8" /></div>
              <h3 className="text-2xl font-black text-sky-900">이름이 뭐예요?</h3>
              <p className="text-slate-500 font-bold">선생님이 이름을 불러줄게요!</p>
            </div>
            <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSaveName()} placeholder="이름 입력" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[24px] font-bold text-xl focus:border-sky-400 focus:outline-none" />
            <div className="flex gap-3">
              <button onClick={() => setShowNamePrompt(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-[24px] font-bold">나중에</button>
              <button onClick={handleSaveName} className="flex-2 py-4 bg-sky-500 text-white rounded-[24px] font-black shadow-lg shadow-sky-100">저장하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 입장 모달: 비밀번호 입력 (교사/관리자) */}
      {showTeacherAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-6">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-[340px] space-y-5 animate-in zoom-in-95 duration-300">
            {authRoleChoice === 'admin' && connectionMode === 'cloud' ? (
              <>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg"><Lock className="w-8 h-8" /></div>
                  <h3 className="text-xl font-black text-slate-900">관리자 전용실</h3>
                  <p className="text-slate-500 font-bold text-sm">Google 계정으로 로그인해 주세요</p>
                </div>
                <button onClick={adminGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border-2 border-slate-200 rounded-[20px] font-bold text-slate-700 hover:bg-slate-50 transition-colors active:scale-95">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google로 로그인
                </button>
                <button onClick={() => { setAuthRoleChoice(null); setShowTeacherAuthModal(false); }} className="w-full py-3 bg-slate-100 text-slate-500 rounded-[20px] font-bold hover:bg-slate-200 transition-colors">취소</button>
              </>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <div className={`w-16 h-16 ${authRoleChoice === 'admin' ? 'bg-slate-800' : 'bg-indigo-600'} rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg`}>{authRoleChoice === 'admin' ? <Lock className="w-8 h-8" /> : <KeyRound className="w-8 h-8" />}</div>
                  <h3 className="text-xl font-black text-slate-900">{authRoleChoice === 'admin' ? '관리자 전용실' : '교사 전용실'}</h3>
                  <p className="text-slate-500 font-bold text-sm">{authRoleChoice === 'admin' ? '관리자' : '교사'} 비밀번호를 입력해 주세요!</p>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && verifyTeacherPassword()}
                    placeholder="비밀번호 4자리"
                    className="w-full px-6 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-[20px] font-bold text-xl text-center focus:border-slate-800 focus:outline-none tracking-[0.8em]"
                  />
                  <KeyRound className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setAuthRoleChoice(null); setTeacherPassword(''); setShowTeacherAuthModal(false); }} className="flex-1 py-3.5 bg-slate-100 text-slate-500 rounded-[20px] font-bold hover:bg-slate-200 transition-colors">취소</button>
                  <button onClick={verifyTeacherPassword} className={`flex-2 py-3.5 ${authRoleChoice === 'admin' ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'} text-white rounded-[20px] font-black shadow-lg transition-all active:scale-95`}>입장하기</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {!showSetupWizard && <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-sky-100">
        <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0" onClick={resetView}>
          <div className="p-1.5 sm:p-2 text-white bg-sky-400 rounded-xl shadow-sky-200 shadow-lg"><Sparkles className="w-5 h-5 sm:w-6 sm:h-6" /></div>
          <span className="hidden sm:block text-lg font-black text-sky-900">{churchConfig.departmentName || churchConfig.eventName || 'Bible Education'}</span>
        </div>
        <div className="flex items-center gap-4">
          {connectionMode === 'cloud' && !cloudOnline && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-lg animate-pulse">오프라인</span>
          )}
          {/* 툴바 */}
          <div className="bg-white rounded-2xl shadow-sm border border-sky-100 px-2 sm:px-3 py-2 flex items-center flex-wrap gap-1.5 sm:gap-2">
            {userName ? (
              <span className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm bg-sky-100 text-sky-700 border border-sky-200">
                <User className="w-4 h-4" />
                <span>{userName}</span>
              </span>
            ) : (
              <button onClick={() => setShowNamePrompt(true)} className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-colors border bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-100">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">로그인</span>
              </button>
            )}
            {isAdmin && (
              <button onClick={handleAdminLogout} className="p-1.5 sm:p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 border border-red-100 transition-colors" title="관리자 로그아웃">
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 bg-amber-100 border-2 border-amber-200 rounded-xl sm:rounded-2xl shadow-sm">
              <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-black text-amber-700 tabular-nums text-xs sm:text-base">{talents}</span>
            </div>
            {classes.length > 0 && (
              <button onClick={() => { resetView(); setShowClassListView(true); }} className="p-1.5 sm:p-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-100 transition-colors" title="반별 친구들">
                <Users className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => { resetView(); setActiveTab('shop'); }} title={`${churchConfig.currencyName}상점`} className={`p-1.5 sm:p-2 rounded-xl transition-colors border ${activeTab === 'shop' ? 'bg-sky-500 text-white border-sky-500' : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-100'}`}><ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" /></button>
            {import.meta.env.DEV && (
              <div className="hidden sm:block relative border-l border-sky-100 pl-2">
                <button type="button" onClick={() => setShowPreviewViewportDropdown(v => !v)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold ${previewViewport ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`} title="미리보기">
                  {previewViewport === 'desktop' ? '데스크탑' : previewViewport === 'tablet' ? '테블릿' : previewViewport === 'mobile' ? '모바일' : '미리보기'}
                </button>
                {showPreviewViewportDropdown && (
                  <div className="absolute right-0 top-full mt-1 py-1 bg-white rounded-xl shadow-lg border border-slate-200 z-50 min-w-[120px]">
                    <button type="button" onClick={() => { setPreviewViewport(null); setShowPreviewViewportDropdown(false); }} className={`w-full px-3 py-2 text-left text-xs font-bold rounded-lg ${!previewViewport ? 'bg-slate-100 text-slate-700' : 'text-slate-600 hover:bg-slate-50'}`}>기본(해제)</button>
                    <button type="button" onClick={() => { setPreviewViewport('desktop'); setShowPreviewViewportDropdown(false); }} className={`w-full px-3 py-2 text-left text-xs font-bold rounded-lg ${previewViewport === 'desktop' ? 'bg-slate-100 text-slate-700' : 'text-slate-600 hover:bg-slate-50'}`}>데스크탑</button>
                    <button type="button" onClick={() => { setPreviewViewport('tablet'); setShowPreviewViewportDropdown(false); }} className={`w-full px-3 py-2 text-left text-xs font-bold rounded-lg ${previewViewport === 'tablet' ? 'bg-slate-100 text-slate-700' : 'text-slate-600 hover:bg-slate-50'}`}>테블릿</button>
                    <button type="button" onClick={() => { setPreviewViewport('mobile'); setShowPreviewViewportDropdown(false); }} className={`w-full px-3 py-2 text-left text-xs font-bold rounded-lg ${previewViewport === 'mobile' ? 'bg-slate-100 text-slate-700' : 'text-slate-600 hover:bg-slate-50'}`}>모바일</button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* 사용자: 프로필 필 (이름 있을 때만; 없을 땐 입장→학생으로 이름 입력 유도) */}
          {userName && (
            <div className="rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1.5 sm:py-2 bg-sky-50 border border-sky-100 flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="text-[10px] sm:text-xs font-black text-sky-700 hidden md:block">
                {userName} 어린이
                {currentClass && (
                  <span className={currentClassColor ? `ml-1 px-1.5 py-0.5 rounded ${currentClassColor.bg} ${currentClassColor.text}` : ''}>
                    ({currentClass.name})
                  </span>
                )}
              </span>
              <button onClick={handleLogout} className="p-1.5 text-slate-300 hover:text-slate-500"><LogOut className="w-4 h-4" /></button>
            </div>
          )}
        </div>
        </div>
        <div className="overflow-hidden bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-500 bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite] py-1 sm:py-1.5">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
            <p className="text-xs sm:text-base md:text-xl font-black text-white tracking-wider sm:tracking-widest animate-pulse whitespace-nowrap">다음세대 조직신학 대정복</p>
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
          </div>
        </div>
        <style>{`@keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }`}</style>
        {classes.length > 0 && (
          <div className="border-b-2 border-slate-200 bg-white">
            <div className="flex items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 overflow-x-auto scrollbar-hide">
              <Users className="w-5 h-5 text-slate-500 shrink-0" />
              {classes.map(c => {
                const color = getClassColor(c.id);
                const isExpanded = expandedClassId === c.id;
                const count = students.filter(s => s.classId === c.id).length;
                return (
                  <button key={c.id} onClick={() => setExpandedClassId(isExpanded ? null : c.id)} className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-sm sm:text-base font-black transition-all shrink-0 flex items-center gap-1.5 ${isExpanded ? `${color.bg} text-white shadow-lg scale-105` : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-200'}`}>
                    {c.name}반
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${isExpanded ? 'bg-white/30 text-white' : 'bg-slate-300/50 text-slate-500'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
            {expandedClassId && (() => {
              const cls = classes.find(c => c.id === expandedClassId);
              const classStudents = students.filter(s => s.classId === expandedClassId);
              const color = getClassColor(expandedClassId);
              if (!cls) return null;
              return (
                <div className={`px-4 sm:px-6 py-3 sm:py-4 border-t-2 ${color.light} animate-in slide-in-from-top-2 duration-200`}>
                  <div className="flex flex-wrap gap-2">
                    {classStudents.length === 0 ? (
                      <span className="text-sm text-slate-400 font-bold">배정된 학생이 없어요</span>
                    ) : classStudents.map(s => (
                      <span key={s.id} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-sm sm:text-base font-bold border-2 ${color.border} ${color.light} text-slate-800`}>{s.name}</span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </header>}

      {!showSetupWizard && <main className={`p-4 sm:p-6 mx-auto transition-all ${previewViewport === 'desktop' ? 'max-w-[1280px]' : previewViewport === 'tablet' ? 'max-w-[768px]' : previewViewport === 'mobile' ? 'max-w-[375px]' : 'max-w-4xl'} ${previewViewport ? 'ring-2 ring-amber-300 ring-inset rounded-lg' : ''}`}>
        {showClassListView ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowClassListView(false)} className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-slate-800">반별 친구들</h2>
                <p className="text-sm font-bold text-slate-500">반별로 정리된 친구 명단이에요</p>
              </div>
            </div>
            <div className={`grid gap-4 ${previewGridCols ?? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              {classes.map(c => {
                const classStudents = students.filter(s => s.classId === c.id);
                const color = getClassColor(c.id);
                return (
                  <div key={c.id} className="p-0 bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:border-violet-100 transition-colors overflow-hidden">
                    <div className={`px-4 py-3 rounded-t-2xl ${color.bg} ${color.text} font-black text-base whitespace-nowrap overflow-hidden text-ellipsis`}>
                      {c.name}
                    </div>
                    <div className="p-4">
                      {classStudents.length === 0 ? (
                        <p className="text-slate-400 text-sm font-medium">비어 있음</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {classStudents.map(s => (
                            <span key={s.id} className="px-3 py-1.5 bg-sky-50 text-sky-700 rounded-xl text-sm font-bold border border-sky-100">{s.name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : isQuizMode ? (
          <div key={`quiz-session-${quizSessionKey}`} className="space-y-8 animate-in zoom-in-95 duration-500 pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button onClick={resetView} className="flex-1 sm:flex-none p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-bold text-slate-600 border border-slate-100 hover:text-sky-500 hover:border-sky-200"><Home className="w-5 h-5" /> 처음으로</button>
                <button onClick={resetCurrentQuiz} className="flex-1 sm:flex-none p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-bold text-slate-400 border border-slate-100 hover:text-amber-500 hover:border-amber-200"><RefreshCw className="w-5 h-5" /> 리셋</button>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-2 rounded-full border border-slate-100 shadow-sm"><Trophy className="w-5 h-5 text-amber-500" /><span className="font-black text-slate-600">성경 퀴즈대회 연습</span></div>
              <div className="font-black text-sky-600 text-xl tabular-nums">{currentQuizIndex + 1} / {activeQuizQuestions.length}</div>
            </div>
            
            {!isQuizFinished ? (
              <div className="bg-white p-6 sm:p-10 rounded-[50px] shadow-2xl border-4 border-sky-100 relative overflow-hidden flex flex-col min-h-[550px]">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-sky-200"><HelpCircle className="w-32 h-32" /></div>
                
                <div className="space-y-6 relative z-10 flex-1">
                  <div className="text-center space-y-4">
                    <div className="inline-block px-4 py-1 bg-sky-100 text-sky-600 rounded-full font-black text-xs uppercase tracking-widest">Question {currentQuizIndex + 1}</div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 leading-tight">{activeQuizQuestions[currentQuizIndex]?.question}</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-8">
                    {activeQuizQuestions[currentQuizIndex]?.options.map((option, idx) => {
                      const isSelected = userAnswers[currentQuizIndex] === idx;
                      const isCorrect = activeQuizQuestions[currentQuizIndex].answerIndex === idx;
                      
                      let buttonStyle = "bg-white border-slate-100 hover:border-sky-200 hover:bg-slate-50";
                      let indicatorStyle = "bg-slate-200 text-slate-500";
                      
                      if (showFeedback) {
                        if (isCorrect) {
                          buttonStyle = "bg-green-50 border-green-400 text-green-700 shadow-md ring-2 ring-green-100";
                          indicatorStyle = "bg-green-500 text-white";
                        } else if (isSelected) {
                          buttonStyle = "bg-red-50 border-red-400 text-red-700 shadow-md ring-2 ring-red-100";
                          indicatorStyle = "bg-red-500 text-white";
                        } else {
                          buttonStyle = "bg-white border-slate-100 opacity-50 grayscale";
                        }
                      } else if (isSelected) {
                        buttonStyle = "bg-sky-50 border-sky-400 text-sky-700 shadow-md";
                        indicatorStyle = "bg-sky-500 text-white";
                      }

                      return (
                        <button key={`${currentQuizIndex}-${idx}`} onClick={() => handleAnswer(idx)} className={`p-4 sm:p-5 text-left rounded-[24px] border-2 transition-all font-bold text-base sm:text-lg flex items-center gap-4 ${buttonStyle}`}>
                          <div className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full flex items-center justify-center text-sm font-black transition-colors ${indicatorStyle}`}>{idx + 1}</div>
                          {option}
                          {showFeedback && isCorrect && <CheckCircle2 className="w-6 h-6 ml-auto text-green-500 animate-in zoom-in" />}
                          {showFeedback && isSelected && !isCorrect && <X className="w-6 h-6 ml-auto text-red-500 animate-in zoom-in" />}
                        </button>
                      );
                    })}
                  </div>

                  {showFeedback && (
                    <div className={`p-5 sm:p-6 rounded-[30px] mt-6 animate-in slide-in-from-top-4 duration-500 shadow-inner ${userAnswers[currentQuizIndex] === activeQuizQuestions[currentQuizIndex]?.answerIndex ? 'bg-green-50/50 border border-green-200' : 'bg-red-50/50 border border-red-200'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        {userAnswers[currentQuizIndex] === activeQuizQuestions[currentQuizIndex]?.answerIndex ? (
                          <div className="flex items-center gap-2"><div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white"><Check className="w-5 h-5" /></div><span className="font-black text-green-700 text-lg">우와! 정답이에요!</span></div>
                        ) : (
                          <div className="flex items-center gap-2"><div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white"><X className="w-5 h-5" /></div><span className="font-black text-red-700 text-lg">아쉬워요! 정답은 {(activeQuizQuestions[currentQuizIndex]?.answerIndex || 0) + 1}번이에요.</span></div>
                        )}
                      </div>
                      
                      {(() => {
                        const { explanationText, verse } = parseExplanation(activeQuizQuestions[currentQuizIndex]?.explanation || "");
                        return (
                          <div className="space-y-4">
                            <p className="text-slate-600 font-bold leading-relaxed sm:text-lg">{explanationText}</p>
                            
                            {verse && currentVerseText && (
                              <div className={`mt-4 transition-all duration-500 ${isVerseShowing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <div className="flex items-center gap-2 mb-2 px-1">
                                  <BookMarked className="w-5 h-5 text-sky-500" />
                                  <span className="text-sm font-black text-sky-700 italic tracking-tight">{verse}</span>
                                </div>
                                
                                <div className="bg-white/90 p-5 rounded-[24px] border-2 border-white shadow-xl relative overflow-hidden group flex flex-col justify-center">
                                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform"><Sparkles className="w-8 h-8 text-sky-400" /></div>
                                  <p className="text-sky-900 font-black text-lg sm:text-xl leading-relaxed">
                                    "{currentVerseText}"
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setCurrentQuizIndex(0); setShowFeedback(userAnswers[0] !== undefined); }} disabled={currentQuizIndex === 0} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 disabled:opacity-0 transition-colors"><ChevronLeft className="w-6 h-6" /><ChevronLeft className="w-6 h-6 -ml-5" /></button>
                    <button onClick={navigatePrev} disabled={currentQuizIndex === 0} className="flex items-center gap-2 px-5 py-3 bg-white text-slate-600 rounded-2xl font-black border border-slate-100 disabled:opacity-0 hover:bg-slate-50 transition-colors">
                      <ChevronLeft className="w-5 h-5" /> 이전
                    </button>
                  </div>
                  
                  <button onClick={navigateNext} disabled={userAnswers[currentQuizIndex] === undefined} className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95 ${userAnswers[currentQuizIndex] === undefined ? 'bg-slate-100 text-slate-300' : 'bg-sky-500 text-white hover:bg-sky-600'}`}>
                    {currentQuizIndex === activeQuizQuestions.length - 1 ? '전체 결과 보기' : '다음 문제'} <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[50px] shadow-2xl border-4 border-amber-100 text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-amber-400 rounded-full flex items-center justify-center mx-auto text-white shadow-xl shadow-amber-100 animate-bounce"><Trophy className="w-14 h-14" /></div>
                <div className="space-y-2"><h3 className="text-4xl font-black text-slate-900">도전 완료!</h3><p className="text-xl font-bold text-slate-500">훌륭해요! {userName} 어린이의 실력은?</p></div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <div className="bg-slate-50 p-6 rounded-3xl flex-1 shadow-inner border border-slate-100"><div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">맞춘 개수</div><div className="text-5xl font-black text-sky-600">{Object.values(userAnswers).filter((ans, idx) => ans === activeQuizQuestions[idx].answerIndex).length} / {activeQuizQuestions.length}</div></div>
                  <div className="bg-slate-50 p-6 rounded-3xl flex-1 shadow-inner border border-slate-100"><div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">최종 점수</div><div className="text-6xl font-black text-amber-500 tracking-tight">{Math.round(calculateScore())}<span className="text-2xl ml-1">점</span></div></div>
                </div>
                <div className="flex flex-col items-center gap-4 pt-4">
                  <button onClick={() => { setQuizSessionKey(prev => prev + 1); setCurrentQuizIndex(0); setUserAnswers({}); setIsQuizFinished(false); setShowFeedback(false); setIsVerseShowing(false); }} className="w-full sm:w-auto px-10 py-5 bg-slate-100 text-slate-600 rounded-[30px] font-black text-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"><RefreshCw className="w-6 h-6" /> 다시 풀어보기</button>
                  <button onClick={resetView} className="w-full sm:w-auto px-12 py-5 bg-sky-500 text-white rounded-[30px] font-black text-xl shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all active:scale-95 flex items-center justify-center gap-2"><Home className="w-6 h-6" /> 처음으로 돌아가기</button>
                </div>
              </div>
            )}
          </div>
        ) : !selectedTopic && activeTab !== 'teacher' && activeTab !== 'admin' ? (
          activeTab === 'shop' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4"><button onClick={resetView} className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"><ChevronLeft className="w-6 h-6" /></button><h2 className="text-3xl font-black text-slate-800">{churchConfig.currencyName} 상점</h2></div>
                <button onClick={resetMyTalents} className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 text-sm"><RefreshCw className="w-4 h-4" /> 내 {churchConfig.currencyName} 초기화</button>
              </div>
              <div className={`grid gap-6 ${previewGridCols ?? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                {(shopItems.length ? shopItems : STICKERS).map(sticker => {
                  const isOwned = ownedStickers.includes(sticker.id);
                  return (
                    <div key={sticker.id} className={`p-6 bg-white rounded-3xl shadow-md border-2 transition-all ${isOwned ? 'border-sky-200 opacity-60' : 'border-transparent hover:border-amber-200'}`}>
                      <div className="text-6xl mb-4 text-center">{sticker.icon}</div>
                      <div className="text-center space-y-3">
                        <h4 className="font-black text-lg">{sticker.name}</h4>
                        <button onClick={() => buySticker(sticker.id, sticker.price)} disabled={isOwned} className={`w-full py-2 rounded-xl font-bold flex items-center justify-center gap-2 ${isOwned ? 'bg-slate-100 text-slate-400' : 'bg-amber-400 text-white hover:bg-amber-500 shadow-md shadow-amber-100'}`}>{isOwned ? <CheckCircle2 className="w-5 h-5" /> : <><Coins className="w-4 h-4" /> {sticker.price}</>}{isOwned ? '수집 완료' : '교환하기'}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : selectedChallengeRoom ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedChallengeRoom(false)} className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500 text-white">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">챌린지 방</h2>
                    <p className="text-slate-400 font-bold text-sm">{churchConfig.currencyName}를 모아 보세요!</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                {challenges.map(ch => {
                  const isCompleted = completedChallenges.includes(ch.id);
                  const isBetPending = pendingBetChallengeId === ch.id;
                  const isEditing = isAdmin && editingChallengeId === ch.id;
                  return (
                    <div key={ch.id} className="p-6 bg-white rounded-[32px] border-2 border-amber-100 shadow-lg space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-black text-slate-800">{ch.title}</h3>
                          <p className="text-slate-600 font-medium mt-1">{ch.description}</p>
                          {ch.type === 'normal' ? (
                            <p className="mt-2 font-black text-amber-600">완료 시 {ch.talents} {churchConfig.currencyName}</p>
                          ) : (
                            <p className="mt-2 font-black text-amber-600">{churchConfig.currencyName} 걸기 (완료 시 2배, 최대 {ch.talents} {churchConfig.currencyName})</p>
                          )}
                        </div>
                        {isAdmin && (
                          isEditing ? (
                            <div className="flex items-center gap-2">
                              <input type="number" min={0} value={editChallengeTalents} onChange={(e) => setEditChallengeTalents(Number(e.target.value) || 0)} className="w-20 px-2 py-1 border rounded-lg font-bold" />
                              <button onClick={() => updateChallengeTalents(ch.id, editChallengeTalents)} className="px-3 py-1 bg-amber-500 text-white rounded-lg font-bold text-sm">저장</button>
                              <button onClick={() => setEditingChallengeId(null)} className="px-3 py-1 bg-slate-200 rounded-lg font-bold text-sm">취소</button>
                            </div>
                          ) : (
                            <button onClick={() => { setEditingChallengeId(ch.id); setEditChallengeTalents(ch.talents); }} className="p-2 bg-slate-100 rounded-xl font-bold text-sm">{churchConfig.currencyName} 수정</button>
                          )
                        )}
                      </div>
                      {ch.type === 'normal' ? (
                        isCompleted ? (
                          <p className="font-bold text-slate-400">완료했어요!</p>
                        ) : ch.id === 'ch-game' ? (
                          (() => {
                            tetrisOnCompleteRef.current = () => { addTalents(ch.talents); markChallengeComplete(ch.id); };
                            if (!tetrisGameStarted && !tetrisGameOver) {
                              return (
                                <div className="space-y-3">
                                  <p className="text-slate-600 font-medium text-sm">성경책 이름이 떨어지는 블록을 맞춰 5줄을 없애면 완료!</p>
                                  <button onClick={startTetris} className="px-6 py-3 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600 flex items-center gap-2">
                                    <Gamepad2 className="w-5 h-5" /> 게임 시작
                                  </button>
                                </div>
                              );
                            }
                            if (tetrisGameOver && (tetrisLinesCleared >= TARGET_LINES || tetrisScore >= TARGET_SCORE)) {
                              return <p className="font-bold text-green-600">챌린지 완료! {ch.talents} {churchConfig.currencyName}를 받았어요!</p>;
                            }
                            if (tetrisGameOver) {
                              return (
                                <div className="space-y-2">
                                  <p className="font-bold text-slate-500">게임 오버. 다시 도전해 보세요!</p>
                                  <button onClick={startTetris} className="px-4 py-2 bg-slate-500 text-white rounded-xl font-bold text-sm">다시 하기</button>
                                </div>
                              );
                            }
                            const cells = tetrisPiece ? getShapeCells(tetrisPiece.shapeIndex, tetrisPiece.rotation) : [];
                            return (
                              <div className="space-y-2">
                                <div className="flex gap-4 text-sm font-bold">
                                  <span>점수: {tetrisScore}</span>
                                  <span>줄: {tetrisLinesCleared} / {TARGET_LINES}</span>
                                </div>
                                <div className="inline-block border-2 border-slate-300 rounded-lg p-1 bg-slate-900" style={{ width: COLS * 18, height: ROWS * 18 }}>
                                  {Array.from({ length: ROWS }, (_, row) => (
                                    <div key={row} className="flex">
                                      {Array.from({ length: COLS }, (_, col) => {
                                        let label = tetrisGrid[row]?.[col] ?? '';
                                        if (!label && tetrisPiece) {
                                          const cellsR = getShapeCells(tetrisPiece.shapeIndex, tetrisPiece.rotation);
                                          let bi = 0;
                                          for (let r = 0; r < cellsR.length; r++)
                                            for (let c = 0; c < (cellsR[r]?.length ?? 0); c++) {
                                              if (cellsR[r]?.[c] && tetrisPiece.y + r === row && tetrisPiece.x + c === col)
                                                label = tetrisPiece.bookNames[bi] ?? '';
                                              if (cellsR[r]?.[c]) bi++;
                                            }
                                        }
                                        return (
                                          <div key={col} className="w-4 h-4 border border-slate-700 shrink-0 flex items-center justify-center text-[8px] font-bold overflow-hidden bg-slate-800" title={label}>
                                            {label ? label.slice(0, 2) : ''}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  <button type="button" onClick={() => { if (tetrisPiece && !collide(tetrisGrid, tetrisPiece, -1, 0)) setTetrisPiece(p => p ? { ...p, x: p.x - 1 } : null); }} className="px-3 py-1.5 bg-slate-500 text-white rounded-lg font-bold text-sm">←</button>
                                  <button type="button" onClick={() => { if (tetrisPiece && !collide(tetrisGrid, tetrisPiece, 1, 0)) setTetrisPiece(p => p ? { ...p, x: p.x + 1 } : null); }} className="px-3 py-1.5 bg-slate-500 text-white rounded-lg font-bold text-sm">→</button>
                                  <button type="button" onClick={() => { if (!tetrisPiece) return; const np = { ...tetrisPiece, y: tetrisPiece.y + 1 }; if (!collide(tetrisGrid, np, 0, 0)) setTetrisPiece(np); }} className="px-3 py-1.5 bg-amber-500 text-white rounded-lg font-bold text-sm">↓</button>
                                </div>
                              </div>
                            );
                          })()
                        ) : ch.id === 'ch-bible' ? (
                          <div className="space-y-4">
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                              <p className="text-xs font-black text-amber-700 mb-1">{currentBibleVerseKey}</p>
                              <p className="text-slate-700 font-medium leading-relaxed">{BIBLE_DATASET[currentBibleVerseKey] ?? ''}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setCurrentBibleVerseKey(bibleEntries[Math.floor(Math.random() * bibleEntries.length)]?.[0] ?? currentBibleVerseKey)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm">다른 구절 보기</button>
                              <button onClick={() => { addTalents(ch.talents); markChallengeComplete(ch.id); }} className="px-6 py-3 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600">소리 내어 읽었어요</button>
                            </div>
                          </div>
                        ) : ch.id === 'ch-kakao' ? (
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {teachers.length === 0 ? (
                                <p className="text-slate-400 font-bold text-sm">관리자 설정에서 선생님을 추가해 주세요.</p>
                              ) : null}
                              {teachers.map(t => (
                                <a key={t.id} href={t.kakaoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-xl font-bold hover:bg-yellow-200 border border-yellow-300">
                                  <MessageCircle className="w-5 h-5" /> {t.name} 카톡으로 인사하기
                                </a>
                              ))}
                            </div>
                            <button onClick={() => { addTalents(ch.talents); markChallengeComplete(ch.id); }} className="px-6 py-3 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600">인사 보냈어요</button>
                          </div>
                        ) : (
                          <button onClick={() => { markChallengeComplete(ch.id); addTalents(ch.talents); }} className="px-6 py-3 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600">완료했어요</button>
                        )
                      ) : (
                        <div className="space-y-2">
                          {ch.id === 'ch-bet' && (
                            <p className="text-slate-600 font-medium text-sm bg-amber-50 p-3 rounded-xl border border-amber-100">오늘 미션: 가족에게 배운 말씀 한 줄 전하기. 완료하면 걸었던 {churchConfig.currencyName} 2배!</p>
                          )}
                          {isCompleted ? (
                            <p className="font-bold text-slate-400">완료했어요!</p>
                          ) : isBetPending ? (
                            <>
                              <p className="font-bold text-slate-600">{pendingBetAmount} {churchConfig.currencyName} 걸었어요. 완료하면 2배로 받아요!</p>
                              <button onClick={() => { addTalents(pendingBetAmount * 2); markChallengeComplete(ch.id); setPendingBetChallengeId(null); setPendingBetAmount(0); }} className="px-6 py-3 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600">완료했어요 (2배 받기)</button>
                            </>
                          ) : (
                            <div className="flex flex-wrap items-center gap-2">
                              <input type="number" min={1} max={Math.min(talents, ch.talents)} value={betInputAmount || ''} onChange={(e) => setBetInputAmount(Math.min(ch.talents, Math.max(0, Number(e.target.value) || 0)))} placeholder="걸 금액" className="w-24 px-3 py-2 border-2 border-amber-200 rounded-xl font-bold" />
                              <button onClick={() => { const amt = Math.min(talents, ch.talents, Math.max(1, betInputAmount || 0)); if (talents < amt) return; setTalents(prev => prev - amt); setPendingBetChallengeId(ch.id); setPendingBetAmount(amt); setBetInputAmount(0); }} className="px-6 py-3 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600">도전하기</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in duration-700">
              <div className="space-y-3 sm:space-y-4 text-center pt-4 sm:pt-8 px-2">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-sky-900 leading-tight">{getDisplayTitle().line1}<br/><span className="text-sky-500 relative inline-block">{getDisplayTitle().line2}<span className="absolute bottom-0 left-0 w-full h-2 sm:h-3 bg-sky-200/50 -z-10 rounded-full"></span></span></h2>
                <p className="text-slate-500 font-bold text-base sm:text-xl md:text-2xl">(다음세대 조직신학)</p>
              </div>

              <div className={`grid gap-4 sm:gap-6 ${previewGridCols ?? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {THEOLOGY_TOPICS.map((topic) => (
                  <button key={topic.id} onClick={() => setSelectedTopic(topic)} className="relative flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-8 transition-all duration-300 bg-white border-2 border-transparent group rounded-3xl sm:rounded-[40px] shadow-lg hover:shadow-2xl hover:border-sky-200 overflow-hidden text-center">
                    <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl ${topic.color} text-white group-hover:scale-110 transition-transform shadow-lg shadow-sky-100`}><topic.Icon className="w-8 h-8 sm:w-10 sm:h-10" /></div>
                    <div><h3 className="text-base sm:text-xl font-black">{topic.title}</h3><p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest uppercase mt-1">{topic.subTitle}</p></div>
                    <div className="absolute top-0 right-0 p-4 transition-opacity opacity-5 group-hover:opacity-10"><topic.Icon className="w-12 sm:w-16 h-12 sm:h-16" /></div>
                  </button>
                ))}
                <button onClick={() => { setSelectedChallengeRoom(true); setSelectedTopic(null); }} className="relative flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-8 transition-all duration-300 bg-amber-500 border-2 border-transparent group rounded-3xl sm:rounded-[40px] shadow-lg hover:shadow-2xl hover:bg-amber-600 overflow-hidden text-center">
                  <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-amber-400 text-white group-hover:scale-110 transition-transform shadow-lg"><Trophy className="w-8 h-8 sm:w-10 sm:h-10" /></div>
                  <div><h3 className="text-base sm:text-xl font-black text-white">챌린지 방</h3><p className="text-[10px] sm:text-xs font-bold text-amber-100 tracking-widest uppercase mt-1">게임·성경·카톡으로 {churchConfig.currencyName} 모으기</p></div>
                </button>
                <button onClick={() => startQuiz()} className="relative flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-8 transition-all duration-300 bg-gradient-to-br from-orange-500 to-red-500 border-2 border-transparent group rounded-3xl sm:rounded-[40px] shadow-lg hover:shadow-2xl hover:from-orange-600 hover:to-red-600 overflow-hidden text-center">
                  <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/20 text-white group-hover:scale-110 transition-transform shadow-lg backdrop-blur-sm"><Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10" /></div>
                  <div><h3 className="text-base sm:text-xl font-black text-white">교리퀴즈 전체 도전</h3><p className="text-[10px] sm:text-xs font-bold text-orange-100 tracking-widest uppercase mt-1">모든 주제 랜덤 도전 · 완료 시 5 {churchConfig.currencyName}</p></div>
                </button>
              </div>

              {/* ── 교사 · 관리자 영역 ── */}
              <div className="relative mt-14 pt-12">
                <div className="absolute inset-x-0 top-0 flex items-center">
                  <div className="flex-1 h-[3px] bg-slate-800"></div>
                  <span className="px-5 py-1.5 text-sm font-black text-white bg-slate-800 rounded-full">교사 · 관리자 전용</span>
                  <div className="flex-1 h-[3px] bg-slate-800"></div>
                </div>
                <div className={`grid gap-4 sm:gap-6 ${previewGridCols ?? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                  <button onClick={handleTeacherLoungeClick} className="relative flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-8 transition-all duration-300 bg-indigo-600 border-2 border-transparent group rounded-3xl sm:rounded-[40px] shadow-lg hover:shadow-2xl hover:bg-indigo-700 overflow-hidden text-center">
                    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-indigo-500 text-white group-hover:scale-110 transition-transform shadow-lg">{isTeacherAuthenticated ? <Library className="w-8 h-8 sm:w-10 sm:h-10" /> : <KeyRound className="w-8 h-8 sm:w-10 sm:h-10" />}</div>
                    <div><h3 className="text-base sm:text-xl font-black text-white">교사 전용실</h3><p className="text-[10px] sm:text-xs font-bold text-indigo-200 tracking-widest uppercase mt-1">자료 · 미션확인 · 보상</p></div>
                    {!isTeacherAuthenticated && <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 p-2 rounded-xl shadow-lg animate-pulse"><KeyRound className="w-4 h-4" /></div>}
                  </button>
                  <button onClick={handleAdminRoomClick} className="relative flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-8 transition-all duration-300 bg-slate-800 border-2 border-transparent group rounded-3xl sm:rounded-[40px] shadow-lg hover:shadow-2xl hover:bg-slate-900 overflow-hidden text-center">
                    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-600 text-white group-hover:scale-110 transition-transform shadow-lg">{isAdmin ? <Settings className="w-8 h-8 sm:w-10 sm:h-10" /> : <Lock className="w-8 h-8 sm:w-10 sm:h-10" />}</div>
                    <div><h3 className="text-base sm:text-xl font-black text-white">관리자 전용실</h3><p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest uppercase mt-1">설정 · 상점 · 반 관리</p></div>
                    {!isAdmin && <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 p-2 rounded-xl shadow-lg animate-pulse"><Lock className="w-4 h-4" /></div>}
                  </button>
                  {isAdmin && (
                    <button onClick={() => { setSetupStep(1); setSetupConfig({ ...churchConfig }); setShowSetupWizard(true); }} className="relative flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-8 transition-all duration-300 bg-gradient-to-br from-rose-500 to-purple-600 border-2 border-transparent group rounded-3xl sm:rounded-[40px] shadow-lg hover:shadow-2xl hover:from-rose-600 hover:to-purple-700 overflow-hidden text-center">
                      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/20 text-white group-hover:scale-110 transition-transform shadow-lg backdrop-blur-sm"><Settings className="w-8 h-8 sm:w-10 sm:h-10" /></div>
                      <div><h3 className="text-base sm:text-xl font-black text-white">초기 설정</h3><p className="text-[10px] sm:text-xs font-bold text-rose-100 tracking-widest uppercase mt-1">교회명 · 비밀번호 · 클라우드</p></div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        ) : (activeTab === 'teacher' || activeTab === 'admin') ? (
          <div className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
            <aside className="md:w-64 shrink-0 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <button onClick={resetView} className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"><ChevronLeft className="w-6 h-6" /></button>
                {activeTab === 'admin' ? (
                  <button onClick={handleAdminLogout} className="p-3 bg-slate-800 text-white rounded-2xl shadow-sm hover:bg-slate-900 transition-all flex items-center gap-2 font-bold text-sm"><Lock className="w-4 h-4" /> 잠금</button>
                ) : (
                  <button onClick={() => { setIsTeacherAuthenticated(false); setSelectedTeacherCategory(null); setActiveTab('info'); }} className="p-3 bg-indigo-600 text-white rounded-2xl shadow-sm hover:bg-indigo-700 transition-all flex items-center gap-2 font-bold text-sm"><Lock className="w-4 h-4" /> 잠금</button>
                )}
              </div>
              <div className="mb-2">
                <h2 className="text-xl font-black text-slate-800">{activeTab === 'admin' ? '관리자 전용실' : '교사 전용실'}</h2>
                <p className="text-slate-400 font-bold text-xs mt-0.5">메뉴를 선택하세요</p>
              </div>
              <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                {currentCategories.map((cat) => (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat)} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all shrink-0 md:shrink-none font-bold ${selectedCategory?.id === cat.id ? (activeTab === 'admin' ? 'bg-slate-800' : 'bg-indigo-600') + ' text-white shadow-lg' : 'bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-700'}`}>
                    <div className={`p-2 rounded-xl ${selectedCategory?.id === cat.id ? 'bg-white/20' : cat.color} ${selectedCategory?.id === cat.id ? 'text-white' : 'text-white'}`}><cat.Icon className="w-5 h-5" /></div>
                    <span className="text-sm">{cat.name}</span>
                  </button>
                ))}
              </nav>
            </aside>
            <main className="flex-1 min-w-0">
              {!selectedCategory ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border-4 border-dashed border-slate-100 text-center px-6">
                  {activeTab === 'admin' ? <Settings className="w-16 h-16 text-slate-200 mb-4" /> : <Library className="w-16 h-16 text-slate-200 mb-4" />}
                  <p className="text-slate-400 font-bold text-lg">왼쪽 메뉴에서 항목을 선택하세요.</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-10 duration-300">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${selectedCategory.color} text-white`}>
                      <selectedCategory.Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800">{selectedCategory.name}</h2>
                      <p className="text-slate-400 font-bold text-sm">자료를 확인하고 관리하세요.</p>
                    </div>
                  </div>

                {selectedCategory.id === 'mission-confirm' ? (
                  <div className="bg-white p-6 sm:p-10 rounded-[40px] shadow-2xl border-4 border-teal-100 space-y-8">
                    <h4 className="text-xl font-black text-slate-800">오늘의 미션 확인</h4>
                    <p className="text-slate-600 font-medium text-sm">학생이 완료한 미션을 확인하고 확인 버튼을 누르면 해당 학생에게 3 {churchConfig.currencyName}가 부여됩니다.</p>
                    {pendingMissionCompletions.length === 0 ? (
                      <div className="text-center py-16 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                        <CheckCircle2 className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold">대기 중인 미션 완료가 없어요.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                        {pendingMissionCompletions.map((item) => {
                          const student = students.find(s => s.name === item.studentName);
                          const classObj = student?.classId ? classes.find(c => c.id === student.classId) : null;
                          return (
                            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border-2 border-teal-50 rounded-3xl hover:border-teal-100 transition-all shadow-sm">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-black text-lg text-slate-800">{item.studentName}</span>
                                  <span className="text-sm font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded-lg">{classObj?.name ?? '-'}</span>
                                </div>
                                <p className="mt-2 text-slate-600 font-medium">{item.topicTitle} – {item.missionText}</p>
                              </div>
                              <button onClick={() => confirmMissionCompletion(item.id)} className="shrink-0 px-5 py-2.5 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" /> 확인
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : selectedCategory.id === 'talent-gifts' ? (
                  <div className="bg-white p-6 sm:p-10 rounded-[40px] shadow-2xl border-4 border-amber-100 space-y-8">
                    {loggedInStudents.length > 0 && (
                      <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-100">
                        <p className="font-black text-slate-700 text-sm mb-2">지금 로그인한 친구들</p>
                        <div className="flex flex-wrap gap-2">
                          {loggedInStudents.map(s => (
                            <span key={s.id} className="px-3 py-1.5 bg-white rounded-xl font-bold text-slate-600 border border-sky-100">{s.name}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      <button type="button" onClick={() => setTalentGiftListMode('loggedIn')} className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${talentGiftListMode === 'loggedIn' ? 'bg-sky-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        지금 로그인한 친구들
                      </button>
                      <button type="button" onClick={() => setTalentGiftListMode('all')} className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${talentGiftListMode === 'all' ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        전체 반별 분류명단
                      </button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 flex gap-2">
                        <input 
                          type="text" 
                          value={newStudentName} 
                          onChange={(e) => setNewStudentName(e.target.value)} 
                          onKeyDown={(e) => e.key === 'Enter' && addStudent()}
                          placeholder="추가할 학생 이름" 
                          className="flex-1 px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-amber-400 focus:outline-none"
                        />
                        <button onClick={addStudent} className="px-6 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600 transition-all flex items-center gap-2">
                          <PlusCircle className="w-6 h-6" /> 추가
                        </button>
                      </div>
                      <button onClick={giveBulkTalents} className="px-6 py-4 bg-sky-500 text-white rounded-2xl font-black hover:bg-sky-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-100">
                        <Star className="w-6 h-6" /> 전체 +1 {churchConfig.currencyName}
                      </button>
                    </div>

                    {talentGiftListMode === 'all' && (
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="font-black text-slate-600">반 필터:</span>
                        <select value={selectedClassFilter} onChange={(e) => setSelectedClassFilter(e.target.value)} className="px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 focus:border-amber-400 focus:outline-none">
                          <option value="">전체</option>
                          {classes.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                        </select>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-4 sm:px-6 py-2 bg-slate-50 rounded-xl text-slate-400 font-black text-sm uppercase tracking-widest gap-2">
                        <span>학생 이름</span>
                        <span className="shrink-0">반</span>
                        <span className="shrink-0">{churchConfig.currencyName} 현황</span>
                      </div>
                      <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                        {(talentGiftListMode === 'loggedIn'
                          ? students.filter(s => loggedInStudents.some(l => l.name === s.name))
                          : (selectedClassFilter ? students.filter(s => s.classId === selectedClassFilter) : students)
                        ).length === 0 ? (
                          <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                            <Users className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold">등록된 학생이 없어요!</p>
                          </div>
                        ) : (
                          (talentGiftListMode === 'loggedIn'
                            ? students.filter(s => loggedInStudents.some(l => l.name === s.name))
                            : (selectedClassFilter ? students.filter(s => s.classId === selectedClassFilter) : students)
                          ).map(student => {
                            const studentClass = classes.find(c => c.id === student.classId);
                            return (
                              <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white border-2 border-slate-50 rounded-3xl hover:border-amber-100 transition-all group shadow-sm gap-4">
                                <div className="flex items-center gap-4 min-w-0">
                                  <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 font-black text-xl shrink-0">
                                    {student.name.charAt(0)}
                                  </div>
                                  <span className="font-black text-lg sm:text-xl text-slate-700 truncate">{student.name}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {isAdmin ? (
                                    <>
                                      <select value={pendingClassAssign?.studentId === student.id ? (pendingClassAssign.classId ?? '') : (student.classId ?? '')} onChange={(e) => setPendingClassAssign({ studentId: student.id, classId: e.target.value || null })} className="px-3 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 text-sm focus:border-amber-400 focus:outline-none">
                                        <option value="">미배정</option>
                                        {classes.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                      </select>
                                      {pendingClassAssign?.studentId === student.id && (
                                        <button onClick={() => { assignStudentToClass(pendingClassAssign.studentId, pendingClassAssign.classId); setPendingClassAssign(null); }} className="px-3 py-2 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600">보내기</button>
                                      )}
                                    </>
                                  ) : (
                                    <span className="font-bold text-slate-600 text-sm px-3 py-1 bg-slate-50 rounded-lg">{studentClass?.name ?? '-'}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100">
                                    <Coins className="w-5 h-5 text-amber-500 fill-amber-500" />
                                    <span className="font-black text-amber-700 tabular-nums">{student.talents}</span>
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <input type="number" min={1} value={giftAmountByStudent[student.id] ?? 1} onChange={(e) => setGiftAmountByStudent(prev => ({ ...prev, [student.id]: Math.max(1, Number(e.target.value) || 1) }))} placeholder={churchConfig.currencyName} className="w-14 sm:w-16 px-2 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 text-sm focus:border-amber-400 focus:outline-none" />
                                    <button onClick={() => { const amt = Math.max(1, giftAmountByStudent[student.id] ?? 1); giveTalentToStudent(student.id, amt); }} className="min-w-[3.5rem] px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-base hover:bg-amber-600">부여</button>
                                    <button onClick={() => giveTalentToStudent(student.id, 1)} className="p-2 bg-sky-100 text-sky-600 rounded-xl hover:bg-sky-500 hover:text-white transition-all" title={`+1 ${churchConfig.currencyName}`}>
                                      <PlusCircle className="w-6 h-6" />
                                    </button>
                                    <button onClick={() => resetStudentTalents(student.id)} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-300 transition-all font-bold text-xs" title="0으로 초기화">0</button>
                                    <button onClick={() => deleteStudent(student.id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                      <UserMinus className="w-6 h-6" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                ) : selectedCategory.id === 'shop-admin' ? (
                  <div className="bg-white p-6 sm:p-10 rounded-[40px] shadow-2xl border-4 border-emerald-100 space-y-8">
                    <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                      <input type="text" value={newShopItemName} onChange={(e) => setNewShopItemName(e.target.value)} placeholder="아이템 이름" className="flex-1 min-w-[120px] px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-emerald-400 focus:outline-none" />
                      <input type="text" value={newShopItemIcon} onChange={(e) => setNewShopItemIcon(e.target.value)} placeholder="이모지 (예: ⭐)" className="w-24 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-center focus:border-emerald-400 focus:outline-none" />
                      <input type="number" min={0} value={newShopItemPrice} onChange={(e) => setNewShopItemPrice(Number(e.target.value) || 0)} placeholder="가격" className="w-28 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-emerald-400 focus:outline-none" />
                      <button onClick={() => { addShopItem(newShopItemName, newShopItemIcon, newShopItemPrice); setNewShopItemName(''); setNewShopItemIcon('⭐'); setNewShopItemPrice(30); }} className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all flex items-center gap-2">
                        <PlusCircle className="w-5 h-5" /> 추가
                      </button>
                    </div>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
                      {shopItems.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 text-slate-400 font-bold">등록된 상점 아이템이 없어요. 위에서 추가해 주세요.</div>
                      ) : (
                        shopItems.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-white border-2 border-slate-50 rounded-2xl hover:border-emerald-100 transition-all gap-4">
                            {editingShopItemId === item.id ? (
                              <>
                                <input type="text" value={editShopName} onChange={(e) => setEditShopName(e.target.value)} className="flex-1 px-3 py-2 border rounded-xl font-bold" />
                                <input type="text" value={editShopIcon} onChange={(e) => setEditShopIcon(e.target.value)} className="w-16 px-2 py-2 border rounded-xl text-center" />
                                <input type="number" min={0} value={editShopPrice} onChange={(e) => setEditShopPrice(Number(e.target.value) || 0)} className="w-20 px-2 py-2 border rounded-xl font-bold" />
                                <button onClick={saveEditShopItem} className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm">저장</button>
                                <button onClick={() => setEditingShopItemId(null)} className="px-4 py-2 bg-slate-200 rounded-xl font-bold text-sm">취소</button>
                              </>
                            ) : (
                              <>
                                <span className="text-2xl">{item.icon}</span>
                                <span className="flex-1 font-black text-slate-700">{item.name}</span>
                                <span className="font-black text-amber-600">{item.price} {churchConfig.currencyName}</span>
                                {isAdmin && (
                                  <>
                                    <button onClick={() => startEditShopItem(item)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 text-sm font-bold">수정</button>
                                    <button onClick={() => deleteShopItem(item.id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : selectedCategory.id === 'logged-in-students' ? (
                  <div className="bg-white p-6 sm:p-10 rounded-[40px] shadow-2xl border-4 border-sky-100 space-y-6">
                    <h4 className="text-xl font-black text-slate-800">로그인한 학생 명단</h4>
                    {loggedInStudents.length === 0 ? (
                      <div className="text-center py-16 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                        <Users className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold">Supabase 연동 후, 로그인한 학생 목록이 여기에 표시됩니다.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b-2 border-slate-100">
                              <th className="py-3 px-4 font-black text-slate-600">이름</th>
                              <th className="py-3 px-4 font-black text-slate-600">로그인 시각</th>
                              <th className="py-3 px-4 font-black text-slate-600">반</th>
                              <th className="py-3 px-4 font-black text-slate-600">{churchConfig.currencyName}</th>
                              {isAdmin && <th className="py-3 px-4 font-black text-slate-600">차단</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {loggedInStudents.map(s => {
                              const matched = students.find(st => st.name === s.name);
                              const classObj = matched?.classId ? classes.find(c => c.id === matched.classId) : null;
                              const isBlocked = blockedStudentIds.includes(s.id);
                              return (
                                <tr key={s.id} className={`border-b border-slate-50 ${isBlocked ? 'bg-red-50/50' : ''}`}>
                                  <td className="py-3 px-4 font-bold text-slate-800">{s.name}</td>
                                  <td className="py-3 px-4 text-slate-500 font-medium">{s.loggedInAt ?? '-'}</td>
                                  <td className="py-3 px-4 font-bold text-slate-600">{classObj?.name ?? '-'}</td>
                                  <td className="py-3 px-4 font-black text-amber-600 tabular-nums">{matched != null ? matched.talents : '-'}</td>
                                  {isAdmin && (
                                    <td className="py-3 px-4">
                                      <button type="button" onClick={() => toggleBlockStudent(s.id)} className={`px-3 py-1.5 rounded-xl font-bold text-sm ${isBlocked ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                                        {isBlocked ? '차단 해제' : '차단'}
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : selectedCategory.id === 'class-management' ? (
                  <div className="bg-white p-6 sm:p-10 rounded-[40px] shadow-2xl border-4 border-violet-100 space-y-8">
                    {loggedInStudents.length > 0 && (
                      <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-100">
                        <p className="font-black text-slate-700 text-sm mb-2">지금 로그인한 친구들</p>
                        <div className="flex flex-wrap gap-2">
                          {loggedInStudents.map(s => (
                            <span key={s.id} className="px-3 py-1.5 bg-white rounded-xl font-bold text-slate-600 border border-sky-100">{s.name}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {(() => {
                      const unassignedLoggedIn = loggedInStudents.filter(s => {
                        const st = students.find(st => st.name === s.name);
                        return !st || st.classId == null || st.classId === '';
                      });
                      return unassignedLoggedIn.length > 0 ? (
                        <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-100">
                          <p className="font-black text-slate-700 text-sm mb-2">반에 아직 배정되지 않은 로그인 친구들</p>
                          {classes.length === 0 ? (
                            <p className="text-slate-500 text-sm font-medium">반을 먼저 추가해 주세요.</p>
                          ) : (
                            <div className="space-y-3">
                              {unassignedLoggedIn.map(s => {
                                const selectedId = unassignedSelectedClassId[s.id] ?? '';
                                return (
                                  <div key={s.id} className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-xl border border-amber-200">
                                    <span className="font-bold text-amber-800">{s.name}</span>
                                    <select value={selectedId} onChange={(e) => setUnassignedSelectedClassId(prev => ({ ...prev, [s.id]: e.target.value }))} className="px-3 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 text-sm focus:border-violet-400 focus:outline-none">
                                      <option value="">반 선택</option>
                                      {classes.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                    </select>
                                    <button onClick={() => { if (selectedId) { assignUnassignedToClass(s.name, selectedId); setUnassignedSelectedClassId(prev => { const next = { ...prev }; delete next[s.id]; return next; }); } }} disabled={!selectedId} className="px-4 py-2 bg-violet-500 text-white rounded-xl font-bold text-sm hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">배정</button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ) : null;
                    })()}
                    <h4 className="text-xl font-black text-slate-800">반 목록</h4>
                    {isAdmin && (
                      <div className="flex gap-2 flex-wrap">
                        <input type="text" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="반 이름 (예: 1반)" className="flex-1 min-w-[120px] px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-violet-400 focus:outline-none" />
                        <button onClick={() => { addClass(newClassName); setNewClassName(''); }} className="px-6 py-3 bg-violet-500 text-white rounded-2xl font-black hover:bg-violet-600 transition-all flex items-center gap-2">
                          <Plus className="w-5 h-5" /> 추가
                        </button>
                      </div>
                    )}
                    <div className="grid gap-3">
                      {classes.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 text-slate-400 font-bold">등록된 반이 없어요. {isAdmin ? '위에서 반을 추가해 주세요.' : '관리자가 반을 추가하면 여기에 표시됩니다.'}</div>
                      ) : (
                        classes.map(c => (
                          <div key={c.id} className="flex items-center justify-between p-4 bg-white border-2 border-slate-50 rounded-2xl hover:border-violet-100 transition-all gap-4">
                            {editingClassId === c.id && isAdmin ? (
                              <>
                                <input type="text" value={editClassName} onChange={(e) => setEditClassName(e.target.value)} className="flex-1 px-4 py-2 border-2 border-violet-200 rounded-xl font-bold" />
                                <button onClick={() => { updateClass(c.id, editClassName); setEditingClassId(null); setEditClassName(''); }} className="px-4 py-2 bg-violet-500 text-white rounded-xl font-bold text-sm">저장</button>
                                <button onClick={() => { setEditingClassId(null); setEditClassName(''); }} className="px-4 py-2 bg-slate-200 rounded-xl font-bold text-sm">취소</button>
                              </>
                            ) : (
                              <>
                                <span className="font-black text-slate-700">{c.name}</span>
                                {isAdmin && (
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => { setEditingClassId(c.id); setEditClassName(c.name); }} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-violet-100 text-sm font-bold"><Pencil className="w-4 h-4" /></button>
                                    <button onClick={() => deleteClass(c.id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    {isAdmin && students.length > 0 && (
                      <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h4 className="text-lg font-black text-slate-800">학생 반 배정</h4>
                        <div className="grid gap-3 max-h-[280px] overflow-y-auto scrollbar-hide">
                          {students.map(s => (
                            <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl gap-4">
                              <span className="font-bold text-slate-700">{s.name}</span>
                              <div className="flex items-center gap-2">
                                <select value={pendingClassAssign?.studentId === s.id ? (pendingClassAssign.classId ?? '') : (s.classId ?? '')} onChange={(e) => setPendingClassAssign({ studentId: s.id, classId: e.target.value || null })} className="px-3 py-2 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-700 focus:border-violet-400 focus:outline-none">
                                  <option value="">미배정</option>
                                  {classes.map(cl => (<option key={cl.id} value={cl.id}>{cl.name}</option>))}
                                </select>
                                {pendingClassAssign?.studentId === s.id && (
                                  <button onClick={() => { assignStudentToClass(pendingClassAssign.studentId, pendingClassAssign.classId); setPendingClassAssign(null); }} className="px-3 py-2 bg-violet-500 text-white rounded-xl font-bold text-sm hover:bg-violet-600">확인</button>
                                )}
                                <button onClick={() => { if (pendingClassAssign?.studentId === s.id) setPendingClassAssign(null); deleteStudent(s.id); }} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all" title="명단에서 삭제"><UserMinus className="w-5 h-5" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : selectedCategory.id === 'church-settings' ? (
                  <div className="bg-white p-6 sm:p-10 rounded-[40px] shadow-2xl border-4 border-gray-100 space-y-8">
                    <h4 className="text-xl font-black text-slate-800 flex items-center gap-2"><Settings className="w-6 h-6 text-gray-500" /> 교회 설정</h4>

                    <div className="space-y-4">
                      <h5 className="font-black text-slate-700">기본 정보</h5>
                      <div className="grid gap-3">
                        <div>
                          <label className="text-sm font-bold text-slate-500 mb-1 block">교회 이름</label>
                          <input type="text" value={churchConfig.churchName} onChange={(e) => updateChurchConfig({ ...churchConfig, churchName: e.target.value })} placeholder="예: 새빛교회" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-sky-400 focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-500 mb-1 block">부서 이름</label>
                          <input type="text" value={churchConfig.departmentName} onChange={(e) => updateChurchConfig({ ...churchConfig, departmentName: e.target.value })} placeholder="예: 드림아동부" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-sky-400 focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-500 mb-1 block">행사 이름</label>
                          <input type="text" value={churchConfig.eventName} onChange={(e) => updateChurchConfig({ ...churchConfig, eventName: e.target.value })} placeholder="예: 2026 여름성경학교" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-sky-400 focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h5 className="font-black text-slate-700">비밀번호 관리</h5>
                      <div className="grid gap-4">
                        <div className="p-4 bg-slate-800 rounded-2xl space-y-2">
                          <label className="text-sm font-black text-white flex items-center gap-2"><Lock className="w-4 h-4" /> 관리자 비밀번호</label>
                          <input type="text" value={churchConfig.adminPassword} onChange={(e) => { const newPw = e.target.value; updateChurchConfig({ ...churchConfig, adminPassword: newPw }); localStorage.setItem('church_admin_session', newPw); }} className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl font-bold focus:border-sky-400 focus:outline-none text-center text-lg tracking-widest" />
                          <p className="text-xs text-slate-400">변경 시 즉시 적용됩니다</p>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-2xl space-y-2 border-2 border-indigo-100">
                          <label className="text-sm font-black text-indigo-700 flex items-center gap-2"><KeyRound className="w-4 h-4" /> 교사 비밀번호</label>
                          <input type="text" value={churchConfig.teacherPassword} onChange={(e) => updateChurchConfig({ ...churchConfig, teacherPassword: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-2xl font-bold focus:border-indigo-400 focus:outline-none text-center text-lg tracking-widest" />
                          <p className="text-xs text-indigo-400">교사 전용실 입장용</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h5 className="font-black text-slate-700">보상 시스템</h5>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="text-sm font-bold text-slate-500 mb-1 block">보상 명칭</label>
                          <input type="text" value={churchConfig.currencyName} onChange={(e) => updateChurchConfig({ ...churchConfig, currencyName: e.target.value })} placeholder="예: 달란트" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-sky-400 focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-500 mb-1 block">초기 지급량</label>
                          <input type="number" value={churchConfig.initialCurrency} onChange={(e) => updateChurchConfig({ ...churchConfig, initialCurrency: Math.max(0, Number(e.target.value) || 0) })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-sky-400 focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-sm font-bold text-slate-500 mb-1 block">첫 로그인 보너스</label>
                          <input type="number" value={churchConfig.firstLoginBonus} onChange={(e) => updateChurchConfig({ ...churchConfig, firstLoginBonus: Math.max(0, Number(e.target.value) || 0) })} className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-sky-400 focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <h5 className="font-black text-slate-700">선생님 목록</h5>
                        <button onClick={() => {
                          const name = prompt('선생님 이름을 입력하세요:');
                          if (!name?.trim()) return;
                          const kakaoLink = prompt('카카오톡 오픈채팅 링크를 입력하세요 (선택):') || '';
                          const newTeacher: Teacher = { id: Date.now().toString(), name: name.trim(), kakaoLink };
                          updateTeachers([...teachers, newTeacher]);
                        }} className="px-4 py-2 bg-sky-500 text-white rounded-2xl font-bold text-sm hover:bg-sky-600 flex items-center gap-2"><UserPlus className="w-4 h-4" /> 추가</button>
                      </div>
                      {teachers.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 text-slate-400 font-bold">등록된 선생님이 없어요. 추가 버튼을 눌러 선생님을 등록하세요.</div>
                      ) : (
                        <div className="grid gap-3">
                          {teachers.map(t => (
                            <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl gap-4">
                              <div className="min-w-0">
                                <p className="font-black text-slate-700">{t.name}</p>
                                {t.kakaoLink && <p className="text-sm text-sky-500 font-medium truncate">{t.kakaoLink}</p>}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => {
                                  const name = prompt('이름 수정:', t.name);
                                  if (!name?.trim()) return;
                                  const kakaoLink = prompt('카카오톡 링크 수정:', t.kakaoLink) ?? t.kakaoLink;
                                  updateTeachers(teachers.map(x => x.id === t.id ? { ...x, name: name.trim(), kakaoLink } : x));
                                }} className="p-2 bg-white text-slate-600 rounded-xl hover:bg-sky-100 border border-slate-200"><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => {
                                  if (!confirm(`${t.name} 선생님을 삭제할까요?`)) return;
                                  updateTeachers(teachers.filter(x => x.id !== t.id));
                                }} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      <h5 className="font-black text-slate-700 flex items-center gap-2"><CloudUpload className="w-5 h-5 text-blue-500" /> Google Drive 자료 관리</h5>
                      {connectionMode === 'cloud' ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            <div>
                              <p className="font-black text-green-700">Cloud 모드 - Google Drive 자동 연결</p>
                              <p className="text-sm font-bold text-green-600">Apps Script를 통해 자료가 관리됩니다</p>
                            </div>
                          </div>
                          <button onClick={refreshDriveMaterials} disabled={gDriveLoading} className="px-4 py-2 bg-sky-50 text-sky-600 rounded-2xl font-bold text-sm hover:bg-sky-100 flex items-center gap-1">
                            <RefreshCw className={`w-4 h-4 ${gDriveLoading ? 'animate-spin' : ''}`} /> 자료 새로고침
                          </button>
                        </div>
                      ) : gDriveState.isSignedIn ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            <div>
                              <p className="font-black text-green-700">연결됨</p>
                              <p className="text-sm font-bold text-green-600">{gDriveState.userEmail}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={refreshDriveMaterials} disabled={gDriveLoading} className="px-4 py-2 bg-sky-50 text-sky-600 rounded-2xl font-bold text-sm hover:bg-sky-100 flex items-center gap-1">
                              <RefreshCw className={`w-4 h-4 ${gDriveLoading ? 'animate-spin' : ''}`} /> 자료 새로고침
                            </button>
                            <button onClick={disconnectGoogleDrive} className="px-4 py-2 bg-red-50 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-100">
                              연결 해제
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={connectGoogleDrive} disabled={gDriveLoading} className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-black hover:bg-blue-600 transition-all flex items-center gap-2">
                          {gDriveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CloudUpload className="w-5 h-5" />} Google Drive 연결
                        </button>
                      )}
                      <p className="text-xs text-slate-400 font-bold">{connectionMode === 'cloud' ? '교사 라운지 자료 카테고리에서 자료를 올리고 내릴 수 있습니다.' : '교사 자료를 Google Drive에 영구 저장합니다. 관리자만 연결하면 됩니다.'}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <button onClick={() => {
                        setSetupStep(1);
                        setSetupConfig({ ...churchConfig });
                        setShowSetupWizard(true);
                        setSelectedAdminCategory(null);
                      }} className="w-full px-6 py-3 bg-slate-700 text-white rounded-2xl font-black hover:bg-slate-800 flex items-center justify-center gap-2 transition-all"><Settings className="w-5 h-5" /> 초기 설정 마법사 다시 열기</button>
                      <button onClick={() => {
                        const pw = prompt('관리자 비밀번호를 입력하세요:');
                        if (pw !== churchConfig.adminPassword) { alert('비밀번호가 틀렸습니다.'); return; }
                        if (!confirm('정말 모든 데이터(학생, 반, 보상, 미션 등)를 초기화할까요? 교회 설정은 유지됩니다.')) return;
                        ['church_students','church_classes','church_talents','church_missions','church_stickers','church_shop_items','church_challenges','church_completed_challenges','church_pending_missions','church_blocked_students','church_logged_in_students','church_user_name','church_first_login_done'].forEach(k => localStorage.removeItem(k));
                        if (connectionMode === 'cloud' && apiUrl) { gasPost(apiUrl, { action: 'resetData' }).catch(console.error); }
                        window.location.reload();
                      }} className="w-full px-6 py-3 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 flex items-center justify-center gap-2"><RefreshCw className="w-5 h-5" /> 데이터 초기화</button>
                    </div>
                  </div>
                ) : MATERIAL_CATEGORY_IDS.includes(selectedCategory.id) ? (
                  <div className="bg-white p-6 sm:p-10 rounded-[40px] shadow-2xl border-4 border-slate-100 space-y-6">
                    <input ref={materialFileInputRef} type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,.hwp,image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadMaterial(selectedCategory.id, f); e.target.value = ''; }} />
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <h4 className="text-xl font-black text-slate-800">다운로드할 자료</h4>
                      <div className="flex items-center gap-2">
                        {gDriveLoading && <Loader2 className="w-5 h-5 animate-spin text-sky-500" />}
                        {gDriveState.isSignedIn && (
                          <button onClick={refreshDriveMaterials} disabled={gDriveLoading} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 flex items-center gap-1" title="새로고침">
                            <RefreshCw className={`w-4 h-4 ${gDriveLoading ? 'animate-spin' : ''}`} />
                          </button>
                        )}
                        {isAdmin && activeTab === 'admin' && (
                          <button onClick={() => materialFileInputRef.current?.click()} disabled={gDriveLoading} className="px-6 py-3 bg-sky-500 text-white rounded-2xl font-black hover:bg-sky-600 transition-all flex items-center gap-2">
                            <CloudUpload className="w-5 h-5" /> 자료 올리기
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Google Drive 자료 */}
                    {(gDriveMaterials[selectedCategory.id] || []).length > 0 && (
                      <div className="grid gap-3">
                        {(gDriveMaterials[selectedCategory.id] || []).map((m) => (
                          <div key={m.id} className="flex items-center justify-between gap-4 p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-2xl font-bold text-slate-700 transition-all">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <CloudUpload className="w-4 h-4 text-blue-500 shrink-0" />
                              <span className="truncate">{m.name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <a href={m.webContentLink || `https://drive.google.com/uc?export=download&id=${m.id}`} target="_blank" rel="noopener noreferrer" download={m.name} className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl font-black hover:bg-sky-600 transition-all">
                                <Download className="w-5 h-5" /> 다운로드
                              </a>
                              {m.webViewLink && (
                                <a href={m.webViewLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all text-sm">
                                  <ExternalLink className="w-4 h-4" /> 보기
                                </a>
                              )}
                              {isAdmin && activeTab === 'admin' && gDriveState.isSignedIn && (
                                <button onClick={() => handleDeleteDriveFile(selectedCategory.id, m.id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shrink-0" title="삭제">
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* 로컬 자료 (기존 static + blob) */}
                    {(materialsList[selectedCategory.id] || []).length > 0 && (
                      <div className="grid gap-3">
                        {(materialsList[selectedCategory.id] || []).map((m, i) => (
                          <div key={i} className="flex items-center justify-between gap-4 p-4 bg-slate-50 hover:bg-sky-50 border-2 border-slate-100 hover:border-sky-200 rounded-2xl font-bold text-slate-700 transition-all">
                            <span className="flex-1 min-w-0 truncate">{m.name}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <a href={m.file.startsWith('blob:') ? m.file : `/materials/${m.file}`} download={m.name} className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl font-black hover:bg-sky-600 transition-all">
                                <Download className="w-5 h-5" /> 다운로드
                              </a>
                              {isAdmin && activeTab === 'admin' && (
                                <button onClick={() => deleteMaterial(selectedCategory.id, i)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shrink-0" title="삭제">
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* 빈 상태 */}
                    {(materialsList[selectedCategory.id] || []).length === 0 && (gDriveMaterials[selectedCategory.id] || []).length === 0 && (
                      <div className="text-center py-16 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                        <FileText className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold">
                          {activeTab === 'admin' && gDriveState.isSignedIn
                            ? '등록된 자료가 없어요. "자료 올리기" 버튼으로 Google Drive에 업로드하세요.'
                            : '등록된 자료가 없어요. 관리자가 관리자 전용실에서 자료를 업로드할 수 있어요.'}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white p-20 rounded-[40px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-8 bg-slate-50 rounded-full text-slate-200">
                      <selectedCategory.Icon className="w-20 h-20" />
                    </div>
                    <div className="max-w-xs">
                      <h4 className="text-2xl font-black text-slate-800 mb-2">준비 중인 공간</h4>
                      <p className="text-slate-400 font-bold leading-relaxed">선생님, 이 카테고리의 실제 자료는 곧 업데이트될 예정이에요!</p>
                    </div>
                  </div>
                )}
                </div>
              )}
            </main>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex items-center gap-4"><button onClick={resetView} className="p-3 transition-colors bg-white shadow-sm rounded-2xl hover:bg-slate-50"><ChevronLeft className="w-6 h-6" /></button><div className="flex-1">
              <h2 className="flex items-center gap-2 text-2xl font-black">
                <span className={`${selectedTopic?.color} p-1.5 rounded-lg text-white shadow-sm`}>
                  {selectedTopic && React.createElement(selectedTopic.Icon, { className: "w-6 h-6" })}
                </span>
                {selectedTopic?.title}
              </h2>
            </div></div>
            <div className="flex p-1.5 bg-white border shadow-md rounded-3xl border-slate-100 overflow-x-auto scrollbar-hide">
              <button onClick={() => setActiveTab('info')} className={`flex-1 min-w-[100px] py-4 rounded-2xl flex items-center justify-center gap-2 font-black transition-all ${activeTab === 'info' ? 'bg-sky-100 text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}><BookMarked className="w-5 h-5" /> 말씀 배움터</button>
              <button onClick={() => setActiveTab('deep')} className={`flex-1 min-w-[100px] py-4 rounded-2xl flex items-center justify-center gap-2 font-black transition-all ${activeTab === 'deep' ? 'bg-sky-100 text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}><Lightbulb className="w-5 h-5" /> 한 걸음 더!</button>
              <button onClick={() => { setActiveTab('meaning'); }} className={`flex-1 min-w-[100px] py-4 rounded-2xl flex items-center justify-center gap-2 font-black transition-all ${activeTab === 'meaning' ? 'bg-sky-100 text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}><Footprints className="w-5 h-5" /> 믿음의 실천</button>
            </div>
            
            <div className="min-h-[400px]">
              {activeTab === 'info' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-8 space-y-8 bg-white border shadow-2xl rounded-[40px] border-sky-50">
                    <div className="p-8 border-l-8 bg-amber-50 rounded-3xl border-amber-400 relative overflow-hidden"><Star className="absolute -top-4 -right-4 w-16 h-16 text-amber-200 fill-amber-100 opacity-50" /><h4 className="flex items-center gap-2 mb-3 font-black text-amber-800 text-lg uppercase tracking-wider"><Award className="w-6 h-6" /> 오늘의 보석 말씀</h4><p className="text-2xl font-bold italic leading-relaxed text-amber-900">"{selectedTopic?.verse}"</p></div>
                    <div className="space-y-4"><h4 className="text-2xl font-black text-slate-800 flex items-center gap-2"><BookOpen className="w-6 h-6 text-sky-500" /> 어떤 내용인가요?</h4><p className="text-xl leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">{selectedTopic?.coreContent}</p></div>
                    <button onClick={() => startQuiz(selectedTopic?.id)} className="w-full mt-6 py-6 bg-amber-400 text-white rounded-[32px] font-black text-2xl shadow-lg shadow-amber-100 hover:bg-amber-500 transition-all flex flex-col items-center justify-center gap-1 active:scale-95"><span className="flex items-center gap-3"><Trophy className="w-8 h-8" /> 이 주제 퀴즈 도전하기!</span><span className="text-sm font-bold text-amber-100">완료 시 1 {churchConfig.currencyName}</span></button>
                  </div>
                </div>
              )}
              {activeTab === 'deep' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-8 bg-white border shadow-2xl rounded-[40px] border-sky-50"><div className="space-y-4"><h4 className="text-2xl font-black text-slate-800 flex items-center gap-2"><Lightbulb className="w-6 h-6 text-yellow-500" /> 더 깊이 알아볼까요?</h4><p className="text-xl leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">{selectedTopic?.deepContent}</p></div></div>
                </div>
              )}
              {activeTab === 'meaning' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-8 space-y-8 bg-white border shadow-2xl rounded-[40px] border-sky-50">
                    <div className="space-y-4"><h4 className="text-2xl font-black text-slate-800 flex items-center gap-2"><Heart className="w-6 h-6 text-red-500" /> 나에게 주는 의미</h4><p className="text-xl leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">{selectedTopic?.meaningContent}</p></div>
                    <div className="pt-6 space-y-6 border-t border-slate-100">
                      <div className="flex items-center justify-between"><h4 className="text-2xl font-black text-slate-800 flex items-center gap-2"><Gamepad2 className="w-6 h-6 text-sky-500" /> 오늘의 미션!</h4><div className="text-sm font-black text-amber-600 bg-amber-100 px-4 py-2 rounded-full border border-amber-200 shadow-sm flex items-center gap-1"><Coins className="w-4 h-4 fill-amber-500 text-amber-500" /> 선생님 확인 후 3 {churchConfig.currencyName}</div></div>
                      <div className="grid gap-4">
                        {selectedTopic?.missions.map((m, i) => {
                          const missionId = `${selectedTopic?.id}-m-${i}`;
                          const isDone = completedMissions.includes(missionId);
                          return (
                            <label key={i} className={`flex items-center gap-5 p-6 border-2 cursor-pointer rounded-[32px] transition-all ${isDone ? 'bg-sky-50 border-sky-200 opacity-80 scale-[0.98]' : 'bg-white border-slate-100 shadow-md'}`}>
                              <input type="checkbox" checked={isDone} onChange={() => toggleMission(missionId)} className="w-8 h-8 text-sky-500 rounded-xl" /><span className={`font-bold text-xl ${isDone ? 'text-sky-900 line-through opacity-60' : 'text-slate-700'}`}>{m}</span>
                              {isDone && <CheckCircle2 className="w-8 h-8 text-sky-500 ml-auto animate-in zoom-in" />}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>}

      <footer className="px-6 mt-16 text-center pb-20 space-y-5">
        <div className="inline-flex flex-col items-center gap-2">
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-800 via-sky-600 to-slate-800 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]" style={{fontFamily: "'Trebuchet MS', 'Arial Black', sans-serif"}}>
            TRINITY AI FORUM
          </h3>
          <style>{`@keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }`}</style>
        </div>
        <p className="text-sm font-bold text-slate-400 tracking-widest" style={{fontFamily: "'Trebuchet MS', sans-serif"}}>© 2026 Developed by Yijae Shin</p>
      </footer>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
