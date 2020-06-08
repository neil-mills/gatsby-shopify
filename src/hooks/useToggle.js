import { useState } from 'react';

const useToggle = () => {
  const [ isToggled, setToggle ] = useState(false);
  const toggle = () =>  setToggle(prevState => !prevState);
  return { isToggled, toggle }
}

export default useToggle;