export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  projectId: string;
  priority?: 'low' | 'medium' | 'high';
  updatedAt?: Date;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  status: 'In Progress' | 'Completed';
  tasks: Task[];
  priority?: 'low' | 'medium' | 'high';
  updatedAt?: Date;
  color?: string; // For custom project colors
}

export type ProjectStatus = 'In Progress' | 'Completed';
export type Priority = 'low' | 'medium' | 'high';
