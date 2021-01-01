class Controls {
    constructor(updater, id) {
        this.updater = updater
        this.id = id
    }

    addSelector(options, name, defaultValue = '', valueMap) {
        var controls = document.getElementById(this.id)
        var label = document.createElement('h3')
        label.innerHTML = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

        var selector = document.createElement('select')
        selector.name = name
        selector.id = name
        selector.onchange = this.updater

        Object.keys(options).forEach(el => {
            var option = document.createElement("option")
            option.value = options[el]
            option.text = options[el]
            option.selected = el === defaultValue
            selector.appendChild(option)
        })

        controls.appendChild(label)
        controls.appendChild(selector)
    }

    addCheckboxes(options, name, defaultValues = []) {
        var controls = document.getElementById(this.id)
        var label = document.createElement('h3')
        label.innerHTML = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

        var box = document.createElement('div')
        box.setAttribute('class', name)
        
        Object.keys(options).forEach(el => {
            var group = document.createElement('div')
            var checkbox = document.createElement('input')
            checkbox.type ='checkbox'
            checkbox.name = el
            checkbox.id = el
            checkbox.onclick = this.updater
            checkbox.checked = defaultValues.includes(el)
            var checkboxLabel = document.createElement('label')
            checkboxLabel.setAttribute('for', el)
            checkboxLabel.innerHTML = options[el]

            group.appendChild(checkbox)
            group.appendChild(checkboxLabel)
            box.appendChild(group)
        })

        controls.appendChild(label)
        controls.appendChild(box)
    }
}