import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFibers';

// 递归中的递阶段
export const beginWork = (wip: FiberNode): FiberNode | null => {
  // 比较，返回子 FiberNode
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip);
    case HostComponent:
      return updateHostComponent(wip);
    case HostText:
      // 到 Text 说明到最底层了，返回 null 开始归阶段
      return null;
    default:
      if (__DEV__) {
        console.warn('beginWork未实现的类型', wip.tag);
      }
      break;
  }
  return null;
};

// 计算最新状态并返回子节点
const updateHostRoot = (wip: FiberNode) => {
  const baseState = wip.memoizedState;
  // HostRoot 第一次渲染是 Element 类型
  const updateQueue = wip.updateQueue as UpdateQueue<Element>;
  // 计算最新状态
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;

  const nextChildren = wip.memoizedState;
  // 创建子节点
  reconcileChildren(wip, nextChildren);
  // 返回子节点
  return wip.child;
};

// 创建子节点并返回
const updateHostComponent = (wip: FiberNode) => {
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.children;
  // 创建子节点
  reconcileChildren(wip, nextChildren);
  // 返回子节点
  return wip.child;
};

const reconcileChildren = (wip: FiberNode, children?: ReactElementType) => {
  const current = wip.alternate;

  if (current !== null) {
    // update 流程
    wip.child = reconcileChildFibers(wip, current?.child, children);
  } else {
    // mount 流程
    wip.child = mountChildFibers(wip, null, children);
  }
};
