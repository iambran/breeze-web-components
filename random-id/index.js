const randomID = () => {
  return Math.random().toString(36).substring(2, 8)
}

export default randomID
