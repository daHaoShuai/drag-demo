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
    child.src = curr.getAttribute('src')
    child.style.zIndex = 1
    child.onclick = _ => {
      curr = child
      // getBoundingClientRect() 返回一个矩形对象
      // 包含6个属性: left right top bottom width height
      // 元素在页面中相对于视口的位置
      const rect = curr.getBoundingClientRect()
      inputs[0].value = rect.width
      inputs[1].value = rect.height
      inputs[2].value = top
      inputs[3].value = left
      inputs[4].value = curr.textContent
      inputs[5].value = curr.getAttribute('src')
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
  const width = inputs[0].value
  const height = inputs[1].value
  const top = inputs[2].value
  const left = inputs[3].value
  const text = inputs[4].value
  const src = inputs[5].value
  curr.style.width = width + 'px'
  curr.style.height = height + 'px'
  curr.style.top = top + 'px'
  curr.style.left = left + 'px'
  curr.textContent = text
  curr.src = src
}
