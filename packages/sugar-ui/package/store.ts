const { ref } = SUGAR;
const store = ref({
  percentage: {},
  getPercentage,
  sugarWh
});

function getPercentage (node: any, pid: any) {
  const width = node.getAttribute('sugar-wh').split(',')[0];
  const height = node.getAttribute('sugar-wh').split(',')[1];
  const top = node.getAttribute('sugar-tb').split(',')[0];
  const bottom = node.getAttribute('sugar-tb').split(',')[1];
  const pNode: any = document.querySelector(`#${pid}`);
  const pw = pNode.getAttribute('sugar-wh').split(',')[0];
  const ph = pNode.getAttribute('sugar-wh').split(',')[1];
  return `width:${(width / pw * 100).toFixed(2)}%;height:${(height / ph * 100).toFixed(2)}%;margin-top:${(top / ph * 100).toFixed(2)}%;margin-bottom:${(bottom / ph * 100).toFixed(2)}%`;
}

function sugarWh (pid: any) {
  const result = {};
  const ids = Array.from(document.querySelectorAll(`#${pid} [sugar-id]`));
  for (let i = 0; i < ids.length; i++) {
    result[ids[i].getAttribute('sugar-id')] = getPercentage(ids[i], pid);
  }
  return result;
}

export {
  store,
  sugarWh
};
