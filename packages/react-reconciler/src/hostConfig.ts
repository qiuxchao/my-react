// 描述宿主环境

export type Container = any;

/** 创建实例节点（例如DOM）的方法，宿主环境实现 */
export const createInstance = (...args: any) => {
  return {} as any;
};

/** 将子节点插入到父节点下 */
export const appendInitialChild = (...args: any) => {
  return {} as any;
};

/** 创建 Text 节点实例 */
export const createTextInstance = (...args: any) => {
  return {} as any;
};
