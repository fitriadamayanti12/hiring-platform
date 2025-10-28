export const loadState = () => {
  try {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const serializedState = localStorage.getItem('hiring-platform-state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn('Could not load state from localStorage', err);
    return undefined;
  }
};

export const saveState = (state: any) => {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    const serializedState = JSON.stringify(state);
    localStorage.setItem('hiring-platform-state', serializedState);
  } catch (err) {
    console.warn('Could not save state to localStorage', err);
  }
};