import { WorkTag } from './workTags';
import { Props, Key, Ref } from 'shared/ReactTypes';
import { Flags, NoFlags } from './fiberFlags';

export class FiberNode {
  type: any;
  tag: WorkTag;
  pendingProps: Props;
  memoizedProps: Props | null;
  key: Key;
  stateNode: any;
  ref: Ref;

  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;

  // 标识指向 current 还是 workInProgress
  alternate: FiberNode | null;
  // 副作用
  flags: Flags;

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

    this.alternate = null;
    this.flags = NoFlags;
  }
}
