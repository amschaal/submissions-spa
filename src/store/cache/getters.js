export const validators = (state) => {
  return state.validators
}
export const validatorDict = (state) => {
  var validators = {}
  for (var i in state.validators) {
    validators[state.validators[i].id] = state.validators[i]
  }
  return validators
}
