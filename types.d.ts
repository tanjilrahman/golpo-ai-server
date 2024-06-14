export interface StoryType {
  id: string;
  chapters: Chapter[];
  images: string[];
  isPublic: boolean;
  authorId: string;
  author: Author;
  createdAt: Date;
  language: string;
  storyType: string;
  readerAge: string;
  writingStyle: string;
  isSuperStory: boolean;
}

export interface StoryOptions {
  language: string;
  storyType: string;
  readerAge: string;
  writingStyle: string;
  isSuperStory: boolean;
}

export interface StoryData {
  imagePrompts: string[];
  chapters: Chapter[] | json;
}

export interface ParsedStory {
  imagePrompts: string[];
  chapter: Chapter;
}

export interface ParsedSuperStory {
  imagePrompt: string;
  chapter: Chapter;
}

export interface Chapter {
  title: string;
  story: string[];
}

export interface ParsedPlotDataType {
  title: string;
  plot: string;
}
