type MountHandler = () => void;
export type { MountHandler };

interface MountHandleItem {
  used: boolean;
  fun: MountHandler;
}

type MountHandleList = Record<string, MountHandleItem[]>;
export type { MountHandleList };
