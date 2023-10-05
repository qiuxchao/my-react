import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Props, Key, Ref, ReactElementType } from 'shared/ReactTypes';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';
import { UpdateQueue } from './updateQueue';

export class FiberNode {
  type: any;
  tag: WorkTag;
  pendingProps: Props;
  key: Key;
  stateNode: any;
  ref: Ref;

  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;

  memoizedProps: Props | null;
  memoizedState: any;
  /** 标识指向 current 还是 workInProgress */
  alternate: FiberNode | null;
  // 副作用
  flags: Flags;
  // 更新队列
  updateQueue: unknown;

  public constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    // Fiber 标识
    this.tag = tag;
    this.key = key;
    // HostComponent <div> div DOM
    this.stateNode = null;
    // FunctionComponent () => {}
    this.type = null;

    /** 构成树状结构 */
    // 指向父 FiberNode
    this.return = null;
    // 兄弟 FiberNode
    this.sibling = null;
    // 子 FiberNode
    this.child = null;
    // 在多个相同的兄弟中自己的位置
    this.index = 0;

    this.ref = null;

    // 作为工作单元
    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.memoizedState = null;
    this.updateQueue = null;

    this.alternate = null;
    this.flags = NoFlags;
  }
}

export class FiberRootNode {
  container: Container;
  current: FiberNode;
  finishedWork: FiberNode | null;

  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container;
    // FiberRootNode.current 指向 hostRootFiber
    this.current = hostRootFiber;
    // hostRootFiber.stateNode 指向 FiberRootNode
    hostRootFiber.stateNode = this;
    this.finishedWork = null;
  }
}

/** 从 FiberRootNode 创建 WorkInProgress */
export const createWorkInProgress = (current: FiberNode, pendingProps: Props) => {
  let wip = current.alternate;

  if (wip === null) {
    // mount 阶段，还没有更新过
    wip = new FiberNode(current.tag, pendingProps, current.key);
    wip.stateNode = current.stateNode;
    // 双缓存互换
    wip.alternate = current;
    current.alternate = wip;
  } else {
    // update 阶段
    wip.pendingProps = pendingProps;
    // 清除副作用
    wip.flags = NoFlags;
  }

  wip.type = current.type;
  wip.updateQueue = current.updateQueue;
  wip.child = current.child;
  wip.memoizedProps = current.memoizedProps;
  wip.memoizedState = current.memoizedState;

  return wip;
};

/** 从 ReactElement 创建一个 FiberNode */
export const createFiberFromElement = (element: ReactElementType): FiberNode => {
  const { type, key, props } = element;
  let fiberTag: WorkTag = FunctionComponent;

  if (typeof type === 'string') {
    // <div /> type: 'div'
    fiberTag = HostComponent;
  } else if (typeof type !== 'function' && __DEV__) {
    console.warn('未定义的 type 类型', element);
  }
  const fiber = new FiberNode(fiberTag, props, key);
  fiber.type = type;
  return type;
};
