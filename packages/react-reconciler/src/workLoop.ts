import { beginWork } from './beginWorker';
import { completeWork } from './completeWorker';
import { FiberNode } from './fiber';

// 正在工作的 FiberNode
let workInProgress: FiberNode | null = null;

const prepareFreshStack = (fiber: FiberNode) => {
  workInProgress = fiber;
};

const renderRoot = (root: FiberNode) => {
  // 初始化
  prepareFreshStack(root);

  // 开始递归流程
  do {
    try {
      workLoop();
      break;
    } catch (e) {
      console.warn('workLoop 发生错误', e);
      workInProgress = null;
    }
  } while (true);
};

const workLoop = () => {
  // eslint-disable-next-line no-unmodified-loop-condition
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
};

// 执行工作单元
const performUnitOfWork = (fiber: FiberNode) => {
  // next 可能是 fiber 的 child 也可能是 null
  const next = beginWork(fiber);
  // 工作结束缓存当前 props
  fiber.memoizedProps = fiber.pendingProps;

  // 如果没有 child，说明这个工作单元到底了
  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    // 继续循环
    workInProgress = next;
  }
};

// 完成一个工作单元
const completeUnitOfWork = (filber: FiberNode) => {
  let node: FiberNode | null = filber;

  do {
    // 完成当前节点
    completeWork(node);

    // 处理兄弟节点
    const sibling = node.sibling;
    if (sibling !== null) {
      workInProgress = sibling;
      return;
    }

    // 子节点和兄弟节点都处理完了，处理父节点
    node = node.return;
  } while (node !== null);
};
