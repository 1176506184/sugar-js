import ref from './ref';

export function useState (initValue) {
  const data = ref(initValue);
  return [data, (value: any) => {
    data.value = value;
  }];
}
