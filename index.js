const left = document.querySelector('#left')
const midden = document.querySelector('#midden')
const right = document.querySelector('#right')
const codeBox = document.querySelector('.code')
// 右边的属性输入框
const inputs = document.querySelectorAll("#right > .item > input")
// 修改样式按钮
const changeBtn = document.querySelector('.change')
// 全屏预览按钮
const lookBtn = document.querySelector('.look')
// 下载源码按钮
const downBtn = document.querySelector('.down')
// 清除全部按钮
const clearBtn = document.querySelector('.clear')

// 记录当前拖拽的元素
let curr = null

// 移除编辑区域的元素的选中框
const clearAllselected = _ => {
  Array.prototype.slice
    .call(midden.children)
    .forEach(c => c.classList.remove('selected'))
}

// 给当前选中的元素加上标记框
const selectedEl = el => {
  clearAllselected()
  el.classList.add('selected')
}

// 组件进入编辑区域
const dragenter = e => {
  // console.log('进入编辑区域');
}
// 组件经过编辑区域
const dragover = e => {
  // 取消默认事件
  e.preventDefault()
}
// 组件离开编辑区域
const dragleave = e => {
  // console.log('离开编辑区域');
}

const drop = e => {
  if (curr) {
    const top = e.offsetY
    const left = e.offsetX
    // getBoundingClientRect() 返回一个矩形对象
    // 包含6个属性: left right top bottom width height
    // 元素在页面中相对于视口的位置
    const rect = curr.getBoundingClientRect()
    const child = curr.cloneNode()
    child.style.position = 'absolute'
    child.style.top = top + 'px'
    child.style.left = left + 'px'
    // 如果有文字内容就需要加上
    if (curr.textContent) {
      child.textContent = curr.textContent
    }
    child.style.zIndex = 1
    // 填充右边属性栏的值
    const setProp = _ => {
      // 先允许所有的输入框给输入
      inputs.forEach(i => i.disabled = false)
      inputs[0].value = rect.width
      inputs[1].value = rect.height
      inputs[2].value = top
      inputs[3].value = left
      // 动态关闭一些输入框
      if (curr.textContent) {
        inputs[4].value = curr.textContent
      } else {
        inputs[4].value = ''
        inputs[4].disabled = true
      }
      if (curr.getAttribute('src')) {
        inputs[5].value = curr.getAttribute('src')
      } else {
        inputs[5].value = ''
        inputs[5].disabled = true
      }
      if (curr.style.color) {
        inputs[6].value = curr.style.color
      } else {
        inputs[6].value = ''
        inputs[6].disabled = true
      }
      if (curr.style.fontSize) {
        inputs[7].value = curr.style.fontSize
      } else {
        inputs[7].value = ''
        inputs[7].disabled = true
      }
    }
    child.onclick = function (e) {
      // 阻止冒泡事件,不然就移动不了了
      e.stopPropagation()
      curr = this
      selectedEl(this)
      setProp()
    }
    // 先添加新元素,然后删掉之前的元素
    midden.appendChild(child)
    // 添加的时候默认选中当前的元素
    selectedEl(child)
    // 遍历预览区的所有子元素,判断有没有和当前元素是一样的,如果一样就移除掉这个子元素
    Array.prototype
      .slice.call(midden.children)
      .forEach(c => {
        if (curr === c) {
          midden.removeChild(c)
        }
      })
    // 设置属性到右边的属性栏
    setProp()
    // 让当前选中的元素指向刚刚创建的这个元素
    curr = child
  }
}

const addComponent = (component) => {
  curr = component
  // dragenter组件进入编辑区域中
  midden.addEventListener('dragenter', dragenter)
  // dragover在目标元素中经过,必须要阻止默认行为,不然不能触发drop事件
  midden.addEventListener('dragover', dragover)
  // dragleave组件离开编辑区域
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

midden.onclick = _ => {
  // 取消选中的元素
  curr = null
  // 清空属性框中的值
  inputs.forEach(i => {
    i.value = ''
    i.disabled = false
  })
  // 取消组件的选中框
  clearAllselected()
}

// 生成html代码
const generateCode = code => `
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>预览页面</title>
</head>
<body>
<div style="position: relative; width: 100%; min-height: 100vh;">${code.replaceAll('draggable="true"', '')}</div>
</body>
</html>`

// 生成源码文件
const generateCodeSource = (code, fileName) => {
  const a = document.createElement('a')
  // 下载文件的名字
  a.download = fileName
  a.style.display = 'none'
  // 把内容变成Blob数据
  const blob = new Blob([code])
  // 创建链接
  a.href = URL.createObjectURL(blob)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// 改变元素属性
changeBtn.onclick = _ => {
  if (curr) {
    const width = inputs[0].value
    const height = inputs[1].value
    const top = inputs[2].value
    const left = inputs[3].value
    const text = inputs[4].value
    const src = inputs[5].value
    const color = inputs[6].value
    const font_size = inputs[7].value
    curr.style.width = width + 'px'
    curr.style.height = height + 'px'
    curr.style.top = top + 'px'
    curr.style.left = left + 'px'
    if (text) {
      curr.textContent = text
    }
    if (src) {
      curr.src = src
    }
    if (color) {
      curr.style.color = color
    }
    if (font_size) {
      curr.style.fontSize = font_size
    }
  }
}

// 全屏预览
lookBtn.onclick = _ => {
  clearAllselected()
  const code = generateCode(midden.innerHTML)
  console.log('code', code)
  left.style.display = 'none'
  midden.style.display = 'none'
  right.style.display = 'none'
  codeBox.style.display = 'block'
  codeBox.innerHTML = code
}

// 双击关闭预览
codeBox.ondblclick = _ => {
  codeBox.style.display = 'none'
  left.style.display = 'block'
  midden.style.display = 'block'
  right.style.display = 'block'
}

// 下载源码文件
downBtn.onclick = _ => {
  // 清除掉组件的选中框
  clearAllselected()
  // 处理生成源码,去掉允许拖拽
  const code = generateCode(midden.innerHTML)
  generateCodeSource(code, 'index.html')
}

// 清除全部
clearBtn.onclick = _ => {
  midden.innerHTML = ''
}
