import type { ElementType } from 'react';

export type Topic = {
  id: string;
  title: string;
  subTitle: string;
  Icon: ElementType;
  color: string;
  verse: string;
  summary?: string;
  coreContent: string;
  deepContent: string;
  meaningContent: string;
  missions: string[];
};

export type QuizQuestion = {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type TeacherCategory = {
  id: string;
  name: string;
  Icon: ElementType;
  color: string;
  description: string;
};

export type Class = { id: string; name: string };

export type LoggedInStudent = { id: string; name: string; loggedInAt?: string };

export type Student = {
  id: string;
  name: string;
  talents: number;
  classId?: string | null;
};

export type ShopItem = {
  id: string;
  name: string;
  icon: string;
  price: number;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  talents: number;
  type: 'normal' | 'bet';
};

export type PendingMissionCompletion = {
  id: string;
  studentId: string;
  studentName: string;
  topicId: string;
  topicTitle: string;
  missionId: string;
  missionText: string;
  createdAt: string;
};

export type Teacher = { id: string; name: string; kakaoLink: string };
