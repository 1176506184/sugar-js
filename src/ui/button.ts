const button = {
    name: 'sugar-button',
    render: (props) => {
        return `<button s-on:click="click" class="sugar-button">
                 {{props.label}}
             </button>`
    },
    emit: ['click']
}


export default button