export const getUser = (state) => {
  return state.user
}
export const isLoggedIn = (state) => {
  console.log(state)
  return state.user != null
}
// Replace this later if non staff members authenticate
export const isStaff = (state) => {
  return state.user != null
}
