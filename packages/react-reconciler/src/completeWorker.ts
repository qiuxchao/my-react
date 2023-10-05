import { appendInitialChild, createInstance, createTextInstance } from 'hostConfig';
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

// 递归中的归阶段 构建离屏 DOM 树
export const completeWork = (wip: FiberNode) => {
  const newProps = wip.pendingProps;
  const current = wip.alternate;

  switch (wip.tag) {
    case HostComponent:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // mount
        // 1. 构建 DOM
        const instance = createInstance(wip.type, newProps);
        // 2. 将 DOM 插入到 DOM 树中
        appendAllChildren(instance, wip);
        wip.stateNode = instance;
      }
      // 收集子节点的副作用
      bubbleProperties(wip);
      return null;
    case HostText:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // mount
        // 1. 构建 DOM
        const instance = createTextInstance(newProps.content);
        wip.stateNode = instance;
      }
      // 收集子节点的副作用
      bubbleProperties(wip);
      return null;
    case HostRoot:
      // 收集子节点的副作用
      bubbleProperties(wip);
      return null;
    default:
      if (__DEV__) {
        console.warn('为处理的 completeWork 情况', wip);
      }
      break;
  }
};

/** 将 wip 插入到 parent 下面，递归处理 wip 的层级，找到最深处的有用的节点 */
const appendAllChildren = (parent: FiberNode, wip: FiberNode) => {
  let node = wip.child;

  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      // 找到了有用的节点，插入
      appendInitialChild(parent, node?.stateNode);
    } else if (node.child !== null) {
      // 继续递归处理子节点
      node.child.return = node;
      node = node.child;
      continue;
    }

    // 找到了根节点 退出递归
    if (node === wip) return;

    // 处理兄弟节点
    while (node.sibling === null) {
      if (node.return === null || node.return === wip) return;
      node = node?.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
};

/** 将子节点的副作用冒泡到父节点上 */
const bubbleProperties = (wip: FiberNode) => {
  let subtreeFlags = NoFlags;
  let child = wip.child;

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;

    child.return = wip;
    child = child.sibling;
  }

  // 将下面所有的副作用都合并到 wip 的 subtreeFlags 中
  wip.subtreeFlags |= subtreeFlags;
};
