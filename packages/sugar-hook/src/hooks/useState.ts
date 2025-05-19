import useSignal from './useSignal';

export function useState (initValue) {
  const data = useSignal(initValue);
  return [data, (value: any) => {
    data.value = value;
  }];
}
