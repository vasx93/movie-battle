
const searchEngine = ( {
  root, 
  renderOption, 
  onOptionSelect, 
  inputValue, 
  fetchData
 })  => {
  root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input">
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
 `;
  //           selecting the divs 
  const input = root.querySelector('input')
  const dropdown = root.querySelector('.dropdown')
  const resultsWrapper = root.querySelector('.results')

  //            movie search
  const onInput = async event => {
    const items = await fetchData(event.target.value)
    
    console.log(items)
    //? removing the empty dropdown list
    if (!items.length) {
      dropdown.classList.remove('is-active');
      return;
    }
    resultsWrapper.innerHTML = ''
  
    //*      Looping over api results
  
    dropdown.classList.add('is-active')

    for (let item of items) {
      const link = document.createElement('a')// creating movie links
      link.classList.add('dropdown-item')
      link.innerHTML = renderOption(item)
  
      //*      event handler on Poster click
      link.addEventListener('click', () => {
        dropdown.classList.remove('is-active')
        input.value = inputValue(item)
        onOptionSelect(item)
      })
  
      resultsWrapper.append(link)
    }
  }
  input.addEventListener('input', debounce(onInput))

  // click to close dropdown results
  document.addEventListener('click', event => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove('is-active')
  }
})
}








