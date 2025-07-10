import { Project, Task } from '@/models/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

interface AppState {
  projects: Project[];
  loading: boolean;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_TASK'; payload: { projectId: string; task: Task } }
  | { type: 'UPDATE_TASK'; payload: { projectId: string; task: Task } }
  | { type: 'DELETE_TASK'; payload: { projectId: string; taskId: string } };

interface AppContextType {
  state: AppState;
  addProject: (title: string, description?: string, priority?: 'low' | 'medium' | 'high') => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addTask: (projectId: string, title: string) => void;
  updateTask: (projectId: string, task: Task) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  toggleTaskComplete: (projectId: string, taskId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = '@todo_projects';

const initialState: AppState = {
  projects: [],
  loading: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload, loading: false };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
      };
    case 'ADD_TASK':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, tasks: [...p.tasks, action.payload.task] }
            : p
        ),
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? {
                ...p,
                tasks: p.tasks.map(t => 
                  t.id === action.payload.task.id ? action.payload.task : t
                ),
              }
            : p
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, tasks: p.tasks.filter(t => t.id !== action.payload.taskId) }
            : p
        ),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadProjects();
  }, []);

  // Save to AsyncStorage whenever projects change
  useEffect(() => {
    if (!state.loading) {
      saveProjects(state.projects);
    }
  }, [state.projects, state.loading]);

  const loadProjects = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const projects = JSON.parse(stored).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          tasks: p.tasks.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
          })),
        }));
        dispatch({ type: 'SET_PROJECTS', payload: projects });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveProjects = async (projects: Project[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  const updateProjectStatus = (project: Project): Project => {
    const completedTasks = project.tasks.filter(t => t.completed).length;
    const totalTasks = project.tasks.length;
    const status = totalTasks > 0 && completedTasks === totalTasks ? 'Completed' : 'In Progress';
    return { ...project, status };
  };

  const addProject = (title: string, description?: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newProject: Project = {
      id: Date.now().toString(),
      title,
      description,
      createdAt: new Date(),
      status: 'In Progress',
      tasks: [],
      priority,
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
  };

  const updateProject = (project: Project) => {
    const updatedProject = updateProjectStatus(project);
    dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
  };

  const deleteProject = (projectId: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: projectId });
  };

  const addTask = (projectId: string, title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date(),
      projectId,
    };
    
    dispatch({ type: 'ADD_TASK', payload: { projectId, task: newTask } });
    
    // Update project status
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      const updatedProject = updateProjectStatus({
        ...project,
        tasks: [...project.tasks, newTask],
      });
      dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
    }
  };

  const updateTask = (projectId: string, task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: { projectId, task } });
    
    // Update project status
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      const updatedTasks = project.tasks.map(t => t.id === task.id ? task : t);
      const updatedProject = updateProjectStatus({
        ...project,
        tasks: updatedTasks,
      });
      dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
    }
  };

  const deleteTask = (projectId: string, taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { projectId, taskId } });
    
    // Update project status
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      const updatedTasks = project.tasks.filter(t => t.id !== taskId);
      const updatedProject = updateProjectStatus({
        ...project,
        tasks: updatedTasks,
      });
      dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
    }
  };

  const toggleTaskComplete = (projectId: string, taskId: string) => {
    const project = state.projects.find(p => p.id === projectId);
    const task = project?.tasks.find(t => t.id === taskId);
    
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      updateTask(projectId, updatedTask);
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
