import { Action } from 'shared/ReactTypes';

// 单个更新
export interface Update<State> {
  action: Action<State>;
}

// 更新队列
export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null;
  };
}

// 创建单个更新
export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action,
  };
};

// 创建更新队列
export const createUpdateQueue = <Action>() => {
  return {
    shared: {
      pending: null,
    },
  } satisfies UpdateQueue<Action>;
};

// 将单个更新插入到更新队列中
export const enqueueUpdate = <Action>(updateQueue: UpdateQueue<Action>, update: Update<Action>) => {
  updateQueue.shared.pending = update;
};

// 消费更新
export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null,
): { memoizedState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = { memoizedState: baseState };
  if (pendingUpdate !== null) {
    const action = pendingUpdate.action;
    if (action instanceof Function) {
      // baseState 1 update (x) => 4x -> memoizedState 4
      result.memoizedState = action(baseState);
    } else {
      // baseState 1 update 2 -> memoizedState 2
      result.memoizedState = action;
    }
  }
  return result;
};
