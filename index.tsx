
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
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
  UserMinus
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

type Topic = {
  id: string;
  title: string;
  subTitle: string;
  Icon: React.ElementType;
  color: string;
  verse: string;
  summary?: string;
  coreContent: string;
  deepContent: string;
  meaningContent: string;
  missions: string[];
};

type QuizQuestion = {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

type TeacherCategory = {
  id: string;
  name: string;
  Icon: React.ElementType;
  color: string;
  description: string;
};

type Student = {
  id: string;
  name: string;
  talents: number;
};

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
  { id: 'talent-gifts', name: '달란트 선물 명단', Icon: Gift, color: 'bg-amber-500', description: '학생별 달란트 관리 및 시상 현황' },
];

const STICKERS = [
  { id: 'sticker-1', name: '기쁨의 별', icon: '⭐', price: 30 },
  { id: 'sticker-2', name: '사랑의 하트', icon: '❤️', price: 50 },
  { id: 'sticker-3', name: '믿음의 방패', icon: '🛡️', price: 100 },
  { id: 'sticker-4', name: '성령의 비둘기', icon: '🕊️', price: 150 },
  { id: 'sticker-5', name: '천국의 열쇠', icon: '🔑', price: 200 },
];

const App: React.FC = () => {
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('dream_user_name') || '');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState('');
  
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState(false);
  const [showTeacherAuthModal, setShowTeacherAuthModal] = useState(false);
  const [teacherPassword, setTeacherPassword] = useState('');
  const [selectedTeacherCategory, setSelectedTeacherCategory] = useState<TeacherCategory | null>(null);

  // 교사 라운지 학생 명단 상태
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('dream_students');
    return saved ? JSON.parse(saved) : [];
  });
  const [newStudentName, setNewStudentName] = useState('');

  const [talents, setTalents] = useState<number>(() => {
    const saved = localStorage.getItem('dream_talents');
    return saved ? parseInt(saved) : 100;
  });
  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    const saved = localStorage.getItem('dream_missions');
    return saved ? JSON.parse(saved) : [];
  });
  const [ownedStickers, setOwnedStickers] = useState<string[]>(() => {
    const saved = localStorage.getItem('dream_stickers');
    return saved ? JSON.parse(saved) : [];
  });

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

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'deep' | 'meaning' | 'shop' | 'teacher'>('info');

  useEffect(() => {
    localStorage.setItem('dream_talents', talents.toString());
  }, [talents]);

  useEffect(() => {
    localStorage.setItem('dream_missions', JSON.stringify(completedMissions));
  }, [completedMissions]);

  useEffect(() => {
    localStorage.setItem('dream_stickers', JSON.stringify(ownedStickers));
  }, [ownedStickers]);

  useEffect(() => {
    localStorage.setItem('dream_user_name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('dream_students', JSON.stringify(students));
  }, [students]);

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

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setShowNamePrompt(false);
    } else {
      alert("이름을 입력해주세요!");
    }
  };

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      setUserName('');
      setIsTeacherAuthenticated(false);
      localStorage.removeItem('dream_user_name');
    }
  };

  const addTalents = (amount: number) => {
    setTalents(prev => prev + amount);
  };

  const toggleMission = (missionId: string) => {
    if (completedMissions.includes(missionId)) {
      setCompletedMissions(prev => prev.filter(id => id !== missionId));
      addTalents(-3);
    } else {
      setCompletedMissions(prev => [...prev, missionId]);
      addTalents(3);
    }
  };

  const buySticker = (stickerId: string, price: number) => {
    if (ownedStickers.includes(stickerId)) return;
    if (talents < price) {
      alert("달란트가 부족해요!");
      return;
    }
    setTalents(prev => prev - price);
    setOwnedStickers(prev => [...prev, stickerId]);
  };

  const handleTeacherLoungeClick = () => {
    if (isTeacherAuthenticated) {
      setActiveTab('teacher');
      setSelectedTopic(null);
    } else {
      setShowTeacherAuthModal(true);
    }
  };

  const verifyTeacherPassword = () => {
    if (teacherPassword === '1004') {
      setIsTeacherAuthenticated(true);
      setShowTeacherAuthModal(false);
      setActiveTab('teacher');
      setSelectedTopic(null);
      setTeacherPassword('');
    } else {
      alert("비밀번호가 틀렸어요!");
      setTeacherPassword('');
    }
  };

  const resetView = () => {
    setSelectedTopic(null);
    setSelectedTeacherCategory(null);
    setActiveTab('info');
    setIsQuizMode(false);
    setIsQuizFinished(false);
    setCurrentQuizIndex(0);
    setUserAnswers({});
    setShowFeedback(false);
    setCurrentVerseText(null);
    setIsVerseShowing(false);
  };

  const startQuiz = (topicId?: string) => {
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
      talents: 0
    };
    setStudents(prev => [...prev, newStudent]);
    setNewStudentName('');
  };

  const deleteStudent = (id: string) => {
    if (confirm("정말 이 학생을 명단에서 삭제할까요?")) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const giveTalentToStudent = (id: string, amount: number) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, talents: s.talents + amount } : s));
  };

  const giveBulkTalents = () => {
    if (students.length === 0) return;
    if (confirm("모든 학생에게 1 달란트씩 선물할까요?")) {
      setStudents(prev => prev.map(s => ({ ...s, talents: s.talents + 1 })));
    }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden text-slate-800 bg-sky-50/50">
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

      {/* Teacher Auth Modal */}
      {showTeacherAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-6">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-[340px] space-y-5 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg"><Lock className="w-8 h-8" /></div>
              <h3 className="text-xl font-black text-slate-900">선생님 전용실</h3>
              <p className="text-slate-500 font-bold text-sm">비밀번호를 입력해 주세요!</p>
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
              <button onClick={() => setShowTeacherAuthModal(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-500 rounded-[20px] font-bold hover:bg-slate-200 transition-colors">취소</button>
              <button onClick={verifyTeacherPassword} className="flex-2 py-3.5 bg-slate-800 text-white rounded-[20px] font-black shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all active:scale-95">입장하기</button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md shadow-sm border-b border-sky-100">
        <div className="flex items-center gap-3 cursor-pointer" onClick={resetView}>
          <div className="p-2 text-white bg-sky-400 rounded-xl shadow-sky-200 shadow-lg"><Sparkles className="w-6 h-6" /></div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black leading-none text-sky-900">2026 Dream Bible</h1>
            <div className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-500" />
              <p className="text-[10px] font-black text-sky-600 uppercase tracking-wider">교리 퀴즈 대정복</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-amber-100 border-2 border-amber-200 rounded-2xl shadow-sm">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
            <span className="font-black text-amber-700 tabular-nums text-sm sm:text-base">{talents}</span>
          </div>
          <button onClick={() => { resetView(); setActiveTab('shop'); }} className={`p-2 rounded-xl transition-colors ${activeTab === 'shop' ? 'bg-sky-500 text-white' : 'bg-sky-100 text-sky-600 hover:bg-sky-200'}`}><ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" /></button>
          {!userName ? (
            <button onClick={() => setShowNamePrompt(true)} className="p-2 bg-sky-100 text-sky-500 rounded-xl hover:bg-sky-200"><User className="w-5 h-5" /></button>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-1">
              <span className="text-xs font-black text-sky-700 hidden md:block">{userName} 어린이</span>
              <button onClick={handleLogout} className="p-1.5 text-slate-300 hover:text-slate-500"><LogOut className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl p-6 mx-auto">
        {isQuizMode ? (
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
        ) : !selectedTopic && activeTab !== 'teacher' ? (
          activeTab === 'shop' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center gap-4"><button onClick={resetView} className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"><ChevronLeft className="w-6 h-6" /></button><h2 className="text-3xl font-black text-slate-800">달란트 상점</h2></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {STICKERS.map(sticker => {
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
          ) : (
            <div className="space-y-12 animate-in fade-in duration-700">
              <div className="space-y-4 text-center pt-8">
                <div className="inline-block px-6 py-2 bg-amber-100 text-amber-600 rounded-full font-black text-sm mb-2 shadow-sm border border-amber-200">🏆 성경 퀴즈대회 완벽 대비!</div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-sky-900 leading-tight">2026 드림아동부<br/><span className="text-sky-500 relative inline-block">교리성경공부<span className="absolute bottom-0 left-0 w-full h-3 bg-sky-200/50 -z-10 rounded-full"></span></span></h2>
                <p className="text-slate-500 font-bold text-xl md:text-2xl">(초등부 어린이 조직신학)</p>
              </div>
              
              <button 
                onClick={() => startQuiz()} 
                className="w-full relative group overflow-hidden bg-gradient-to-r from-amber-400 to-amber-600 p-8 md:p-10 rounded-[48px] shadow-2xl shadow-amber-100 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:scale-[1.02] active:scale-95 text-white"
              >
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-10 group-hover:scale-110 transition-transform"><Trophy className="w-64 h-64" /></div>
                <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                  <div className="w-20 h-20 bg-white/20 rounded-[32px] flex items-center justify-center backdrop-blur-md shadow-inner">
                    <Gamepad2 className="w-10 h-10" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-3xl font-black mb-2 tracking-tight">교리퀴즈 전체 도전</h3>
                    <p className="font-bold opacity-90 text-amber-50 text-lg">모든 주제의 문제를 랜덤하게 풀어보세요!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/20 px-8 py-4 rounded-[28px] font-black text-xl backdrop-blur-md border border-white/30 relative z-10 group-hover:bg-white group-hover:text-amber-600 transition-all shadow-lg">
                  전체 도전 시작 <Zap className="w-5 h-5 fill-current" />
                </div>
              </button>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {THEOLOGY_TOPICS.map((topic) => (
                  <button key={topic.id} onClick={() => setSelectedTopic(topic)} className="relative flex flex-col items-center gap-4 p-8 transition-all duration-300 bg-white border-2 border-transparent group rounded-[40px] shadow-lg hover:shadow-2xl hover:border-sky-200 overflow-hidden text-center">
                    <div className={`p-6 rounded-3xl ${topic.color} text-white group-hover:scale-110 transition-transform shadow-lg shadow-sky-100`}><topic.Icon className="w-10 h-10" /></div>
                    <div><h3 className="text-xl font-black">{topic.title}</h3><p className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-1">{topic.subTitle}</p></div>
                    <div className="absolute top-0 right-0 p-4 transition-opacity opacity-5 group-hover:opacity-10"><topic.Icon className="w-16 h-16" /></div>
                  </button>
                ))}
                <button onClick={handleTeacherLoungeClick} className="relative flex flex-col items-center gap-4 p-8 transition-all duration-300 bg-slate-800 border-2 border-transparent group rounded-[40px] shadow-lg hover:shadow-2xl hover:bg-slate-900 overflow-hidden text-center">
                  <div className="p-6 rounded-3xl bg-slate-600 text-white group-hover:scale-110 transition-transform shadow-lg">{isTeacherAuthenticated ? <Library className="w-10 h-10" /> : <Lock className="w-10 h-10" />}</div>
                  <div><h3 className="text-xl font-black text-white">교사 전용실</h3><p className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-1">자료 관리 & 스테이션</p></div>
                  {!isTeacherAuthenticated && <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 p-2 rounded-xl shadow-lg animate-pulse"><KeyRound className="w-4 h-4" /></div>}
                </button>
              </div>
            </div>
          )
        ) : activeTab === 'teacher' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            {!selectedTeacherCategory ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4"><button onClick={resetView} className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"><ChevronLeft className="w-6 h-6" /></button><div><h2 className="text-3xl font-black text-slate-800">드림 교사 라운지</h2><p className="text-slate-400 font-bold text-sm">성경학교 준비를 위한 자료실입니다.</p></div></div>
                  <button onClick={() => { setIsTeacherAuthenticated(false); resetView(); }} className="p-4 bg-slate-800 text-white rounded-2xl shadow-lg hover:bg-slate-900 transition-all flex items-center gap-2 font-bold"><Lock className="w-5 h-5" /> 라운지 잠금</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {TEACHER_CATEGORIES.map((cat) => (
                    <button key={cat.id} onClick={() => setSelectedTeacherCategory(cat)} className="relative flex flex-col items-start gap-6 p-8 text-left transition-all duration-300 bg-white border-2 border-transparent group rounded-[40px] shadow-lg hover:shadow-2xl hover:border-slate-200 overflow-hidden">
                      <div className={`p-5 rounded-3xl ${cat.color} text-white group-hover:scale-110 transition-transform shadow-lg`}><cat.Icon className="w-8 h-8" /></div>
                      <div className="space-y-2"><h3 className="text-xl font-black text-slate-800 leading-tight">{cat.name}</h3><p className="text-sm font-bold text-slate-400">{cat.description}</p></div>
                      <div className="absolute top-0 right-0 p-4 transition-opacity opacity-5 group-hover:opacity-10"><cat.Icon className="w-20 h-20" /></div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedTeacherCategory(null)} className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl ${selectedTeacherCategory.color} text-white`}>
                        <selectedTeacherCategory.Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-800">{selectedTeacherCategory.name}</h2>
                        <p className="text-slate-400 font-bold text-sm">자료를 확인하고 관리하세요.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedTeacherCategory.id === 'talent-gifts' ? (
                  <div className="bg-white p-6 sm:p-10 rounded-[40px] shadow-2xl border-4 border-amber-100 space-y-8">
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
                        <Star className="w-6 h-6" /> 전체 +1 달란트
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-6 py-2 bg-slate-50 rounded-xl text-slate-400 font-black text-sm uppercase tracking-widest">
                        <span>학생 이름</span>
                        <span className="mr-32">달란트 현황</span>
                      </div>
                      <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                        {students.length === 0 ? (
                          <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                            <Users className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold">등록된 학생이 없어요!</p>
                          </div>
                        ) : (
                          students.map(student => (
                            <div key={student.id} className="flex items-center justify-between p-5 bg-white border-2 border-slate-50 rounded-3xl hover:border-amber-100 transition-all group shadow-sm">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 font-black text-xl">
                                  {student.name.charAt(0)}
                                </div>
                                <span className="font-black text-xl text-slate-700">{student.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-2xl border border-amber-100">
                                  <Coins className="w-5 h-5 text-amber-500 fill-amber-500" />
                                  <span className="font-black text-amber-700 tabular-nums">{student.talents}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => giveTalentToStudent(student.id, 1)} className="p-2 bg-sky-100 text-sky-600 rounded-xl hover:bg-sky-500 hover:text-white transition-all">
                                    <PlusCircle className="w-6 h-6" />
                                  </button>
                                  <button onClick={() => deleteStudent(student.id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                    <UserMinus className="w-6 h-6" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-20 rounded-[40px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-8 bg-slate-50 rounded-full text-slate-200">
                      <selectedTeacherCategory.Icon className="w-20 h-20" />
                    </div>
                    <div className="max-w-xs">
                      <h4 className="text-2xl font-black text-slate-800 mb-2">준비 중인 공간</h4>
                      <p className="text-slate-400 font-bold leading-relaxed">선생님, 이 카테고리의 실제 자료는 곧 업데이트될 예정이에요!</p>
                    </div>
                  </div>
                )}
              </div>
            )}
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
                    <button onClick={() => startQuiz(selectedTopic?.id)} className="w-full mt-6 py-6 bg-amber-400 text-white rounded-[32px] font-black text-2xl shadow-lg shadow-amber-100 hover:bg-amber-500 transition-all flex items-center justify-center gap-3 active:scale-95"><Trophy className="w-8 h-8" /> 이 주제 퀴즈 도전하기!</button>
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
                      <div className="flex items-center justify-between"><h4 className="text-2xl font-black text-slate-800 flex items-center gap-2"><Gamepad2 className="w-6 h-6 text-sky-500" /> 오늘의 드림 미션!</h4><div className="text-sm font-black text-amber-600 bg-amber-100 px-4 py-2 rounded-full border border-amber-200 shadow-sm flex items-center gap-1"><Coins className="w-4 h-4 fill-amber-500 text-amber-500" /> 완료 시 3 달란트</div></div>
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
      </main>

      <footer className="px-6 mt-16 space-y-4 text-center pb-20">
        <div className="flex justify-center gap-8 opacity-20 grayscale"><Sparkles className="w-6 h-6" /><Award className="w-6 h-6" /><Star className="w-6 h-6" /><Gamepad2 className="w-6 h-6" /></div>
        <div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-loose">© 2026 Dream Kids Summer Bible School<br/>대한예수교장로회 총회훈련원 교재 기반</p>
          <div className="flex items-center justify-center gap-1 mt-2 text-sky-300 text-xs font-black italic"><Heart className="w-3 h-3 fill-sky-200 text-sky-200" /> 어린이 조직신학 탐험대</div>
        </div>
      </footer>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
