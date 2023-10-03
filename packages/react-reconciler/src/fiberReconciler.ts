import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import { UpdateQueue, createUpdate, createUpdateQueue, enqueueUpdate } from './updateQueue';
import { ReactElementType } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

// 创建 hostRootFiber 并将其与 FiberRootNode 做关联，创建更新队列后返回 FiberRootNode
export const createContainer = (container: Container) => {
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue();
  return root;
};

// 将 element 的更新放到 hostRootFiber 的更新队列中
export const updateContainer = (element: ReactElementType | null, root: FiberRootNode) => {
  const hostRootFiber = root.current;
  const update = createUpdate<ReactElementType | null>(element);
  enqueueUpdate(hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>, update);
  // 处理 fiber 更新
  scheduleUpdateOnFiber(hostRootFiber);
  return element;
};
