//* debounces any input that is passed as cb - default 1sec

const debounce = (cb, delay = 750) => {
  let timeout
  // ...rest all the args that are provided and on timeout we run the CB func which debounce is WRAPPED around
  
  return (...arg) => {
    clearTimeout(timeout)
    timeout = setTimeout( () => {
      cb(...arg)
    }, delay)
  }

}

const xBtn = document.querySelector('.delete')

xBtn.addEventListener('click', () => {
  document.querySelector('#tutorial').classList.add('is-hidden')
})

