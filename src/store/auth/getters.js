export const getUser = (state) => {
  return state.user
}
export const isLoggedIn = (state) => {
  console.log(state)
  return state.user != null
}
