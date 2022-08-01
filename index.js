const left = document.querySelector('#left')
const midden = document.querySelector('#midden')
const right = document.querySelector('#right')
// 右边的属性输入框
const inputs = document.querySelectorAll("#right > .item > input")
// 修改样式按钮
const changeBtn = document.querySelector('.change')

// 记录当前拖拽的元素
let curr = null

const dragenter = e => {
  e.dataTransfer.dropEffect = 'move'
}

const dragover = e => {
  e.preventDefault()
}

const dragleave = e => {
  e.dataTransfer.dropEffect = 'none'
}

const drop = e => {
  if (curr) {
    const top = e.offsetY
    const left = e.offsetX
    const child = curr.cloneNode()
    child.draggable = false
    child.style.position = 'absolute'
    child.style.top = top + 'px'
    child.style.left = left + 'px'
    child.textContent = curr.textContent
    child.style.zIndex = 1
    child.onclick = _ => {
      curr = child
      inputs[0].value = top
      inputs[1].value = left
    }
    midden.appendChild(child)
  }
}

const addComponent = (component) => {
  curr = component
  // dragenter进入目标元素中,添加一个移动的标记
  midden.addEventListener('dragenter', dragenter)
  // dragover在目标元素中经过,必须要阻止默认行为,不然不能触发drop事件
  midden.addEventListener('dragover', dragover)
  // dragleave离开目标元素时,添加一个禁用标记
  midden.addEventListener('dragleave', dragleave)
  // drop在目标元素松开时,添加一个组件
  midden.addEventListener('drop', drop)
}

// 给组件区域的组件绑定拖动事件
Array.prototype
  .slice.call(left.children)
  .forEach(component => {
    // 元素拖动事件监听
    component.ondragstart = _ => addComponent(component)
  })


changeBtn.onclick = _ => {
  const top = inputs[0].value
  const left = inputs[1].value
  curr.style.top = top + 'px'
  curr.style.left = left + 'px'
}
