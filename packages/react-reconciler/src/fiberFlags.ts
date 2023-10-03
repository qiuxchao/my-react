// FiberNode 副作用标识
export type Flags = number;

// 什么也不做
export const NoFlags = 0b0000001;
// 插入
export const Placement = 0b0000010;
// 更新
export const Update = 0b0000100;
// 删除子节点
export const ChildDeletion = 0b0000100;
