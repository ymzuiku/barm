import produce from 'immer';

export function applyReducerImmer(state: any, action: any) {
  if (typeof action === 'function') {
    return produce(state, (draft: any) => {
      action(draft);
    });
  }

  return state;
}

applyReducerImmer.key = 'applyReducerImmer';
