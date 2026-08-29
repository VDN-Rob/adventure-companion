export interface DiaryEntry {
    id: string;
    dayId: string;
  
    title: string;
    text: string | null;
  
    photo1: string | null;
    photo2: string | null;
    photo3: string | null;
  
    createdAt: string;
    updatedAt: string;
  }