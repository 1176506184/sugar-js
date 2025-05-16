const {
  useSignal
  // @ts-expect-error
} = SUGAR;
export function arrow (direction: string = 'left') {
  return `<svg style="${arrowMap[direction]}" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M719.2 912.6c14.2-14.2 14.2-37.2 0-51.4L371.7 513.8c-2.8-2.9-2.8-7.5 0-10.3L719.2 156c14.2-14.2 14.2-37.2 0-51.4-14.2-14.2-37.2-14.2-51.4 0L320.3 452c-15.6 15.6-23.4 36-23.4 56.5s7.8 41 23.4 56.5l347.4 347.4c14.3 14.3 37.3 14.3 51.5 0.2z" fill="#333"></path></svg>`;
}

const arrowMap = {
  let: 'transform: rotate(180deg);',
  right: 'transform: rotate(0deg);',
  top: 'transform: rotate(90deg);',
  bottom: 'transform: rotate(-90deg);'
};

export function useState (initValue) {
  const data = useSignal(initValue);
  return [data, (value) => {
    data.value = value;
  }];
}
